import { db } from '../config/db';
import { hashPassword } from '../utils/password.utils';

async function seedSuperAdmin() {
    console.log('🌱 Seeding SuperAdmin user...');

    try {
        const email = 'super@hopinSuperAdmin.email';
        const password = 'SuperPassword123!';
        const fullName = 'System SuperAdmin';

        // Check if SuperAdmin already exists
        const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);

        if (existingUser.rows.length > 0) {
            console.log('✅ SuperAdmin already exists.');
            console.log(`   Email: ${email}`);
            console.log('   Skipping creation.');
            return;
        }

        const hashedPassword = await hashPassword(password);

        const result = await db.query(
            `INSERT INTO users (email, password_hash, full_name, role) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, email, full_name, role, created_at`,
            [email, hashedPassword, fullName, 'superadmin']
        );

        const user = result.rows[0];
        console.log('✅ SuperAdmin created successfully!');
        console.log(`   ID: ${user.id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Password: ${password}`);
        console.log(`   Role: ${user.role}`);
        console.log('\n⚠️  Please keep these credentials safe!');

    } catch (error) {
        console.error('❌ Failed to seed SuperAdmin:', error);
    } finally {
        process.exit(0);
    }
}

seedSuperAdmin();
