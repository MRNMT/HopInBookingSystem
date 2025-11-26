# Quick Start: Add Payment to BookingPage

## Step 1: Update BookingPage.tsx

Add these imports at the top:
```tsx
import { useState } from 'react';
import { StripePaymentForm } from '../components/StripePaymentForm';
import { createPaymentIntent } from '../services/payment.service';
import { useNavigate } from 'react-router-dom';
```

## Step 2: Add State Variables

Inside the BookingPage component:
```tsx
const [showPayment, setShowPayment] = useState(false);
const [clientSecret, setClientSecret] = useState<string | null>(null);
const [bookingAmount, setBookingAmount] = useState(580); // Example amount
const navigate = useNavigate();
```

## Step 3: Create Payment Handler

Add this function:
```tsx
const handleProceedToPayment = async () => {
  try {
    // In a real app, you'd create the booking first
    const bookingId = 'temp-booking-id'; // Replace with actual booking ID
    
    const paymentData = await createPaymentIntent({
      bookingId,
      amount: bookingAmount,
      currency: 'ZAR',
    });

    setClientSecret(paymentData.data.clientSecret);
    setShowPayment(true);
  } catch (error) {
    console.error('Error creating payment:', error);
    alert('Failed to initialize payment');
  }
};

const handlePaymentSuccess = () => {
  alert('Payment successful! Booking confirmed.');
  navigate('/profile'); // Or booking confirmation page
};

const handlePaymentError = (error: string) => {
  alert(`Payment failed: ${error}`);
  setShowPayment(false);
};
```

## Step 4: Update the Form Submit

Replace the current "Pay Now" button with:
```tsx
{!showPayment ? (
  <Button 
    variant='primary' 
    className='w-full'
    onClick={handleProceedToPayment}
    type="button"
  >
    Proceed to Payment
  </Button>
) : (
  <div className="mt-6">
    <h3 className="text-xl font-bold mb-4">Complete Payment</h3>
    <StripePaymentForm
      clientSecret={clientSecret!}
      amount={bookingAmount}
      onSuccess={handlePaymentSuccess}
      onError={handlePaymentError}
    />
  </div>
)}
```

## Complete Example

Here's how the payment section should look:

```tsx
<form className='space-y-6'>
  {/* ... existing form fields ... */}

  <div className='bg-blue-50 border border-blue-200 rounded p-4 text-sm text-blue-800'>
    <span className='font-semibold'>Secure Payment: </span>Your payment information is encrypted and secure
  </div>

  {!showPayment ? (
    <Button 
      variant='primary' 
      className='w-full'
      onClick={handleProceedToPayment}
      type="button"
    >
      Proceed to Payment (R{bookingAmount})
    </Button>
  ) : (
    <div className="mt-6 p-6 bg-white rounded-lg border-2 border-blue-200">
      <h3 className="text-xl font-bold mb-4">💳 Complete Payment</h3>
      <StripePaymentForm
        clientSecret={clientSecret!}
        amount={bookingAmount}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </div>
  )}
</form>
```

## Test It!

1. Fill in the booking form
2. Click "Proceed to Payment"
3. Use test card: `4242 4242 4242 4242`
4. Expiry: `12/25`, CVC: `123`
5. Click "Pay"
6. Payment should succeed!

---

**That's it! Your payment integration is ready.** 🎉
