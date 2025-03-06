import { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Header from '../components/header';
import styles from '../styles/Home.module.css';

export default function Personensuche() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [randomZwischenruf, setRandomZwischenruf] = useState(null);
  const [beispielRede, setBeispielRede] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

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

  async function fetchImageURL(firstName, lastName) {
    try {
      const response = await fetch('/api/name_to_picture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName })
      });
      if (!response.ok) {
        throw new Error('Fehler beim Laden des Bildes');
      }
      const data = await response.json();
      return data.imageURL;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  
  // Kürzt zu lange Texte
  function truncateText(text, maxLength = 150) {
    if (!text) return '';
    return text.length <= maxLength ? text : text.slice(0, maxLength) + '...';
  }
  
  function LocalImage({ fetchPriority, ...rest }) {
    // fetchPriority wird ignoriert und nicht weitergegeben
    return <img {...rest} />;
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
    console.log(selectedPerson);
    if (selectedPerson && selectedPerson.zwischenrufe && selectedPerson.zwischenrufe.length > 0) {
      const randomIndex = Math.floor(Math.random() * selectedPerson.zwischenrufe.length);
      const chosenZwischenruf = selectedPerson.zwischenrufe[randomIndex];
      console.log(chosenZwischenruf);
      setRandomZwischenruf(chosenZwischenruf);
      // Rede-ID verwenden, um die passende Rede zu laden
      fetchRedeFromZwischenruf(chosenZwischenruf.rede_id);
    }
  }
  
  // Beim ersten Laden: Standard-Person (z.B. Olaf Scholz)
  useEffect(() => {
    if (!selectedPerson) {
      const defaultId = '11003231'; // bitte anpassen
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
      fetchImageURL(selectedPerson.vorname, selectedPerson.nachname).then(url => {
        if (url) {
          setImageURL(url);
        }
      });
    }
  }, [selectedPerson]);

  // Sobald Personendaten vorliegen, lade beim ersten Mal automatisch einen zufälligen Zwischenruf
  useEffect(() => {
    if (selectedPerson && selectedPerson.zwischenrufe && selectedPerson.zwischenrufe.length > 0) {
      handleRandomZwischenruf();
    }
  }, [selectedPerson]);

  useEffect(() => {
    if (selectedPerson && imageURL) {
      setIsLoaded(true);
    }
  }, [selectedPerson, imageURL]);

  if (!isLoaded) {
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
              className={styles.suchbar}
            />
            {suggestions.length > 0 && (
              <div className={styles.suggestionContainer}>
                <ul className={styles.suggestionList}>
                  {suggestions.map((person) => (
                    <li
                      key={person.id}
                      onClick={() => handleSuggestionClick(person)}
                      className={styles.suggestionItem}
                    >
                      {person.vorname} {person.nachname}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
  
          {/* Insert the creative loading bar here */}
          <div className={styles.loadingWrapper}>
            <div className={styles.loadingCircle}></div>
          </div>
        </main>
      </div>
    );
  };
  

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
            className={styles.suchbar}
          />
          {suggestions.length > 0 && (
            <div className={styles.suggestionContainer}>
              <ul className={styles.suggestionList}>
                {suggestions.map((person) => (
                  <li
                    key={person.id}
                    onClick={() => handleSuggestionClick(person)}
                    className={styles.suggestionItem}
                  >
                    {person.vorname} {person.nachname}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
  
        {selectedPerson && (
          <div className={styles.layoutContainer}>
            {/* Linke Spalte: Visitenkarte */}
            <div
              className={styles.visitenkarte}
              style={{
                borderRadius: '8px',
                overflow: 'hidden', // Damit das Bild und der Name nicht über den Rand hinausragen
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                padding: '1rem',
              }}
            >
              {/* Name als Überschrift */}
              <h1 className={styles.profilePictureCaption}>
                {selectedPerson.anrede_titel} {selectedPerson.akad_titel}{' '}
                {selectedPerson.vorname} {selectedPerson.nachname}
              </h1>
            
              {/* Vertikale Trennlinie */}
              <div className={styles.verticalLine}></div>
            
              {/* Flex-Container für Bild und Inhalt */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                {/* Linke Spalte: Bild */}
                {imageURL && (
                  <div style={{ flexShrink: 0 }}>
                    <LocalImage
                      src={imageURL}
                      alt={`${selectedPerson.vorname} ${selectedPerson.nachname}`}
                      className={styles.profilePicture}
                      style={{
                        display: 'block',
                        width: '120px',
                        height: 'auto',
                        borderRadius: '4px',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                )}

                {/* Rechte Spalte: Datenliste */}
                <dl className={styles.visitenkarteDatalist}>
                  <div className={styles.dataRow}>
                    <dt>Geburtsdatum:</dt>
                    <dd>{selectedPerson.geburtsdatum}</dd>
                  </div>
                  <div className={styles.dataRow}>
                    <dt>Geburtsort:</dt>
                    <dd>{selectedPerson.geburtsort}</dd>
                  </div>
                  <div className={styles.dataRow}>
                    <dt>Sterbedatum:</dt>
                    <dd>{selectedPerson.sterbedatum || '---'}</dd>
                  </div>
                  <div className={styles.dataRow}>
                    <dt>Geschlecht:</dt>
                    <dd>{selectedPerson.geschlecht}</dd>
                  </div>
                  <div className={styles.dataRow}>
                    <dt>Familienstand:</dt>
                    <dd>{selectedPerson.familienstand}</dd>
                  </div>
                  <div className={styles.dataRow}>
                    <dt>Religion:</dt>
                    <dd>{selectedPerson.religion}</dd>
                  </div>
                  <div className={styles.dataRow}>
                    <dt>Beruf:</dt>
                    <dd>{selectedPerson.beruf}</dd>
                  </div>
                  <div className={styles.dataRow}>
                    <dt>Partei:</dt>
                    <dd>{selectedPerson.partei_kurz}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Rechte Spalte: Infoboxen und Beispieldialog */}
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className={styles.smallinfobox}>
                  <div className={styles.smallinfoboxLabel}>Zwischenrufe:</div>
                  <div className={styles.smallinfoboxCount}>
                    {selectedPerson.zwischenrufe_count}
                  </div>
                </div>
                <div className={styles.smallinfobox}>
                  <div className={styles.smallinfoboxLabel}>Reden:</div>
                  <div className={styles.smallinfoboxCount}>
                    {selectedPerson.reden_count}
                  </div>
                </div>
                <div className={styles.smallinfobox}>
                  <div className={styles.smallinfoboxLabel}>Inhalt:</div>
                  <div className={styles.smallinfoboxCount}>
                    0
                  </div>
                </div>
                <div className={styles.smallinfobox}>
                  <div className={styles.smallinfoboxLabel}>Amount of Bitches:</div>
                  <div className={styles.smallinfoboxCount}>
                    0
                  </div>
                </div>
              </div>
      
              {/* Beispiel-Box im Schwarz-Weiß-Stil */}
              <div className={styles.examplebox}>
                {/* Titelzeile: Überschrift + Button */}
                <div className={styles.exampleHeader}>
                  <h3 style={{ margin: 0 }}>
                    Beispiel Zwischenruf von {selectedPerson.vorname} {selectedPerson.nachname}:
                  </h3>
                  <button
                    onClick={handleRandomZwischenruf}
                    className={styles.refreshButton}
                  >
                    <span className={styles.refreshIcon}>🔄</span> Refresh
                  </button>
                </div>
        
                {/* Zwischenruf + Antwort */}
                <div className={styles.exampleInnerBox}>
                  {(!beispielRede && !randomZwischenruf) ? (
                    // Fallback: 404, falls nichts da
                    <div className={styles.notFound404}>Ich habe mich benommen!</div>
                  ) : (
                    <>
                      {beispielRede && (
                        <p style={{ margin: 0 }}>
                          <strong>
                            {beispielRede.vorname} {beispielRede.nachname} ({beispielRede.partei_kurz})
                          </strong>
                          : {truncateText(beispielRede.inhalt, 1200)}
                        </p>
                      )}
                    </>
                  )}
                </div>
        
                {/* Footer-Bereich */}
                <div className={styles.exampleFooter}>
                  <div className={styles.exampleInnerBox}>
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
