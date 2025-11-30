# HopIn Booking System - System Overview

## Introduction

**HopIn** is a comprehensive hotel booking and management system built with a modern tech stack. The system consists of three main applications:

1. **Customer App** - Public-facing booking interface for end users
2. **CMS (Content Management System)** - Admin dashboard for hotel management
3. **Backend API** - RESTful API server handling all business logic

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────┐       ┌─────────────────────┐
│   Customer App      │       │     CMS Admin       │
│   (React/Vite)      │       │   (React/Vite)      │
└──────────┬──────────┘       └──────────┬──────────┘
           │                              │
           │         HTTPS/REST           │
           └──────────────┬───────────────┘
                          │
                 ┌────────▼────────┐
                 │  Backend API    │
                 │  (Node.js +     │
                 │   Express)      │
                 └────────┬────────┘
                          │
           ┌──────────────┼──────────────┐
           │              │              │
    ┌──────▼──────┐  ┌───▼────┐  ┌─────▼─────┐
    │ PostgreSQL  │  │ Stripe │  │  Google   │
    │  Database   │  │   API  │  │  OAuth    │
    └─────────────┘  └────────┘  └───────────┘
```

### Technology Stack

#### Frontend (Customer App & CMS)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: Redux Toolkit
- **UI Components**: Custom components with React Icons
- **Charts**: Recharts for analytics visualization
- **Styling**: TailwindCSS (optional) / Vanilla CSS
- **Maps**: Leaflet for location visualization
- **Payment**: Stripe Elements for secure payment processing

#### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js v5
- **Database**: PostgreSQL 8.x
- **ORM**: Raw SQL queries with `pg` driver
- **Authentication**: JWT (JSON Web Tokens)
- **OAuth**: Passport.js with Google OAuth 2.0
- **Payment Gateway**: Stripe API
- **Validation**: Zod schema validation
- **Security**: 
  - bcryptjs for password hashing
  - Helmet.js for security headers
  - CORS middleware

#### DevOps
- **Development**: ts-node for development server
- **Build**: TypeScript compiler (tsc)
- **Process Manager**: (Production deployment pending)

---

## Database Architecture

### Core Tables (12 Total)

#### 1. **users**
Manages user authentication, profiles, and role-based access control.
- Supports OAuth (Google) and standard email/password authentication
- Three roles: `customer`, `admin`, `superadmin`
- Email domain validation for admin roles

#### 2. **accommodations**
Core hotel/property information.
- Name, description, location (city, country, lat/lng)
- Star rating (1-5)
- Active/inactive status for soft deletes
- Audit trail with `created_by` admin user

#### 3. **room_types**
Different room categories within each accommodation.
- Pricing per night
- Capacity and total inventory
- Availability flag

#### 4. **bookings**
Customer reservations linking users to room types.
- Date range validation
- Multiple status states: `pending`, `confirmed`, `cancelled`, `completed`
- Payment status tracking
- Guest information and special requests
- Admin notes for management

#### 5. **payments**
Financial transaction records.
- Linked to bookings
- Stripe transaction IDs
- Status: `pending`, `completed`, `failed`, `refunded`
- Multi-currency support

#### 6. **reviews**
User feedback and ratings.
- 1-5 star rating
- Admin moderation with approval workflow
- One review per booking constraint

#### 7. **notifications**
User alert system.
- Type-based notifications: booking confirmations, updates, promotions
- Read/unread tracking
- Related booking references

#### 8. **facilities**
Master list of amenities (WiFi, Pool, Gym, etc.)

#### 9. **accommodation_facilities**
Many-to-many relationship between accommodations and facilities

#### 10. **user_favorites**
User's saved/favorited accommodations

#### 11. **accommodation_images**
Photo gallery for each property (JSONB array)

#### 12. **room_type_images**
Photo gallery for each room type (JSONB array)

### Database Features
- UUID primary keys for scalability
- Foreign key constraints with appropriate cascade/restrict rules
- Automatic timestamp tracking with triggers
- Check constraints for data validation
- Indexes on frequently queried columns

---

## Authentication & Authorization

### Authentication Methods

**1. Email/Password (Standard)**
- Password hashing using bcryptjs (10 rounds)
- JWT tokens for session management
- Token expiration: 7 days

**2. OAuth 2.0 (Google)**
- Passport.js Google strategy
- Automatic user creation on first login
- Profile data synchronization

### Authorization Levels

**Customer** (`role: 'customer'`)
- Book accommodations
- View/manage own bookings
- Leave reviews
- Manage favorites
- View profile and notifications

**Admin** (`role: 'admin'`)
- All customer permissions
- View all bookings
- Approve/modify bookings
- View analytics and reports
- Manage accommodations
- Approve reviews
- Email requirement: `*@hopinAdmin.email`

**Super Admin** (`role: 'superadmin'`)
- All admin permissions
- Create/manage admin users
- Full system access
- Email requirement: `*@hopinSuperAdmin.email`

### Security Middleware
Authentication middleware validates JWT tokens and injects user data into requests. Protected routes check for:
1. Valid JWT token
2. Appropriate user role
3. Resource ownership (for user-specific operations)

---

## API Structure

### Base URL
```
http://localhost:8000/api/v1
```

### Main Route Groups

**Public Routes**
- `/auth` - Login, register, Google OAuth
- `/accommodations` - Browse hotels (GET only)

**Authenticated Routes**
- `/user` - Profile management, favorites
- `/bookings` - Create and manage bookings
- `/payments` - Payment processing (Stripe)
- `/reviews` - Submit and view reviews
- `/notifications` - User notifications

**Admin Routes** (requires admin/superadmin role)
- `/admin/dashboard/stats` - Analytics data
- `/admin/users` - User management
- `/admin/accommodations` - CRUD operations
- `/admin/bookings` - Booking management
- `/admin/reviews/pending` - Review moderation
- `/admin/location-performance` - Location analytics

**Super Admin Routes** (requires superadmin role)
- `/superadmin/admins` - Admin user management
- `/superadmin/dashboard` - System-wide analytics

---

## Key Features

### 1. **Real-Time Analytics**
- Dashboard statistics (revenue, bookings, occupancy, guests)
- Location-based performance metrics
- Real-time booking status tracking
- Customer metrics and segmentation

### 2. **Booking Management**
- Multi-room booking support
- Date range validation and availability checking
- Automatic pricing calculation
- Status workflow: pending → confirmed → completed
- Cancellation with refund tracking

### 3. **Payment Integration**
- Stripe Payment Intents API
- Automatic payment-booking synchronization
- Admin approval automatically marks payments as completed
- Support for refunds on cancellation

### 4. **Review System**
- Post-booking review submission
- Admin moderation workflow
- Rating aggregation for accommodations

### 5. **Notification System**
- Event-driven notifications
- Multiple notification types
- Read/unread tracking
- Booking-related alerts

---

## Data Flow Examples

### Booking Creation Flow
```
1. Customer selects room and dates
   ↓
2. Frontend validates availability
   ↓
3. POST /api/v1/bookings/create
   ↓
4. Backend creates booking (status: pending)
   ↓
5. Backend creates Stripe Payment Intent
   ↓
6. Backend creates payment record
   ↓
7. Frontend receives client_secret
   ↓
8. Customer completes Stripe payment
   ↓
9. Stripe webhook → POST /api/v1/payments/webhook
   ↓
10. Backend updates payment status → completed
    ↓
11. Backend updates booking status → confirmed
    ↓
12. Notification sent to customer
```

### Admin Booking Approval Flow
```
1. Admin views pending bookings
   ↓
2. Admin clicks "Approve" on booking
   ↓
3. PUT /api/v1/admin/bookings/:id { status: 'confirmed' }
   ↓
4. Backend updates booking status → confirmed
   ↓
5. Backend updates payment status → completed (NEW)
   ↓
6. Backend updates booking.payment_status → paid
   ↓
7. Analytics immediately reflect revenue
   ↓
8. Notification sent to customer
```

---

## Environment Configuration

### Required Environment Variables

**Backend (.env)**
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/hopin_db

# JWT Secret
JWT_SECRET=your-secret-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:8000/api/v1/auth/google/callback

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Server
PORT=8000
CLIENT_URL=http://localhost:5173
```

**Frontend (.env)**
```bash
VITE_API_URL=http://localhost:8000/api/v1
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_GOOGLE_MAPS_API_KEY=your-maps-api-key
```

---

## Quick Start Guide

### Backend Setup
```bash
cd Backend
npm install
npm run setup              # Configure environment
npm run seed:superadmin    # Create initial superadmin
npm run seed:accommodations # Seed sample data
npm run dev                # Start development server
```

### Customer App Setup
```bash
cd Customer-app
npm install
npm run dev                # Start at http://localhost:5173
```

### CMS Setup
```bash
cd CMS
npm install
npm run dev                # Start at http://localhost:5174
```

---

## Project Structure

```
HopInBookingSystem/
├── Backend/
│   ├── src/
│   │   ├── api/v1/         # Route definitions
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── config/         # Database, env config
│   │   ├── scripts/        # Database setup, seeding
│   │   └── server.ts       # App entry point
│   └── package.json
│
├── Customer-app/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route pages
│   │   ├── sections/       # Page sections
│   │   ├── services/       # API clients
│   │   ├── store/          # Redux state
│   │   └── routes/         # Route configuration
│   └── package.json
│
└── CMS/
    ├── src/
    │   ├── components/     # Admin UI components
    │   ├── pages/          # Dashboard pages
    │   ├── services/       # API clients
    │   └── store/          # Redux state
    └── package.json
```

---

## Development Workflow

### 1. Database Changes
```bash
# Modify schema
vim Backend/src/scripts/schema.sql

# Apply changes
npm run setup
```

### 2. API Development
```bash
# Add route → controller → service
Backend/src/api/v1/new-feature.routes.ts
Backend/src/controllers/new-feature.controller.ts
Backend/src/services/new-feature.service.ts

# Test with curl or Postman
curl -X GET http://localhost:8000/api/v1/new-endpoint
```

### 3. Frontend Development
```bash
# Add page component
Customer-app/src/pages/NewPage.tsx

# Add route
Customer-app/src/routes/AppRoutes.tsx

# Connect with API service
Customer-app/src/services/new-feature.service.ts
```

---

## Testing

### Backend Testing
Currently uses manual testing via:
- Direct database queries
- API endpoint testing with test scripts
- Stripe test cards for payment flows

### Frontend Testing
- Manual UI testing during development
- Browser developer tools for debugging
- React DevTools for component inspection

---

## Security Considerations

**Implemented**
- Password hashing (bcryptjs)
- JWT token authentication
- Role-based access control
- CORS configuration
- Helmet security headers
- SQL injection prevention (parameterized queries)
- Email domain validation for admin roles

**Best Practices**
- Never commit `.env` files
- Rotate JWT secrets regularly
- Use production Stripe keys only in production
- Validate all user inputs
- Sanitize error messages in production

---

## Future Enhancements

- [ ] Email verification for new users
- [ ] Password reset flow
- [ ] Multi-language support (i18n)
- [ ] Advanced search filters
- [ ] Booking calendar view
- [ ] Automated testing suite
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Real-time notifications (WebSockets)
- [ ] Mobile app (React Native)

---

## Support & Maintenance

For technical issues or questions, refer to:
- Backend API documentation
- Frontend component documentation
- Database schema documentation

Last Updated: November 30, 2025
Version: 1.0.0
