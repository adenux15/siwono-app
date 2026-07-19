require('dotenv').config();
const postgres = require('postgres');
const url = process.env.DATABASE_URL;
const client = postgres(url, {prepare: false, max: 1});
client`SELECT "id", "email", "name", "username", "password", "role" FROM "users"`.then(r => {
    console.log('Users in DB:', r);
    process.exit(0);
}).catch(e => {
    console.error('Error querying DB:', e.message);
    process.exit(1);
});
