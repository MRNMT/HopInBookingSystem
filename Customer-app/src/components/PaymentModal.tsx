import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from './Button';
import { payments } from '../utils/api';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  bookingData: any;
  onSuccess: (paymentIntent: any) => void;
}

const CheckoutForm = ({ amount, onSuccess, onClose }: { amount: number, onSuccess: (pi: any) => void, onClose: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message || 'An error occurred');
      setProcessing(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret: (elements as any)._commonOptions.clientSecret,
      confirmParams: {
        return_url: window.location.origin + '/booking/success', 
      },
      redirect: 'if_required',
    });

    if (error) {
      setError(error.message || 'Payment failed');
      setProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      try {
        // Confirm payment on backend
        await payments.confirm(paymentIntent.id);
        onSuccess(paymentIntent);
      } catch (err) {
        console.error('Error confirming payment on backend:', err);
        setError('Payment succeeded but failed to confirm booking. Please contact support.');
      } finally {
        setProcessing(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {error && <div className="text-red-500 mt-2 text-sm">{error}</div>}
      <div className="mt-6 flex gap-3 justify-end">
        <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
        <Button 
          variant="primary" 
          type="submit" 
          disabled={!stripe || processing}
        >
          {processing ? 'Processing...' : `Pay R${amount.toFixed(2)}`}
        </Button>
      </div>
    </form>
  );
};

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, amount, bookingData, onSuccess }) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && amount > 0) {
      const createIntent = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await payments.createIntent({
            amount,
            currency: 'ZAR',
            bookingData
          });
          
          if (response.success) {
             setClientSecret(response.data.clientSecret);
          } else {
             setError(response.message || 'Failed to initialize payment');
          }
        } catch (err: any) {
          console.error('Error creating payment intent:', err);
          setError('Failed to initialize payment. Please try again.');
        } finally {
          setLoading(false);
        }
      };
      
      createIntent();
    }
  }, [isOpen, amount]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Secure Payment</h2>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <p className="text-red-500 mb-4">{error}</p>
            <Button variant="secondary" onClick={onClose}>Close</Button>
          </div>
        ) : clientSecret ? (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm amount={amount} onSuccess={onSuccess} onClose={onClose} />
          </Elements>
        ) : null}
      </div>
    </div>
  );
};
