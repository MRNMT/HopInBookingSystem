import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51SXdJ7Dr8RIJeoQqZSIhbhD21hLxKbY08MqRBlbXmyavZaGENjEKFro3pqzeRY2YpATtVsvEcfzj4fQzmEXHJYJ700NgxCWUah');

export default stripePromise;
