import api from './api';

export interface DashboardStats {
    totalBookings: number;
    revenue: number;
    occupancyRate: number;
    totalGuests: number;
    recentBookings: Booking[];
}

export interface User {
    id: string;
    full_name: string;
    email: string;
    role: string;
    created_at: string;
    profile_image_url?: string;
}

export interface Accommodation {
    id: string;
    name: string;
    description: string;
    address: string;
    city: string;
    country: string;
    price_per_night: number;
    rating: number;
    images: string[];
    amenities: string[];
    is_active?: boolean;
}

export interface Booking {
    id: string;
    user_id: string;
    room_type_id: string;
    check_in_date: string;
    check_out_date: string;
    total_price: number;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    payment_status?: 'pending' | 'paid' | 'refunded';
    created_at: string;
    admin_notes?: string;
    user?: {
        full_name: string;
        email: string;
    };
    accommodation?: {
        name: string;
        city: string;
    };
}

export interface UpdateBookingDto {
    status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    admin_notes?: string;
}

class AdminService {
    /**
     * Fetch dashboard statistics
     */
    async getDashboardStats(): Promise<DashboardStats> {
        try {
            const response = await api.get('/admin/dashboard/stats');
            console.log('Dashboard stats response:', response.data);

            // Backend returns: { message, data }
            const data = response.data.data || response.data;

            return {
                totalBookings: data.total_bookings || 0,
                revenue: data.total_revenue || 0,
                occupancyRate: data.occupancy_rate || 0,
                totalGuests: data.total_guests || 0,
                recentBookings: data.recent_bookings || []
            };
        } catch (error: any) {
            console.error('Failed to fetch dashboard stats:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Fetch all users
     */
    async getAllUsers(): Promise<User[]> {
        try {
            const response = await api.get('/admin/users');
            console.log('Users response:', response.data);

            // Backend returns: { message, data }
            return response.data.data || response.data;
        } catch (error: any) {
            console.error('Failed to fetch users:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Fetch all accommodations
     */
    async getAccommodations(): Promise<Accommodation[]> {
        try {
            const response = await api.get('/admin/accommodations');
            console.log('Accommodations response:', response.data);

            // Backend returns: { message, data }
            return response.data.data || response.data;
        } catch (error: any) {
            console.error('Failed to fetch accommodations:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Create a new accommodation
     */
    async createAccommodation(data: Partial<Accommodation>): Promise<Accommodation> {
        try {
            const response = await api.post('/admin/accommodations', data);
            console.log('Create accommodation response:', response.data);

            return response.data.data || response.data;
        } catch (error: any) {
            console.error('Failed to create accommodation:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Update an existing accommodation
     */
    async updateAccommodation(id: string, data: Partial<Accommodation>): Promise<Accommodation> {
        try {
            const response = await api.put(`/admin/accommodations/${id}`, data);
            console.log('Update accommodation response:', response.data);

            return response.data.data || response.data;
        } catch (error: any) {
            console.error('Failed to update accommodation:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Delete an accommodation
     */
    async deleteAccommodation(id: string): Promise<void> {
        try {
            const response = await api.delete(`/admin/accommodations/${id}`);
            console.log('Delete accommodation response:', response.data);
        } catch (error: any) {
            console.error('Failed to delete accommodation:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Fetch all bookings with user and accommodation details
     */
    async getBookings(): Promise<Booking[]> {
        try {
            const response = await api.get('/admin/bookings');
            console.log('Bookings response:', response.data);

            // Backend returns: { message, data }
            return response.data.data || response.data;
        } catch (error: any) {
            console.error('Failed to fetch bookings:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Update a booking (approve, modify, cancel)
     */
    async updateBooking(id: string, data: UpdateBookingDto): Promise<Booking> {
        try {
            const response = await api.put(`/admin/bookings/${id}`, data);
            console.log('Update booking response:', response.data);

            return response.data.data || response.data;
        } catch (error: any) {
            console.error('Failed to update booking:', error.response?.data || error.message);
            throw error;
        }
    }
}

export const adminService = new AdminService();
