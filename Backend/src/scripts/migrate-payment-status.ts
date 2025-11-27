import { db } from '../config/db';

async function addPaymentStatusColumn() {
    try {
        console.log('Starting migration: Adding payment_status column to bookings table...');

        // Add payment_status column to bookings table
        await db.query(`
      ALTER TABLE bookings 
      ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) NOT NULL DEFAULT 'pending' 
      CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed'))
    `);
        console.log('✓ Added payment_status column');

        // Update existing records based on their current status
        // If booking is confirmed, assume payment is paid
        const result1 = await db.query(`
      UPDATE bookings 
      SET payment_status = 'paid' 
      WHERE status = 'confirmed' AND payment_status = 'pending'
    `);
        console.log(`✓ Updated ${result1.rowCount} confirmed bookings to 'paid' status`);

        // If booking is cancelled, check if there's a refunded payment
        const result2 = await db.query(`
      UPDATE bookings b
      SET payment_status = 'refunded'
      FROM payments p
      WHERE b.id = p.booking_id 
        AND p.status = 'refunded' 
        AND b.status = 'cancelled'
    `);
        console.log(`✓ Updated ${result2.rowCount} cancelled bookings with refunded payments`);

        console.log('Migration completed successfully!');
        process.exit(0);
    } catch (error: any) {
        if (error.message?.includes('column "payment_status" of relation "bookings" already exists')) {
            console.log('✓ Column payment_status already exists, skipping...');
            process.exit(0);
        } else {
            console.error('Migration failed:', error);
            process.exit(1);
        }
    }
}

addPaymentStatusColumn();
