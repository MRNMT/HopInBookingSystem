import { db } from '../config/db';
import { Notification, NotificationType } from '../../common/types/types';
import { AppError } from '../middleware/error.handler';

export class NotificationService {
  
  /**
   * Retrieves all notifications for a specific user.
   * Ordered by newest first.
   */
  public async getForUser(userId: string): Promise<Notification[]> {
    const query = `
      SELECT * FROM notifications 
      WHERE user_id = $1 
      ORDER BY created_at DESC
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  /**
   * Marks a specific notification as read.
   * Includes a check to ensure the notification belongs to the requesting user.
   */
  public async markAsRead(notificationId: string, userId: string): Promise<void> {
    const query = `
      UPDATE notifications 
      SET is_read = true 
      WHERE id = $1 AND user_id = $2
    `;
    const result = await db.query(query, [notificationId, userId]);

    if (result.rowCount === 0) {
      // If no rows were updated, it means the ID doesn't exist 
      // OR the notification belongs to someone else.
      throw new AppError(404, 'Notification not found or access denied.');
    }
  }

  /**
   * Marks all unread notifications for a user as read.
   * Useful for a "Mark all as read" button in the UI.
   */
  public async markAllAsRead(userId: string): Promise<void> {
    const query = `
      UPDATE notifications 
      SET is_read = true 
      WHERE user_id = $1 AND is_read = false
    `;
    await db.query(query, [userId]);
  }

  /**
   * Internal Helper: Creates a new notification record.
   * This is called by other services (BookingService, ReviewService) to notify users.
   */
  public async send(
    userId: string, 
    type: NotificationType, 
    message: string,
    relatedBookingId?: string
  ): Promise<void> {
    
    // Determine a default title based on the notification type
    let title = 'Notification';
    switch (type) {
      case 'booking_confirmation': title = 'Booking Confirmed'; break;
      case 'booking_update': title = 'Booking Update'; break;
      case 'cancellation': title = 'Booking Cancelled'; break;
      case 'review_reminder': title = 'Rate Your Stay'; break;
      case 'promotion': title = 'Special Offer'; break;
    }

    const query = `
      INSERT INTO notifications (user_id, type, title, message, related_booking_id)
      VALUES ($1, $2, $3, $4, $5)
    `;

    // We use || null for relatedBookingId to handle optional values correctly in SQL
    await db.query(query, [userId, type, title, message, relatedBookingId || null]);
    
    console.log(`Notification sent to User ${userId}: [${title}] ${message}`);
  }
}