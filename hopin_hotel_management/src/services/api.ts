import axios from 'axios';

const getBaseUrl = () => {
    let url = import.meta.env.VITE_API_URL || 'https://hopinbookingsystem-1.onrender.com/api/v1';
    // Remove trailing slash if present to avoid double slashes when appending
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    // Append /api/v1 if not present
    if (!url.endsWith('/api/v1')) {
        url += '/api/v1';
    }
    return url;
};

const api = axios.create({
    baseURL: getBaseUrl(),
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers!.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
