import { User as AppUser } from '../../../common/types/types';

declare global {
  namespace Express {
    interface User extends AppUser {}

    interface Request {
      user?: User;
    }
  }
}