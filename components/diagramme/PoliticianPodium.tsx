import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import styles from "../../styles/Home.module.css";

export default function PoliticianPodium({ queryType }) {
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
      return [1080, 1550];
    } else if (queryType === "getLongestRedenWorst5Person") {
      return [198, 366];    
    } else {
      return [0, 100];
    }
  }
  
  function getYAxisLabel(queryType) {
    if (
      queryType === "getLongestRedenTop5Person" ||
      queryType === "getLongestRedenWorst5Person"
    ) {
      return "Avg Wörteranzahl";
    }
    return "Effizienz";
  }

  function CustomTick(props) {
    const { x, y, payload, textAnchor } = props;

    const fragments = payload.value.split(/[\s-]+/);
  
    return (
      <g transform={`translate(${x}, ${y + 10})`}>
        <text textAnchor={textAnchor || "middle"} fill="#666" fontSize="12px">
          {fragments.map((segment, index) => (
            <tspan x="0" dy={index === 0 ? 0 : 14} key={index}>
              {segment}
            </tspan>
          ))}
        </text>
      </g>
    );
  }

  function CustomTooltip({ active, payload, label }) {
    if (!active || !payload || !payload.length) {
      return null;
    }
  
    const { party, value } = payload[0].payload;
  
    return (
      <div style={{
        backgroundColor: "#fff",
        border: "1px solid #ccc",
        padding: "8px"
      }}>
        <p><strong>Name:</strong> {label}</p>
        <p><strong>Effizienz:</strong> {value}</p>
        <p><strong>Partei:</strong> {party}</p>
      </div>
    );
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

    fetchData();
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

        <XAxis dataKey="name" tick={<CustomTick />} interval={0}
          label= {{value: "Politiker", position: "insideBottom", offset: -20, 
            style:{fontWeight: "bold"} }} 
        />
        <YAxis label= {{value: getYAxisLabel(queryType), position: "insideLeft", dx: -20, dy: 40, angle: -90,
            style:{fontWeight: "bold"} }} 
            domain={getDomainForQuery(queryType)} 
            />
        <Tooltip content={<CustomTooltip />}
          />
        <Bar dataKey="value" fill={({ payload }) => payload.fill} radius={[8, 8, 0, 0]} style={{ filter: 'url(#shadow)' }} />
      </BarChart>
    </ResponsiveContainer>
  );
}
