-- =============================================================================
-- HOTEL APP DATABASE SCHEMA (PostgreSQL)
-- This script creates 12 tables with necessary UUIDs, foreign keys, and constraints.
-- =============================================================================

-- Enable UUIDs for unique, scalable IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function to auto-update timestamps (used by all tables for audit)
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- -----------------------------------------------------------------------------
-- 1. users (Handles Auth, Roles, and Profile)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    
    -- Supports OAuth & Standard Login
    password_hash VARCHAR(255) NULL, 
    oauth_provider VARCHAR(50) NULL,
    oauth_id VARCHAR(255) NULL,      
    
    profile_image_url TEXT NULL,
    
    -- Roles for Admin Panel access
    role VARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'superadmin')),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Security Constraint: Enforce email domains for Admin roles
-- Note: Constraints might already exist if re-running, so we drop if exists first or just add if not exists (Postgres doesn't support ADD CONSTRAINT IF NOT EXISTS easily)
-- We will rely on the table creation for the initial run. If modifying, manual migration is needed.
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_role_email_domain') THEN
        ALTER TABLE users ADD CONSTRAINT check_role_email_domain 
        CHECK (
          (role = 'superadmin' AND email LIKE '%@hopinSuperAdmin.email') OR 
          (role = 'admin' AND email LIKE '%@hopinAdmin.email') OR 
          (role = 'customer' AND email NOT LIKE '%@hopinAdmin.email' AND email NOT LIKE '%@hopinSuperAdmin.email')
        );
    END IF;
END $$;


-- -----------------------------------------------------------------------------
-- 2. facilities (Master list of amenities)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS facilities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    icon_name VARCHAR(50) NULL,
    category VARCHAR(50) NULL
);


-- -----------------------------------------------------------------------------
-- 3. accommodations (Core hotel properties)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS accommodations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    latitude DECIMAL(9, 6) NULL,
    longitude DECIMAL(9, 6) NULL,
    star_rating SMALLINT CHECK (star_rating >= 1 AND star_rating <= 5),
    policies TEXT NULL, 
    is_active BOOLEAN DEFAULT true, -- Admin management / soft delete
    created_by UUID REFERENCES users(id) ON DELETE SET NULL, -- Admin Audit
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_accom_city ON accommodations(city); -- For fast search


-- -----------------------------------------------------------------------------
-- 4. room_types (Pricing, Capacity, Inventory for each hotel)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS room_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    accommodation_id UUID NOT NULL REFERENCES accommodations(id) ON DELETE CASCADE,
    type_name VARCHAR(100) NOT NULL, 
    description TEXT NULL,
    price_per_night DECIMAL(10, 2) NOT NULL,
    capacity SMALLINT NOT NULL, -- Max guests
    total_inventory SMALLINT NOT NULL, -- Total rooms of this type
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- -----------------------------------------------------------------------------
-- 5. bookings (The reservation transaction)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    room_type_id UUID NOT NULL REFERENCES room_types(id) ON DELETE RESTRICT,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    num_rooms SMALLINT NOT NULL DEFAULT 1,
    num_guests SMALLINT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    payment_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
    guest_name VARCHAR(255) NOT NULL,
    guest_email VARCHAR(255) NOT NULL,
    guest_phone VARCHAR(50) NULL,
    special_requests TEXT NULL,
    admin_notes TEXT NULL, 
    modified_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CHECK (check_out_date > check_in_date)
);


-- -----------------------------------------------------------------------------
-- 6. payments (Tracks individual transactions/refunds)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    provider VARCHAR(50) NOT NULL, -- e.g. 'stripe'
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    transaction_id VARCHAR(255) NOT NULL, -- Gateway ID (PaymentIntent ID)
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- -----------------------------------------------------------------------------
-- 7. reviews (User Reviews & Ratings)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    accommodation_id UUID NOT NULL REFERENCES accommodations(id) ON DELETE CASCADE,
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE SET NULL,
    rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NULL,
    is_approved BOOLEAN DEFAULT false, -- Admin Moderation
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(booking_id) -- One review per booking
);


-- -----------------------------------------------------------------------------
-- 8. user_favorites (User Profile Requirement)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_favorites (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    accommodation_id UUID NOT NULL REFERENCES accommodations(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, accommodation_id)
);


-- -----------------------------------------------------------------------------
-- 9. accommodation_images (Photo Gallery - Hotel Level)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS accommodation_images (
    accommodation_id UUID PRIMARY KEY REFERENCES accommodations(id) ON DELETE CASCADE,
    images JSONB NOT NULL DEFAULT '[]', -- Array of image objects
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- -----------------------------------------------------------------------------
-- 10. accommodation_facilities (Many-to-Many Relationship)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS accommodation_facilities (
    accommodation_id UUID NOT NULL REFERENCES accommodations(id) ON DELETE CASCADE,
    facility_id INTEGER NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
    PRIMARY KEY (accommodation_id, facility_id)
);


-- -----------------------------------------------------------------------------
-- 11. notifications (User Alerts)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('booking_confirmation', 'booking_update', 'promotion', 'review_reminder', 'cancellation')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    related_booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- -----------------------------------------------------------------------------
-- 12. room_type_images (Photo Gallery - Room Level)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS room_type_images (
    room_type_id UUID PRIMARY KEY REFERENCES room_types(id) ON DELETE CASCADE,
    -- Storing images as a JSON Array allows for multiple photos per room type
    images JSONB NOT NULL DEFAULT '[]', 
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- -----------------------------------------------------------------------------
-- Auto-Update Triggers (Set updated_at on modify)
-- -----------------------------------------------------------------------------
DROP TRIGGER IF EXISTS set_timestamp_users ON users;
CREATE TRIGGER set_timestamp_users BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_accommodations ON accommodations;
CREATE TRIGGER set_timestamp_accommodations BEFORE UPDATE ON accommodations FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_room_types ON room_types;
CREATE TRIGGER set_timestamp_room_types BEFORE UPDATE ON room_types FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_bookings ON bookings;
CREATE TRIGGER set_timestamp_bookings BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_reviews ON reviews;
CREATE TRIGGER set_timestamp_reviews BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_accommodation_images ON accommodation_images;
CREATE TRIGGER set_timestamp_accommodation_images BEFORE UPDATE ON accommodation_images FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_room_type_images ON room_type_images;
CREATE TRIGGER set_timestamp_room_type_images BEFORE UPDATE ON room_type_images FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
