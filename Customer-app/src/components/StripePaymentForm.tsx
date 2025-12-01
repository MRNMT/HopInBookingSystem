import { useState } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import stripePromise from '../config/stripe';
import { Button } from './Button';
import { PaymentConfirmationDialog } from './PaymentConfirmationDialog';

interface PaymentFormProps {
  clientSecret: string;
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const CheckoutForm = ({ amount, onSuccess, onError }: Omit<PaymentFormProps, 'clientSecret'>) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentConfirm, setShowPaymentConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/booking-confirmation`,
        },
      });

      if (error) {
        onError(error.message || 'Payment failed');
      } else {
        onSuccess();
      }
    } catch (err: any) {
      onError(err.message || 'An error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Amount to pay:</span> R{amount.toFixed(2)}
          </p>
        </div>

        <PaymentElement />

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700">
          <p className="font-semibold mb-2">🔒 Secure Payment</p>
          <p>Your payment information is encrypted and secure. We use Stripe for payment processing.</p>
        </div>

        <Button
          variant="primary"
          type="submit"
          disabled={!stripe || isProcessing}
          className="w-full"
        >
          {isProcessing ? 'Processing...' : `Pay R${amount.toFixed(2)}`}
        </Button>
      </form>

      <PaymentConfirmationDialog
        isOpen={showPaymentConfirm}
        onClose={() => setShowPaymentConfirm(false)}
        onConfirm={confirmPayment}
        amount={amount}
        loading={isProcessing}
      />
    </>
  );
};

export const StripePaymentForm = ({ clientSecret, amount, onSuccess, onError }: PaymentFormProps) => {
  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#0088FF',
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm amount={amount} onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
};
