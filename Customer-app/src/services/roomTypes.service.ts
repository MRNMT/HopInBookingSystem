import api from './api';

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

export const getRoomTypes = async (accommodationId: string) => {
    const response = await api.get(`/accommodations/${accommodationId}/room-types`);
    return response.data.data;
};

