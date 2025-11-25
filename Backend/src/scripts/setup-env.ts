import fs from 'fs';
import path from 'path';

const envPath = path.join(__dirname, '../../.env');
const examplePath = path.join(__dirname, '../../.env.example');

console.log(' Setting up local environment...');

if (fs.existsSync(envPath)) {
    console.log('.env file already exists. Skipping creation.');
} else {
    if (fs.existsSync(examplePath)) {
        fs.copyFileSync(examplePath, envPath);
        console.log('Created .env file from .env.example');
        console.log(' Please update .env with your specific configuration values.');
    } else {
        console.error(' .env.example file not found! Cannot create .env.');
        process.exit(1);
    }
}

console.log('\n Environment setup complete!');
