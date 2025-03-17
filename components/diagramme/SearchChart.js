import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import styles from '../../styles/Home.module.css';

export default function SearchChart() {
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([]);

  function CustomTooltip({ active, payload, label }) {
    if (!active || !payload || !payload.length) return null;

    const item = payload[0].payload;
    return (
      <div className={styles.bubbleTooltip}>
        <p><strong>Jahr:</strong> {label}</p>
        <p><strong>Anzahl:</strong> {item.gesamt_count}</p>
      </div>
    );
  }

  // Load data on component mount
  useEffect(() => {
    handleSearch();
  }, []);

  // Function to fetch data from API
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

      // Expecting response like [{ jahr: 2013, gesamt_count: "42" }, ...]
      const json = await response.json();

      const parsedData = json.map((row) => ({
        jahr: Number(row.jahr),
        gesamt_count: Number(row.gesamt_count),
      }));

      // Fill in missing years between 2013 and 2024
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

  // When Enter is pressed, run handleSearch
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={styles.searchChartContainer}>
      {/* Search controls */}
      <div className={styles.searchChartControls}>
        <input
          className={styles.suchbar}
          type="text"
          placeholder="Stichwort eingeben (oder leer für alle)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className={styles.searchButton}
          onClick={handleSearch}
        >
          Suche
        </button>
      </div>

      {/* Chart */}
      <div className={styles.searchChartChart}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="jahr" />
            <YAxis type="number" domain={[0, 'dataMax']} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="gesamt_count" fill="rgba(173, 142, 2, 0.5)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
