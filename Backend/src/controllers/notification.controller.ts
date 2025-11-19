import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/notification.service';
import { AppError } from '../middleware/error.handler';

const notifService = new NotificationService();

/**
 * Retrieves all notifications for the currently logged-in user.
 */
export const getMyNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Requires isAuthenticated middleware to run first
    if (!req.user?.id) {
      return next(new AppError(401, 'Authentication required to view notifications.'));
    }
    const userId = req.user.id;
    
    // Delegate retrieval to the service layer
    const data = await notifService.getForUser(userId);
    
    res.status(200).json({ 
      message: 'Notifications retrieved successfully', 
      data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Marks a single notification as read by its ID.
 */
export const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return next(new AppError(401, 'Authentication required.'));
    }
    const { id } = req.params; // Notification ID
    
    // Delegate update logic to the service layer
    await notifService.markAsRead(id, req.user.id);
    
    res.status(200).json({ message: `Notification ${id} marked as read` });
  } catch (error) {
    next(error);
  }
};

/**
 * Marks all unread notifications for the user as read.
 */
export const markAllAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return next(new AppError(401, 'Authentication required.'));
    }
    const userId = req.user.id;

    // Delegate mass update logic to the service layer
    await notifService.markAllAsRead(userId);

    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};