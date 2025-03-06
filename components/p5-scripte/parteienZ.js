import React, { useRef, useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';

// Dynamischer Import von react-p5
const Sketch = dynamic(() => import('react-p5'), { ssr: false });

function P5Sketch() {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });
  const [rufer, setRufer] = useState([]);

  // Hier speichern wir nachher unsere fertigen Balken-Objekte
  const balkenRef = useRef([]);

  // 1) Größe des umgebenden <div> messen
  useEffect(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      setDimensions({ w: clientWidth, h: clientHeight });
    }
  }, []);

  // 2) Daten laden und sortieren
  useEffect(() => {
    async function fetchRufer() {
      const data = await get_rufer();
      // Sortieren nach anzahl absteigend
      data.sort((a, b) => b[1] - a[1]);
      setRufer(data);
    }
    if (dimensions.w > 0 && dimensions.h > 0) {
      fetchRufer();
    }
  }, [dimensions]);

  // 3) API-Aufruf: liefert [ [partei_kurz, anzahl], ... ]
  async function get_rufer() {
    try {
      const response = await fetch('/api/pgapi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queryType: 'getMostRudeParty' })
      });
      if (!response.ok) throw new Error('Failed to fetch data');

      const data = await response.json();
      // data[i] = { partei_kurz: 'CDU', anzahl: 1234 } oder ähnlich
      // Mappe auf [partei, anzahl]
      return data.map(d => [d.partei_kurz, d.anzahl]);
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      return [];
    }
  }

  // 4) Farbzuweisung nach Partei
  function partei_to_color(partei) {
    switch (partei) {
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
  }

  // Hilfsfunktion Helligkeitscheck
  function isDarkColor(hex) {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
  }

  // Hilfsfunktionen für Outside-Platzierung (Text)
  function placeValueOutside(p5, valText, valWidth, leftAxisX, currentWidth, yPos, barHeight) {
    p5.fill('#111');
    p5.textAlign(p5.LEFT, p5.CENTER);

    let xPos = leftAxisX + currentWidth + 6;
    const maxRight = p5.width - 10;
    if (xPos + valWidth > maxRight) {
      xPos = maxRight - valWidth;
    }
    p5.text(valText, xPos, yPos + barHeight / 2);
  }
  function placeNameOutside(p5, nameText, nameWidth, leftAxisX, currentWidth, yPos, barHeight, extraXOffset = 6) {
    p5.fill('#111');
    p5.textAlign(p5.LEFT, p5.CENTER);

    let xPos = leftAxisX + currentWidth + extraXOffset;
    const maxRight = p5.width - 10;
    if (xPos + nameWidth > maxRight) {
      xPos = maxRight - nameWidth;
    }

    let minX = leftAxisX + currentWidth + 2;
    if (xPos < minX) {
      xPos = minX;
    }
    p5.text(nameText, xPos, yPos + barHeight / 2);
  }

  // 5) Balken-Klasse
  class Balken {
    constructor(finalWidth, index, color, partyName, amount) {
      this.finalWidth = finalWidth; 
      this.currentWidth = 0;       
      this.index = index;
      this.color = color;
      this.name = partyName;   // z.B. "CDU"
      this.amount = amount;    // z.B. 1234
    }

    drawBar(totalBars, p5, slotHeight, topMargin, barMargin, barHeight, leftAxisX) {
      // Animiertes Wachsen
      this.currentWidth = p5.lerp(this.currentWidth, this.finalWidth, 0.1);
      const yPos = topMargin + this.index * slotHeight + barMargin / 2;

      // Schatten
      p5.push();
      p5.drawingContext.shadowOffsetX = 3;
      p5.drawingContext.shadowOffsetY = 3;
      p5.drawingContext.shadowBlur = 5;
      p5.drawingContext.shadowColor = 'rgba(0, 0, 0, 0.2)';

      // Balken
      p5.fill(this.color);
      p5.noStroke();
      p5.rect(leftAxisX, yPos, this.currentWidth, barHeight, 0, 10, 10, 0);
      p5.pop();

      // Text
      const txtColor = isDarkColor(this.color) ? '#FFFFFF' : '#000000';
      p5.textSize(14);

      let valText = String(this.amount);
      let nameText = this.name;

      let valWidth = p5.textWidth(valText);
      let nameWidth = p5.textWidth(nameText);

      // Passt beides in den Balken rein?
      let totalInsideWidthNeeded = valWidth + nameWidth + 30;

      if (this.currentWidth > totalInsideWidthNeeded) {
        // Name + Wert *im* Balken
        p5.fill(txtColor);
        p5.textAlign(p5.LEFT, p5.CENTER);
        p5.text(nameText, leftAxisX + 8, yPos + barHeight / 2);

        p5.textAlign(p5.RIGHT, p5.CENTER);
        p5.text(valText, leftAxisX + this.currentWidth - 8, yPos + barHeight / 2);

      } else if (this.currentWidth > valWidth + 20) {
        // Nur Wert im Balken, Partei-Name draußen
        p5.fill(txtColor);
        p5.textAlign(p5.RIGHT, p5.CENTER);
        p5.text(valText, leftAxisX + this.currentWidth - 8, yPos + barHeight / 2);

        placeNameOutside(p5, nameText, nameWidth, leftAxisX, this.currentWidth, yPos, barHeight);

      } else {
        // Wert + Partei draußen
        placeValueOutside(p5, valText, valWidth, leftAxisX, this.currentWidth, yPos, barHeight);
        placeNameOutside(p5, nameText, nameWidth, leftAxisX, this.currentWidth, yPos, barHeight, valWidth + 12);
      }
    }
  }

  // 6) Erzeuge die Balken *einmal*, sobald rufer und dimensions verfügbar sind
  useEffect(() => {
    if (rufer.length === 0 || dimensions.w === 0 || dimensions.h === 0) {
      // Nichts zu tun
      return;
    }

    // Breite/Höhe
    const p5width = dimensions.w;
    const p5height = dimensions.h;

    // Layout
    const topMargin = 80;
    const bottomMargin = 60;
    const leftAxisX = 80;
    const rightMargin = 40;
    const barMargin = 12;
    const barAreaWidth = p5width - (leftAxisX + rightMargin);

    // Größter Wert
    const maxVal = Math.max(...rufer.map(r => r[1]));
    // Mapping-Funktion
    const mapSize = (val) => (barAreaWidth * val) / maxVal;

    // Platz pro Balken
    const totalBars = rufer.length;
    const slotHeight = (p5height - topMargin - bottomMargin) / totalBars;
    const barHeight = slotHeight - barMargin;

    // Hier erstellen wir alle Balken
    const newBalkenArray = rufer.map(([partei, anzahl], i) => {
      const color = partei_to_color(partei);
      const finalW = mapSize(anzahl);
      return new Balken(finalW, i, color, partei, anzahl);
    });

    // Und speichern sie ins Ref
    balkenRef.current = newBalkenArray;

  }, [rufer, dimensions]);

  // 7) Setup-Funktion
  const setup = useCallback((p5, canvasParentRef) => {
    const w = dimensions.w || 600;
    const h = dimensions.h || 600;
    p5.createCanvas(w, h).parent(canvasParentRef);
  }, [dimensions]);

  // 8) Draw-Funktion
  const draw = useCallback((p5) => {
    p5.clear();
    p5.noStroke();

    // Nur zeichnen, wenn Balken da
    if (!balkenRef.current || balkenRef.current.length === 0) return;

    // Margins/Layouts nochmal hier definieren
    const topMargin = 80;
    const bottomMargin = 60;
    const leftAxisX = 80;
    const rightMargin = 40;
    const barMargin = 12;

    // Platz pro Balken
    const totalBars = balkenRef.current.length;
    const slotHeight = (p5.height - topMargin - bottomMargin) / totalBars;
    const barHeight = slotHeight - barMargin;

    // Balken zeichnen
    balkenRef.current.forEach(balken => {
      balken.drawBar(totalBars, p5, slotHeight, topMargin, barMargin, barHeight, leftAxisX);
    });

    // Achse zeichnen
    p5.stroke(0);
    p5.line(
      leftAxisX,
      topMargin - 10,
      leftAxisX,
      p5.height - bottomMargin + 10
    );
  }, []);

  // 9) Render
  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', position: 'relative' }}
    >
      {dimensions.w > 0 && dimensions.h > 0 && (
        <Sketch setup={setup} draw={draw} />
      )}
    </div>
  );
}

export default P5Sketch;
