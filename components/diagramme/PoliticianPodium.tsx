import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function PoliticianPodium({ queryType }) {
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
        case "SSW":                   return "#000088";
        case "Die PARTEI":            return "#5E2028";
        case "LKR":                   return "#FFA500";
        case "Plos":                  return "#808080";
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

  function getDomainForQuery(queryType) {
    if (queryType === "getEfficiencyTop5Person") {
      return [0.46, 0.55];
    } else if (queryType === "getEfficiencyWorst5Person") {
      return [0.17, 0.27];
    } else if (queryType === "getLongestRedenTop5Person") {
      return [100000, 250000];
    } else if (queryType === "getLongestRedenWorst5Person") {
      return [2500, 6500];    
    } else {
      return [0, 100];
    }
  }
  
  function getYAxisLabel(queryType) {
    if (
      queryType === "getLongestRedenTop5Person" ||
      queryType === "getLongestRedenWorst5Person"
    ) {
      return "Wörteranzahl";
    }
    return "Effizienz";
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
      <BarChart data={data} margin={{ top: 20, right: 20, left: 40, bottom: 20 }}>
        <defs>
          <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#444" floodOpacity="0.4" />
          </filter>
        </defs>

        <XAxis dataKey="name" 
          label= {{value: "Politiker", position: "insideBottom", offset: -15, 
            style:{fontWeight: "bold"} }} 
        />
        <YAxis label= {{value: getYAxisLabel(queryType), position: "insideLeft", dx: -20, dy: 40, angle: -90,
            style:{fontWeight: "bold"} }} 
            domain={getDomainForQuery(queryType)} 
            />
        <Tooltip formatter={(value, name, props) => {
          const party = props.payload?.[0]?.payload?.party || "Unbekannt"; 
          return [`${value} (Partei: ${party})`, "Effizienz"];}}
          />
        <Bar dataKey="value" fill={({ payload }) => payload.fill} radius={[8, 8, 0, 0]} style={{ filter: 'url(#shadow)' }} />
      </BarChart>
    </ResponsiveContainer>
  );
}
