import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function MyBarChart() {
  const [data, setData] = useState([]);

  const getPartyColor = (party) => {
    switch (party) {
      case 'AfD':                   return '#0489DB';
      case 'BÜNDNIS 90/DIE GRÜNEN': return '#1AA037';
      case 'CDU':                   return '#000000';
      case 'SPD':                   return '#E3000F';
      case 'FDP':                   return '#FFEF00';
      case 'DIE LINKE.':            return '#9a62a1';
      case 'CSU':                   return '#000000';
      case 'BSW':                   return '#ff00ff';
      default:                      return '#FFFFFF';
    }
  };

  async function fetchTop5EfficientPoliticians() {
    try {
      const response = await fetch("/api/pgapi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          queryType: "getEfficiencyTop5Person"
        }),
      });

      const data = await response.json();
      

      const formattedData = data.map(item => ({
        name: `${item.vorname} ${item.nachname}`,
        value: item.avg_efficiency,
        party: item.partei_kurz,  
        fill: getPartyColor(item.partei_kurz) 
      }));

      setData(formattedData);
    } catch (error) {
      console.error("Fehler beim Abrufen der Daten:", error);
      setData([]);
    }
  }

  useEffect(() => {
    fetchTop5EfficientPoliticians();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill={({payload}) => payload.fill} />
      </BarChart>
    </ResponsiveContainer>
  );
}
