import { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Header from '../components/header';

export default function Personensuche() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [randomZwischenruf, setRandomZwischenruf] = useState(null);
  const [beispielRede, setBeispielRede] = useState(null);

  // Namensvorschläge laden
  async function fetchNameSuggestions(value) {
    if (!value) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch('/api/pgapi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          queryType: 'getNameSuggestions',
          searchTerm: value
        })
      });
      if (!response.ok) throw new Error('Fehler beim Laden der Namensvorschläge');
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error(error);
      setSuggestions([]);
    }
  }

  // Personendaten inklusive Zwischenrufe laden
  async function fetchPersonData(id) {
    try {
      const response = await fetch('/api/pgapi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          queryType: 'getPersonData',
          searchTerm: id
        })
      });
      const data = await response.json();
      // data[0] enthält alle Felder, inklusive zwischenrufe_count, reden_count und zwischenrufe (Array von Objekten)
      setSelectedPerson(data[0]);
    } catch (error) {
      console.error(error);
      setSelectedPerson(null);
    }
  }

  // Rede anhand der zwischenruf_id abfragen
  async function fetchRedeFromZwischenruf(redeId) {
    try {
      const response = await fetch('/api/pgapi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          queryType: 'getRedeFromZwischenruf',
          searchTerm: redeId
        })
      });
      if (!response.ok) throw new Error('Fehler beim Laden der Rede');
      const data = await response.json();
      if (data && data[0]) {
        setBeispielRede(data[0]);
      }
    } catch (error) {
      console.error(error);
      setBeispielRede(null);
    }
  }
  // Kürzt zu lange Texte
  function truncateText(text, maxLength = 150) {
    if (!text) return '';
    return text.length <= maxLength ? text : text.slice(0, maxLength) + '...';
  }

  // Suchfeld-Handler
  function handleChange(e) {
    const value = e.target.value;
    setSearchTerm(value);
    fetchNameSuggestions(value);
  }

  // Wenn ein Vorschlag angeklickt wird
  function handleSuggestionClick(person) {
    setSearchTerm('');
    setSuggestions([]);
    fetchPersonData(person.id);
  }

  // Button-Klick: Einen neuen zufälligen Zwischenruf auswählen & Rede laden
  function handleRandomZwischenruf() {
    console.log(selectedPerson)
    if (selectedPerson && selectedPerson.zwischenrufe && selectedPerson.zwischenrufe.length > 0) {
      const randomIndex = Math.floor(Math.random() * selectedPerson.zwischenrufe.length);
      const chosenZwischenruf = selectedPerson.zwischenrufe[randomIndex];
      console.log(chosenZwischenruf)
      setRandomZwischenruf(chosenZwischenruf);
      // Rede-ID verwenden, um die passende Rede zu laden
      fetchRedeFromZwischenruf(chosenZwischenruf.rede_id);
    }
  }
  // Beim ersten Laden: Standard-Person (z.B. Unser Hero BRANDNERRRRRRRR)
  useEffect(() => {
    if (!selectedPerson) {
      const defaultId = '11004678'; // bitte anpassen
      fetchPersonData(defaultId);
    }
  }, []);

  useEffect(() => {
    if (selectedPerson) {
      // Zurücksetzen, falls vorher schon ein Zwischenruf ausgewählt war
      setRandomZwischenruf(null);
      setBeispielRede(null);
      // Neuen Zufallszwischenruf für den aktuellen Abgeordneten laden
      handleRandomZwischenruf();
    }
  }, [selectedPerson]);

  // Sobald Personendaten vorliegen, lade beim ersten Mal automatisch einen zufälligen Zwischenruf
  useEffect(() => {
    if (selectedPerson && selectedPerson.zwischenrufe && selectedPerson.zwischenrufe.length > 0) {
      handleRandomZwischenruf();
    }
  }, [selectedPerson]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <title>Bundestagsscraper</title>
      <meta
        name="description"
        content="A website inspired by the Bundestag displaying curated data."
      />
      <Header />
      <Navbar />
      <main
        style={{
          flexGrow: 1,
          padding: '1rem',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Suchfeld */}
        <div style={{ position: 'relative', width: '50%', margin: '2rem auto' }}>
          <input
            type="text"
            value={searchTerm}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && suggestions.length > 0) {
                handleSuggestionClick(suggestions[0]);
              }
            }}
            placeholder="Such nach Abgeordneten..."
            className="Home-module__g21JLG__suchbar"
          />
          {suggestions.length > 0 && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                width: '100%',
                zIndex: 10000,
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
              }}
            >
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {suggestions.map((person) => (
                  <li
                    key={person.id}
                    onClick={() => handleSuggestionClick(person)}
                    className="Home-module__g21JLG__suchvorschlag"
                  >
                    {person.vorname} {person.nachname}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
  
        {/* Layout: Linke Spalte (Visitenkarte) + Rechte Spalte (Infoboxen & Beispieldialog) */}
        {selectedPerson && (
          <div className="Home-module__g21JLG__layoutContainer">
            {/* Linke Spalte: Visitenkarte */}
            <div className="Home-module__g21JLG__visitenkarte">
              <h1>
                {selectedPerson.anrede_titel} {selectedPerson.akad_titel}{' '}
                {selectedPerson.vorname} {selectedPerson.nachname}
              </h1>
              <dl className="Home-module__g21JLG__visitenkarte-datalist">
                <div className="Home-module__g21JLG__data-row">
                  <dt>Geburtsdatum:</dt>
                  <dd>{selectedPerson.geburtsdatum}</dd>
                </div>
                <div className="Home-module__g21JLG__data-row">
                  <dt>Geburtsort:</dt>
                  <dd>{selectedPerson.geburtsort}</dd>
                </div>
                <div className="Home-module__g21JLG__data-row">
                  <dt>Sterbedatum:</dt>
                  <dd>{selectedPerson.sterbedatum || '---'}</dd>
                </div>
                <div className="Home-module__g21JLG__data-row">
                  <dt>Geschlecht:</dt>
                  <dd>{selectedPerson.geschlecht}</dd>
                </div>
                <div className="Home-module__g21JLG__data-row">
                  <dt>Familienstand:</dt>
                  <dd>{selectedPerson.familienstand}</dd>
                </div>
                <div className="Home-module__g21JLG__data-row">
                  <dt>Religion:</dt>
                  <dd>{selectedPerson.religion}</dd>
                </div>
                <div className="Home-module__g21JLG__data-row">
                  <dt>Beruf:</dt>
                  <dd>{selectedPerson.beruf}</dd>
                </div>
                <div className="Home-module__g21JLG__data-row">
                  <dt>Partei:</dt>
                  <dd>{selectedPerson.partei_kurz}</dd>
                </div>
              </dl>
            </div>
  
            {/* Rechte Spalte: Infoboxen und Beispieldialog */}
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="Home-module__g21JLG__smallinfobox">
                  <div className="Home-module__g21JLG__smallinfobox-label">Zwischenrufe:</div>
                  <div className="Home-module__g21JLG__smallinfobox-count">
                    {selectedPerson.zwischenrufe_count}
                  </div>
                </div>
                <div className="Home-module__g21JLG__smallinfobox">
                  <div className="Home-module__g21JLG__smallinfobox-label">Reden:</div>
                  <div className="Home-module__g21JLG__smallinfobox-count">
                    {selectedPerson.reden_count}
                  </div>
                </div>
                <div className="Home-module__g21JLG__smallinfobox">
                  <div className="Home-module__g21JLG__smallinfobox-label">Inhalt:</div>
                  <div className="Home-module__g21JLG__smallinfobox-count">
                    0
                  </div>
                </div>
                <div className="Home-module__g21JLG__smallinfobox">
                  <div className="Home-module__g21JLG__smallinfobox-label">Amount of Bitches:</div>
                  <div className="Home-module__g21JLG__smallinfobox-count"> 
                    0
                  </div>
                </div>
              </div>
  
              {/* Beispiel-Box im Schwarz-Weiß-Stil */}
              <div className="Home-module__g21JLG__examplebox">
                {/* Titelzeile: Überschrift + Button */}
                <div className="Home-module__g21JLG__exampleHeader">
                  <h3 style={{ margin: 0 }}>
                    Beispiel Zwischenruf von {selectedPerson.vorname} {selectedPerson.nachname}:
                  </h3>
                  <button
                    onClick={handleRandomZwischenruf}
                    className="Home-module__g21JLG__refreshButton"
                  >
                    <span className="Home-module__g21JLG__refreshIcon">🔄</span> Refresh
                  </button>
                </div>
  
                {/* Zwischenruf + Antwort */}
                <div className="Home-module__g21JLG__exampleInnerBox">
                  {(!beispielRede && !randomZwischenruf) ? (
                    // Fallback: 404, falls nichts da
                    <div className="Home-module__g21JLG__notFound404">404</div>
                  ) : (
                    <>
                      {beispielRede && (
                        <p style={{ margin: 0 }}>
                          <strong>
                            {beispielRede.vorname} {beispielRede.nachname} ({beispielRede.partei_kurz})
                          </strong>
                          : {truncateText(beispielRede.inhalt, 1500)}
                        </p>
                      )}
                    </>
                  )}
                </div>
  
                {/* Footer-Bereich */}
                <div className="Home-module__g21JLG__exampleFooter">
                  <div className="Home-module__g21JLG__exampleInnerBox">
                    {randomZwischenruf && (
                      <p style={{ margin: 0 }}>
                        <strong>
                          {selectedPerson.vorname} {selectedPerson.nachname} ({selectedPerson.partei_kurz})
                        </strong>
                        : {truncateText(randomZwischenruf.inhalt, 150)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );  
}
