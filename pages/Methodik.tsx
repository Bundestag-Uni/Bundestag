import React from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Header from '../components/header';
import { Container, Box, Typography, Paper, List, ListItem } from '@mui/material';

export default function Methodik() {
  return (
    <div>
      <Header />
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h2" component="h1" align="center" gutterBottom>
          Methodik
        </Typography>
        <Typography variant="subtitle1" align="center" gutterBottom>
          Eine detaillierte Übersicht über den Aufbau und die Datenverarbeitung des Bundestagsscrapers
        </Typography>

        {/* Architekturaufbau */}
        <Box sx={{ mt: 4 }}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Architekturaufbau
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Frontend:</strong> Das Frontend ist die Benutzerschnittstelle des Systems und besteht aus drei Hauptfunktionen:
            </Typography>
            <List>
              <ListItem disableGutters>
                <Typography variant="body1">• Zwischenrufe: Analyse und Darstellung von Zwischenrufen aus Bundestagsdebatten.</Typography>
              </ListItem>
              <ListItem disableGutters>
                <Typography variant="body1">• Yap‑O‑Meter: Visualisierung der "Redefreudigkeit" von Abgeordneten.</Typography>
              </ListItem>
              <ListItem disableGutters>
                <Typography variant="body1">• Personensuche: Abruf spezifischer Informationen über Bundestagsabgeordnete.</Typography>
              </ListItem>
            </List>
            <Typography variant="body1" gutterBottom>
              Das Frontend greift direkt auf die SQL‑Datenbank zu, um die benötigten Daten abzurufen.
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>SQL‑Datenbank (Postgres):</strong> Die zentrale Datenbank speichert alle Daten, die aus externen Quellen (z. B. Bundestags‑API, Wikipedia‑Scraper) gesammelt und durch interne Prozesse bereinigt werden.
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>KI‑Effizienzauswertung von Reden:</strong> Ein in Python implementiertes KI‑Modul verwendet LightRAG, um die Effizienz von Reden zu analysieren. Die Ergebnisse werden über das Frontend abrufbar gemacht.
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Daten Cleanup Wrapper:</strong> Ein Python‑Skript, das Rohdaten aus der Bundestags‑API bereinigt und in der SQL‑Datenbank speichert.
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Externe Quellen:</strong>
            </Typography>
            <List>
              <ListItem disableGutters>
                <Typography variant="body1">• Bundestags API: Schnittstelle zur Abfrage parlamentarischer Informationen.</Typography>
              </ListItem>
              <ListItem disableGutters>
                <Typography variant="body1">• Wikipedia Scraper: Sammlung ergänzender Informationen über Abgeordnete.</Typography>
              </ListItem>
            </List>
          </Paper>

          {/* Daten Cleanup */}
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Daten Cleanup
            </Typography>
            <Typography variant="body1" gutterBottom>
              Die Daten werden aus den Bundestagsprotokollen extrahiert und in drei separate Listen aufgeteilt:
            </Typography>
            <List>
              <ListItem disableGutters>
                <Typography variant="body1">• <strong>Liste Reden:</strong> Enthält Rede-ID, Abgeordneten-ID und den Redeinhalt.</Typography>
              </ListItem>
              <ListItem disableGutters>
                <Typography variant="body1">• <strong>Liste Zwischenrufe:</strong> Enthält Rede-ID, Abgeordneten-ID und den Inhalt der Zwischenrufe.</Typography>
              </ListItem>
              <ListItem disableGutters>
                <Typography variant="body1">• <strong>Liste an Abgeordneten:</strong> Enthält Informationen über Abgeordnete wie ID, Partei und persönliche Daten.</Typography>
              </ListItem>
            </List>
            <Typography variant="body1" gutterBottom>
              Die bereinigten Daten werden in der SQL‑Datenbank als zentrale Ablage gespeichert.
            </Typography>
          </Paper>

          {/* KI-Effizienz-Auswertung */}
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              KI‑Effizienz‑Auswertung
            </Typography>
            <Typography variant="body1" gutterBottom>
              Die Effizienzberechnung erfolgt in mehreren Schritten:
            </Typography>
            <List component="ol">
              <ListItem disableGutters>
                <Typography variant="body1">
                  <strong>SQL‑Datenbank:</strong> Die Tabelle „Liste an Reden“ enthält für jede Rede eine eindeutige ID und den Redeinhalt.
                </Typography>
              </ListItem>
              <ListItem disableGutters>
                <Typography variant="body1">
                  <strong>LightRAG Indexing:</strong> Der Redeinhalt wird analysiert, um Entitäten und deren Beziehungen zu extrahieren.
                </Typography>
              </ListItem>
              <ListItem disableGutters>
                <Typography variant="body1">
                  <strong>Erweiterte Analyse:</strong> Die Ergebnisse werden in einer erweiterten Tabelle gespeichert, die zusätzliche Informationen wie Anzahl der Entitäten, Beziehungen und Rede‑Länge enthält.
                </Typography>
              </ListItem>
              <ListItem disableGutters>
                <Typography variant="body1">
                  <strong>Effizienzberechnung:</strong>
                  <br />
                  Effizienz Zwischenwert = (Anzahl_Entitäten * Anzahl_Beziehungen) / Rede_Länge<br />
                  Die Werte werden normalisiert, sodass die Rede mit der höchsten Effizienz den Wert 1 erhält.
                </Typography>
              </ListItem>
              <ListItem disableGutters>
                <Typography variant="body1">
                  <strong>Rückspeicherung:</strong> Die berechneten Daten werden zurück in die SQL‑Datenbank gespeichert.
                </Typography>
              </ListItem>
            </List>
          </Paper>
        </Box>
      </Container>
      <Footer />
    </div>
  );
}
