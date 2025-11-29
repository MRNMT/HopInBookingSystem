import api from './api';

export interface User {
    id: string;
    email: string;
    full_name: string;
    role: 'customer' | 'admin' | 'superadmin';
    profile_image_url?: string;
    created_at: string;
}

export interface CreateAdminDto {
    email: string;
    password: string;
    fullName: string;
}

interface ApiResponse<T> {
    data: T;
    message?: string;
}

class SuperAdminService {
    /**
     * Creates a new Admin account via the backend API
     */
    async createAdmin(data: CreateAdminDto): Promise<User> {
        const response = await api.post<ApiResponse<User>>('/superadmin', data);
        return response.data.data;
    }

    /**
     * Retrieves a list of all Admins and SuperAdmins
     */
    async getAllAdmins(): Promise<User[]> {
        const response = await api.get<ApiResponse<User[]>>('/superadmin');
        return response.data.data || [];
    }

    /**
     * Retrieves a specific Admin by ID
     */
    async getAdminById(id: string): Promise<User | null> {
        const response = await api.get<ApiResponse<User | null>>(`/superadmin/${id}`);
        return response.data.data;
    }

    /**
     * Deletes an Admin account
     */
    async deleteAdmin(id: string): Promise<User | null> {
        const response = await api.delete<ApiResponse<User | null>>(`/superadmin/${id}`);
        return response.data.data;
    }
}

export const superAdminService = new SuperAdminService();

