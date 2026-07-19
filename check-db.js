require('dotenv').config();
const postgres = require('postgres');
const url = process.env.DATABASE_URL;
console.log('Testing connection to:', url.replace(/:[^:@]+@/, ':***@'));
const client = postgres(url, {prepare: false, max: 1});
client`SELECT 1`.then(r => {
    console.log('Success:', r);
    process.exit(0);
}).catch(e => {
    console.error('Error connecting to DB:', e.message);
    process.exit(1);
});
