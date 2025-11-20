import { db } from '../config/db';
import { Review, CreateReviewDto } from '../../common/types/types';
import { AppError } from '../middleware/error.handler';
import { NotificationService } from './notification.service';

export class ReviewService {
  private notifService = new NotificationService();

  public async create(userId: string, data: CreateReviewDto): Promise<Review> {
    const { booking_id, accommodation_id, rating, comment } = data; //params
    const bookingRes = await db.query(`
      SELECT b.* FROM bookings b
      JOIN room_types r ON b.room_type_id = r.id
      WHERE b.id = $1 
        AND b.user_id = $2 
        AND r.accommodation_id = $3
    `, [booking_id, userId, accommodation_id]);

    if (bookingRes.rows.length === 0) {
      throw new AppError(400, 'Invalid booking. You cannot review an accommodation you have not booked.');
    }

    const booking = bookingRes.rows[0];

    const now = new Date();
    const checkOutDate = new Date(booking.check_out_date);
    
    if (booking.status !== 'completed' && checkOutDate > now) {
      throw new AppError(400, 'You can only review after your stay is completed.');
    }
    const existingReview = await db.query('SELECT * FROM reviews WHERE booking_id = $1', [booking_id]);
    if (existingReview.rows.length > 0) {
      throw new AppError(409, 'You have already submitted a review for this stay.');
    }
    const insertRes = await db.query(`
      INSERT INTO reviews (user_id, accommodation_id, booking_id, rating, comment, is_approved)
      VALUES ($1, $2, $3, $4, $5, false)
      RETURNING *
    `, [userId, accommodation_id, booking_id, rating, comment]);

    return insertRes.rows[0];
  }

  // --- Admin Methods ---

  public async getPending(): Promise<Review[]> {
    const query = `
      SELECT r.*, u.full_name as user_name, a.name as accommodation_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      JOIN accommodations a ON r.accommodation_id = a.id
      WHERE r.is_approved = false
      ORDER BY r.created_at ASC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  public async approve(reviewId: string): Promise<void> {
    const result = await db.query(
      'UPDATE reviews SET is_approved = true WHERE id = $1 RETURNING user_id', 
      [reviewId]
    );

    if (result.rows.length === 0) {
      throw new AppError(404, 'Review not found.');
    }

    const userId = result.rows[0].user_id;
    await this.notifService.send(
        userId, 
        'booking_update', 
        'Your review has been approved and is now live!'
    );
  }

  public async delete(reviewId: string): Promise<void> {
    const result = await db.query('DELETE FROM reviews WHERE id = $1', [reviewId]);
    
    if (result.rowCount === 0) {
      throw new AppError(404, 'Review not found.');
    }
  }
}