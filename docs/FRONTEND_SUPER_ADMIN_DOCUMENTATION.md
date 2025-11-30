# HopIn Super Admin Portal - Frontend Documentation

## Table of Contents
- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Authentication](#authentication)
- [Pages & Features](#pages--features)
- [Components](#components)
- [Services](#services)
- [Setup & Development](#setup--development)

---

## Overview

The **HopIn Super Admin Portal** (`hopin_hotel_management`) is a dedicated web application designed for system owners and high-level administrators. Unlike the standard CMS, which focuses on hotel operations (bookings, rooms), this portal focuses on **system governance** and **user administration**.

**Primary Functions:**
- Manage Administrator accounts (Create, View, Delete)
- Monitor system-wide statistics
- Oversee platform health
- Manage Super Admin profile

---

## Technology Stack

**Core:**
- **Framework:** React 18.x
- **Build Tool:** Vite
- **Language:** TypeScript 5.x

**Styling & UI:**
- **CSS Framework:** Tailwind CSS
- **Icons:** Lucide React
- **Components:** Custom Tailwind components

**State Management:**
- **Global State:** Redux Toolkit
- **Persistence:** Redux Persist (if configured) or LocalStorage

**Routing:**
- React Router v6

**HTTP Client:**
- Axios

---

## Project Structure

```
hopin_hotel_management/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── CreateAdminModal.tsx
│   │   ├── DeleteConfirmationModal.tsx
│   │   └── ProtectedRoute.tsx
│   ├── pages/               # Application pages
│   │   ├── Login.tsx
│   │   ├── SuperAdminDashboard.tsx
│   │   ├── AdminManagement.tsx
│   │   └── SuperAdminProfile.tsx
│   ├── services/            # API integration
│   │   ├── api.ts
│   │   ├── auth.service.ts
│   │   └── superadmin.service.ts
│   ├── store/               # Redux store configuration
│   │   ├── store.ts
│   │   └── authSlice.ts
│   ├── App.tsx              # Root component
│   └── main.tsx             # Entry point
├── public/
├── index.html
├── tailwind.config.js       # Tailwind configuration
└── vite.config.ts           # Vite configuration
```

---

## Authentication

### Login Flow
The portal uses a separate login page specifically for Super Admins.

1. **Credentials:** Requires an email with the `@hopinSuperAdmin.email` domain.
2. **Validation:** Checks for `superadmin` role upon login.
3. **Session:** Stores JWT token in LocalStorage/Redux.

**Protected Routes:**
Routes are protected by a `ProtectedRoute` component that verifies:
- User is authenticated
- User has the `superadmin` role

---

## Pages & Features

### 1. Super Admin Dashboard
**Location:** `src/pages/SuperAdminDashboard.tsx`

**Features:**
- **System Stats:** Cards displaying total Admins, Super Admins, and System Status.
- **Recent Activity:** Table showing the 5 most recently created administrators.
- **Quick Actions:** Buttons to immediately create a new admin or view the full list.
- **Profile Menu:** Dropdown for profile management and logout.

### 2. Admin Management
**Location:** `src/pages/AdminManagement.tsx`

**Features:**
- **Admin List:** Full table of all system administrators.
- **Search:** Real-time filtering by name or email.
- **Role Badges:** Visual distinction between 'Admin' and 'Super Admin'.
- **Delete Functionality:** Ability to remove admin accounts (with self-deletion protection).
- **Create Admin:** Modal trigger to add new users.

### 3. Login
**Location:** `src/pages/Login.tsx`

**Features:**
- Secure login form.
- Input validation.
- Error handling for invalid credentials or insufficient permissions.

---

## Components

### CreateAdminModal
**Purpose:** Form to register a new administrator.
- **Inputs:** Full Name, Email, Password.
- **Validation:** Enforces `@hopinAdmin.email` domain constraint.
- **Feedback:** Success/Error notifications.

### DeleteConfirmationModal
**Purpose:** Safety check before deleting an account.
- **Display:** Shows the name and email of the admin to be deleted.
- **Action:** Confirms deletion via API.

---

## Services

### SuperAdmin Service
**Location:** `src/services/superadmin.service.ts`

**Methods:**
- `getAllAdmins()`: Fetches list of all users with admin/superadmin roles.
- `createAdmin(data)`: Sends request to create a new admin user.
- `deleteAdmin(id)`: Sends request to delete a specific admin.
- `getDashboardStats()`: Fetches aggregated system statistics.

### Auth Service
**Location:** `src/services/auth.service.ts`

**Methods:**
- `login(credentials)`: Authenticates user and returns token.
- `logout()`: Clears session data.

---

## Setup & Development

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation
```bash
cd hopin_hotel_management
npm install
```

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:8000/api/v1
```

### Running Locally
```bash
npm run dev
```
The application will start at `http://localhost:5175` (or next available port).

### Building for Production
```bash
npm run build
```
Output will be generated in the `dist/` directory.

---

## Security Considerations
- **Role Enforcement:** Frontend strictly enforces `superadmin` role for access.
- **Domain Validation:** Admin creation is restricted to specific email domains to prevent unauthorized account creation.
- **Self-Protection:** Logic prevents a Super Admin from deleting their own account to avoid lockout.
