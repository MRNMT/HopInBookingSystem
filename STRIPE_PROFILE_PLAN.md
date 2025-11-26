# Implementation Plan: Stripe Integration & User Profile

## Phase 1: Stripe Payment Integration

### Backend Tasks:
1. ✅ Install Stripe SDK: `npm install stripe`
2. ✅ Add Stripe keys to `.env`
3. ✅ Create payment controller (`payment.controller.ts`)
4. ✅ Create payment routes
5. ✅ Implement endpoints:
   - POST `/api/v1/payments/create-intent` - Create payment intent
   - POST `/api/v1/payments/webhook` - Handle Stripe webhooks
   - POST `/api/v1/bookings` - Create booking after payment

### Frontend Tasks:
1. ✅ Install Stripe libraries: `npm install @stripe/stripe-js @stripe/react-stripe-js`
2. ✅ Add Stripe publishable key to `.env`
3. ✅ Update BookingPage with Stripe Elements
4. ✅ Handle payment confirmation
5. ✅ Redirect to confirmation page

---

## Phase 2: User Profile Page

### Backend Tasks:
1. ✅ Create booking controller (`booking.controller.ts`)
2. ✅ Create booking service
3. ✅ Implement endpoints:
   - GET `/api/v1/bookings/user/:userId` - Get user's bookings
   - GET `/api/v1/bookings/:id` - Get single booking
   - PUT `/api/v1/users/:id` - Update user profile

### Frontend Tasks:
1. ✅ Create ProfilePage component
2. ✅ Create sections:
   - Profile Information (editable)
   - Current Bookings
   - Previous Bookings
   - Favorites
3. ✅ Add profile icon to navigation
4. ✅ Create routes

---

## Database Schema Reference:

### `bookings` table:
- id (UUID)
- user_id (UUID) → FK to users
- room_type_id (UUID) → FK to room_types
- check_in_date (DATE)
- check_out_date (DATE)
- num_rooms (INT)
- num_guests (INT)
- total_price (DECIMAL)
- status ('pending', 'confirmed', 'cancelled', 'completed')
- guest_name, guest_email, guest_phone
- special_requests, admin_notes

### `payments` table:
- id (UUID)
- booking_id (UUID) → FK to bookings
- user_id (UUID)
- amount (DECIMAL)
- currency ('ZAR')
- provider ('stripe')
- status ('pending', 'completed', 'failed', 'refunded')
- transaction_id (Stripe PaymentIntent ID)

---

## Implementation Order:

1. **Backend Stripe Setup** (30 mins)
2. **Frontend Stripe Integration** (45 mins)
3. **Booking API** (30 mins)
4. **Profile Page UI** (1 hour)
5. **Navigation Updates** (15 mins)
6. **Testing** (30 mins)

**Total Estimated Time: ~3.5 hours**

---

Let's begin! 🚀
