import { db } from '../config/db';
import { User, UpdateProfileDto, Booking, Accommodation } from '../../common/types/types';
import { AppError } from '../middleware/error.handler';

export class UserService {
  public async getProfile(userId: string): Promise<User> {
    const query = await db.query(
      'SELECT id, full_name, email, role, profile_image_url, created_at FROM users WHERE id = $1',     // 1. Execute the SQL query
      [userId]
    );
    if (query.rows.length === 0) {     // 2. Check if any user was found
      throw new AppError(404, 'User not found');
    }
    return query.rows[0] as User;     // 3. Return the first row, cast to the User type
  }



  public async updateProfile (userId: string, data: UpdateProfileDto):Promise<String> {
    const query = await db.query(
        'update'
    )
    return "";
  }

  
  
  // TODO: Implement getById(userId: string) (Admin function)

  // TODO: Implement getMyBookings(userId: string)

  // TODO: Implement getMyFavorites(userId: string)

  // TODO: Implement addFavorite(userId: string, accommodationId: string)

  // TODO: Implement removeFavorite(userId: string, accommodationId: string)

}