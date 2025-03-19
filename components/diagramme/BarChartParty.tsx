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
      case "SSW":                   return "#000088";
      case "Die PARTEI":            return "#5E2028";
      case "LKR":                   return "#FFA500";
      case "Plos":                  return "#808080";
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

  function getDomainForQuery(queryType) {
    if (queryType === "getBestPartysEfficiency") {
      return [0.3, 0.4];
    } else if (queryType === "getBestPartysRedelenght") {
      return [480, 710];    
    } else {
      return [0, 100];
    }
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
      <BarChart data={data} margin={{ top: 20, right: 20, left: 40, bottom: 20 }}>
      <defs>
          <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#444" floodOpacity="0.4" />
          </filter>
        </defs>

        <XAxis dataKey="name" 
          label= {{value: "Partei", position: "insideBottom", offset: -15, 
            style:{fontWeight: "bold"} }}/>
        <YAxis label= {{value: "Effizienz", position: "insideLeft", dx: -20, dy: 40, angle: -90,
            style:{fontWeight: "bold"} }}
            domain={getDomainForQuery(queryType)} />
        <Tooltip formatter={(value, name, props) => {
          const party = props.payload?.[0]?.payload?.party || "Unbekannt"; 
          return [`${value} (Partei: ${party})`, "Effizienz"];}}/>
        <Bar dataKey="value" fill={({ payload }) => payload.fill} radius={[8, 8, 0, 0]} style={{ filter: 'url(#shadow)' }} />
      </BarChart>
    </ResponsiveContainer>
  );
}
