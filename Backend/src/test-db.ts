import { db } from './config/db';
import { hashPassword } from './utils/password.utils';

async function testDatabaseConnection() {
    console.log(' Testing database connection...\n');

    try {
        // Test 1: Basic connection test
        console.log('Test 1: Testing basic database connectivity...');
        const testQuery = await db.query('SELECT NOW() as current_time');
        console.log(' Database connected successfully!');
        console.log(`   Current database time: ${testQuery.rows[0].current_time}\n`);

        // Test 2: Check if users table exists
        console.log('Test 2: Checking if users table exists...');
        const tableCheck = await db.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `);

        if (tableCheck.rows[0].exists) {
            console.log(' Users table exists!\n');
        } else {
            console.log(' Users table does not exist. Please create the database schema first.\n');
            return;
        }

        // Test 3: Check current users in database
        console.log('Test 3: Checking existing users...');
        const existingUsers = await db.query('SELECT id, email, full_name, role, created_at FROM users');
        console.log(`   Found ${existingUsers.rows.length} existing user(s)`);
        if (existingUsers.rows.length > 0) {
            console.log('   Existing users:');
            existingUsers.rows.forEach((user, index) => {
                console.log(`   ${index + 1}. ${user.email} (${user.role}) - ${user.full_name}`);
            });
        }
        console.log('');

        // Test 4: Add a mock user
        const mockEmail = 'testuser@example.com';
        console.log('Test 4: Adding a mock user...');

        // Check if mock user already exists
        const existingMockUser = await db.query('SELECT id FROM users WHERE email = $1', [mockEmail]);

        if (existingMockUser.rows.length > 0) {
            console.log(`  Mock user (${mockEmail}) already exists. Skipping creation.\n`);
        } else {
            const hashedPassword = await hashPassword('Test123!');
            const insertResult = await db.query(
                `INSERT INTO users (email, password_hash, full_name, role) 
         VALUES ($1, $2, $3, $4) 
         RETURNING id, email, full_name, role, created_at`,
                [mockEmail, hashedPassword, 'Test User', 'customer']
            );

            const newUser = insertResult.rows[0];
            console.log(' Mock user created successfully!');
            console.log(`   User ID: ${newUser.id}`);
            console.log(`   Email: ${newUser.email}`);
            console.log(`   Name: ${newUser.full_name}`);
            console.log(`   Role: ${newUser.role}`);
            console.log(`   Created at: ${newUser.created_at}\n`);
        }

        // Test 5: Verify the user can be retrieved
        console.log('Test 5: Retrieving the mock user...');
        const retrievedUser = await db.query(
            'SELECT id, email, full_name, role, created_at FROM users WHERE email = $1',
            [mockEmail]
        );

        if (retrievedUser.rows.length > 0) {
            console.log(' Mock user retrieved successfully!');
            console.log(`   ${JSON.stringify(retrievedUser.rows[0], null, 2)}\n`);
        } else {
            console.log(' Failed to retrieve mock user\n');
        }

        console.log(' All database tests completed successfully!');
        console.log('\n Mock User Credentials for Testing:');
        console.log('   Email: testuser@example.com');
        console.log('   Password: Test123!');
        console.log('\nYou can now test the auth endpoints using these credentials.');

    } catch (error) {
        console.error(' Database test failed:', error);
        if (error instanceof Error) {
            console.error('Error details:', error.message);
        }
    } finally {
        // Close the connection
        process.exit(0);
    }
}

// Run the test
testDatabaseConnection();
