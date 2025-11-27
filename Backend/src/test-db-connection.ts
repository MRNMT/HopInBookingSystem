import dotenv from 'dotenv';

dotenv.config();

console.log('=== DATABASE CONNECTION DEBUG ===');
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('DATABASE_URL length:', process.env.DATABASE_URL?.length);

// Mask the password but show the structure
if (process.env.DATABASE_URL) {
    const url = process.env.DATABASE_URL;
    const passwordMatch = url.match(/\/\/([^:]+):([^@]+)@([^\/]+)/);

    if (passwordMatch) {
        const [, username, password, host] = passwordMatch;
        console.log('Username:', username);
        console.log('Password length:', password.length);
        console.log('Password first 4 chars:', password.substring(0, 4));
        console.log('Host:', host);
    }
}
console.log('================================\n');