# Payment System Database Fix

## Problem
The payment confirmation was failing with the error:
```
Failed to confirm payment: column "payment_method" of relation "payments" does not exist
```

## Root Cause
There was a mismatch between the database schema and the application code:

1. **payments table**: The schema defined a `provider` column, but the code was trying to insert into a `payment_method` column
2. **bookings table**: The code was trying to update a `payment_status` column that didn't exist in the schema

## Solution

### 1. Fixed payment.service.ts
- Changed the INSERT query in `confirmPayment()` method to use `provider` instead of `payment_method`
- The `provider` column stores the payment gateway name (e.g., 'stripe')

### 2. Updated schema.sql
- Added `payment_status` column to the `bookings` table
- Column definition: `VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed'))`

### 3. Created and Ran Migration
- Created `migrate-payment-status.ts` to add the missing column to existing databases
- Migration successfully added the column and updated existing records:
  - Confirmed bookings → payment_status = 'paid'
  - Cancelled bookings with refunded payments → payment_status = 'refunded'

## Files Modified
1. `src/services/payment.service.ts` - Fixed column name from `payment_method` to `provider`
2. `src/scripts/schema.sql` - Added `payment_status` column to bookings table
3. `src/scripts/migrate-payment-status.ts` - Created migration script (new file)
4. `src/scripts/add_payment_status_column.sql` - Created SQL migration (new file)

## Testing
The migration completed successfully. The payment confirmation should now work correctly.

To test:
1. Make a booking through the customer app
2. Complete the payment with Stripe
3. Verify that the payment is recorded in the database with `provider = 'stripe'`
4. Verify that the booking status is updated to 'confirmed' with `payment_status = 'paid'`
