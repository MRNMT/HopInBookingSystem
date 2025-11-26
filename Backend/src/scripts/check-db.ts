import { db } from '../config/db';

async function checkDatabase() {
    try {
        const countResult = await db.query('SELECT COUNT(*) FROM accommodations');
        console.log(`TOTAL_ACCOMMODATIONS: ${countResult.rows[0].count}`);
    } catch (error) {
        console.error('ERROR:', error);
    } finally {
        process.exit(0);
    }
}

checkDatabase();
