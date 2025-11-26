import api from './api';

export interface Accommodation {
    id: string;
    name: string;
    description: string;
    address: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    star_rating: number;
    policies: string;
    is_active: boolean;
    created_at: string;
}

export interface RoomType {
    id: string;
    accommodation_id: string;
    type_name: string;
    description: string;
    price_per_night: number;
    capacity: number;
    total_inventory: number;
    is_available: boolean;
}

export const getAllAccommodations = async () => {
    const response = await api.get('/accommodations');
    return response.data;
};

export const getAccommodationById = async (id: string) => {
    const response = await api.get(`/accommodations/${id}`);
    return response.data;
};

export const searchAccommodations = async (filters: {
    city?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: number;
    rooms?: number;
}) => {
    const response = await api.get('/accommodations/search', { params: filters });
    return response.data;
};

export const getRoomTypes = async (accommodationId: string) => {
    const response = await api.get(`/accommodations/${accommodationId}/room-types`);
    return response.data;
};
