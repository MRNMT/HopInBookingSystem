import { db } from './config/db';
import dotenv from 'dotenv';

dotenv.config();

async function checkSchema() {
    console.log('\n🔍 Checking Database Schema...\n');

    try {
        // Check user_favorites table structure
        const schema = await db.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'user_favorites'
            ORDER BY ordinal_position;
        `);

        console.log('📋 user_favorites table structure:');
        schema.rows.forEach(col => {
            console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
        });

        // Get all favorites without id
        console.log('\n📊 Favorites in database:');
        const favorites = await db.query(`
            SELECT 
                uf.user_id,
                uf.accommodation_id,
                uf.created_at,
                u.email as user_email,
                u.full_name as user_name,
                a.name as accommodation_name
            FROM user_favorites uf
            JOIN users u ON uf.user_id = u.id
            JOIN accommodations a ON uf.accommodation_id = a.id
            ORDER BY uf.created_at DESC
        `);

        console.log(`Total: ${favorites.rows.length}\n`);

        if (favorites.rows.length > 0) {
            favorites.rows.forEach((fav, index) => {
                console.log(`${index + 1}. ${fav.user_name} (${fav.user_email})`);
                console.log(`   → ${fav.accommodation_name}`);
                console.log(`   Added: ${fav.created_at}\n`);
            });
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        process.exit(0);
    }
}

checkSchema();
