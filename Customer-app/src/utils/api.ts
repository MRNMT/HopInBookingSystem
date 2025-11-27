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
    const response = await fetch(`http://localhost:5000/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  login: async (data: { email: string; password: string }) => {
    const response = await fetch(`http://localhost:5000/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  logout: async () => {
    const response = await fetch(`http://localhost:5000/api/v1/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return response.json();
  },
  getMe: async () => {
    const response = await fetch(`http://localhost:5000/api/v1/auth/me`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },
};

// Accommodations endpoints
export const accommodations = {
  getAll: async () => {
    const response = await fetch(`http://localhost:5000/api/v1/accommodations`);
    return response.json();
  },
  getById: async (id: string) => {
    const response = await fetch(`http://localhost:5000/api/v1/accommodations/${id}`);
    return response.json();
  },
  getByCity: async (city: string) => {
    const response = await fetch(`http://localhost:5000/api/v1/accommodations/city/${city}`);
    return response.json();
  },
};

// Bookings endpoints
export const bookings = {
  create: async (data: any) => {
    const response = await fetch(`http://localhost:5000/api/v1/bookings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },
  cancel: async (id: string) => {
    const response = await fetch(`http://localhost:5000/api/v1/bookings/${id}/cancel`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return response.json();
  },
};

// Reviews endpoints
export const reviews = {
  create: async (data: any) => {
    const response = await fetch(`http://localhost:5000/api/v1/reviews`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },
  getForAccommodation: async (accommodationId: string) => {
    const response = await fetch(`http://localhost:5000/api/v1/reviews/${accommodationId}`);
    return response.json();
  },
};

// Users endpoints
export const users = {
  getProfile: async () => {
    const response = await fetch(`http://localhost:5000/api/v1/users/profile`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },
  updateProfile: async (data: any) => {
    const response = await fetch(`http://localhost:5000/api/v1/users/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },
  getMyBookings: async () => {
    const response = await fetch(`http://localhost:5000/api/v1/users/bookings`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },
  getMyFavorites: async () => {
    const response = await fetch(`http://localhost:5000/api/v1/users/favorites`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },
  addFavorite: async (data: any) => {
    const response = await fetch(`http://localhost:5000/api/v1/users/favorites`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },
  removeFavorite: async (id: string) => {
    const response = await fetch(`http://localhost:5000/api/v1/users/favorites/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return response.json();
  },
};

// Payments endpoints
export const payments = {
  createIntent: async (data: any) => {
    const response = await fetch(`http://localhost:5000/api/v1/payments/create-intent`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    // Check if response is OK before parsing JSON
    if (!response.ok) {
      let errorMessage = `Request failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (e) {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      const error: any = new Error(errorMessage);
      error.status = response.status;
      throw error;
    }
    
    return response.json();
  },
  confirm: async (paymentIntentId: string) => {
    const response = await fetch(`http://localhost:5000/api/v1/payments/confirm`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ paymentIntentId }),
    });
    
    // Check if response is OK before parsing JSON
    if (!response.ok) {
      let errorMessage = `Request failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (e) {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      const error: any = new Error(errorMessage);
      error.status = response.status;
      throw error;
    }
    
    return response.json();
  },
};

// Notifications endpoints
export const notifications = {
  getAll: async () => {
    const response = await fetch(`http://localhost:5000/api/v1/notifications`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },
  create: async (data: any) => {
    const response = await fetch(`http://localhost:5000/api/v1/notifications`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },
  markAsRead: async (id: string) => {
    const response = await fetch(`http://localhost:5000/api/v1/notifications/${id}/read`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    return response.json();
  },
  markAllAsRead: async () => {
    const response = await fetch(`http://localhost:5000/api/v1/notifications/read-all`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    return response.json();
  },
};
