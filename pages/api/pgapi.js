import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: '164.30.69.134',
  database: 'Bundestag',
  password: 'ziewfgru86gtewi77f7gti7etgwf78i',
  port: 3100,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { queryType, searchTerm } = req.body; 
    let queryText = '';
    let values = []; // Parameter-Array für parametrisierte Queries

    switch (queryType) {
      case 'getTopZwischenrufer':
        queryText = `
          SELECT a.vorname, a.nachname, a.partei_kurz, COUNT(*) AS anzahl
          FROM zwischenruf z
          JOIN abgeordnete a ON z.zwischenrufer_id = a.id
          GROUP BY a.vorname, a.nachname, a.partei_kurz
          ORDER BY anzahl DESC
          LIMIT 100;
        `;
        break;

      case 'getMostRudeParty':
        queryText = `
          SELECT a.partei_kurz, COUNT(*) AS anzahl
          FROM zwischenruf z
          JOIN abgeordnete a ON z.zwischenrufer_id = a.id
          GROUP BY a.partei_kurz
          ORDER BY anzahl DESC 
          LIMIT 8;
        `;
        break;

      case 'getMostInterruptedParties':
        queryText = `
          SELECT a.partei_kurz, COUNT(*) AS anzahl
          FROM zwischenruf z
          JOIN reden r ON z.rede_id = r.id
          JOIN abgeordnete a ON r.redner_id = a.id
          GROUP BY a.partei_kurz
          ORDER BY anzahl DESC 
          LIMIT 8;
        `;
        break;

      case 'getMostInterruptedIndividuals':
        queryText = `
          SELECT a.vorname, a.nachname, a.partei_kurz, COUNT(*) AS anzahl
          FROM zwischenruf z
          JOIN reden r ON z.rede_id = r.id
          JOIN abgeordnete a ON r.redner_id = a.id
          GROUP BY a.vorname, a.nachname, a.partei_kurz
          ORDER BY anzahl DESC
          LIMIT 100;
        `;
        break;

      case 'searchZwischenruf':
        const finalTerm = searchTerm ?? '';

        queryText = `
          SELECT EXTRACT(YEAR FROM datum) AS jahr,
                 COUNT(*) AS gesamt_count
          FROM zwischenruf
          WHERE inhalt ILIKE $1
          GROUP BY jahr
          ORDER BY jahr;
        `;
        values = [`%${finalTerm}%`]; // '%Suchbegriff%' oder '%%' bei leer
        break;

      case 'findPartyById':
      queryText = `
        SELECT a.partei_kurz, COUNT(*) AS anzahl
        FROM zwischenruf z
        JOIN abgeordnete a ON z.zwischenrufer_id = a.id
        WHERE a.id = $1
        GROUP BY a.partei_kurz
      `;
      values = [searchTerm];
      break;


      default:
        return res.status(400).json({ error: 'Invalid query type' });
    }

    // Datenbank-Abfrage
    const result = await pool.query(queryText, values);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('❌ Fehler bei der Datenbankabfrage:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
