import { db } from "../config/db";
import { User } from "../common/types/types";

export class AdminService {

    public async getDashboardStats() {
        // Get total revenue from completed payments with confirmed bookings only
        const revenueRes = await db.query(
            `SELECT COALESCE(SUM(p.amount), 0) as total 
             FROM payments p
             INNER JOIN bookings b ON p.booking_id = b.id
             WHERE p.status = 'completed' AND b.status = 'confirmed'`
        );

        // Get total number of bookings
        const bookingsRes = await db.query(
            `SELECT COUNT(*) as total FROM bookings`
        );

        // Get total number of guests (sum of num_guests from all bookings)
        const guestsRes = await db.query(
            `SELECT COALESCE(SUM(num_guests), 0) as total FROM bookings WHERE status != 'cancelled'`
        );

        // Calculate occupancy rate (confirmed bookings / total accommodations)
        const occupancyRes = await db.query(
            `SELECT 
                COUNT(DISTINCT b.room_type_id) as booked_rooms,
                (SELECT COUNT(*) FROM room_types) as total_rooms
            FROM bookings b
            WHERE b.status = 'confirmed' 
            AND b.check_in_date <= CURRENT_DATE 
            AND b.check_out_date >= CURRENT_DATE`
        );

        const bookedRooms = parseInt(occupancyRes.rows[0].booked_rooms) || 0;
        const totalRooms = parseInt(occupancyRes.rows[0].total_rooms) || 1;
        const occupancyRate = totalRooms > 0 ? Math.round((bookedRooms / totalRooms) * 100) : 0;

        // Get recent bookings with user and accommodation details
        const recentBookingsRes = await db.query(
            `SELECT 
                b.id,
                b.check_in_date,
                b.check_out_date,
                b.total_price,
                b.status,
                b.created_at,
                json_build_object('full_name', u.full_name, 'email', u.email) as user,
                json_build_object('name', a.name, 'city', a.city) as accommodation
            FROM bookings b
            LEFT JOIN users u ON b.user_id = u.id
            LEFT JOIN room_types r ON b.room_type_id = r.id
            LEFT JOIN accommodations a ON r.accommodation_id = a.id
            ORDER BY b.created_at DESC
            LIMIT 5`
        );

        return {
            total_revenue: parseFloat(revenueRes.rows[0].total),
            total_bookings: parseInt(bookingsRes.rows[0].total),
            total_guests: parseInt(guestsRes.rows[0].total),
            occupancy_rate: occupancyRate,
            recent_bookings: recentBookingsRes.rows
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
