-- Migration: Add payment_status column to bookings table
-- This migration adds the payment_status column that was missing from the original schema

-- Add payment_status column to bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) NOT NULL DEFAULT 'pending' 
CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed'));

-- Update existing records based on their current status
-- If booking is confirmed, assume payment is paid
UPDATE bookings 
SET payment_status = 'paid' 
WHERE status = 'confirmed' AND payment_status = 'pending';

-- If booking is cancelled, check if there's a refunded payment
UPDATE bookings b
SET payment_status = 'refunded'
FROM payments p
WHERE b.id = p.booking_id 
  AND p.status = 'refunded' 
  AND b.status = 'cancelled';

COMMIT;
