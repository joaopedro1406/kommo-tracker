const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const dir = process.env.DATA_DIR || '/data';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const db = new sqlite3.Database(`${dir}/kommo.db`);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS leads (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    kommo_id    TEXT UNIQUE,
    name        TEXT,
    phone       TEXT,
    message     TEXT,
    created_at  TEXT
  )`);
});

module.exports = db;
