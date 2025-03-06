import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function SearchChart() {
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([]);

  function CustomTooltip({ active, payload, label }) {
    if (!active || !payload || !payload.length) return null;

    const item = payload[0].payload;
    return (
      <div className="Home-module__g21JLG__bubble-tooltip">
        <p><strong>Jahr:</strong> {label}</p>
        <p><strong>Anzahl:</strong> {item.gesamt_count}</p>
      </div>
    );
  }

  // Beim Laden der Komponente einmal "alles anzeigen"
  useEffect(() => {
    handleSearch();
  }, []);

  // Funktion, um die DB-Abfrage zu starten
  const handleSearch = async () => {
    try {
      const response = await fetch('/api/pgapi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          queryType: 'searchZwischenruf',
          searchTerm,
        }),
      });
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      // Antwort, z. B. [{ jahr: 2013, gesamt_count: "42" }, ...]
      const json = await response.json();

      // 'gesamt_count' -> Number
      const parsedData = json.map((row) => ({
        jahr: Number(row.jahr),
        gesamt_count: Number(row.gesamt_count),
      }));

      // Alle Jahre zwischen 2013 und 2024 auffüllen, damit 0-Werte erscheinen
      const startYear = 2013;
      const endYear = 2024;
      const fullData = [];
      
      for (let y = startYear; y <= endYear; y++) {
        const existing = parsedData.find((d) => d.jahr === y);
        if (existing) {
          fullData.push(existing);
        } else {
          fullData.push({ jahr: y, gesamt_count: 0 });
        }
      }

      setData(fullData);
    } catch (error) {
      console.error('Fehler beim Laden der Daten:', error);
    }
  };

  // onKeyDown: wenn Enter gedrückt, handleSearch
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="Home-module__g21JLG__searchChartContainer">
      {/* Eingabe + Button */}
      <div className="Home-module__g21JLG__searchChartControls">
        <input
          className="Home-module__g21JLG__searchChartInput"
          type="text"
          placeholder="Stichwort eingeben (oder leer für alle)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}  // <--- Hier der Enter-Handler
        />
        <button
          className="Home-module__g21JLG__searchChartButton"
          onClick={handleSearch}
        >
          Suche
        </button>
      </div>

      {/* Diagramm */}
      <div className="Home-module__g21JLG__searchChartChart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="jahr" />
            <YAxis type="number" domain={[0, 'dataMax']} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="gesamt_count" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
