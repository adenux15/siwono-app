const Database = require('better-sqlite3');
const db = new Database('sqlite.db');

db.prepare("UPDATE users SET username = 'admin', password = 'admin123' WHERE id = 'usr_1'").run();
db.prepare("UPDATE users SET username = 'petugas', password = 'petugas123' WHERE id = 'usr_2'").run();

console.log("Database updated successfully");
