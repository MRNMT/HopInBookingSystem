import { db } from './config/db';

async function checkRoomTypes() {
    try {
        console.log('Checking room_types table...\n');

        const roomTypesQuery = 'SELECT * FROM room_types LIMIT 10';
        const roomTypes = await db.query(roomTypesQuery);

        console.log(`Total room types found: ${roomTypes.rows.length}`);
        console.log('Room types:', JSON.stringify(roomTypes.rows, null, 2));

        const countQuery = `
            SELECT accommodation_id, COUNT(*) as room_count 
            FROM room_types 
            GROUP BY accommodation_id
        `;
        const counts = await db.query(countQuery);
        console.log('\nRoom types per accommodation:');
        console.log(JSON.stringify(counts.rows, null, 2));

        const accomQuery = 'SELECT id, name FROM accommodations LIMIT 10';
        const accoms = await db.query(accomQuery);
        console.log('\nAvailable accommodations:');
        console.log(JSON.stringify(accoms.rows, null, 2));

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkRoomTypes();
