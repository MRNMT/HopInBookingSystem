import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/v1';

async function testApiEndpoints() {
    console.log(' Testing API Endpoints...\n');

    try {
        // Test 1: Health check on base route
        console.log('Test 1: Testing base route...');
        try {
            const healthCheck = await axios.get('http://localhost:5000');
            console.log(` Base route working: ${healthCheck.data}\n`);
        } catch (error) {
            console.log(' Server might not be running. Please start the server first.\n');
            console.log('   Run: npm run dev (or ts-node src/server.ts)\n');
            return;
        }

        // Test 2: Login with mock user
        console.log('Test 2: Testing login endpoint...');
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'testuser@example.com',
            password: 'Test123!'
        });

        if (loginResponse.status === 200) {
            console.log(' Login successful!');
            console.log(`   Token: ${loginResponse.data.data.token.substring(0, 30)}...`);
            console.log(`   User: ${loginResponse.data.data.user.full_name} (${loginResponse.data.data.user.email})\n`);

            const token = loginResponse.data.data.token;

            // Test 3: Get user profile with JWT
            console.log('Test 3: Testing protected endpoint (get profile)...');
            const profileResponse = await axios.get(`${BASE_URL}/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (profileResponse.status === 200) {
                console.log(' Protected route working!');
                console.log(`   Retrieved profile: ${profileResponse.data.data.full_name}\n`);
            }

            // Test 4: Test user routes
            console.log('Test 4: Testing user profile update...');
            const updateResponse = await axios.put(
                `${BASE_URL}/user/profile`,
                {
                    full_name: 'Test User Updated'
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (updateResponse.status === 200) {
                console.log(' User profile update working!');
                console.log(`   Updated name: ${updateResponse.data.data.full_name}\n`);
            }

            console.log('🎉 All API endpoint tests passed successfully!');
            console.log('\n Summary:');
            console.log('   - Database connection: Working ✓');
            console.log('   - Auth routes (login): Working ✓');
            console.log('   - Protected routes (JWT): Working ✓');
            console.log('   - User routes (update): Working ✓');
            console.log('\n All paths are functioning correctly!');
        }

    } catch (error: any) {
        console.error(' API test failed!');
        if (error.response) {
            console.error(`   Status: ${error.response.status}`);
            console.error(`   Error: ${JSON.stringify(error.response.data, null, 2)}`);
        } else if (error.request) {
            console.error('   No response from server. Make sure the server is running.');
            console.error('   Run: ts-node src/server.ts');
        } else {
            console.error(`   Error: ${error.message}`);
        }
    }
}

testApiEndpoints();
