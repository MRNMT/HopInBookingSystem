import { db } from '../config/db';
import { User, UpdateProfileDto, Booking, Accommodation } from '../../common/types/types';
import { AppError } from '../middleware/error.handler';

export class UserService {

  public async getProfile(userId: string): Promise<User> {
    const result = await db.query(
      'SELECT id, full_name, email, role, profile_image_url, created_at FROM users WHERE id = $1', 
      [userId]
    );

    if (result.rows.length === 0) {
      throw new AppError(404, 'User not found');
    }

    return result.rows[0] as User;
  }

  public async updateProfile(userId: string, data: UpdateProfileDto): Promise<User> {
    const allowedUpdates = ['full_name', 'profile_image_url'];
    const updates = Object.keys(data).filter(
      (key) => allowedUpdates.includes(key) && (data as any)[key] !== undefined
    );

    if (updates.length === 0) {
      throw new AppError(400, 'No valid fields provided for update');
    }

    const setClause = updates
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');

    const values = [userId, ...updates.map((key) => (data as any)[key])];

    const query = `
      UPDATE users
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
      RETURNING id, full_name, email, role, profile_image_url, created_at
    `;

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      throw new AppError(404, 'User not found or update failed');
    }

    return result.rows[0] as User;
  }
  
  public async getById(userId: string): Promise<User> {
    const result = await db.query(
      'SELECT id, full_name, email, role, profile_image_url, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      throw new AppError(404, 'User not found');
    }

    return result.rows[0] as User;
  }

  public async getMyBookings(userId: string): Promise<Booking[]> {
    const query = `
      SELECT 
        b.*,
        r.id as room_type_id,
        r.type_name as room_type_name,
        r.price_per_night as room_type_price_per_night,
        a.id as accommodation_id,
        a.name as accommodation_name,
        a.city as accommodation_city,
        a.country as accommodation_country,
        (SELECT images FROM accommodation_images ai WHERE ai.accommodation_id = a.id) as accommodation_images
        FROM bookings b
        JOIN room_types r ON b.room_type_id = r.id
        JOIN accommodations a ON r.accommodation_id = a.id
        WHERE b.user_id = $1
        ORDER BY b.check_in_date DESC`;

    const result = await db.query(query, [userId]);
    return result.rows as Booking[];
  }

  public async getMyFavorites(userId: string): Promise<Accommodation[]> {
    const query = `
      SELECT 
        a.*,
        (SELECT images FROM accommodation_images ai WHERE ai.accommodation_id = a.id) as images
      FROM accommodations a
      JOIN user_favorites uf ON a.id = uf.accommodation_id
      WHERE uf.user_id = $1
    `;

    const result = await db.query(query, [userId]);
    return result.rows as Accommodation[];
  }

  public async addFavorite(userId: string, accommodationId: string): Promise<void> {
    const query = `
      INSERT INTO user_favorites (user_id, accommodation_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, accommodation_id) DO NOTHING
    `;
    await db.query(query, [userId, accommodationId]);
  }

  public async removeFavorite(userId: string, accommodationId: string): Promise<void> {
    const query = `
      DELETE FROM user_favorites 
      WHERE user_id = $1 AND accommodation_id = $2
    `;
    const result = await db.query(query, [userId, accommodationId]);
  }

}
