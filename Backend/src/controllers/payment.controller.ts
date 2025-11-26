import { Request, Response } from 'express';
import { db } from '../config/db';
import * as stripeService from '../services/stripe.service';

// Create payment intent for booking
export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id; // User might be optional if we allow guest checkout, but let's assume auth for now
    const { bookingId, amount, currency = 'ZAR', bookingData } = req.body;

    if (!amount) {
      return res.status(400).json({
        message: 'Amount is required'
      });
    }

    let finalBookingId = bookingId;

    // If no bookingId, create a new booking first
    if (!bookingId && bookingData) {
      // Validate booking data
      const { roomTypeId, checkIn, checkOut, numberOfRooms, numberOfGuests, guestName, guestEmail, guestPhone } = bookingData;

      if (!roomTypeId || !checkIn || !checkOut) {
        return res.status(400).json({ message: 'Missing booking details' });
      }

      // Create booking with pending status
      // Note: We should probably check availability here too, but keeping it simple for now
      const newBooking = await db.query(
        `INSERT INTO bookings (
          user_id, room_type_id, check_in_date, check_out_date, 
          total_price, status, guest_name, guest_email, guest_phone,
          number_of_rooms, number_of_guests
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`,
        [
          userId || null, // Handle guest checkout if userId is null
          roomTypeId,
          checkIn,
          checkOut,
          amount,
          'pending', // Initial status
          guestName,
          guestEmail,
          guestPhone,
          numberOfRooms,
          numberOfGuests
        ]
      );

      finalBookingId = newBooking.rows[0].id;
    } else if (bookingId) {
      // Verify booking exists and belongs to user
      const booking = await db.query(
        'SELECT * FROM bookings WHERE id = $1',
        [bookingId]
      );

      if (booking.rows.length === 0) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      finalBookingId = bookingId;
    } else {
      return res.status(400).json({ message: 'Booking ID or Booking Data is required' });
    }

    // Create payment intent
    const paymentIntent = await stripeService.createPaymentIntent({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      bookingId: finalBookingId,
      userId: userId || 'guest',
      metadata: {
        booking_id: finalBookingId,
        user_email: (req as any).user?.email || bookingData?.guestEmail,
      },
    });

    // Save payment record
    await db.query(
      `INSERT INTO payments (booking_id, user_id, amount, currency, provider, status, transaction_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [finalBookingId, userId || null, amount, currency, 'stripe', 'pending', paymentIntent.id]
    );

    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.clientSecret,
        paymentIntentId: paymentIntent.id,
        bookingId: finalBookingId
      },
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ message: 'Failed to create payment intent' });
  }
};

// Confirm payment
export const confirmPayment = async (req: Request, res: Response) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ message: 'Payment intent ID is required' });
    }

    const paymentIntent = await stripeService.retrievePaymentIntent(paymentIntentId);

    // Update payment status
    await db.query(
      'UPDATE payments SET status = $1 WHERE transaction_id = $2',
      [paymentIntent.status === 'succeeded' ? 'completed' : paymentIntent.status, paymentIntentId]
    );

    // If payment succeeded, update booking status
    if (paymentIntent.status === 'succeeded') {
      const payment = await db.query(
        'SELECT booking_id FROM payments WHERE transaction_id = $1',
        [paymentIntentId]
      );

      if (payment.rows.length > 0) {
        await db.query(
          'UPDATE bookings SET status = $1 WHERE id = $2',
          ['confirmed', payment.rows[0].booking_id]
        );
      }
    }

    res.json({
      success: true,
      data: {
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
      },
    });
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ message: 'Failed to confirm payment' });
  }
};

// Get payment status
export const getPaymentStatus = async (req: Request, res: Response) => {
  try {
    const { paymentIntentId } = req.params;

    const paymentIntent = await stripeService.retrievePaymentIntent(paymentIntentId);

    res.json({
      success: true,
      data: {
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
      },
    });
  } catch (error) {
    console.error('Error getting payment status:', error);
    res.status(500).json({ message: 'Failed to get payment status' });
  }
};

// Create refund
export const createRefund = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { paymentIntentId, amount } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ message: 'Payment intent ID is required' });
    }

    // Verify payment belongs to user or user is admin
    const payment = await db.query(
      'SELECT * FROM payments WHERE transaction_id = $1',
      [paymentIntentId]
    );

    if (payment.rows.length === 0) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    const userRole = (req as any).user.role;
    if (payment.rows[0].user_id !== userId && userRole !== 'admin' && userRole !== 'superadmin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Create refund
    const refund = await stripeService.createRefund(
      paymentIntentId,
      amount ? Math.round(amount * 100) : undefined
    );

    // Update payment status
    await db.query(
      'UPDATE payments SET status = $1 WHERE transaction_id = $2',
      ['refunded', paymentIntentId]
    );

    // Update booking status
    await db.query(
      'UPDATE bookings SET status = $1 WHERE id = $2',
      ['cancelled', payment.rows[0].booking_id]
    );

    res.json({
      success: true,
      data: {
        refundId: refund.id,
        amount: refund.amount / 100,
        status: refund.status,
      },
    });
  } catch (error) {
    console.error('Error creating refund:', error);
    res.status(500).json({ message: 'Failed to create refund' });
  }
};

// Webhook handler for Stripe events
export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;

  try {
    // Note: You need to set STRIPE_WEBHOOK_SECRET in .env
    // const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);

    // Handle the event
    // switch (event.type) {
    //   case 'payment_intent.succeeded':
    //     // Handle successful payment
    //     break;
    //   case 'payment_intent.payment_failed':
    //     // Handle failed payment
    //     break;
    //   // ... handle other event types
    // }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error}`);
  }
};

// Get user's payment history
export const getMyPayments = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const result = await db.query(
      `SELECT p.*, b.check_in_date, b.check_out_date, b.guest_name
       FROM payments p
       LEFT JOIN bookings b ON p.booking_id = b.id
       WHERE p.user_id = $1
       ORDER BY p.created_at DESC`,
      [userId]
    );

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error getting payment history:', error);
    res.status(500).json({ message: 'Failed to get payment history' });
  }
};

// Get payment by ID
export const getPaymentById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    const result = await db.query(
      `SELECT p.*, b.check_in_date, b.check_out_date, b.guest_name
       FROM payments p
       LEFT JOIN bookings b ON p.booking_id = b.id
       WHERE p.id = $1 AND p.user_id = $2`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error getting payment:', error);
    res.status(500).json({ message: 'Failed to get payment' });
  }
};

// Get all payments (Admin only)
export const getAllPaymentsAdmin = async (req: Request, res: Response) => {
  try {
    const result = await db.query(
      `SELECT p.*, b.check_in_date, b.check_out_date, b.guest_name, u.email as user_email
       FROM payments p
       LEFT JOIN bookings b ON p.booking_id = b.id
       LEFT JOIN users u ON p.user_id = u.id
       ORDER BY p.created_at DESC`
    );

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error getting all payments:', error);
    res.status(500).json({ message: 'Failed to get payments' });
  }
};

