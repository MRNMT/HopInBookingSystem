import api from './api';

export interface LoginDto {
    email: string;
    password: string;
}

export interface LoginResponse {
    user: {
        id: string;
        email: string;
        full_name: string;
        role: 'customer' | 'admin' | 'superadmin';
    };
    token: string;
}

class AuthService {
    async login(data: LoginDto): Promise<LoginResponse> {
        const response = await api.post<{ data: LoginResponse }>('/auth/login', data);
        return response.data.data;
    }
}

export const authService = new AuthService();
