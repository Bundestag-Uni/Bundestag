import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function PoliticianPodium({ queryType }) {
  const [data, setData] = useState([]);

  const getPartyColor = (party) => {

      switch (party) {
        case "AfD": return "#0489DB";
        case "BÜNDNIS 90/DIE GRÜNEN": return "#1AA037";
        case "DIE GRÜNEN/BÜNDNIS 90": return "#1AA037";
        case "CDU": return "#000000";
        case "SPD": return "#E3000F";
        case "FDP": return "#FFEF00";
        case "DIE LINKE.": return "#9a62a1";
        case "CSU": return "#000000";
        case "BSW": return "#ff00ff";
        default: return "#FFFFFF";
      }
  };


  function mapRowToChartItem(item) {
    let valueKey = "avg_efficiency";
    if (
      queryType === "getLongestRedenTop5Person" ||
      queryType === "getLongestRedenWorst5Person"
    ) {
      valueKey = "total_words";
    }

    return {
      name: `${item.vorname} ${item.nachname}`,
      value: item[valueKey],          
      party: item.partei_kurz,
      fill: getPartyColor(item.partei_kurz),
    };
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/pgapi", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ queryType }),
        });
        const result = await response.json();

        const formatted = result.map(mapRowToChartItem);
        setData(formatted);
      } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
        setData([]);
      }
    }

    fetchData();
  }, [queryType]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill={({ payload }) => payload.fill} />
      </BarChart>
    </ResponsiveContainer>
  );
}
