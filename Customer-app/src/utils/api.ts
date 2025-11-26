// API utility for Customer-app

const API_BASE_URL = 'http://localhost:5000/api/v1';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Auth endpoints
export const auth = {
  register: async (data: { email: string; password: string; fullName: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  login: async (data: { email: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return response.json();
  },
  getMe: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },
};

// Accommodations endpoints
export const accommodations = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/accommodations`);
    return response.json();
  },
  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/accommodations/${id}`);
    return response.json();
  },
  getByCity: async (city: string) => {
    const response = await fetch(`${API_BASE_URL}/accommodations/city/${city}`);
    return response.json();
  },
};

// Bookings endpoints
export const bookings = {
  create: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },
  cancel: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}/cancel`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return response.json();
  },
};

// Reviews endpoints
export const reviews = {
  create: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },
  getForAccommodation: async (accommodationId: string) => {
    const response = await fetch(`${API_BASE_URL}/reviews/${accommodationId}`);
    return response.json();
  },
};

// Users endpoints
export const users = {
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },
  updateProfile: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },
  getMyBookings: async () => {
    const response = await fetch(`${API_BASE_URL}/users/bookings`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },
  getMyFavorites: async () => {
    const response = await fetch(`${API_BASE_URL}/users/favorites`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },
  addFavorite: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/users/favorites`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },
  removeFavorite: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/users/favorites/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return response.json();
  },
};
