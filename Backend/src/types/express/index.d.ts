import { User as AppUser } from '../../../common/types/types';

declare global {
  namespace Express {
    // 1. Extend the empty Express.User interface with your custom User properties
    interface User extends AppUser {}

    // 2. Explicitly tell Request to use this User type
    interface Request {
      user?: User;
    }
  }
}