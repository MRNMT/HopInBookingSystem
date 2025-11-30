# HopIn Booking System - Backend API Documentation

## Table of Contents
- [Overview](#overview)
- [Base URL & Versioning](#base-url--versioning)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [API Endpoints](#api-endpoints)
  - [Authentication Routes](#authentication-routes)
  - [User Routes](#user-routes)
  - [Accommodation Routes](#accommodation-routes)
  - [Booking Routes](#booking-routes)
  - [Payment Routes](#payment-routes)
  - [Review Routes](#review-routes)
  - [Favorites Routes](#favorites-routes)
  - [Notification Routes](#notification-routes)
  - [Admin Routes](#admin-routes)
  - [Super Admin Routes](#super-admin-routes)

---

## Overview

The HopIn Backend API is a RESTful service built with Node.js and Express.js, providing comprehensive hotel booking management functionality. All data is stored in PostgreSQL and accessed via parameterized SQL queries.

**Tech Stack:**
- Node.js v18+
- Express.js v5
- PostgreSQL 8.x
- TypeScript
- JWT for authentication
- Stripe for payments

---

## Base URL & Versioning

**Base URL:**
```
http://localhost:8000/api/v1
```

**API Version:** v1  
**Content-Type:** `application/json`  
**Charset:** UTF-8

---

## Authentication

### JWT Token Authentication

Most endpoints require authentication via JWT tokens. Include the token in the `Authorization` header:

```http
Authorization: Bearer <your-jwt-token>
```

### Token Acquisition

Obtain tokens by:
1. **POST /auth/login** - Email/password login
2. **POST /auth/register** - User registration
3. **GET /auth/google** - Google OAuth flow

### Token Expiration

- **Expiry Time:** 7 days
- **On Expiry:** Client must re-authenticate

### Role-Based Access Control

Three user roles with hierarchical permissions:
- **customer** - Basic user access
- **admin** - Accommodation and booking management
- **superadmin** - Full system access including admin management

---

## Error Handling

### Standard Error Response Format

```json
{
  "error": "Error message description",
  "statusCode": 400
}
```

### Common HTTP Status Codes

| Code | Meaning | Typical Use Case |
|------|---------|------------------|
| 200 | OK | Successful GET, PUT requests |
| 201 | Created | Successful POST (resource created) |
| 400 | Bad Request | Validation errors, missing fields |
| 401 | Unauthorized | Missing/invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource, availability issue |
| 500 | Internal Server Error | Unexpected server error |

### Error Examples

**Validation Error:**
```json
{
  "error": "Email is required",
  "statusCode": 400
}
```

**Authentication Error:**
```json
{
  "error": "Authentication required",
  "statusCode": 401
}
```

**Authorization Error:**
```json
{
  "error": "Admin access required",
  "statusCode": 403
}
```

---

## API Endpoints

### Authentication Routes

Base path: `/auth`

#### POST /auth/register

Register a new user account.

**Access:** Public

**Request Body:**
```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "full_name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  },
  "token": "jwt-token-here"
}
```

**Business Rules:**
- Email must be unique
- Password minimum 6 characters
- Default role is `customer`
- Admin emails must match domain constraints

---

#### POST /auth/login

Authenticate user with email and password.

**Access:** Public

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "full_name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  },
  "token": "jwt-token-here"
}
```

**Error Response (401):**
```json
{
  "error": "Invalid credentials",
  "statusCode": 401
}
```

---

#### GET /auth/google

Initiate Google OAuth login flow.

**Access:** Public

**Response:** Redirects to Google OAuth consent screen

---

#### GET /auth/google/callback

Google OAuth callback handler.

**Access:** Public (called by Google)

**Response:** Redirects to frontend with JWT token in URL

---

### User Routes

Base path: `/user`  
**Authentication:** Required (JWT)

#### GET /user/profile

Get current user's profile information.

**Success Response (200):**
```json
{
  "message": "Profile fetched",
  "data": {
    "id": "uuid",
    "full_name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "profile_image_url": "https://...",
    "created_at": "2025-01-15T10:30:00Z"
  }
}
```

---

#### PUT /user/profile

Update user profile information.

**Request Body:**
```json
{
  "full_name": "John Updated",
  "profile_image_url": "https://new-image-url.com/photo.jpg"
}
```

**Success Response (200):**
```json
{
  "message": "Profile updated",
  "data": {
    "id": "uuid",
    "full_name": "John Updated",
    "email": "john@example.com",
    "profile_image_url": "https://new-image-url.com/photo.jpg"
  }
}
```

---

#### PUT /user/password

Change user password.

**Request Body:**
```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword456!"
}
```

**Success Response (200):**
```json
{
  "message": "Password updated successfully"
}
```

---

### Accommodation Routes

Base path: `/accommodations`

#### GET /accommodations

Get all active accommodations.

**Access:** Public

**Query Parameters:**
- `city` (optional) - Filter by city
- `minPrice` (optional) - Minimum price per night
- `maxPrice` (optional) - Maximum price per night

**Success Response (200):**
```json
{
  "message": "Accommodations fetched",
  "data": [
    {
      "id": "uuid",
      "name": "Grand Hotel Pretoria",
      "description": "Luxury 5-star hotel...",
      "city": "Pretoria",
      "country": "South Africa",
      "address": "123 Main Street",
      "star_rating": 5,
      "images": ["url1", "url2"],
      "facilities": ["WiFi", "Pool", "Gym"],
      "room_types": [
        {
          "id": "uuid",
          "type_name": "Deluxe Suite",
          "price_per_night": 1200.00,
          "capacity": 2
        }
      ]
    }
  ]
}
```

---

#### GET /accommodations/:id

Get detailed information about a specific accommodation.

**Access:** Public

**Success Response (200):**
```json
{
  "message": "Accommodation details",
  "data": {
    "id": "uuid",
    "name": "Grand Hotel Pretoria",
    "description": "Full description...",
    "city": "Pretoria",
    "facilities": ["WiFi", "Pool", "Gym"],
    "room_types": [...],
    "reviews": [...],
    "average_rating": 4.5
  }
}
```

---

### Booking Routes

Base path: `/bookings`  
**Authentication:** Required

#### POST /bookings/create

Create a new booking and payment intent.

**Request Body:**
```json
{
  "room_type_id": "uuid",
  "check_in_date": "2025-12-15",
  "check_out_date": "2025-12-20",
  "num_rooms": 1,
  "num_guests": 2,
  "guest_name": "John Doe",
  "guest_email": "john@example.com",
  "guest_phone": "+27123456789",
  "special_requests": "Late check-in please"
}
```

**Success Response (200):**
```json
{
  "message": "Booking created",
  "data": {
    "bookingId": "uuid",
    "clientSecret": "pi_xxx_secret_xxx",
    "totalPrice": 6000.00
  }
}
```

**Business Logic:**
1. Validates date range (check-out must be after check-in)
2. Checks room availability for selected dates
3. Calculates total price (nights × price_per_night × num_rooms)
4. Creates booking with status `'pending'`
5. Creates Stripe Payment Intent
6. Creates payment record
7. Returns client secret for Stripe payment form

**Error (409 - Not Available):**
```json
{
  "error": "Not enough rooms available for these dates",
  "statusCode": 409
}
```

---

#### GET /bookings/user

Get all bookings for the authenticated user.

**Success Response (200):**
```json
{
  "message": "User bookings",
  "data": [
    {
      "id": "uuid",
      "check_in_date": "2025-12-15",
      "check_out_date": "2025-12-20",
      "total_price": 6000.00,
      "status": "confirmed",
      "payment_status": "paid",
      "accommodation_name": "Grand Hotel Pretoria",
      "room_type_name": "Deluxe Suite"
    }
  ]
}
```

---

#### DELETE /bookings/:id/cancel

Cancel a user's booking.

**Success Response (200):**
```json
{
  "message": "Booking cancelled successfully"
}
```

**Business Rules:**
- Only booking owner can cancel
- Cannot cancel if status is already `'cancelled'` or `'completed'`
- Sends cancellation notification to user

---

### Payment Routes

Base path: `/payments`  
**Authentication:** Required

#### POST /payments/create-intent

Create a Stripe Payment Intent (usually called internally by booking creation).

**Request Body:**
```json
{
  "amount": 6000.00,
  "currency": "ZAR",
  "bookingId": "uuid"
}
```

**Success Response (200):**
```json
{
  "clientSecret": "pi_xxx_secret_xxx"
}
```

---

#### POST /payments/webhook

Stripe webhook endpoint for payment events (Stripe calls this).

**Access:** Public (Stripe signature validation)

**Handles Events:**
- `payment_intent.succeeded` - Updates payment and booking to completed/confirmed
- `payment_intent.payment_failed` - Marks payment as failed

**Response (200):** `{ received: true }`

---

#### GET /payments/user

Get payment history for authenticated user.

**Success Response (200):**
```json
{
  "message": "Payment history",
  "data": [
    {
      "id": "uuid",
      "amount": 6000.00,
      "currency": "ZAR",
      "status": "completed",
      "transaction_id": "pi_xxx",
      "created_at": "2025-11-15T14:30:00Z"
    }
  ]
}
```

---

### Review Routes

Base path: `/reviews`  
**Authentication:** Required

#### POST /reviews

Submit a review for a booking.

**Request Body:**
```json
{
  "booking_id": "uuid",
  "accommodation_id": "uuid",
  "rating": 5,
  "comment": "Excellent stay! Highly recommend."
}
```

**Success Response (201):**
```json
{
  "message": "Review submitted for approval",
  "data": {
    "id": "uuid",
    "rating": 5,
    "comment": "Excellent stay!",
    "is_approved": false
  }
}
```

**Business Rules:**
- One review per booking
- Rating must be 1-5
- Requires admin approval before public display

---

#### GET /reviews/accommodation/:id

Get approved reviews for an accommodation.

**Access:** Public

**Success Response (200):**
```json
{
  "message": "Reviews fetched",
  "data": [
    {
      "id": "uuid",
      "rating": 5,
      "comment": "Great hotel!",
      "user": {
        "full_name": "John Doe"
      },
      "created_at": "2025-11-10T12:00:00Z"
    }
  ]
}
```

---

### Favorites Routes

Base path: `/favorites`  
**Authentication:** Required

#### GET /favorites

Get user's favorited accommodations.

**Success Response (200):**
```json
{
  "message": "Favorites fetched",
  "data": [
    {
      "accommodation_id": "uuid",
      "name": "Grand Hotel",
      "city": "Pretoria",
      "images": [...]
    }
  ]
}
```

---

#### POST /favorites/:accommodationId

Add accommodation to favorites.

**Success Response (200):**
```json
{
  "message": "Added to favorites"
}
```

---

#### DELETE /favorites/:accommodationId

Remove accommodation from favorites.

**Success Response (200):**
```json
{
  "message": "Removed from favorites"
}
```

---

### Notification Routes

Base path: `/notifications`  
**Authentication:** Required

#### GET /notifications

Get user notifications.

**Success Response (200):**
```json
{
  "message": "Notifications fetched",
  "data": [
    {
      "id": "uuid",
      "type": "booking_confirmation",
      "title": "Booking Confirmed",
      "message": "Your booking at Grand Hotel has been confirmed",
      "is_read": false,
      "created_at": "2025-11-30T10:00:00Z"
    }
  ]
}
```

---

#### PUT /notifications/:id/read

Mark notification as read.

**Success Response (200):**
```json
{
  "message": "Notification marked as read"
}
```

---

### Admin Routes

Base path: `/admin`  
**Authentication:** Required (admin or superadmin role)

#### GET /admin/dashboard/stats

Get dashboard analytics.

**Success Response (200):**
```json
{
  "message": "Dashboard stats received",
  "data": {
    "total_revenue": 125000.50,
    "total_bookings": 245,
    "total_guests": 580,
    "occupancy_rate": 75,
    "recent_bookings": [...]
  }
}
```

**Analytics Calculations:**
- **Total Revenue:** Sum of completed payments with confirmed bookings
- **Total Bookings:** Count of all bookings
- **Total Guests:** Sum of num_guests from non-cancelled bookings
- **Occupancy Rate:** (Booked rooms / Total rooms) × 100 for current period
- **Recent Bookings:** Last 5 bookings with user and accommodation details

---

#### GET /admin/location-performance

Get performance metrics by location.

**Success Response (200):**
```json
{
  "message": "Location performance fetched",
  "data": [
    {
      "city": "Pretoria",
      "total_bookings": 120,
      "confirmed_bookings": 105,
      "total_revenue": 45000.00
    },
    {
      "city": "Cape Town",
      "total_bookings": 95,
      "confirmed_bookings": 88,
      "total_revenue": 38500.00
    }
  ]
}
```

---

#### GET /admin/users

Get all users.

**Success Response (200):**
```json
{
  "message": "All users fetched",
  "data": [
    {
      "id": "uuid",
      "full_name": "John Doe",
      "email": "john@example.com",
      "role": "customer",
      "created_at": "2025-01-15T10:00:00Z"
    }
  ]
}
```

---

#### GET /admin/accommodations

Get all accommodations (including inactive).

**Success Response (200):**
```json
{
  "message": "Fetched all accommodations",
  "data": [...]
}
```

---

#### POST /admin/accommodations

Create new accommodation.

**Request Body:**
```json
{
  "name": "New Hotel",
  "description": "Description here",
  "address": "123 Street",
  "city": "Polokwane",
  "country": "South Africa",
  "star_rating": 4,
  "policies": "{}"
}
```

**Success Response (200):**
```json
{
  "message": "Accommodation created successfully",
  "data": { "id": "uuid", ... }
}
```

---

#### PUT /admin/accommodations/:id

Update accommodation.

**Request Body:** Same as POST (partial updates allowed)

**Success Response (200):**
```json
{
  "message": "Accommodation updated successfully",
  "data": { ... }
}
```

---

#### DELETE /admin/accommodations/:id

Delete accommodation.

**Success Response (200):**
```json
{
  "message": "Accommodation successfully deleted"
}
```

---

#### GET /admin/bookings

Get all bookings.

**Success Response (200):**
```json
{
  "message": "fetched all bookings",
  "data": [
    {
      "id": "uuid",
      "user": {
        "full_name": "John Doe",
        "email": "john@example.com"
      },
      "accommodation": {
        "name": "Grand Hotel",
        "city": "Pretoria"
      },
      "check_in_date": "2025-12-15",
      "status": "pending",
      "total_price": 6000.00
    }
  ]
}
```

---

#### PUT /admin/bookings/:id

Update booking status or add admin notes.

**Request Body:**
```json
{
  "status": "confirmed",
  "admin_notes": "Confirmed by admin, guest requested late check-in"
}
```

**Success Response (200):**
```json
{
  "message": "Updated admin",
  "data": { ... }
}
```

**Business Logic (NEW):**
- When `status` is set to `'confirmed'`:
  - Automatically updates related payment status to `'completed'`
  - Updates booking `payment_status` to `'paid'`
  - Revenue immediately reflects in analytics
- When `status` is set to `'cancelled'`:
  - Updates payment status to `'refunded'`
  - Updates booking `payment_status` to `'refunded'`
- Sends notification to user on status change

---

#### GET /admin/reviews/pending

Get reviews pending approval.

**Success Response (200):**
```json
{
  "message": "Fetched all pending reviews",
  "data": [...]
}
```

---

#### POST /admin/reviews/:id/approve

Approve a review.

**Success Response (200):**
```json
{
  "message": "Review approved",
  "data": { ... }
}
```

---

#### DELETE /admin/reviews/:id

Delete a review.

**Success Response (200):**
```json
{
  "message": "Review deleted"
}
```

---

### Super Admin Routes

Base path: `/superadmin`  
**Authentication:** Required (superadmin role only)

#### GET /superadmin/dashboard

Get super admin dashboard stats.

**Success Response (200):**
```json
{
  "message": "Super admin dashboard stats",
  "data": {
    "total_admins": 12,
    "total_accommodations": 45,
    "total_revenue": 250000.00,
    "system_stats": { ... }
  }
}
```

---

#### GET /superadmin/admins

Get all admin users.

**Success Response (200):**
```json
{
  "message": "All admins fetched",
  "data": [
    {
      "id": "uuid",
      "full_name": "Admin User",
      "email": "admin@hopinAdmin.email",
      "role": "admin",
      "created_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

---

#### POST /superadmin/admins

Create new admin user.

**Request Body:**
```json
{
  "fullName": "New Admin",
  "email": "newadmin@hopinAdmin.email",
  "password": "SecurePassword123!"
}
```

**Success Response (201):**
```json
{
  "message": "Admin created successfully",
  "data": {
    "id": "uuid",
    "full_name": "New Admin",
    "email": "newadmin@hopinAdmin.email",
    "role": "admin"
  }
}
```

**Business Rules:**
- Email must end with `@hopinAdmin.email`
- Password must be at least 6 characters
- Email must be unique

---

#### DELETE /superadmin/admins/:id

Delete an admin user.

**Success Response (200):**
```json
{
  "message": "Admin deleted successfully"
}
```

**Business Rules:**
- Cannot delete superadmin users
- Cannot delete self

---

## Database Schema Reference

### Key Tables

**users**
- Primary auth and profile table
- Supports OAuth and standard login
- Role-based access: customer, admin, superadmin

**bookings**
- Main transaction table
- Status: pending → confirmed → completed
- Payment status: pending → paid

**payments**
- Financial transaction records
- Status: pending → completed/failed/refunded
- Stripe transaction IDs

**accommodations + room_types**
- Hotel properties and room inventory
- Pricing and availability

**reviews**
- User feedback with admin moderation
- One review per booking

---

## Business Rules Summary

### Booking Creation
1. ✅ Check-out date must be after check-in date
2. ✅ Room availability validated against existing bookings
3. ✅ Price calculated: nights × price_per_night × num_rooms
4. ✅ Booking created with status: `'pending'`
5. ✅ Payment intent created via Stripe
6. ✅ Payment record created with transaction ID

### Admin Booking Approval (Updated)
1. ✅ Admin updates booking status to `'confirmed'`
2. ✅ System automatically marks payment as `'completed'`
3. ✅ System updates booking payment_status to `'paid'`
4. ✅ Revenue immediately appears in analytics
5. ✅ Notification sent to customer

### Payment Success (Stripe Webhook)
1. ✅ Payment status updated to `'completed'`
2. ✅ Booking status updated to `'confirmed'`
3. ✅ Booking payment_status updated to `'paid'`
4. ✅ Confirmation notification sent

---

## Security Notes

**Authentication:**
- JWT tokens with 7-day expiration
- Password hashing with bcryptjs (10 rounds)
- OAuth flow with Google

**Authorization:**
- Middleware validates user roles
- Resource ownership verification
- Email domain validation for admin roles

**Data Protection:**
- Parameterized SQL queries prevent injection
- CORS configuration for frontend origins
- Helmet.js security headers
- Environment variables for secrets

---

## Development & Testing

### Running the Backend
```bash
cd Backend
npm install
npm run dev  # Development server on port 8000
```

### Testing Endpoints

**Using cURL:**
```bash
# Register user
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Test User","email":"test@example.com","password":"test123"}'

# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Get accommodations
curl http://localhost:8000/api/v1/accommodations

# Get user profile (authenticated)
curl http://localhost:8000/api/v1/user/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Changelog

**Version 1.0.0 - November 30, 2025**
- ✅ Complete API implementation
- ✅ Admin approval auto-approves payments
- ✅ Location-based analytics
- ✅ Real-time dashboard statistics
- ✅ Stripe payment integration
- ✅ Google OAuth support

---

Last Updated: November 30, 2025  
API Version: 1.0.0  
Maintained by: HopIn Development Team
