import fs from 'fs';
import path from 'path';

const envPath = path.join(__dirname, '../../.env');

try {
    let envContent = fs.readFileSync(envPath, 'utf8');

    envContent = envContent.replace(/STRIPE_SECRET_KEY="(.*)"/g, 'STRIPE_SECRET_KEY=$1');

    envContent = envContent.replace(/DATABASE_URL="(.*)"/g, 'DATABASE_URL=$1');

    fs.writeFileSync(envPath, envContent);
    console.log('Successfully fixed .env file formatting!');
} catch (error) {
    console.error('Error fixing .env file:', error);
}
