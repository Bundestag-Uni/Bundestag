import React, { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// -----------------------------------
// CLIENT-SIDE IMPORT OF REACT-P5
// -----------------------------------
const Sketch = dynamic(() => import('react-p5'), { ssr: false });

// -----------------------------------
// 1) Datensatz
// -----------------------------------
let parteien = [
  ['AfD', 15000],
  ['BÜNDNIS 90/DIE GRÜNEN', 13888],
  ['CDU', 10000],
  ['SPD', 8888],
  ['FDP', 3400],
  ['DIE LINKE.', 2333],
  ['CSU', 590],
  ['BSW', 10]
];

// Canvas-Größe (Startwerte - aber wir verwenden später den Container)
const x_canvas = 600;
const y_canvas = 600;

// -----------------------------------
// 2) Farb- und Hilfsfunktionen
// -----------------------------------
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

function isDarkColor(hex) {
  let r = parseInt(hex.substring(1, 3), 16);
  let g = parseInt(hex.substring(3, 5), 16);
  let b = parseInt(hex.substring(5, 7), 16);
  let brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
}

// -----------------------------------
// 3) Diagramm-Layout
// -----------------------------------
const max_val = Math.max(...parteien.map(p => p[1]));

// Ränder
let topMargin = 80;
let bottomMargin = 60;
let barMargin = 12;
let leftAxisX = 80;

// Anfangsberechnung (falls man sie braucht, aber wir überschreiben sie)
let barAreaWidth = x_canvas - (leftAxisX + 40);

// Rechnet Parteiwert -> Balkenbreite
function mapSize(val) {
  return (barAreaWidth * val) / max_val;
}

// -----------------------------------
// 4) Balken-Klasse
// -----------------------------------
class Balken {
  constructor(finalWidth, index, color, name, amount, p5) {
    this.finalWidth = finalWidth;
    this.currentWidth = 0;
    this.index = index;
    this.color = color;
    this.name = name;
    this.amount = amount;
    this.p5 = p5;
  }

  drawBar() {
    let p5 = this.p5;
    const totalBars = parteien.length;
    // Wir berechnen die slotHeight anhand des aktuellen Canvas
    const slotHeight = (p5.height - topMargin - bottomMargin) / totalBars;
    const yPos = topMargin + this.index * slotHeight + barMargin / 2;
    const barHeight = slotHeight - barMargin;

    // Animiertes "Wachsen"
    this.currentWidth = p5.lerp(this.currentWidth, this.finalWidth, 0.1);

    // Schatten
    p5.push();
    p5.drawingContext.shadowOffsetX = 3;
    p5.drawingContext.shadowOffsetY = 3;
    p5.drawingContext.shadowBlur = 5;
    p5.drawingContext.shadowColor = 'rgba(0, 0, 0, 0.2)';

    // Balken
    p5.fill(this.color);
    p5.noStroke();
    // Nur rechts abgerundet
    p5.rect(leftAxisX, yPos, this.currentWidth, barHeight, 0, 10, 10, 0);
    p5.pop();

    // --------------------------
    // Beschriftungen: "Name" & "Wert"
    // --------------------------
    let txtColor = isDarkColor(this.color) ? '#FFFFFF' : '#000000';
    p5.textSize(14);

    let valText = this.amount.toString();
    let nameText = this.name;
    let valWidth = p5.textWidth(valText);
    let nameWidth = p5.textWidth(nameText);

    // Prüfe, ob wir genug Platz haben, Name + Wert drin unterzubringen
    let totalInsideWidthNeeded = valWidth + nameWidth + 30;

    if (this.currentWidth > totalInsideWidthNeeded) {
      // -> Beides drin
      p5.fill(txtColor);
      p5.textAlign(p5.LEFT, p5.CENTER);
      p5.text(nameText, leftAxisX + 8, yPos + barHeight / 2);

      p5.textAlign(p5.RIGHT, p5.CENTER);
      p5.text(valText, leftAxisX + this.currentWidth - 8, yPos + barHeight / 2);

    } else if (this.currentWidth > valWidth + 20) {
      // -> Nur Wert rein, Name außen
      p5.fill(txtColor);
      p5.textAlign(p5.RIGHT, p5.CENTER);
      p5.text(valText, leftAxisX + this.currentWidth - 8, yPos + barHeight / 2);

      placeNameOutside(p5, nameText, nameWidth, leftAxisX, this.currentWidth, yPos, barHeight);

    } else {
      // -> Beide draußen
      placeValueOutside(p5, valText, valWidth, leftAxisX, this.currentWidth, yPos, barHeight);
      placeNameOutside(p5, nameText, nameWidth, leftAxisX, this.currentWidth, yPos, barHeight, valWidth + 6);
    }
  }
}

// -----------------------------------
// 5) Hilfsfunktionen für Outside-Platzierung
// -----------------------------------
function placeValueOutside(
  p5,
  valText,
  valWidth,
  leftAxisX,
  currentWidth,
  yPos,
  barHeight
) {
  p5.fill('#111');
  p5.textAlign(p5.LEFT, p5.CENTER);

  let xPos = leftAxisX + currentWidth + 6;
  let maxRight = p5.width - 10;
  if (xPos + valWidth > maxRight) {
    xPos = maxRight - valWidth;
  }
  p5.text(valText, xPos, yPos + barHeight / 2);
}

function placeNameOutside(
  p5,
  nameText,
  nameWidth,
  leftAxisX,
  currentWidth,
  yPos,
  barHeight,
  extraXOffset = 6
) {
  p5.fill('#111');
  p5.textAlign(p5.LEFT, p5.CENTER);

  let xPos = leftAxisX + currentWidth + extraXOffset;
  let maxRight = p5.width - 10;
  if (xPos + nameWidth > maxRight) {
    xPos = maxRight - nameWidth;
  }

  let minX = leftAxisX + currentWidth + 2;
  if (xPos < minX) {
    xPos = minX;
  }
  p5.text(nameText, xPos, yPos + barHeight / 2);
}

// -----------------------------------
// 6) React-Komponente mit flexibler Größe
// -----------------------------------
function P5BalkenDiagramm() {
  // Hier speichern wir die Balken ab
  let balkenArray = [];

  // 6a) Ref auf das umgebende DIV + State für gemessene Maße
  const containerRef = useRef(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });

  useEffect(() => {
    // Messen des Eltern-Divs (nur einmal, falls erwünscht)
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      setDims({ w: clientWidth, h: clientHeight });
    }

    // Willst du echtes, dynamisches Resizing, dann:
    // function handleResize() {
    //   if (containerRef.current) {
    //     setDims({
    //       w: containerRef.current.clientWidth,
    //       h: containerRef.current.clientHeight
    //     });
    //   }
    // }
    // window.addEventListener("resize", handleResize);
    // return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 6b) setup und draw für p5
  const setup = (p5, canvasParentRef) => {
    // Falls wir (noch) 0 haben, nimm fallback 600×600
    const w = dims.w || x_canvas;
    const h = dims.h || y_canvas;

    p5.createCanvas(w, h).parent(canvasParentRef);

    // Rechne die barAreaWidth neu
    barAreaWidth = p5.width - (leftAxisX + 40);

    // Balken-Objekte
    for (let i = 0; i < parteien.length; i++) {
      const [partyName, val] = parteien[i];
      const color = partei_to_color(partyName);
      let finalW = mapSize(val);

      balkenArray.push(
        new Balken(finalW, i, color, partyName, val, p5)
      );
    }
  };

  const draw = (p5) => {
    // (Optionally check if dims changed -> p5.resizeCanvas(...) for real-time resizing)
    p5.clear();
    p5.noStroke();

    // Balken
    for (let i = 0; i < balkenArray.length; i++) {
      balkenArray[i].drawBar();
    }

    // Linke Achse
    p5.stroke(0);
    p5.line(
      leftAxisX,
      topMargin - 10,
      leftAxisX,
      p5.height - bottomMargin + 10
    );

    // (Optional) X-Achsen-Beschriftung
    // p5.noStroke();
    // p5.fill('#666');
    // p5.textSize(14);
    // p5.textAlign(p5.CENTER, p5.CENTER);
    // p5.text(`Anzahl Mitglieder (max. ${max_val})`, p5.width / 2, p5.height - bottomMargin / 3);
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%', // oder 100%, wenn das Parent einen fixen Wert hat
        position: 'relative'
      }}
    >
      {/* Nur anzeigen, wenn wir gemessene Maße haben */}
      {dims.w > 0 && dims.h > 0 && (
        <Sketch setup={setup} draw={draw} />
      )}
    </div>
  );
}

export default P5BalkenDiagramm;
