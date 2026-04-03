const express = require('express');
const db = require('./db');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/webhook', (req, res) => {
  const body = req.body;
  const unsorted = body?.unsorted?.add || [];

  for (const item of unsorted) {
    const name    = item?.source_data?.client?.name || item?.source_data?.name || null;
    const phone   = item?.source_data?.client?.id || null;
    const message = (item?.source_data?.data || [])[0]?.text || null;

    db.run(`
      INSERT OR IGNORE INTO leads (kommo_id, name, phone, message, created_at)
      VALUES (?, ?, ?, ?, ?)`,
      [item.lead_id, name, phone, message, item.date_create]
    );
  }

  res.sendStatus(200);
});

app.get('/leads', (req, res) => {
  db.all('SELECT * FROM leads ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/reset-db', (req, res) => {
  db.run(`DROP TABLE IF EXISTS leads`, () => {
    db.run(`CREATE TABLE leads (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      kommo_id    TEXT UNIQUE,
      name        TEXT,
      phone       TEXT,
      message     TEXT,
      created_at  TEXT
    )`, () => {
      res.json({ ok: true, message: 'DB reset, fresh start!' });
    });
  });
});

app.listen(process.env.PORT || 8080, () => console.log('Listening on port 8080'));
