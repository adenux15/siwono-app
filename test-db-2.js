const postgres = require('postgres');
const client = postgres('postgresql://postgres:s1w0n0@1230k3@db.pgugrpmuwupqbmldhont.supabase.co:6543/postgres', {prepare: false, max: 1});
client`SELECT 1`.then(r => console.log('Success')).catch(e => console.error('Error:', e.message)).finally(() => process.exit(0));
