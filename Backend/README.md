# Hotel App Backend API

This is the RESTful API for the Hotel Booking Application. It handles user authentication, accommodation management, booking processing, payments, reviews, and administrative functions.

 **Tech Stack**

- **Runtime:** Node.js (v20+)
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL (Hosted on Supabase)
- **ORM/Querying:** pg library (using raw SQL with a custom connection pool)
- **Authentication:** JWT (JSON Web Tokens) + Passport (Google OAuth)
- **Validation:** Zod
- **Payments:** Stripe (Simulated)

 **Getting Started**

1. **Prerequisites**

- Node.js installed.
- A Supabase project set up.

2. **Installation**

Navigate to the backend folder and install dependencies:

```bash
cd Backend
npm install
```

3. **Environment Configuration**
 
 **Quick Start:**
 ```bash
 npm run setup
 ```
 This will create a `.env` file from the template. You can then edit it with your specific values.
 
 Alternatively, manually create a `.env` file in the `Backend` root directory:
 
 ```env
 # Server
 PORT=5000
 NODE_ENV=development
 
 # Database (Supabase Transaction Pooler recommended for IPv4)
 DATABASE_URL="postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DB_NAME]?sslmode=no-verify"
 
 # Security
 JWT_SECRET="your-super-secret-key"
 
 # Frontend (For redirects)
 FRONTEND_URL="http://localhost:3000"
 ```

4. **Database Initialization**

Run the schema migration script to create tables in Supabase:

```bash
npx tsx src/scripts/init-db.ts
```

5. **Running the Server**

- **Development Mode (Auto-restart)**

```bash
npm run dev
```

- **OR manually**

```bash
npx tsx src/server.ts
```

 **Project Architecture**

This project follows the Controller-Service pattern to ensure separation of concerns and scalability.

| Location                       | Description                                                       |
|-------------------------------|-------------------------------------------------------------------|
| `src/api/v1/*.routes.ts`       | Defines the URL endpoints and applies middleware.                |
| `src/controllers/*.controller.ts` | Handles HTTP requests/responses and validates inputs.      |
| `src/services/*.service.ts`    | Contains business logic and performs database queries.           |
| `src/middleware/*.middleware.ts` | Handles Authentication, Authorization (RBAC), Validation, and Global Errors. |
| `src/config/db.ts`             | Manages the PostgreSQL connection pool.                          |

 **API Endpoints**

Base URL: `http://localhost:5000/api/v1`

---

 **Authentication** (`/auth`)

| Method | Endpoint        | Access  | Description                             |
|--------|-----------------|---------|-------------------------------------|
| POST   | /auth/register  | Public  | Register a new customer account.      |
| POST   | /auth/login     | Public  | Login and receive a JWT Bearer token. |
| GET    | /auth/me        | Private | Get the currently logged-in user's profile. |
| GET    | /auth/google    | Public  | Initiate Google OAuth flow.            |
| POST   | /auth/logout    | Public  | Invalidates session (Client-side action mostly). |

---

 **Users** (`/users`)

| Method | Endpoint           | Access  | Description                        |
|--------|--------------------|---------|----------------------------------|
| GET    | /users/profile     | Private | Get full profile details.          |
| PUT    | /users/profile     | Private | Update profile details.            |
| GET    | /users/bookings    | Private | Get booking history for the logged-in user. |
| GET    | /users/favorites   | Private | Get list of favorited accommodations. |
| POST   | /users/favorites   | Private | Add an accommodation to favorites. |
| DELETE | /users/favorites/:id | Private | Remove an accommodation from favorites. |

---

 **Accommodations** (`/accommodations`)

| Method | Endpoint                 | Access | Description                                      |
|--------|--------------------------|--------|------------------------------------------------|
| GET    | /accommodations          | Public | Search hotels with filters (city, price, rating). |
| GET    | /accommodations/city/:city | Public | Get all hotels in a specific city.              |
| GET    | /accommodations/:id      | Public | Get full details, room types, and reviews for a hotel. |

---

 **Bookings** (`/bookings`)

| Method | Endpoint                        | Access  | Description                            |
|--------|--------------------------------|---------|------------------------------------|
| POST   | /bookings                      | Private | Create a pending booking & initiate payment. |
| POST   | /bookings/:id/cancel           | Private | Cancel an existing booking.          |
| POST   | /bookings/webhook/payment-success | Public  | Webhook for Payment Gateway to confirm payment. |

---

 **Payments** (`/payments`)

| Method | Endpoint           | Access  | Description                               |
|--------|--------------------|---------|-----------------------------------------|
| GET    | /payments/my-history | Private | View transaction history for logged-in user. |
| GET    | /payments/:id       | Private | View details of a specific transaction.  |

---

 **Reviews** (`/reviews`)

| Method | Endpoint  | Access  | Description                        |
|--------|-----------|---------|----------------------------------|
| POST   | /reviews  | Private | Submit a review for a completed booking. |

---

 **Notifications** (`/notifications`)

| Method | Endpoint             | Access  | Description                       |
|--------|----------------------|---------|---------------------------------|
| GET    | /notifications       | Private | Get all notifications.           |
| PATCH  | /notifications/:id/read | Private | Mark a specific notification as read. |
| PATCH  | /notifications/read-all | Private | Mark all notifications as read. |

---

 **Admin Panel** (`/admin`)

*Requirement: User must have role: 'admin' or 'superadmin'.*

**Dashboard & Users**

| Method | Endpoint             | Description                     |
|--------|----------------------|---------------------------------|
| GET    | /admin/dashboard/stats | Get high-level metrics (Revenue, Bookings, etc). |
| GET    | /admin/users          | List all registered users.       |

**Manage Accommodations**

| Method | Endpoint                 | Description                      |
|--------|--------------------------|--------------------------------|
| GET    | /admin/accommodations    | List all hotels (including inactive). |
| POST   | /admin/accommodations    | Create a new hotel + rooms + images. |
| PUT    | /admin/accommodations/:id | Update hotel details.            |
| DELETE | /admin/accommodations/:id | Soft delete a hotel.             |

**Manage Bookings**

| Method | Endpoint               | Description                              |
|--------|------------------------|------------------------------------------|
| GET    | /admin/bookings        | List all system bookings.                |
| PUT    | /admin/bookings/:id    | Manually update status or add notes.    |

**Manage Reviews**

| Method | Endpoint                 | Description                   |
|--------|--------------------------|-------------------------------|
| GET    | /admin/reviews/pending   | Get reviews waiting for approval. |
| POST   | /admin/reviews/:id/approve | Approve/Publish a review.     |
| DELETE | /admin/reviews/:id       | Reject/Delete a review.        |

---

 **SuperAdmin** (`/superadmin`)

*Requirement: User must have role: 'superadmin'.*

| Method | Endpoint        | Description                             |
|--------|-----------------|---------------------------------------|
| POST   | /superadmin/admins | Create a new Admin account (Must use `@hopinAdmin.email`). |
| GET    | /superadmin/admins | List all admin accounts.              |

---

 **Error Handling**

All API errors follow this standard JSON format:

{
  "message": "A human-readable error message",
  "error": "Specific error details (optional)",
  "stack": "Error stack trace (Only in Development mode)"
}


Common Status Codes:

| Code | Description                                    |
|-------|-----------------------------------------------|
| 200   | Success                                       |
| 201   | Created                                      |
| 400   | Bad Request (Validation Failed)               |
| 401   | Unauthorized (Missing/Invalid Token)          |
| 403   | Forbidden (Insufficient Permissions/Role)    |
| 404   | Not Found                                    |
| 500   | Internal Server Error                          |
