import { db } from '../config/db';
import { 
  CreateBookingDto, 
  Booking, 
  AdminUpdateBookingDto, 
  BookingStatus, 
  PaymentStatus 
} from '../../common/types/types';
import { AppError } from '../middleware/error.handler';
import { NotificationService } from './notification.service';

export class BookingService {
  private notifService = new NotificationService();

  /**
   * Creates a new booking and initiates the payment process.
   */
  public async createBooking(userId: string, data: CreateBookingDto): Promise<{ bookingId: string, clientSecret: string, totalPrice: number }> {
    const { room_type_id, check_in_date, check_out_date, num_rooms, num_guests, guest_name, guest_email, guest_phone, special_requests } = data;

    // 1. Validate Dates
    const checkIn = new Date(check_in_date);
    const checkOut = new Date(check_out_date);
    if (checkIn >= checkOut) {
      throw new AppError(400, 'Check-out date must be after check-in date.');
    }

    // 2. Fetch Room Details & Inventory
    const roomRes = await db.query('SELECT * FROM room_types WHERE id = $1', [room_type_id]);
    if (roomRes.rows.length === 0) {
      throw new AppError(404, 'Room type not found.');
    }
    const room = roomRes.rows[0];

    // 3. Check Availability (Basic Overlap Check)
    // Count bookings for this room type that overlap with the requested dates and are NOT cancelled
    const availabilityRes = await db.query(`
      SELECT COUNT(*) FROM bookings 
      WHERE room_type_id = $1 
      AND status != 'cancelled'
      AND (check_in_date < $3 AND check_out_date > $2)
    `, [room_type_id, check_in_date, check_out_date]);

    const bookedCount = parseInt(availabilityRes.rows[0].count, 10);
    if (bookedCount + num_rooms > room.total_inventory) {
      throw new AppError(409, 'Not enough rooms available for these dates.');
    }

    // 4. Calculate Total Price
    const oneDay = 24 * 60 * 60 * 1000;
    const nights = Math.round(Math.abs((checkOut.getTime() - checkIn.getTime()) / oneDay));
    const totalPrice = Number(room.price_per_night) * nights * num_rooms;

    // 5. Mock Payment Gateway Call (Stripe)
    // In a real app, you would call stripe.paymentIntents.create() here
    const mockPaymentIntentId = `pi_mock_${Math.random().toString(36).substring(7)}`;
    const mockClientSecret = `${mockPaymentIntentId}_secret_12345`;

    // 6. Transaction: Insert Booking AND Initial Payment Record
    try {
      await db.query('BEGIN');

      // A. Insert Booking
      const bookingRes = await db.query(`
        INSERT INTO bookings (
          user_id, room_type_id, check_in_date, check_out_date, 
          num_rooms, num_guests, total_price, status, payment_status,
          guest_name, guest_email, guest_phone, special_requests
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', 'pending', $8, $9, $10, $11)
        RETURNING id
      `, [
        userId, room_type_id, check_in_date, check_out_date, 
        num_rooms, num_guests, totalPrice, 
        guest_name, guest_email, guest_phone, special_requests
      ]);
      const bookingId = bookingRes.rows[0].id;

      // B. Insert Pending Payment Record
      await db.query(`
        INSERT INTO payments (
          booking_id, user_id, amount, currency, provider, status, transaction_id
        ) VALUES ($1, $2, $3, 'USD', 'stripe', 'pending', $4)
      `, [bookingId, userId, totalPrice, mockPaymentIntentId]);

      await db.query('COMMIT');

      // 7. Send Notification (Optional - Booking Created but not paid)
      // await this.notifService.send(userId, 'booking_update', 'Your booking is pending payment.');

      return { 
        bookingId, 
        clientSecret: mockClientSecret,
        totalPrice 
      };

    } catch (error) {
      await db.query('ROLLBACK');
      throw error;
    }
  }

  /**
   * Cancels a booking (User action).
   */
  public async cancelBooking(userId: string, bookingId: string): Promise<void> {
    // 1. Get Booking
    const res = await db.query('SELECT * FROM bookings WHERE id = $1 AND user_id = $2', [bookingId, userId]);
    if (res.rows.length === 0) {
      throw new AppError(404, 'Booking not found.');
    }
    const booking = res.rows[0];

    // 2. Check Policy (Simple check: cannot cancel completed/already cancelled)
    if (booking.status === 'cancelled' || booking.status === 'completed') {
      throw new AppError(400, 'Cannot cancel this booking.');
    }

    // 3. Update Status
    await db.query(`
      UPDATE bookings SET status = 'cancelled' WHERE id = $1
    `, [bookingId]);

    // 4. Send Notification
    await this.notifService.send(userId, 'cancellation', `Your booking #${bookingId.slice(0, 8)} has been cancelled.`);
  }

  /**
   * Handles Payment Success Webhook (System action).
   * Updates Payment status to 'completed' and Booking status to 'confirmed'.
   */
  public async handlePaymentSuccess(paymentIntentId: string): Promise<void> {
    try {
      await db.query('BEGIN');

      // 1. Find the Payment Record
      const payRes = await db.query('SELECT * FROM payments WHERE transaction_id = $1', [paymentIntentId]);
      if (payRes.rows.length === 0) {
        throw new AppError(404, 'Payment transaction not found.');
      }
      const payment = payRes.rows[0];

      // 2. Update Payment Status
      await db.query(`UPDATE payments SET status = 'completed' WHERE id = $1`, [payment.id]);

      // 3. Update Booking Status
      await db.query(`
        UPDATE bookings 
        SET status = 'confirmed', payment_status = 'paid' 
        WHERE id = $1 RETURNING user_id
      `, [payment.booking_id]);

      const userId = payRes.rows[0].user_id;

      await db.query('COMMIT');

      // 4. Send Confirmation Notification
      if (userId) {
        await this.notifService.send(
            userId, 
            'booking_confirmation', 
            'Payment received! Your booking is confirmed.'
        );
      }

    } catch (error) {
      await db.query('ROLLBACK');
      throw error;
    }
  }

  // --- Admin Methods ---

  /**
   * Get all bookings with optional filters (Admin).
   */
  public async getAllAdmin(filters: any): Promise<Booking[]> {
    const { status, date } = filters;
    let query = `
      SELECT b.*, r.type_name, a.name as hotel_name 
      FROM bookings b
      JOIN room_types r ON b.room_type_id = r.id
      JOIN accommodations a ON r.accommodation_id = a.id
    `;
    const params: any[] = [];

    if (status) {
      params.push(status);
      query += ` WHERE b.status = $${params.length}`;
    }
    // Add more filters logic here as needed

    query += ` ORDER BY b.created_at DESC`;

    const result = await db.query(query, params);
    return result.rows;
  }

  /**
   * Update booking details manually (Admin).
   */
  public async updateAdmin(id: string, data: AdminUpdateBookingDto): Promise<Booking> {
    const { status, admin_notes } = data;
    
    // Dynamic update query
    const updates: string[] = [];
    const values: any[] = [id];
    let idx = 2;

    if (status) {
        updates.push(`status = $${idx++}`);
        values.push(status);
    }
    if (admin_notes) {
        updates.push(`admin_notes = $${idx++}`);
        values.push(admin_notes);
    }

    if (updates.length === 0) {
        throw new AppError(400, 'No updates provided');
    }

    const query = `
        UPDATE bookings 
        SET ${updates.join(', ')}, updated_at = NOW() 
        WHERE id = $1 
        RETURNING *
    `;

    const result = await db.query(query, values);
    
    if (result.rows.length === 0) {
        throw new AppError(404, 'Booking not found');
    }

    // Notify user of status change if applicable
    const booking = result.rows[0];
    if (status && ['confirmed', 'cancelled'].includes(status)) {
        await this.notifService.send(
            booking.user_id, 
            'booking_update', 
            `Your booking status has been updated to: ${status}`
        );
    }

    return booking;
  }
}