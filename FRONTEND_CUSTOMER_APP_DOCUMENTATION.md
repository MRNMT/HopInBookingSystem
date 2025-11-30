# HopIn Customer App - Frontend Documentation

## Table of Contents
- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Routing](#routing)
- [State Management](#state-management)
- [Key Components](#key-components)
- [Pages](#pages)
- [Services](#services)
- [Authentication Flow](#authentication-flow)
- [Booking Flow](#booking-flow)
- [Payment Integration](#payment-integration)
- [Development Guide](#development-guide)

---

## Overview

The HopIn Customer App is a modern React-based single-page application (SPA) that provides users with a seamless hotel browsing and booking experience. Built with TypeScript and Vite for fast development and optimized production builds.

**Key Features:**
- Browse available accommodations
- Search and filter hotels
- Book rooms with date selection
- Secure Stripe payment integration
- User authentication (Email/Password + Google OAuth)
- User profile and favorites management
- Booking history and management
- Real-time notifications
- Responsive design (mobile-first)

---

## Technology Stack

**Core:**
- React 18.x
- TypeScript 5.x
- Vite (Build tool)

**Routing:**
- React Router v6

**State Management:**
- Redux Toolkit
- React Context for auth

**UI Libraries:**
- React Icons
- Leaflet (Maps)
- Recharts (Analytics)

**Payment:**
- Stripe Elements
- Stripe React SDK

**HTTP Client:**
- Axios

**Styling:**
- CSS Modules / Vanilla CSS

---

## Project Structure

```
Customer-app/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, logos
│   ├── components/      # Reusable components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── Button.tsx
│   │   ├── Cards.tsx
│   │   ├── MapView.tsx
│   │   ├── NotificationBell.tsx
│   │   ├── PaymentModal.tsx
│   │   ├── StripePaymentForm.tsx
│   │   └── ProtectedRoute.tsx
│   ├── pages/           # Route pages
│   │   ├── LandingPage.tsx
│   │   ├── FindPage.tsx
│   │   ├── BookingPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── ConfirmPayment.tsx
│   │   └── AboutPage.tsx
│   ├── sections/        # Page sections
│   │   ├── HeroSection.tsx
│   │   └── FeaturedHotels.tsx
│   ├── services/        # API clients
│   │   ├── api.ts
│   │   ├── auth.service.ts
│   │   ├── booking.service.ts
│   │   ├── accommodation.service.ts
│   │   └── user.service.ts
│   ├── store/           # Redux store
│   │   ├── store.ts
│   │   └── slices/
│   │       ├── authSlice.ts
│   │       └── userSlice.ts
│   ├── routes/          # Route configuration
│   │   └── AppRoutes.tsx
│   ├── App.tsx          # Root component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── .env                 # Environment variables
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Architecture

### Component Hierarchy

```
App
├── AppRoutes
│   ├── Public Routes
│   │   ├── LandingPage
│   │   │   ├── Navbar
│   │   │   ├── HeroSection
│   │   │   ├── FeaturedHotels
│   │   │   └── Footer
│   │   ├── FindPage
│   │   │   ├── Navbar
│   │   │   ├── Search Filters
│   │   │   ├── Cards (Hotel List)
│   │   │   └── Footer
│   │   ├── Login
│   │   └── Register
│   └── Protected Routes (requires auth)
│       ├── BookingPage
│       │   ├── Navbar
│       │   ├── Hotel Details
│       │   ├── MapView
│       │   ├── Date Picker
│       │   ├── PaymentModal
│       │   │   └── StripePaymentForm
│       │   └── Footer
│       ├── ProfilePage
│       │   ├── Navbar
│       │   ├── User Info
│       │   ├── Booking History
│       │   ├── Favorites
│       │   └── Footer
│       └── ConfirmPayment
```

---

## Routing

### Route Configuration

Defined in `src/routes/AppRoutes.tsx` using React Router v6.

**Public Routes:**
```tsx
<Route path="/" element={<LandingPage />} />
<Route path="/find" element={<FindPage />} />
<Route path="/about" element={<AboutPage />} />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="/forgot-password" element={<ForgotPassword />} />
```

**Protected Routes:**
```tsx
<Route element={<ProtectedRoute />}>
  <Route path="/booking/:id" element={<BookingPage />} />
  <Route path="/profile" element={<ProfilePage />} />
  <Route path="/confirm-payment" element={<ConfirmPayment />} />
</Route>
```

### Protected Route Component

```tsx
// components/ProtectedRoute.tsx
const ProtectedRoute = () => {
  const { user } = useSelector((state) => state.auth);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
};
```

---

## State Management

### Redux Store Structure

```typescript
{
  auth: {
    user: User | null,
    token: string | null,
    isAuthenticated: boolean,
    loading: boolean
  },
  user: {
    profile: UserProfile | null,
    bookings: Booking[],
    favorites: Accommodation[]
  }
}
```

### Auth Slice

Located in `src/store/slices/authSlice.ts`

**Actions:**
- `login` - Authenticate user
- `logout` - Clear auth state
- `register` - Create new account
- `setUser` - Update user data
- `setToken` - Store JWT token

**Selectors:**
```typescript
const { user, isAuthenticated, token } = useSelector((state) => state.auth);
```

### Persistence

- JWT token stored in `localStorage`
- Auto-login on page refresh if token exists
- Token cleared on logout

---

## Key Components

### Navbar

**Location:** `src/components/Navbar.tsx`

**Features:**
- Logo and navigation links
- User menu (when authenticated)
- Notification bell with badge
- Responsive mobile menu

**Usage:**
```tsx
<Navbar />
```

---

### Button

**Location:** `src/components/Button.tsx`

**Props:**
```typescript
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}
```

**Usage:**
```tsx
<Button variant="primary" onClick={handleClick}>
  Book Now
</Button>
```

---

### Cards (Hotel Card)

**Location:** `src/components/Cards.tsx`

**Purpose:** Display hotel information in a card format

**Features:**
- Hotel image carousel
- Star rating display
- Price per night
- Quick view details
- Favorite button

**Usage:**
```tsx
<Cards 
  accommodation={hotel}
  onBookClick={() => navigate(`/booking/${hotel.id}`)}
/>
```

---

### MapView

**Location:** `src/components/MapView.tsx`

**Purpose:** Display hotel location on interactive map

**Library:** Leaflet with React-Leaflet

**Features:**
- Interactive map with markers
- Custom marker icons
- Zoom controls
- Responsive sizing

**Usage:**
```tsx
<MapView 
  latitude={hotel.latitude}
  longitude={hotel.longitude}
  name={hotel.name}
/>
```

---

### NotificationBell

**Location:** `src/components/NotificationBell.tsx`

**Features:**
- Badge showing unread count
- Dropdown notification list
- Mark as read functionality
- Auto-refresh

**Usage:**
```tsx
<NotificationBell />
```

---

### PaymentModal

**Location:** `src/components/PaymentModal.tsx`

**Purpose:** Modal dialog for payment processing

**Contains:**
- Booking summary
- Total price display
- Stripe payment form
- Loading states
- Error handling

**Usage:**
```tsx
<PaymentModal 
  isOpen={showPayment}
  onClose={() => setShowPayment(false)}
  bookingData={bookingData}
  clientSecret={clientSecret}
/>
```

---

### StripePaymentForm

**Location:** `src/components/StripePaymentForm.tsx`

**Features:**
- Stripe Elements integration
- Card input validation
- 3D Secure handling
- Error display
- Success callback

**Usage:**
```tsx
<Elements stripe={stripePromise}>
  <StripePaymentForm 
    clientSecret={clientSecret}
    onSuccess={handlePaymentSuccess}
  />
</Elements>
```

---

## Pages

### LandingPage

**Location:** `src/pages/LandingPage.tsx`

**Purpose:** Home page with hero and featured hotels

**Sections:**
- Hero section with search
- Featured accommodations
- Why choose us
- Call to action

---

### FindPage

**Location:** `src/pages/FindPage.tsx`

**Purpose:** Browse and search hotels

**Features:**
- Search filters (city, price range, rating)
- Hotel grid/list view
- Pagination
- Sort options

**State:**
```typescript
const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
const [filters, setFilters] = useState({
  city: '',
  minPrice: 0,
  maxPrice: 10000,
  rating: 0
});
```

---

### BookingPage

**Location:** `src/pages/BookingPage.tsx`

**Purpose:** Hotel details and booking creation

**Features:**
- Hotel image gallery
- Room type selection
- Date range picker
- Guest count selection
- Price calculation
- Booking creation
- Payment modal trigger

**Flow:**
1. User selects room type
2. User picks check-in/check-out dates
3. User enters guest details
4. System calculates total price
5. User clicks "Book Now"
6. API creates booking and payment intent
7. Payment modal opens with Stripe form
8. User completes payment
9. Redirect to confirmation page

---

### ProfilePage

**Location:** `src/pages/ProfilePage.tsx`

**Purpose:** User account management

**Tabs:**
- **Profile:** Edit name, email, photo
- **Bookings:** View booking history with status
- **Favorites:** Manage saved hotels
- **Settings:** Change password, preferences

**Features:**
- Profile update with image upload
- Booking cancellation
- Favorite toggle
- Password change

---

### Login

**Location:** `src/pages/Login.tsx`

**Features:**
- Email/password form
- Google OAuth button
- Form validation
- Remember me checkbox
- Forgot password link

**Authentication:**
```typescript
const handleLogin = async (credentials) => {
  const response = await authService.login(credentials);
  dispatch(setUser(response.user));
  dispatch(setToken(response.token));
  navigate('/');
};
```

---

### Register

**Location:** `src/pages/Register.tsx`

**Features:**
- Registration form (name, email, password)
- Password strength indicator
- Terms acceptance checkbox
- Form validation
- Auto-login after registration

---

### ConfirmPayment

**Location:** `src/pages/ConfirmPayment.tsx`

**Purpose:** Payment confirmation page

**Features:**
- Booking confirmation details
- Receipt display
- Download booking confirmation
- Navigate to bookings

---

## Services

### API Configuration

**Location:** `src/services/api.ts`

**Setup:**
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - Add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - logout
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

### Auth Service

**Location:** `src/services/auth.service.ts`

**Methods:**
```typescript
class AuthService {
  async login(email: string, password: string): Promise<AuthResponse>
  async register(userData: RegisterData): Promise<AuthResponse>
  async loginWithGoogle(): Promise<void>
  async logout(): Promise<void>
}
```

---

### Booking Service

**Location:** `src/services/booking.service.ts`

**Methods:**
```typescript
class BookingService {
  async createBooking(data: CreateBookingDto): Promise<BookingResponse>
  async getUserBookings(): Promise<Booking[]>
  async cancelBooking(id: string): Promise<void>
}
```

---

### Accommodation Service

**Location:** `src/services/accommodation.service.ts`

**Methods:**
```typescript
class AccommodationService {
  async getAll(filters?: Filters): Promise<Accommodation[]>
  async getById(id: string): Promise<Accommodation>
  async search(query: string): Promise<Accommodation[]>
}
```

---

### User Service

**Location:** `src/services/user.service.ts`

**Methods:**
```typescript
class UserService {
  async getProfile(): Promise<UserProfile>
  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile>
  async changePassword(data: PasswordChange): Promise<void>
  async getFavorites(): Promise<Accommodation[]>
  async addFavorite(id: string): Promise<void>
  async removeFavorite(id: string): Promise<void>
}
```

---

## Authentication Flow

### Email/Password Login

```
1. User enters credentials
   ↓
2. POST /api/v1/auth/login
   ↓
3. Backend validates credentials
   ↓
4. Backend returns { user, token }
   ↓
5. Frontend stores token in localStorage
   ↓
6. Frontend updates Redux state
   ↓
7. Frontend redirects to home page
```

### Google OAuth Login

```
1. User clicks "Login with Google"
   ↓
2. Redirect to /api/v1/auth/google
   ↓
3. Google consent screen
   ↓
4. Google redirects to /api/v1/auth/google/callback
   ↓
5. Backend creates/updates user
   ↓
6. Backend redirects to frontend with token in URL
   ↓
7. Frontend extracts token from URL
   ↓
8. Frontend stores token and fetches user data
   ↓
9. Frontend redirects to home page
```

---

## Booking Flow

### Complete Booking Process

```
1. User browses accommodations on FindPage
   ↓
2. User clicks on hotel card
   ↓
3. Navigate to BookingPage with hotel ID
   ↓
4. User selects:
   - Room type
   - Check-in/Check-out dates
   - Number of guests
   - Special requests
   ↓
5. System validates:
   - Date range
   - Room availability
   - Guest count vs capacity
   ↓
6. System calculates total price:
   price = nights × price_per_night × num_rooms
   ↓
7. User clicks "Book Now"
   ↓
8. POST /api/v1/bookings/create
   ↓
9. Backend creates:
   - Booking record (status: pending)
   - Stripe Payment Intent
   - Payment record
   ↓
10. Backend returns: { bookingId, clientSecret, totalPrice }
    ↓
11. Frontend opens PaymentModal
    ↓
12. User enters card details in Stripe form
    ↓
13. Stripe validates and processes payment
    ↓
14. On success:
    - Stripe calls webhook
    - Backend updates payment → completed
    - Backend updates booking → confirmed
    - Notification sent
    ↓
15. Frontend redirects to /confirm-payment
    ↓
16. Display booking confirmation
```

---

## Payment Integration

### Stripe Setup

**Installation:**
```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

**Configuration:**
```typescript
// App.tsx or payment component
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
```

### Payment Form Component

```typescript
// StripePaymentForm.tsx
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const StripePaymentForm = ({ clientSecret, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) return;

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: elements.getElement(CardElement)!
        }
      }
    );

    if (error) {
      // Handle error
      setError(error.message);
    } else if (paymentIntent.status === 'succeeded') {
      // Payment successful
      onSuccess(paymentIntent);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Pay Now
      </button>
    </form>
  );
};
```

### Payment Confirmation

After successful payment:
1. Stripe webhook notifies backend
2. Backend updates booking status
3. Frontend redirects to `/confirm-payment`
4. Display booking details and receipt

---

## Development Guide

### Environment Setup

**Create `.env` file:**
```bash
VITE_API_URL=http://localhost:8000/api/v1
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
VITE_GOOGLE_MAPS_API_KEY=your_maps_api_key
```

### Installation

```bash
cd Customer-app
npm install
```

### Development Server

```bash
npm run dev
# Runs on http://localhost:5173
```

### Build for Production

```bash
npm run build
# Output in dist/ folder
```

### Preview Production Build

```bash
npm run preview
```

---

### Code Style Guidelines

**Component Structure:**
```typescript
// 1. Imports
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Types/Interfaces
interface MyComponentProps {
  title: string;
  onAction: () => void;
}

// 3. Component
export const MyComponent: React.FC<MyComponentProps> = ({ title, onAction }) => {
  // 4. Hooks
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  // 5. Effects
  useEffect(() => {
    // ...
  }, []);

  // 6. Handlers
  const handleClick = () => {
    // ...
  };

  // 7. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};
```

**Naming Conventions:**
- Components: PascalCase (`BookingPage.tsx`)
- Services: camelCase with .service suffix (`auth.service.ts`)
- Hooks: camelCase with 'use' prefix (`useAuth.ts`)
- Constants: UPPER_SNAKE_CASE

---

### Common Development Tasks

**Adding a New Page:**
```typescript
// 1. Create page component
// src/pages/NewPage.tsx
export const NewPage = () => {
  return <div>New Page</div>;
};

// 2. Add route
// src/routes/AppRoutes.tsx
<Route path="/new" element={<NewPage />} />
```

**Adding a New API Endpoint:**
```typescript
// src/services/new-feature.service.ts
import api from './api';

class NewFeatureService {
  async getData() {
    const response = await api.get('/new-endpoint');
    return response.data;
  }
}

export const newFeatureService = new NewFeatureService();
```

**Adding Redux State:**
```typescript
// src/store/slices/newSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const newSlice = createSlice({
  name: 'new',
  initialState: {},
  reducers: {
    // actions
  }
});

export const { actions } = newSlice;
export default newSlice.reducer;

// Add to store.ts
import newReducer from './slices/newSlice';

export const store = configureStore({
  reducer: {
    new: newReducer
  }
});
```

---

## Testing

### Manual Testing Checklist

**Authentication:**
- [ ] Register new account
- [ ] Login with email/password
- [ ] Login with Google
- [ ] Logout
- [ ] Remember me functionality

**Booking:**
- [ ] Browse hotels
- [ ] Filter by city, price
- [ ] View hotel details
- [ ] Select dates and create booking
- [ ] Complete payment
- [ ] View confirmation

**Profile:**
- [ ] Update profile information
- [ ] Change password
- [ ] Add/remove favorites
- [ ] View booking history
- [ ] Cancel booking

---

## Troubleshooting

### Common Issues

**Issue: CORS errors**
```
Solution: Ensure backend CORS is configured to allow frontend origin
Backend: cors({ origin: 'http://localhost:5173' })
```

**Issue: Payment form not loading**
```
Solution: Check Stripe publishable key in .env
Ensure VITE_STRIPE_PUBLISHABLE_KEY is set correctly
```

**Issue: 401 Unauthorized on API calls**
```
Solution: Check if token exists in localStorage
Verify token is being sent in Authorization header
Check if token has expired (7 days)
```

---

## Performance Optimization

**Implemented:**
- Vite for fast builds
- Code splitting with React.lazy
- Image optimization
- Axios request/response interceptors

**Recommended:**
- Memoize expensive computations with useMemo
- Use React.memo for pure components
- Implement virtual scrolling for long lists
- Lazy load images

---

## Security Best Practices

**Implemented:**
- XSS protection via React's JSX escaping
- JWT token storage in localStorage
- HTTPS-only in production
- Stripe PCI compliance

**Recommendations:**
- Regular dependency updates
- CSP headers in production
- Input sanitization
- Rate limiting on backend

---

Last Updated: November 30, 2025  
Version: 1.0.0  
Maintained by: HopIn Development Team
