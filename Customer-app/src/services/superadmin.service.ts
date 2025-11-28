import { API_BASE_URL } from '../utils/api';

interface CreateAdminDto {
    email: string;
    password: string;
    fullName: string;
}

interface User {
    id: string;
    email: string;
    full_name: string;
    role: 'customer' | 'admin' | 'superadmin';
    created_at: string;
    profile_image_url?: string;
}

// Backend now returns { message, data } format
interface ApiResponse<T> {
    message: string;
    data: T;
}

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

export const superAdminService = {
    // Get all admins
    getAllAdmins: async (): Promise<User[]> => {
        const response = await fetch(`${API_BASE_URL}/api/v1/superadmin`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            console.error('[SuperAdmin] Failed to fetch admins:', error);
            throw new Error(error.message || 'Failed to fetch admins');
        }

        const result: ApiResponse<User[]> = await response.json();
        return result.data; // Extract data from new response format
    },

    // Get admin by ID
    getAdminById: async (id: string): Promise<User> => {
        const response = await fetch(`${API_BASE_URL}/api/v1/superadmin/${id}`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            console.error('[SuperAdmin] Failed to fetch admin:', error);
            throw new Error(error.message || 'Failed to fetch admin');
        }

        const result: ApiResponse<User> = await response.json();
        return result.data; // Extract data from new response format
    },

    // Create admin
    createAdmin: async (data: CreateAdminDto): Promise<User> => {
        console.log('[SuperAdmin] Creating admin with data:', {
            email: data.email,
            fullName: data.fullName,
            hasPassword: !!data.password
        });

        const response = await fetch(`${API_BASE_URL}/api/v1/superadmin`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });

        // Log response for debugging
        console.log('[SuperAdmin] Create admin response status:', response.status);

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            console.error('[SuperAdmin] Failed to create admin:', error);
            throw new Error(error.message || error.error || 'Failed to create admin');
        }

        const result: ApiResponse<User> = await response.json();
        console.log('[SuperAdmin] Admin created successfully:', result.data);
        return result.data; // Extract data from new response format
    },

    // Delete admin
    deleteAdmin: async (id: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/api/v1/superadmin/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            console.error('[SuperAdmin] Failed to delete admin:', error);
            throw new Error(error.message || 'Failed to delete admin');
        }
    },
};
