import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from './Button';
import { payments } from '../utils/api';
import { PaymentConfirmationDialog } from './PaymentConfirmationDialog';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  bookingData: any;
  onSuccess: (paymentIntent: any) => void;
}

const CheckoutForm = ({ amount, onSuccess, onClose, clientSecret }: { amount: number, onSuccess: (pi: any) => void, onClose: () => void, clientSecret: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [showPaymentConfirm, setShowPaymentConfirm] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    // Show confirmation dialog first
    setShowPaymentConfirm(true);
  };

  const confirmPayment = async () => {
    if (!stripe || !elements) {
      return;
    }

    setShowPaymentConfirm(false);
    setProcessing(true);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message || 'An error occurred');
      setProcessing(false);
      return;
    }

    // Ensure we have a valid return URL
    const returnUrl = window.location.origin 
      ? `${window.location.origin}/confirm_payment`
      : `${window.location.protocol}//${window.location.host}/confirm_payment`;

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret: clientSecret,
      confirmParams: {
        return_url: returnUrl, 
      },
      redirect: 'if_required',
    });

    if (error) {
      setError(error.message || 'Payment failed');
      setProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      try {
        // Confirm payment on backend
        const confirmResponse = await payments.confirm(paymentIntent.id);
        if (confirmResponse.success) {
          onSuccess(paymentIntent);
        } else {
          setError(confirmResponse.message || 'Payment succeeded but failed to confirm booking. Please contact support.');
        }
      } catch (err: any) {
        console.error('Error confirming payment on backend:', err);
        const errorMessage = err.message || 'Payment succeeded but failed to confirm booking. Please contact support.';
        setError(errorMessage);
        // Don't set processing to false here - let user see the error and decide what to do
      } finally {
        setProcessing(false);
      }
    }
  };

  return (
    <>
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

      <PaymentConfirmationDialog
        isOpen={showPaymentConfirm}
        onClose={() => setShowPaymentConfirm(false)}
        onConfirm={confirmPayment}
        amount={amount}
        loading={processing}
      />
    </>
  );
};

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, amount, bookingData, onSuccess }) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTestCards, setShowTestCards] = useState(false);

  useEffect(() => {
    if (isOpen && amount > 0) {
      const createIntent = async () => {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to make a payment.');
          setLoading(false);
          return;
        }
        
        try {
          const response = await payments.createIntent({
            amount,
            currency: 'ZAR',
            bookingData
          });
          
          if (response.success && response.data?.clientSecret) {
             // Validate clientSecret is a string
             const secret = typeof response.data.clientSecret === 'string' 
               ? response.data.clientSecret 
               : response.data.clientSecret?.clientSecret || response.data.clientSecret;
             
             if (!secret || typeof secret !== 'string') {
               setError('Invalid payment configuration. Please try again.');
               return;
             }
             
             setClientSecret(secret);
          } else {
             // Handle specific error messages from backend
             if (response.message?.includes('Authentication') || response.message?.includes('Unauthorized')) {
               setError('Your session has expired. Please log in again.');
             } else {
               setError(response.message || 'Failed to initialize payment');
             }
          }
        } catch (err: any) {
          console.error('Error creating payment intent:', err);
          
          // Prioritize authentication errors
          if (err.status === 401 || err.status === 403) {
            setError('Your session has expired. Please log in again.');
            localStorage.removeItem('token');
          } else if (err.message?.includes('401') || err.message?.includes('403') ||
              err.message?.includes('Authentication') || err.message?.includes('Unauthorized') ||
              err.message?.includes('Invalid or expired token') || err.message?.includes('Access token required')) {
            setError('Your session has expired. Please log in again.');
            localStorage.removeItem('token');
          } else if (err.message?.includes('Invalid API Key') || err.message?.includes('Stripe')) {
            setError('Payment service configuration error. Please contact support.');
          } else {
            setError(err.message || 'Failed to initialize payment. Please try again.');
          }
        } finally {
          setLoading(false);
        }
      };
      
      createIntent();
    }
  }, [isOpen, amount, bookingData]);

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
          <>
            {/* Test Card Information - Only show in development */}
            {import.meta.env.DEV && (
              <div className="mb-4 border border-yellow-200 bg-yellow-50 rounded-lg p-3">
                <button
                  type="button"
                  onClick={() => setShowTestCards(!showTestCards)}
                  className="w-full text-left flex items-center justify-between text-sm font-semibold text-yellow-800"
                >
                  <span>🧪 Test Card Details (Development Only)</span>
                  <span>{showTestCards ? '▼' : '▶'}</span>
                </button>
                {showTestCards && (
                  <div className="mt-3 text-xs text-yellow-700 space-y-2">
                    <div>
                      <strong>Success:</strong> 4242 4242 4242 4242
                      <br />
                      <span className="text-gray-600">Any future expiry date, any CVC</span>
                    </div>
                    <div>
                      <strong>Decline:</strong> 4000 0000 0000 0002
                      <br />
                      <span className="text-gray-600">Card declined</span>
                    </div>
                    <div>
                      <strong>Insufficient Funds:</strong> 4000 0000 0000 9995
                      <br />
                      <span className="text-gray-600">Insufficient funds</span>
                    </div>
                    <div>
                      <strong>3D Secure:</strong> 4000 0025 0000 3155
                      <br />
                      <span className="text-gray-600">Requires authentication</span>
                    </div>
                    <div className="pt-2 border-t border-yellow-300">
                      <strong>Note:</strong> Use any future expiry date (e.g., 12/34) and any 3-digit CVC
                    </div>
                  </div>
                )}
              </div>
            )}
            <Elements 
              stripe={stripePromise} 
              options={{ 
                clientSecret,
                appearance: {
                  theme: 'stripe' as const,
                  variables: {
                    colorPrimary: '#0088FF',
                  },
                },
              }}
            >
              <CheckoutForm amount={amount} onSuccess={onSuccess} onClose={onClose} clientSecret={clientSecret} />
            </Elements>
          </>
        ) : null}
      </div>
    </div>
  );
};
