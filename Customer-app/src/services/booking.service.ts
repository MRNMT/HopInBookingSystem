import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

export interface Booking {
    id: string;
    accommodation_id: string;
    room_type_id: string;
    check_in_date: string;
    check_out_date: string;
    num_rooms: number;
    num_guests: number;
    total_price: number;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    guest_name: string;
    accommodation_name?: string; // Populated from join
    accommodation_image?: string; // Populated from join
    room_type_name?: string; // Populated from join
}

export const getUserBookings = async () => {
    const token = localStorage.getItem('token');
    // If no token, we might need to handle this. For now assuming auth headers are set or we pass them.
    // Actually, let's assume we use an interceptor or just pass headers here if needed.
    // But wait, the user might not be logged in with a token if we haven't implemented full auth on frontend.
    // The prompt says "I need a user profile page... so I can update profile details".
    // This implies some sort of user context.

    // For now, let's assume the endpoint is protected and we need a token.
    // If the user isn't logged in, this will fail.

    return axios.get(`${API_URL}/bookings/my-bookings`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const getBookingById = async (id: string) => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_URL}/bookings/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};
