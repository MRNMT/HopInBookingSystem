import { db } from '../config/db';
import { Notification, NotificationType } from '../common/types/types';
import { AppError } from '../middleware/error.handler';

export class NotificationService {

  public async getForUser(userId: string): Promise<Notification[]> {
    const query = `
      SELECT * FROM notifications 
      WHERE user_id = $1 
      ORDER BY created_at DESC
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  public async markAsRead(notificationId: string, userId: string): Promise<void> {
    const query = `
      UPDATE notifications 
      SET is_read = true 
      WHERE id = $1 AND user_id = $2
    `;
    const result = await db.query(query, [notificationId, userId]);

    if (result.rowCount === 0) {
      throw new AppError(404, 'Notification not found or access denied.');
    }
  }

  public async markAllAsRead(userId: string): Promise<void> {
    const query = `
      UPDATE notifications 
      SET is_read = true 
      WHERE user_id = $1 AND is_read = false
    `;
    await db.query(query, [userId]);
  }

  public async send(
    userId: string, 
    type: NotificationType, 
    message: string,
    relatedBookingId?: string
  ): Promise<void> {

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

    await db.query(query, [userId, type, title, message, relatedBookingId || null]);

    console.log(`Notification sent to User ${userId}: [${title}] ${message}`);
  }
}
