import { db } from '../config/db';
import {
  CreateBookingDto,
  Booking,
  AdminUpdateBookingDto,
  BookingStatus,
  PaymentStatus
} from '../common/types/types';
import { AppError } from '../middleware/error.handler';
import { NotificationService } from './notification.service';

export class BookingService {
  private notifService = new NotificationService();

  public async createBooking(userId: string, data: CreateBookingDto): Promise<{ bookingId: string, clientSecret: string, totalPrice: number }> {
    const { room_type_id, check_in_date, check_out_date, num_rooms, num_guests, guest_name, guest_email, guest_phone, special_requests } = data;

    const checkIn = new Date(check_in_date);
    const checkOut = new Date(check_out_date);
    if (checkIn >= checkOut) {
      throw new AppError(400, 'Check-out date must be after check-in date.');
    }

    const roomRes = await db.query('SELECT * FROM room_types WHERE id = $1', [room_type_id]);
    if (roomRes.rows.length === 0) {
      throw new AppError(404, 'Room type not found.');
    }
    const room = roomRes.rows[0];

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

    const oneDay = 24 * 60 * 60 * 1000;
    const nights = Math.round(Math.abs((checkOut.getTime() - checkIn.getTime()) / oneDay));
    const totalPrice = Number(room.price_per_night) * nights * num_rooms;

    const mockPaymentIntentId = `pi_mock_${Math.random().toString(36).substring(7)}`;
    const mockClientSecret = `${mockPaymentIntentId}_secret_12345`;

    try {
      await db.query('BEGIN');

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

      await db.query(`
        INSERT INTO payments (
          booking_id, user_id, amount, currency, provider, status, transaction_id
        ) VALUES ($1, $2, $3, 'USD', 'stripe', 'pending', $4)
      `, [bookingId, userId, totalPrice, mockPaymentIntentId]);

      await db.query('COMMIT');

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

  public async cancelBooking(userId: string, bookingId: string): Promise<void> {
    const res = await db.query('SELECT * FROM bookings WHERE id = $1 AND user_id = $2', [bookingId, userId]);
    if (res.rows.length === 0) {
      throw new AppError(404, 'Booking not found.');
    }
    const booking = res.rows[0];

    if (booking.status === 'cancelled' || booking.status === 'completed') {
      throw new AppError(400, 'Cannot cancel this booking.');
    }

    await db.query(`
      UPDATE bookings SET status = 'cancelled' WHERE id = $1
    `, [bookingId]);

    await this.notifService.send(userId, 'cancellation', `Your booking #${bookingId.slice(0, 8)} has been cancelled.`);
  }

  public async handlePaymentSuccess(paymentIntentId: string): Promise<void> {
    try {
      await db.query('BEGIN');

      const payRes = await db.query('SELECT * FROM payments WHERE transaction_id = $1', [paymentIntentId]);
      if (payRes.rows.length === 0) {
        throw new AppError(404, 'Payment transaction not found.');
      }
      const payment = payRes.rows[0];

      await db.query(`UPDATE payments SET status = 'completed' WHERE id = $1`, [payment.id]);

      await db.query(`
        UPDATE bookings 
        SET status = 'confirmed', payment_status = 'paid' 
        WHERE id = $1 RETURNING user_id
      `, [payment.booking_id]);

      const userId = payRes.rows[0].user_id;

      await db.query('COMMIT');

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

  public async getAllBookings(): Promise<Booking[]> {
    let query = `SELECT * from bookings`
    const result = await db.query(query);
    return result.rows
  }

  public async getUserBookings(userId: string): Promise<Booking[]> {
    const query = `
        SELECT b.*, r.type_name as room_type_name, a.name as accommodation_name
        FROM bookings b
        JOIN room_types r ON b.room_type_id = r.id
        JOIN accommodations a ON r.accommodation_id = a.id
        WHERE b.user_id = $1
        ORDER BY b.created_at DESC
      `;
    const result = await db.query(query, [userId]);
    return result.rows;
  }

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

    query += ` ORDER BY b.created_at DESC`;

    const result = await db.query(query, params);
    return result.rows;
  }

  public async updateAdmin(id: string, data: AdminUpdateBookingDto): Promise<Booking> {
    const { status, admin_notes } = data;

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
