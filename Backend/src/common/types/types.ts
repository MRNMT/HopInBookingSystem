export type UserRole = "customer" | "admin" | "superadmin";
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type PaymentStatus = "pending" | "paid" | "refunded" | "failed";
export type NotificationType =
  | "booking_confirmation"
  | "booking_update"
  | "promotion"
  | "review_reminder"
  | "cancellation";

// --- API Responses ---
export interface ApiResponse<T> {
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  results: T[];
  total: number;
  page: number;
  limit: number;
}

// --- Auth & Users ---
export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  profile_image_url?: string;
  created_at: string;

  //Backend-only fields (needed for AuthService logic)
  password_hash?: string;
  oauth_provider?: string;
  oauth_id?: string;
}

export interface RegisterDto {
  fullName: string;
  email: string;
  password?: string;
}

export interface LoginDto {
  email: string;
  password?: string;
}

export interface UpdateProfileDto {
  full_name?: string;
  profile_image_url?: string;
}

// --- Accommodations ---
export interface AccommodationImage {
  url: string;
  alt_text?: string;
  display_order?: number;
}

export interface Facility {
  id: number;
  name: string;
  icon_name?: string;
  category?: string;
}

export interface RoomType {
  id: string;
  accommodation_id: string;
  type_name: string;
  description?: string;
  price_per_night: number;
  capacity: number;
  total_inventory: number;
  is_available: boolean;
}

// NEW: Helper for creating rooms inside the accommodation form
export interface CreateRoomTypeDto {
  type_name: string;
  description?: string;
  price_per_night: number;
  capacity: number;
  total_inventory: number;
  images: AccommodationImage[];
}

export interface Accommodation {
  id: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  star_rating?: number;
  policies?: string;
  is_active: boolean;
  images: AccommodationImage[];
  facilities?: Facility[];
  room_types?: RoomType[];
  lowest_price?: number;
  created_at: string;
  // Calculated fields
  average_rating?: number;
  total_reviews?: number;
}

export interface SearchDto {
  city?: string;
  check_in_date?: string;
  check_out_date?: string;
  num_guests?: number;
  min_price?: number;
  max_price?: number;
  rating?: number;
  facilities?: string;
}

export interface CreateAccommodationDto {
  name: string;
  description?: string;
  address: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  star_rating?: number;
  policies?: string;
  facilities: number[];
  images: AccommodationImage[];
  // Added this back so Admin can create rooms immediately
  room_types: CreateRoomTypeDto[];
}

// --- Bookings ---
export interface Booking {
  id: string;
  user_id: string;
  room_type_id: string;
  check_in_date: string;
  check_out_date: string;
  num_rooms: number;
  num_guests: number;
  total_price: number;
  status: BookingStatus;
  payment_status: PaymentStatus;
  guest_name: string;
  created_at: string;
  room_type?: RoomType;
  accommodation?: Accommodation;
}

export interface CreateBookingDto {
  room_type_id: string;
  check_in_date: string;
  check_out_date: string;
  num_rooms: number;
  num_guests: number;
  guest_name: string;
  guest_email: string;
  guest_phone?: string;
  special_requests?: string;
}

export interface AdminUpdateBookingDto {
  status?: BookingStatus;
  admin_notes?: string;
}

// --- Reviews ---
export interface Review {
  id: string;
  user_id: string;
  accommodation_id: string;
  booking_id: string;
  rating: number;
  comment?: string;
  user_name?: string;
  created_at: string;
}

export interface CreateReviewDto {
  booking_id: string;
  accommodation_id: string;
  rating: number;
  comment?: string;
}

// --- Notifications ---
export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// --- Payments ---
export interface Payment {
  id: string;
  booking_id: string;
  user_id: string;
  amount: number;
  currency: string;
  provider: string;
  status: PaymentStatus;
  transaction_id: string;
  created_at: string;
}
