# HopIn CMS (Admin Panel) - Frontend Documentation

## Table of Contents
- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Authentication & Authorization](#authentication--authorization)
- [Pages Overview](#pages-overview)
- [Key Features](#key-features)
- [Components](#components)
- [Services](#services)
- [State Management](#state-management)
- [Development Guide](#development-guide)

---

## Overview

The HopIn CMS is a powerful admin dashboard for managing the hotel booking system. It provides comprehensive tools for admins and super admins to manage accommodations, bookings, users, reviews, and view real-time analytics.

**Target Users:**
- **Admins** - Manage bookings, accommodations, and reviews
- **Super Admins** - Full system access including admin user management

**Key Capabilities:**
- Real-time analytics dashboard
- Booking management and approval
- Accommodation CRUD operations
- Customer metrics and segmentation
- Review moderation
- Location-based performance analytics
- Admin user management (super admin only)

---

## Technology Stack

**Core:**
- React 18.x
- TypeScript 5.x
- Vite (Build tool)

**UI & Visualization:**
- React Icons
- Recharts (for analytics charts)
- Custom CSS components

**State Management:**
- Redux Toolkit
- React Context

**HTTP Client:**
- Axios with interceptors

**Routing:**
- React Router v6

---

## Project Structure

```
CMS/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, logos
│   │   └── logo.jpg
│   ├── components/      # Reusable UI components
│   │   ├── SideBar.tsx
│   │   ├── Button.tsx
│   │   ├── ActionMenu.tsx
│   │   ├── AddRoomModal.tsx
│   │   └── AddUserModal.tsx
│   ├── pages/           # Dashboard pages
│   │   ├── AdminDashboard.tsx
│   │   ├── Analytics.tsx
│   │   ├── Bookings.tsx
│   │   ├── Rooms.tsx
│   │   ├── CustomerMetricsPage.tsx
│   │   ├── Reviews.tsx
│   │   ├── Settings.tsx
│   │   └── Login.tsx
│   ├── services/        # API clients
│   │   ├── api.ts
│   │   ├── admin.service.ts
│   │   └── superadmin.service.ts
│   ├── store/           # Redux configuration
│   │   └── store.ts
│   ├── routes/          # Route setup
│   │   └── AppRoutes.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env
├── package.json
└── vite.config.ts
```

---

## Architecture

### Application Flow

```
Login (admin/superadmin credentials)
         ↓
    JWT Token Stored
         ↓
    Main Dashboard
         ↓
    ┌────────┴────────┐
    │    SideBar      │
    │  Navigation     │
    └────────┬────────┘
            ↓
   ┌────────┴─────────┐
   │                  │
Admin Pages    Super Admin Pages
   │                  │
   ├─ Dashboard       ├─ Admin Management
   ├─ Analytics       └─ System Settings
   ├─ Bookings
   ├─ Accommodations
   ├─ Customers
   ├─ Reviews
   └─ Settings
```

---

## Authentication & Authorization

### Login Flow

```typescript
// pages/Login.tsx
const handleLogin = async (credentials) => {
  const response = await adminService.login(credentials);
  
  // Store token and user info
  localStorage.setItem('adminToken', response.token);
  localStorage.setItem('adminUser', JSON.stringify(response.user));
  
  // Redirect based on role
  if (response.user.role === 'superadmin') {
    navigate('/superadmin/dashboard');
  } else {
    navigate('/admin/dashboard');
  }
};
```

### Role-Based Access

**Email Domain Validation:**
- Admin: Must use `*@hopinAdmin.email`
- Super Admin: Must use `*@hopinSuperAdmin.email`

**Route Protection:**
```typescript
<Route element={<RequireAuth allowedRoles={['admin', 'superadmin']} />}>
  <Route path="/admin/*" element={<AdminRoutes />} />
</Route>

<Route element={<RequireAuth allowedRoles={['superadmin']} />}>
  <Route path="/superadmin/*" element={<SuperAdminRoutes />} />
</Route>
```

---

## Pages Overview

### 1. AdminDashboard

**Location:** `src/pages/AdminDashboard.tsx`

**Purpose:** Main overview page with key metrics and recent activity

**Features:**
- **KPI Cards:**
  - Total Bookings
  - Total Revenue
  - Occupancy Rate
  - Total Guests
  
- **Performance by Location:**
  - Real-time data from database
  - Shows bookings and revenue per city
  - Matches Analytics page data

- **Recent Bookings Table:**
  - Last 5 bookings
  - Guest name, location, check-in date, status
  - Quick status overview

**Data Sources:**
```typescript
const [stats, setStats] = useState({
  totalBookings: 0,
  revenue: 0,
  occupancyRate: 0,
  totalGuests: 0,
  recentBookings: []
});

const [locationData, setLocationData] = useState([]);

// Fetch from API
const [dashboardStats, locationPerformance] = await Promise.all([
  adminService.getDashboardStats(),
  adminService.getLocationPerformance()
]);
```

---

### 2. Analytics

**Location:** `src/pages/Analytics.tsx`

**Purpose:** Detailed analytics with charts and location performance

**Features:**
- **KPI Overview:**
  - Total Revenue (formatted currency)
  - Total Bookings
  - Occupancy Rate (percentage)
  - Total Guests

- **Charts:**
  - Bookings by Location (Bar Chart)
  - Revenue Distribution (Bar Chart)

- **Location Performance Grid:**
  - City name
  - Confirmed bookings count
  - Total revenue per location

**Visualizations:**
```typescript
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

<BarChart data={locationData.map(loc => ({
  location: loc.city,
  bookings: parseInt(loc.confirmed_bookings)
}))}>
  <Bar dataKey="bookings" fill="#3b82f6" />
  <XAxis dataKey="location" />
  <YAxis />
  <Tooltip />
</BarChart>
```

---

### 3. Bookings

**Location:** `src/pages/Bookings.tsx`

**Purpose:** Manage all customer bookings

**Features:**
- **Booking List Table:**
  - Guest name and email
  - Accommodation name and city
  - Check-in and check-out dates
  - Total price
  - Booking status
  - Payment status

- **Status Management:**
  - Approve booking (status → confirmed)
  - Auto-approve payment when booking confirmed
  - Cancel booking
  - Add admin notes

- **Filters:**
  - Filter by status (pending, confirmed, cancelled, completed)
  - Filter by date range
  - Search by guest name

**Business Logic:**
```typescript
// When admin confirms a booking
const handleApprove = async (bookingId) => {
  await adminService.updateBooking(bookingId, { status: 'confirmed' });
  
  // Backend automatically:
  // 1. Updates payment status to 'completed'
  // 2. Updates booking.payment_status to 'paid'
  // 3. Revenue appears in analytics
  // 4. Sends notification to customer
};
```

**Table Structure:**
```tsx
<table>
  <thead>
    <tr>
      <th>Guest</th>
      <th>Accommodation</th>
      <th>Dates</th>
      <th>Amount</th>
      <th>Status</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {bookings.map(booking => (
      <tr key={booking.id}>
        <td>{booking.user.full_name}</td>
        <td>{booking.accommodation.name}</td>
        <td>{formatDateRange(booking)}</td>
        <td>R{booking.total_price}</td>
        <td><StatusBadge status={booking.status} /></td>
        <td><ActionMenu booking={booking} /></td>
      </tr>
    ))}
  </tbody>
</table>
```

---

### 4. Rooms (Accommodations)

**Location:** `src/pages/Rooms.tsx`

**Purpose:** CRUD operations for accommodations

**Features:**
- **Accommodation Grid:**
  - Card-based display
  - Hotel name, city, description
  - Active/inactive status

- **Actions:**
  - Create new accommodation
  - Edit existing accommodation
  - Delete accommodation
  - Toggle active status

- **Add/Edit Modal:**
  - Name input
  - City dropdown (Polokwane, Pretoria, Cape Town, etc.)
  - Description textarea
  - Address input
  - Form validation

**Modal Component:**
```tsx
<AddRoomModal 
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  accommodation={selectedAccommodation} // null for create, object for edit
  onSuccess={() => {
    fetchAccommodations(); // Refresh list
    setShowModal(false);
  }}
/>
```

---

### 5. CustomerMetricsPage

**Location:** `src/pages/CustomerMetricsPage.tsx`

**Purpose:** Customer analytics and management

**Metrics:**
- **Total Customers:** Count of users with role='customer'
- **Active This Month:** New customers this month
- **Avg Bookings:** Total bookings ÷ total customers
- **Total Bookings:** System-wide booking count

**Customer Table:**
- Full customer list with search
- Name, email, role, join date
- Desktop and mobile responsive views

**Calculations:**
```typescript
const metrics = {
  totalCustomers: users.filter(u => u.role === 'customer').length,
  activeThisMonth: users.filter(u => {
    const created = new Date(u.created_at);
    return created >= firstDayOfMonth;
  }).length,
  avgBookings: (totalBookings / totalCustomers).toFixed(1)
};
```

---

### 6. Reviews

**Location:** `src/pages/Reviews.tsx`

**Purpose:** Review moderation and management

**Features:**
- **Pending Reviews Tab:**
  - Reviews awaiting approval
  - User name, accommodation, rating
  - Review comment
  - Approve/Reject actions

- **Approved Reviews Tab:**
  - Published reviews
  - Ability to delete if inappropriate

**Actions:**
```typescript
const handleApprove = async (reviewId) => {
  await adminService.approveReview(reviewId);
  // Review becomes visible on customer app
  fetchPendingReviews(); // Refresh list
};

const handleDelete = async (reviewId) => {
  await adminService.deleteReview(reviewId);
  fetchReviews(); // Refresh
};
```

---

### 7. Settings

**Location:** `src/pages/Settings.tsx`

**Purpose:** Admin profile and system settings

**Sections:**
- **Profile Settings:**
  - Update name
  - Change email
  - Profile photo upload

- **Security:**
  - Change password
  - Two-factor authentication setup

- **Preferences:**
  - Notification settings
  - Display preferences

---

### 8. Super Admin Pages

**Admin Management** (Super Admin Only)

**Features:**
- View all admin users
- Create new admin accounts
- Delete admin users
- View admin activity logs

**Create Admin:**
```tsx
<AddUserModal 
  onSuccess={() => fetchAdmins()}
  onClose={() => setShowModal(false)}
/>
```

---

## Key Features

### 1. Real-Time Analytics

**Dashboard Stats:**
```typescript
interface DashboardStats {
  totalBookings: number;
  revenue: number;
  occupancyRate: number;
  totalGuests: number;
  recentBookings: Booking[];
}
```

**Data Refresh:**
- Automatic data fetch on page load
- Manual refresh button
- Real-time updates after booking approval

---

### 2. Booking Approval Workflow

**Enhanced Flow (NEW):**
```
Admin clicks "Approve"
        ↓
PUT /admin/bookings/:id { status: 'confirmed' }
        ↓
Backend Transaction:
  1. Update booking status → 'confirmed'
  2. Update payment status → 'completed'
  3. Update booking.payment_status → 'paid'
        ↓
Analytics immediately show revenue
        ↓
Customer receives confirmation notification
```

**Code Example:**
```typescript
const handleApproveBooking = async (bookingId: string) => {
  try {
    await adminService.updateBooking(bookingId, { 
      status: 'confirmed',
      admin_notes: 'Approved by admin'
    });
    
    toast.success('Booking approved! Payment marked as completed.');
    fetchBookings(); // Refresh table
    fetchStats(); // Refresh analytics
  } catch (error) {
    toast.error('Failed to approve booking');
  }
};
```

---

### 3. Location Performance Tracking

**Consistency Across Pages:**

Both AdminDashboard and Analytics use the same endpoint:
```typescript
const locationData = await adminService.getLocationPerformance();
// Returns: [{ city, total_bookings, confirmed_bookings, total_revenue }]
```

**Display:**
- AdminDashboard: Shows in "Performance by Location" card
- Analytics: Shows in "Location Performance" grid + charts

---

### 4. Responsive Design

**Mobile-First Approach:**
- Collapsible sidebar on mobile
- Responsive tables (desktop table → mobile cards)
- Touch-friendly action buttons
- Optimized charts for small screens

**Breakpoints:**
```css
/* Mobile */
@media (max-width: 640px) { }

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) { }

/* Desktop */
@media (min-width: 1025px) { }
```

---

## Components

### SideBar

**Location:** `src/components/SideBar.tsx`

**Features:**
- Logo and branding
- Navigation menu
- Active route highlighting
- User profile section
- Logout button
- Responsive collapse on mobile

**Menu Items:**
```typescript
const menuItems = [
  { path: '/admin/dashboard', icon: MdDashboard, label: 'Dashboard' },
  { path: '/admin/analytics', icon: IoAnalytics, label: 'Analytics' },
  { path: '/admin/bookings', icon: MdBook, label: 'Bookings' },
  { path: '/admin/rooms', icon: FaBed, label: 'Accommodations' },
  { path: '/admin/customers', icon: FaUsers, label: 'Customers' },
  { path: '/admin/reviews', icon: MdReviews, label: 'Reviews' },
];

// Super admin additional items
if (user.role === 'superadmin') {
  menuItems.push({
    path: '/superadmin/admins',
    icon: FaUserShield,
    label: 'Admin Management'
  });
}
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

**Styling:**
- Primary: Blue background (#0088FF)
- Secondary: Gray background
- Outline: Border only
- Ghost: Transparent with hover effect

**Usage:**
```tsx
<Button variant="primary" type="submit">
  Save Changes
</Button>
```

---

### ActionMenu

**Location:** `src/components/ActionMenu.tsx`

**Purpose:** Dropdown menu for table row actions

**Features:**
- Edit action
- Delete action
- Approve/Reject actions
- Custom actions

**Implementation:**
```tsx
<ActionMenu booking={booking}>
  <MenuItem onClick={() => handleApprove(booking.id)}>
    <FaCheck /> Approve
  </MenuItem>
  <MenuItem onClick={() => handleEdit(booking.id)}>
    <FaEdit /> Edit
  </MenuItem>
  <MenuItem onClick={() => handleDelete(booking.id)}>
    <FaTrash /> Delete
  </MenuItem>
</ActionMenu>
```

---

### AddRoomModal

**Location:** `src/components/AddRoomModal.tsx`

**Purpose:** Create/Edit accommodation modal

**Form Fields:**
- Name (text input)
- City (select dropdown)
- Description (textarea)
- Address (text input)

**Modes:**
- **Create Mode:** Empty form, saves new accommodation
- **Edit Mode:** Pre-filled with existing data, updates accommodation

**Validation:**
- Required fields
- Name minimum length
- City selection required

---

### AddUserModal

**Location:** `src/components/AddUserModal.tsx`

**Purpose:** Create new admin user (super admin only)

**Form Fields:**
- Full name
- Email (must end with @hopinAdmin.email)
- Password

**Validation:**
```typescript
const validate = (data) => {
  if (!data.email.endsWith('@hopinAdmin.email')) {
    throw new Error('Email must use @hopinAdmin.email domain');
  }
  if (data.password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }
};
```

---

## Services

### Admin Service

**Location:** `src/services/admin.service.ts`

**Complete API:**
```typescript
class AdminService {
  // Analytics
  async getDashboardStats(): Promise<DashboardStats>
  async getLocationPerformance(): Promise<LocationData[]>
  
  // Users
  async getAllUsers(): Promise<User[]>
  
  // Accommodations
  async getAccommodations(): Promise<Accommodation[]>
  async createAccommodation(data: Partial<Accommodation>): Promise<Accommodation>
  async updateAccommodation(id: string, data: Partial<Accommodation>): Promise<Accommodation>
  async deleteAccommodation(id: string): Promise<void>
  
  // Bookings
  async getBookings(): Promise<Booking[]>
  async updateBooking(id: string, data: UpdateBookingDto): Promise<Booking>
  
  // Reviews
  async getPendingReviews(): Promise<Review[]>
  async approveReview(id: string): Promise<Review>
  async deleteReview(id: string): Promise<void>
}
```

**Usage Example:**
```typescript
import { adminService } from '../services/admin.service';

useEffect(() => {
  const fetchData = async () => {
    const stats = await adminService.getDashboardStats();
    setDashboardStats(stats);
  };
  fetchData();
}, []);
```

---

### Super Admin Service

**Location:** `src/services/superadmin.service.ts`

**Methods:**
```typescript
class SuperAdminService {
  async getAllAdmins(): Promise<Admin[]>
  async createAdmin(data: CreateAdminDto): Promise<Admin>
  async deleteAdmin(id: string): Promise<void>
  async getDashboardStats(): Promise<SuperAdminStats>
}
```

---

### API Client Configuration

**Location:** `src/services/api.ts`

**Setup:**
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// Add auth token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## State Management

### Redux Store

**Configuration:**
```typescript
// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Auth Slice

```typescript
// store/slices/authSlice.ts
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('adminToken');
    }
  }
});
```

---

## Development Guide

### Environment Setup

**Create `.env` file:**
```bash
VITE_API_URL=http://localhost:8000/api/v1
```

### Installation

```bash
cd CMS
npm install
```

### Development Server

```bash
npm run dev
# Runs on http://localhost:5174
```

### Build

```bash
npm run build
# Output in dist/
```

---

### Admin Account Creation

**For initial setup, use backend script:**
```bash
cd Backend
npm run seed:superadmin
# Creates superadmin@hopinSuperAdmin.email / password123
```

**Create additional admins:**
1. Login as super admin
2. Navigate to Admin Management
3. Click "Add Admin"
4. Fill form with @hopinAdmin.email domain

---

### Common Development Workflows

**Adding a New Page:**
```typescript
// 1. Create page component
// src/pages/NewPage.tsx
export const NewPage = () => {
  return <div>New Admin Page</div>;
};

// 2. Add to sidebar
// components/SideBar.tsx
const menuItems = [
  // ...existing items
  { path: '/admin/new-page', icon: FaIcon, label: 'New Page' }
];

// 3. Add route
// routes/AppRoutes.tsx
<Route path="/admin/new-page" element={<NewPage />} />
```

**Adding API Endpoint:**
```typescript
// services/admin.service.ts
async getNewData() {
  const response = await api.get('/admin/new-endpoint');
  return response.data.data || response.data;
}
```

**Adding Chart:**
```typescript
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

<BarChart data={chartData} width={400} height={300}>
  <Bar dataKey="value" fill="#3b82f6" />
  <XAxis dataKey="label" />
  <YAxis />
  <Tooltip />
</BarChart>
```

---

## Testing

### Manual Testing Checklist

**Authentication:**
- [ ] Admin login with @hopinAdmin.email
- [ ] Super admin login with @hopinSuperAdmin.email
- [ ] Invalid credentials rejection
- [ ] Logout functionality

**Dashboard:**
- [ ] Stats display correctly
- [ ] Location performance data loads
- [ ] Recent bookings table populates

**Bookings:**
- [ ] View all bookings
- [ ] Approve booking (check payment auto-approved)
- [ ] Analytics update after approval
- [ ] Add admin notes

**Accommodations:**
- [ ] View accommodation list
- [ ] Create new accommodation
- [ ] Edit existing accommodation
- [ ] Delete accommodation

**Customer Metrics:**
- [ ] Customer count accurate
- [ ] Active this month calculation
- [ ] Search functionality
- [ ] Table pagination

**Reviews:**
- [ ] View pending reviews
- [ ] Approve review
- [ ] Delete review

**Super Admin:**
- [ ] View admin list
- [ ] Create new admin
- [ ] Email domain validation
- [ ] Delete admin

---

## Troubleshooting

**Issue: Charts not rendering**
```
Solution: Check if data is in correct format
Ensure Recharts is installed: npm install recharts
```

**Issue: Sidebar not showing on mobile**
```
Solution: Check responsive classes
Ensure lg:ml-64 is applied to main content
```

**Issue: API returns 403 Forbidden**
```
Solution: Verify user role
Check if route requires superadmin but user is admin
```

**Issue: Analytics showing zero**
```
Solution: Ensure bookings have been approved
Check payment status is 'completed'
Verify confirmed bookings exist
```

---

## Performance Optimization

**Implemented:**
- Lazy loading for routes
- Memoized chart components
- Debounced search inputs
- Pagination for large lists

**Recommended:**
- Virtual scrolling for very large tables
- Cache API responses
- Compress images
- Code splitting

---

## Security Considerations

**Implemented:**
- JWT token expiration (7 days)
- Role-based route protection
- Email domain validation
- XSS protection via React

**Best Practices:**
- Regular password changes
- Audit log for admin actions
- IP whitelist for admin access (production)
- HTTPS only in production

---

Last Updated: November 30, 2025  
Version: 1.0.0  
Maintained by: HopIn Development Team
