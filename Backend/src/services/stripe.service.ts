import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-10-29.clover',
});

export interface CreatePaymentIntentParams {
    amount: number; // in cents
    currency: string;
    bookingId: string;
    userId: string;
    metadata?: Record<string, string>;
}

export interface PaymentIntent {
    id: string;
    clientSecret: string;
    amount: number;
    currency: string;
    status: string;
}

export const createPaymentIntent = async (
    params: CreatePaymentIntentParams
): Promise<PaymentIntent> => {
    const { amount, currency, bookingId, userId, metadata } = params;

    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: currency.toLowerCase(),
        metadata: {
            booking_id: bookingId,
            user_id: userId,
            ...metadata,
        },
        automatic_payment_methods: {
            enabled: true,
        },
    });

    return {
        id: paymentIntent.id,
        clientSecret: paymentIntent.client_secret!,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
    };
};

export const retrievePaymentIntent = async (
    paymentIntentId: string
): Promise<Stripe.PaymentIntent> => {
    return await stripe.paymentIntents.retrieve(paymentIntentId);
};

export const confirmPayment = async (
    paymentIntentId: string
): Promise<Stripe.PaymentIntent> => {
    return await stripe.paymentIntents.confirm(paymentIntentId);
};

export const cancelPayment = async (
    paymentIntentId: string
): Promise<Stripe.PaymentIntent> => {
    return await stripe.paymentIntents.cancel(paymentIntentId);
};

export const createRefund = async (
    paymentIntentId: string,
    amount?: number
): Promise<Stripe.Refund> => {
    const refundParams: Stripe.RefundCreateParams = {
        payment_intent: paymentIntentId,
    };

    if (amount) {
        refundParams.amount = amount;
    }

    return await stripe.refunds.create(refundParams);
};

export default stripe;
