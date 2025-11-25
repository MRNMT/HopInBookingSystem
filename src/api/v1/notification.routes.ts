import { Router } from 'express';
import { 
  getMyNotifications, 
  markAsRead, 
  markAllAsRead 
} from '../../controllers/notification.controller';
import { isAuthenticated } from '../../middleware/auth.middleware';

const notificationRouter = Router();

notificationRouter.use(isAuthenticated); // so that only the logged in user can see the notification

notificationRouter.get('/', getMyNotifications);
notificationRouter.patch('/:id/read', markAsRead);
notificationRouter.patch('/read-all', markAllAsRead);

export default notificationRouter;