import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function BarChartParty({ queryType }) {
  const [data, setData] = useState([]);

  const getPartyColor = (party) => {
    switch (party) {
      case "AfD":                   return "#0489DB";
      case "BÜNDNIS 90/DIE GRÜNEN": return "#1AA037";
      case "DIE GRÜNEN/BÜNDNIS 90": return "#1AA037";
      case "CDU":                   return "#000000";
      case "SPD":                   return "#E3000F";
      case "FDP":                   return "#FFEF00";
      case "DIE LINKE.":            return "#9a62a1";
      case "CSU":                   return "#000000";
      case "BSW":                   return "#ff00ff";
      case "DSU":                   return "#0E4243";
      default:                      return "#FFFFFF";
    }
  };

  function mapRowToChartItem(item) {
    let valueKey = "anzahl"; 

    if (queryType === "getBestPartysEfficiency") {
      valueKey = "avg_efficiency";
    } else if (queryType === "getBestPartysRedelenght") {
      valueKey = "total_words";
    }
  
    return {
      name: item.partei_kurz,
      value: item[valueKey],
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

        const formattedData = result.map(mapRowToChartItem);
        setData(formattedData);
      } catch (error) {
        console.error("Fehler beim Laden:", error);
        setData([]);
      }
    }

    if (queryType) {
      console.log("Lade Partei‐Daten für queryType:", queryType);
      fetchData();
    }
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
