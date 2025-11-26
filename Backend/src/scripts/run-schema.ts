import { db } from '../config/db';
import fs from 'fs';
import path from 'path';

async function runSchema() {
    console.log('🔄 Running Database Schema Migration...');

    try {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('   Reading schema.sql...');

        // Execute the SQL script
        await db.query(schemaSql);

        console.log('✅ Database schema applied successfully!');

    } catch (error) {
        console.error('❌ Failed to apply database schema:', error);
    } finally {
        process.exit(0);
    }
}

runSchema();
