import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import styles from "../../styles/Home.module.css";

export default function BarChartParty({ queryType }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  function CustomTooltip({ active, payload, label }) {
    if (!active || !payload || !payload.length) {
      return null;
    }
  
    const { value } = payload[0].payload;
  
    return (
      <div style={{
        backgroundColor: "#fff",
        border: "1px solid #ccc",
        padding: "8px"
      }}>
        <p><strong>Name:</strong> {label}</p>
        <p><strong>Effizienz:</strong> {value}</p>
      </div>
    );
  }
  
  function getYAxisLabel(queryType) {
    if (
      queryType === "getBestPartysRedelenght" 
    ) {
      return "Avg Wörteranzahl";
    }
    return "Effizienz";
  }

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/pgapi", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ queryType }),
        });
        const result = await response.json();

        const formatted = result.map(mapRowToChartItem);
        setData(formatted);
      } catch (error) {
        console.error("Fehler beim Abrufen:", error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    }

    if (queryType) {
      console.log("Lade Partei‐Daten für queryType:", queryType);
      fetchData();
    }
  }, [queryType]);

  if (isLoading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.loadingCircle}></div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 20, right: 20, left: 40, bottom: 20 }}>
      <defs>
          <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#444" floodOpacity="0.4" />
          </filter>
        </defs>

        <XAxis dataKey="name" 
          label= {{value: "Partei", position: "insideBottom", offset: -15, 
            style:{fontWeight: "bold"} }}/>
        <YAxis label= {{value: getYAxisLabel(queryType), position: "insideLeft", dx: -20, dy: 40, angle: -90,
            style:{fontWeight: "bold"} }}
            domain={getDomainForQuery(queryType)} />
        <Tooltip content={<CustomTooltip/>} />
        <Bar dataKey="value" fill={({ payload }) => payload.fill} radius={[8, 8, 0, 0]} style={{ filter: 'url(#shadow)' }} />
      </BarChart>
    </ResponsiveContainer>
  );
}
