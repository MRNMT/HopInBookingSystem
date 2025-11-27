import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('FATAL: STRIPE_SECRET_KEY is missing in .env file.');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-10-29.clover',
});

export class StripeService {
    public async createPaymentIntent(
        amount: number,
        currency: string,
        metadata: Record<string, string>
    ) {
        return await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: currency.toLowerCase(),
            metadata,
            automatic_payment_methods: {
                enabled: true,
            },
        });
    }

    public async retrievePaymentIntent(paymentIntentId: string) {
        return await stripe.paymentIntents.retrieve(paymentIntentId);
    }
    public async createRefund(paymentIntentId: string, amount?: number) {
        const params: Stripe.RefundCreateParams = {
            payment_intent: paymentIntentId,
        };
        if (amount) {
            params.amount = Math.round(amount * 100);
        }
        return await stripe.refunds.create(params);
    }
}