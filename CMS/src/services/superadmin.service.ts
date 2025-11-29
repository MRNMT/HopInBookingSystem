import api from './api';

export interface AdminUser {
    id: string;
    email: string;
    full_name: string;
    role: 'admin' | 'superadmin';
    created_at: string;
}

export interface CreateAdminDto {
    email: string;
    password: string;
    fullName: string;
}

class SuperAdminService {
    async getAllAdmins() {
        const response = await api.get('/superadmin');
        return response.data;
    }

    async createAdmin(data: CreateAdminDto) {
        const response = await api.post('/superadmin', data);
        return response.data;
    }

    async deleteAdmin(id: string) {
        const response = await api.delete(`/superadmin/${id}`);
        return response.data;
    }
}

export const superAdminService = new SuperAdminService();
