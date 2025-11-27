import { db } from '../config/db';
import { Payment } from '../common/types/types';
import { AppError } from '../middleware/error.handler';
import { StripeService } from '../services/stripe.service';

export class PaymentService {
  // We need the StripeService helper to process actual refunds with the gateway
  private stripeService = new StripeService();

  /**
   * Get all payments for a specific user (Transaction History).
   * Ordered by newest first.
   */
  public async getMyPayments(userId: string): Promise<Payment[]> {
    const query = `
      SELECT * FROM payments 
      WHERE user_id = $1 
      ORDER BY created_at DESC
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  /**
   * Get a specific payment by ID.
   * Includes security check: Users can only see their own payments unless they are an admin.
   */
  public async getById(paymentId: string, userId: string, isAdmin: boolean): Promise<Payment> {
    const query = 'SELECT * FROM payments WHERE id = $1';
    const result = await db.query(query, [paymentId]);

    if (result.rows.length === 0) {
      throw new AppError(404, 'Payment not found.');
    }

    const payment = result.rows[0];

    // Security Check
    if (!isAdmin && payment.user_id !== userId) {
      throw new AppError(403, 'Access denied. You do not own this payment record.');
    }

    return payment;
  }

  /**
   * Process a refund (Admin action).
   * 1. Verifies the payment exists.
   * 2. Calls Stripe API to process the refund.
   * 3. Updates the 'payments' table status to 'refunded'.
   * 4. Updates the linked 'bookings' table status to 'cancelled'.
   */
  public async refundPayment(paymentId: string, userId: string, isAdmin: boolean): Promise<void> {
    // 1. Get Payment Record
    const payRes = await db.query('SELECT * FROM payments WHERE id = $1', [paymentId]);
    if (payRes.rows.length === 0) throw new AppError(404, 'Payment not found');
    const payment = payRes.rows[0];

    // 2. Authorization Check
    if (!isAdmin) {
      throw new AppError(403, 'Only admins can initiate refunds.');
    }

    if (payment.status !== 'completed') {
      throw new AppError(400, 'Can only refund completed payments.');
    }

    // 3. Process Refund in Stripe
    try {
      // Calls the helper in stripe.service.ts
      await this.stripeService.createRefund(payment.transaction_id);
    } catch (error: any) {
      throw new AppError(500, `Stripe Refund Failed: ${error.message}`);
    }

    // 4. Update Database Transactionally
    // (Ideally, wrap in BEGIN/COMMIT, but for simplicity here strictly sequential)

    // Update Payment Status
    await db.query(`UPDATE payments SET status = 'refunded' WHERE id = $1`, [paymentId]);

    // Update Booking Status to cancelled automatically
    await db.query(`UPDATE bookings SET status = 'cancelled', payment_status = 'refunded' WHERE id = $1`, [payment.booking_id]);
  }

  /**
   * Get all payments (Admin Dashboard).
   * Supports filtering by status (e.g., 'succeeded', 'refunded').
   */
  public async getAllAdmin(status?: string): Promise<Payment[]> {
    let query = 'SELECT * FROM payments';
    const params: any[] = [];

    if (status) {
      query += ' WHERE status = $1';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const result = await db.query(query, params);
    return result.rows;
  }

  /**
   * Create a Stripe Payment Intent
   */
  public async createPaymentIntent(
    amount: number,
    currency: string,
    userId: string,
    bookingData: any
  ) {
    const metadata = {
      userId,
      ...(bookingData && { bookingData: JSON.stringify(bookingData) })
    };

    try {
      const paymentIntent = await this.stripeService.createPaymentIntent(
        amount,
        currency,
        metadata
      );

      return paymentIntent;
    } catch (error: any) {
      // Wrap Stripe errors in a more user-friendly message
      if (error.message?.includes('Invalid API Key') || error.type === 'StripeAuthenticationError') {
        throw new AppError(500, 'Payment service is not properly configured. Please contact support.');
      }
      throw new AppError(500, `Payment processing failed: ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * Confirm a payment and save it to the database
   */
  public async confirmPayment(paymentIntentId: string, userId: string): Promise<void> {
    try {
      // Retrieve payment intent from Stripe
      const paymentIntent = await this.stripeService.retrievePaymentIntent(paymentIntentId);

      if (paymentIntent.status !== 'succeeded') {
        throw new AppError(400, 'Payment has not succeeded yet.');
      }

      // Check if payment already exists in database
      const existing = await db.query('SELECT id FROM payments WHERE transaction_id = $1', [paymentIntentId]);

      if (existing.rows.length > 0) {
        // Payment already confirmed
        console.log(`Payment ${paymentIntentId} already exists in database`);
        return;
      }

      // Extract booking ID from metadata if available
      // Check both bookingId (direct) and bookingData (JSON string that might contain bookingId)
      let bookingId = paymentIntent.metadata?.bookingId || null;

      // If bookingId is not directly in metadata, try to extract it from bookingData
      if (!bookingId && paymentIntent.metadata?.bookingData) {
        try {
          const bookingData = JSON.parse(paymentIntent.metadata.bookingData);
          bookingId = bookingData?.bookingId || bookingData?.id || null;
        } catch (e) {
          // If parsing fails, bookingId remains null
          console.warn('Could not parse bookingData from payment intent metadata:', e);
        }
      }

      // Insert payment record
      await db.query(
        `INSERT INTO payments (user_id, booking_id, amount, currency, status, transaction_id, provider)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          userId,
          bookingId,
          paymentIntent.amount / 100, // Convert from cents
          paymentIntent.currency.toUpperCase(),
          'completed',
          paymentIntentId,
          'stripe'
        ]
      );

      // If there's a booking ID, update the booking's payment status
      if (bookingId) {
        await db.query(
          `UPDATE bookings SET payment_status = 'paid', status = 'confirmed' WHERE id = $1`,
          [bookingId]
        );
      }

      console.log(`Payment ${paymentIntentId} confirmed successfully for user ${userId}`);
    } catch (error: any) {
      console.error('Error confirming payment:', error);
      // Re-throw AppError as-is, wrap other errors
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, `Failed to confirm payment: ${error.message || 'Unknown error'}`);
    }
  }
}