import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/v1';

async function verifySuperAdmin() {
    console.log(' Verifying SuperAdmin Login...\n');

    try {
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'super@hopinSuperAdmin.email',
            password: 'SuperPassword123!'
        });

        if (loginResponse.status === 200) {
            console.log(' SuperAdmin Login successful!');
            const user = loginResponse.data.data.user;
            console.log(`   User: ${user.full_name}`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Role: ${user.role}`);

            if (user.role === 'superadmin') {
                console.log(' Role verification passed!');
            } else {
                console.error(' Role verification failed! Expected superadmin, got:', user.role);
            }
        }
    } catch (error: any) {
        console.error(' Login failed!');
        if (error.response) {
            console.error(`   Status: ${error.response.status}`);
            console.error(`   Message: ${error.response.data.message}`);
        } else {
            console.error(`   Error: ${error.message}`);
        }
    }
}

verifySuperAdmin();
