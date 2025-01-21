const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3100;

const pool = new Pool({
  user: 'postgres',
  host: '164.30.69.134',
  database: 'Bundestag',
  password: 'ziewfgru86gtewi77f7gti7etgwf78i',
  port: 3100,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Fehler bei der Verbindung zur Datenbank:', err.stack);
  }
  console.log('Erfolgreich mit der Datenbank verbunden.');
  release();
});

app.get('/tables', async (req, res) => {
  try {
    const result = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Fehler bei der Abfrage der Tabellenstruktur');
  }
});

app.get('/zwischenrufe', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM zwischenruf');
      res.json(result.rows);
    } catch (err) {
      console.error('Datenbankfehler:', err);
      res.status(500).send('Fehler beim Abrufen der Zwischenrufe');
    }
  });
  

app.get('/statistiken', async (req, res) => {
  try {
    const query = `
      SELECT abg.partei_kurz, COUNT(*) AS anzahl_zwischenrufe
      FROM zwischenruf AS z
      JOIN abgeordnete AS abg ON z.zwischenrufer_id = abg.id
      GROUP BY abg.partei_kurz
      ORDER BY anzahl_zwischenrufe DESC;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Fehler beim Abrufen der Statistik:', err);
    res.status(500).send('Fehler beim Abrufen der Statistik');
  }
});

app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});
