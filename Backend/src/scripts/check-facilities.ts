import { db } from '../config/db';

async function checkFacilities() {
    try {
        const res = await db.query('SELECT * FROM facilities');
        console.log('Facilities:', JSON.stringify(res.rows, null, 2));

        const accomRes = await db.query(`
            SELECT a.name, COUNT(af.facility_id) as facility_count
            FROM accommodations a
            LEFT JOIN accommodation_facilities af ON a.id = af.accommodation_id
            GROUP BY a.id, a.name
        `);
        console.log('Facilities per accommodation:', JSON.stringify(accomRes.rows, null, 2));

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkFacilities();
