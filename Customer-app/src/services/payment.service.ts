import api from './api';

export interface CreatePaymentIntentParams {
    bookingId: string;
    amount: number;
    currency?: string;
}

export const createPaymentIntent = async (params: CreatePaymentIntentParams) => {
    const response = await api.post('/payments/create-intent', params);
    return response.data;
};

export const confirmPayment = async (paymentIntentId: string) => {
    const response = await api.post('/payments/confirm', { paymentIntentId });
    return response.data;
};

export const getPaymentStatus = async (paymentIntentId: string) => {
    const response = await api.get(`/payments/status/${paymentIntentId}`);
    return response.data;
};

export const getMyPayments = async () => {
    const response = await api.get('/payments/my-history');
    return response.data;
};
