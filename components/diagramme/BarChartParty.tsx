import * as React from 'react';
import { BarChart } from '@mui/x-charts';
import { useEffect, useState } from 'react';

export default function BartChartParty() {
  const [chartData, setChartData] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/your-endpoint', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ queryType: 'findPartyById', searchTerm: '1' })
        });

        if (!response.ok) {
          throw new Error('Fehler beim Laden der Daten');
        }

        const data = await response.json();
        const labels = data.map(item => item.partei_kurz);
        const values = data.map(item => item.anzahl);

        setCategories(labels);
        setChartData(values);
      } catch (error) {
        console.error('❌ Fehler beim Abrufen der Daten:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <BarChart
      xAxis={[
        {
          id: 'barCategories',
          data: categories,
          scaleType: 'band',
        },
      ]}
      series={[
        {
          data: chartData,
        },
      ]}
      width={500}
      height={300}
    />
  );
}
