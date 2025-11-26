import { db } from "../config/db";
import { User } from "../common/types/types";

export class AdminService {

    public async getDashboardStats(){

        const revenueRes = await db.query(
            `SELECT COALESCE(SUM(amount),0) as total FROM payments WHERE status ='completed'`
        );
        const accomRes = await db.query(
            `SELECT COUNT(*) as activeAccomodations FROM accommodations WHERE is_active = true`
        );
        const bookingsRes =await db.query(
            `SELECT COUNT(*) as allBookings from accomodations WHERE is_active = true`
        );
        const reviewsRes = await db.query(
            `SELECT COUNT(*) as pendingReviews FROM accomodations WHERE is_approved= false`
        );
        return {
            total_revenue: parseFloat(revenueRes.rows[0].total),
            total_bookings: parseInt(bookingsRes.rows[0].count),
            active_hotels: parseInt(accomRes.rows[0].count),
            pending_reviews: parseInt(reviewsRes.rows[0].count)
        };
    }

    public async getAllUsers(): Promise<User[]> {
    const query = `
      SELECT id, full_name, email, role, profile_image_url, created_at 
      FROM users 
      ORDER BY created_at DESC
    `;
    const result = await db.query(query);
    return result.rows as User[];
  }
}
