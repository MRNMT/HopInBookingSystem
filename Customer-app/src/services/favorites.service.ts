import api from './api';

export const addFavorite = async (accommodationId: string) => {
    const response = await api.post('/favorites', { accommodation_id: accommodationId });
    return response.data;
};

export const removeFavorite = async (accommodationId: string) => {
    const response = await api.delete(`/favorites/${accommodationId}`);
    return response.data;
};

export const getFavorites = async () => {
    const response = await api.get('/favorites');
    return response.data;
};

export const isFavorite = async (accommodationId: string) => {
    const response = await api.get(`/favorites/check/${accommodationId}`);
    return response.data.isFavorite;
};
