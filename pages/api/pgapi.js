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

      case 'getNameSuggestions':
        queryText = `
          SELECT id, vorname, nachname
          FROM abgeordnete
          WHERE
            CONCAT(vorname, ' ', nachname) ILIKE $1 || '%' 
            OR CONCAT(nachname, ' ', vorname) ILIKE $1 || '%'
          ORDER BY nachname, vorname
          LIMIT 10;
        `;
        values = [searchTerm];
        break;

      case 'getPersonData':
        queryText = `
          SELECT
            a.id,
            a.anrede_titel,
            a.akad_titel,
            a.vorname,
            a.nachname,
            to_char(a.geburtsdatum, 'DD.MM.YYYY') AS geburtsdatum,
            to_char(a.sterbedatum, 'DD.MM.YYYY') AS sterbedatum,
            a.geschlecht,
            a.geburtsort,
            a.familienstand,
            a.religion,
            a.beruf,
            a.partei_kurz,
            (SELECT COUNT(*) FROM zwischenruf z WHERE z.zwischenrufer_id = a.id) AS zwischenrufe_count,
            (SELECT COUNT(*) FROM reden r WHERE r.redner_id = a.id) AS reden_count,
            (
              SELECT ARRAY(
                SELECT row_to_json(z)
                FROM (
                  SELECT inhalt, rede_id
                  FROM zwischenruf z
                  WHERE z.zwischenrufer_id = a.id
                ) z
              )
            ) AS zwischenrufe
          FROM abgeordnete a
          WHERE a.id = $1;
        `;
        values = [searchTerm];
        break;

      case 'getRedeFromZwischenruf':
        queryText = `
          SELECT
          a.vorname, a.nachname, a.partei_kurz, r.inhalt
          FROM reden as r, abgeordnete as a
          WHERE r.redner_id = a.id and r.id  = $1;
        `;
        values = [searchTerm];
        break;

      case 'getAllReden':
        queryText = `
          SELECT id, inhalt
          FROM reden
          ORDER BY id ASC
          LIMIT 100
        `;
        break;

      case 'getRedenWithMeta':
        queryText = `
            SELECT
              r.id,
              r.inhalt,
              -- Datum ggf. formatieren, z.B. TO_CHAR(r.datum, 'YYYY-MM-DD') as datum,
              r.datum,
              a.vorname,
              a.nachname,
              a.partei_kurz
            FROM reden r
            JOIN abgeordnete a ON r.redner_id = a.id
            ORDER BY r.id
            LIMIT 100
          `;
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
