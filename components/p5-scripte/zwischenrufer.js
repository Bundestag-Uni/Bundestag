import React, { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const Sketch = dynamic(() => import('react-p5'), {
  ssr: false
});

function P5Sketch() {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });

  useEffect(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      setDimensions({ w: clientWidth, h: clientHeight });
    }
  }, []);

  // -------------------------------------------------
  // 1) Datensätze
  // -------------------------------------------------
let rufer = [
    ["Stephan","Brandner","AfD",6315],
    ["Oliver","Krischer","BÜNDNIS 90/DIE GRÜNEN",2526],
    ["Beatrix","Storch","AfD",2724],
    ["Bernd","Baumann","AfD",2221],
    ["Jens","Spahn","CDU",2157],
    ["Marianne","Schieder","SPD",2092],
    ["Steffi","Lemke","BÜNDNIS 90/DIE GRÜNEN",2056],
    ["Thorsten","Frei","CDU",1904],
    ["Ulli","Nissen","SPD",1830],
    ["Kai","Gehring","BÜNDNIS 90/DIE GRÜNEN",1805],
    ["Konstantin","Notz","BÜNDNIS 90/DIE GRÜNEN",1797],
    ["Volker","Kauder","CDU",1682],
    ["Karsten","Hilse","AfD",1541],
    ["Timon","Gremmels","SPD",1473],
    ["Martin","Reichardt","AfD",1399],
    ["Enrico","Komning","AfD",1345],
    ["Otto","Fricke","FDP",1328],
    ["Harald","Ebner","BÜNDNIS 90/DIE GRÜNEN",1279],
    ["Konstantin","Kuhle","FDP",1198],
    ["Michael","Brand","CDU",1195],
    ["Patrick","Schnieder","CDU",1174],
    ["Alexander","Gauland","AfD",1170],
    ["Johannes","Fechner","SPD",1106],
    ["Alexander","Dobrindt","CSU",1099],
    ["Franziska","Brantner","BÜNDNIS 90/DIE GRÜNEN",1089],
    ["Sebastian","Brehm","CSU",992],
    ["Andrea","Lindholz","CSU",985],
    ["Alice","Weidel","AfD",983],
    ["Tino","Sorge","CDU",960],
    ["Rainer","Kraft","AfD",952],
    ["Johannes","Kahrs","SPD",952],
    ["Jan","Korte","DIE LINKE.",928],
    ["Lamya","Kaddor","BÜNDNIS 90/DIE GRÜNEN",856],
    ["Markus","Kurth","BÜNDNIS 90/DIE GRÜNEN",848],
    ["Irene","Mihalic","BÜNDNIS 90/DIE GRÜNEN",843],
    ["Anton","Hofreiter","BÜNDNIS 90/DIE GRÜNEN",837],
    ["Friedrich","Merz","CDU",829],
    ["Thomas","Jarzombek","CDU",820],
    ["Anja","Weisgerber","CSU",817],
    ["Matthias","Gastel","BÜNDNIS 90/DIE GRÜNEN",790],
    ["Alexander","Ulrich","BSW",789],
    ["Volker","Beck","BÜNDNIS 90/DIE GRÜNEN",768],
    ["Gabriele","Katzmarek","SPD",760],
    ["Petra","Sitte","DIE LINKE.",751],
    ["Carsten","Schneider","SPD",743],
    ["Alexander","Hoffmann","CSU",740],
    ["Filiz","Polat","BÜNDNIS 90/DIE GRÜNEN",740],
    ["Katja","Keul","BÜNDNIS 90/DIE GRÜNEN",722],
    ["Kai","Whittaker","CDU",685],
    ["Nina","Warken","CDU",675],
    ["Matthias","Zimmer","CDU",674],
    ["Lisa","Badum","BÜNDNIS 90/DIE GRÜNEN",669],
    ["Matthias","Hauer","CDU",667],
    ["Niema","Movassat","DIE LINKE.",653],
    ["Helin Evrim","Sommer","DIE LINKE.",651],
    ["Klaus","Ernst","BSW",651],
    ["Ulle","Schauws","BÜNDNIS 90/DIE GRÜNEN",643],
    ["Henning","Otte","CDU",622],
    ["Stephan","Stracke","CSU",620],
    ["Michael","Theurer","FDP",579],
    ["Kirsten","Tackmann","DIE LINKE.",574],
    ["Till","Steffen","BÜNDNIS 90/DIE GRÜNEN",574],
    ["Philipp","Amthor","CDU",573],
    ["Kay","Gottschalk","AfD",572],
    ["Marco","Buschmann","FDP",572],
    ["Claudia","Roth","BÜNDNIS 90/DIE GRÜNEN",566],
    ["Canan","Bayram","BÜNDNIS 90/DIE GRÜNEN",547],
    ["Julia","Verlinden","BÜNDNIS 90/DIE GRÜNEN",533],
    ["Mechthild","Rawert","SPD",520],
    ["Tankred","Schipanski","CDU",514],
    ["Hubertus","Heil","SPD",511],
    ["Annalena","Baerbock","BÜNDNIS 90/DIE GRÜNEN",509],
    ["Florian","Hahn","CSU",504],
    ["Marc","Bernhard","AfD",491],
    ["Gero Clemens","Hocker","FDP",489],
    ["Stefan","Schmidt","BÜNDNIS 90/DIE GRÜNEN",486],
    ["Peter","Beyer","CDU",484],
    ["Andreas","Mattfeldt","CDU",482],
    ["Katja","Mast","SPD",479],
    ["Wolfgang","Gehrcke","DIE LINKE.",478],
    ["Ralph","Brinkhaus","CDU",474],
    ["Kathrin","Vogler","DIE LINKE.",471],
    ["Michael","Donth","CDU",470],
    ["Michael","Schrodi","SPD",470],
    ["Dietmar","Bartsch","DIE LINKE.",463],
    ["Tino","Chrupalla","AfD",462],
    ["Peter","Boehringer","AfD",455],
    ["Alexander","Throm","CDU",451],
    ["Beatrix","Chilian","BSW","450"],
    ["Albert","Stegemann","CDU",447],
    ["Volker","Ullrich","CSU",446],
    ["Karamba","Diaby","SPD",440],
    ["Bernhard","Herrmann","BÜNDNIS 90/DIE GRÜNEN",436],
    ["Dagmar","Ziegler","SPD",432],
    ["Hendrik","Hoppenstedt","CDU",423],
    ["Albert","Rupprecht","CSU",416],
    ["Anja","Hajduk","BÜNDNIS 90/DIE GRÜNEN",406],
    ["Maximilian","Mordhorst","FDP",399],
    ["Jens","Zimmermann","SPD",399]
    ];

  // -------------------------------------------------
  // Hilfsfunktionen
  // -------------------------------------------------
  function partei_to_color(partei) {
    switch (partei) {
      case 'AfD': return '#0489DB';
      case 'BÜNDNIS 90/DIE GRÜNEN': return '#1AA037';
      case 'CDU': return '#000000';
      case 'SPD': return '#E3000F';
      case 'FDP': return '#FFEF00';
      case 'DIE LINKE.': return '#9a62a1';
      case 'CSU': return '#000000';
      case 'BSW': return '#ff00ff';
      default: return '#FFFFFF';
    }
  }

  // Skalierung des Kreisradius entsprechend max. Wert
  function fix_data(data_set, p5) {
    const max_val = Math.max(...data_set.map(d => d[3])); 
    // max_size hier nicht zu groß wählen, damit genug Platz bleibt
    const max_size = p5.height / 3; 
    return data_set.map(x => {
      const faktor = (x[3] / max_val) * max_size;
      return [x[0], x[1], x[2], x[3], faktor];
    });
  }

  function isDarkColor(hex) {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);
    let brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
  }

  // -------------------------------------------------
  // Ball-Klasse mit Velocity und "Gravitations"-Physik
  // -------------------------------------------------
  class Ball {
    constructor(vorname, nachname, partei, anzahl, size, color, p5, pinned = false) {
      this.vorname = vorname;
      this.nachname = nachname;
      this.partei = partei;
      this.anzahl = anzahl;
      this.size = size;
      this.color = color;

      this.hovered = false;
      this.pinned = pinned;

      // Startposition nahe der Mitte
      this.x = p5.width / 2 + p5.random(-10, 10);
      this.y = p5.height / 2 + p5.random(-10, 10);

      // Velocity für "Gravitations"-Bewegung
      this.vx = 0;
      this.vy = 0;
    }

    // Distanz und Überlappungscheck
    isOverlapping(other) {
      let dx = this.x - other.x;
      let dy = this.y - other.y;
      let distSq = dx * dx + dy * dy;
      let minDist = (this.size / 2 + other.size / 2);
      return distSq < minDist * minDist;
    }

    // Auflösung bei Überlappung
    resolveOverlap(other) {
      if (this.pinned && other.pinned) return; 
      
      let dx = this.x - other.x;
      let dy = this.y - other.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist === 0) {
        dx = 1;
        dy = 1;
        dist = Math.sqrt(2);
      }
      let minDist = (this.size / 2 + other.size / 2);
      let overlap = minDist - dist;
      if (overlap > 0) {
        // Normalisieren
        dx /= dist;
        dy /= dist;

        // Zum Auflösen der Überlappung
        if (this.pinned) {
          // nur other verschieben
          other.x -= dx * overlap; 
          other.y -= dy * overlap;
        } else if (other.pinned) {
          // nur this verschieben
          this.x += dx * overlap;
          this.y += dy * overlap;
        } else {
          // beide verschieben
          this.x += dx * (overlap * 0.5);
          this.y += dy * (overlap * 0.5);
          other.x -= dx * (overlap * 0.5);
          other.y -= dy * (overlap * 0.5);
        }
      }
    }

    // Maus-Over-Check
    checkHover(p5) {
      let d = p5.dist(p5.mouseX, p5.mouseY, this.x, this.y);
      this.hovered = d < this.size / 2;
    }

    // Zeichnen
    draw(p5) {
      p5.noStroke();
      p5.fill(this.color);
      p5.ellipse(this.x, this.y, this.size, this.size);

      let textColor = isDarkColor(this.color) ? '#FFFFFF' : '#000000';
      p5.fill(textColor);
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.textSize(this.size / 8);
      p5.text(this.vorname, this.x, this.y - this.size / 10);
      p5.text(this.nachname, this.x, this.y + this.size / 10);
    }

    // Tooltip
    showPopup(p5) {
      let popupWidth = 200;
      let popupHeight = 70;
      let popupX = p5.mouseX + 10;
      let popupY = p5.mouseY - 10;

      // Begrenzungen
      if (popupX + popupWidth > p5.width) {
        popupX = p5.mouseX - popupWidth - 10;
      }
      if (popupY + popupHeight > p5.height) {
        popupY = p5.height - popupHeight - 10;
      }
      if (popupY < 0) {
        popupY = 10;
      }

      p5.fill(50, 50, 50, 200);
      p5.rect(popupX, popupY, popupWidth, popupHeight, 5);

      p5.fill('#FFFFFF');
      p5.textSize(12);
      p5.textAlign(p5.LEFT, p5.TOP);
      p5.text(`Name: ${this.vorname} ${this.nachname}`, popupX + 10, popupY + 5);
      p5.text(`Partei: ${this.partei}`, popupX + 10, popupY + 25);
      p5.text(`Anzahl: ${this.anzahl}`, popupX + 10, popupY + 45);
    }

    // Gravitations-Kraft in Richtung Zentrum
    applyGravity(centerX, centerY) {
      if (this.pinned) return;

      let dx = centerX - this.x;
      let dy = centerY - this.y;
      let distSq = dx * dx + dy * dy;
      if (distSq === 0) return;

      // Für etwas Stabilität: sqrt einmal berechnen
      let dist = Math.sqrt(distSq);

      // Stärkere Anziehung für größere Bälle (z.B. factor = 0.0005 * size)
      let force = 0.0005 * this.size; 
      // Kraft geteilt durch distance (einfachere "1/r" Gravitation)
      let fx = force * (dx / dist);
      let fy = force * (dy / dist);

      this.vx += fx;
      this.vy += fy;
    }

    // Bewegung & Dämpfung
    updatePosition() {
      if (this.pinned) return;

      // Leichte Dämpfung
      this.vx *= 0.95;
      this.vy *= 0.95;

      this.x += this.vx;
      this.y += this.vy;
    }
  }

  // -------------------------------------------------
  // Globale Variablen
  // -------------------------------------------------
  let balls = [];
  let hoveredBall = null;

  // -------------------------------------------------
  // Setup
  // -------------------------------------------------
  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(dimensions.w, dimensions.h).parent(canvasParentRef);

    // Daten anpassen & sortieren (größte zuerst)
    rufer = fix_data(rufer, p5);
    rufer.sort((a, b) => b[3] - a[3]);

    // Bälle erstellen
    rufer.forEach((item, i) => {
      const [vorname, nachname, partei, anzahl, size] = item;
      const color = partei_to_color(partei);

      // Nur den größten Ball "pinnen" (optional)
      const pinned = i === 0;
      balls.push(new Ball(vorname, nachname, partei, anzahl, size, color, p5, pinned));
    });
  };

  // -------------------------------------------------
  // Draw
  // -------------------------------------------------
  const draw = (p5) => {
    p5.clear();
    hoveredBall = null;

    // 1) Hover check
    for (let ball of balls) {
      ball.checkHover(p5);
      if (ball.hovered) hoveredBall = ball;
    }

    // 2) Gravitation zum Mittelpunkt
    let cx = p5.width / 2;
    let cy = p5.height / 2;
    for (let ball of balls) {
      ball.applyGravity(cx, cy);
    }

    // 3) Positionen updaten (inkl. Dämpfung)
    for (let ball of balls) {
      ball.updatePosition();
    }

    // 4) Überlappungen beheben (1–2 Durchläufe pro Frame)
    let passes = 2;
    while (passes-- > 0) {
      for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
          if (balls[i].isOverlapping(balls[j])) {
            balls[i].resolveOverlap(balls[j]);
          }
        }
      }
    }

    // 5) Zeichnen
    for (let ball of balls) {
      ball.draw(p5);
    }

    // 6) Popup
    if (hoveredBall) {
      hoveredBall.showPopup(p5);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative'
      }}
    >
      {dimensions.w > 0 && dimensions.h > 0 && (
        <Sketch setup={setup} draw={draw} />
      )}
    </div>
  );
}

export default P5Sketch;
