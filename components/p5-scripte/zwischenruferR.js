import React, { useRef, useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';

const Sketch = dynamic(() => import('react-p5'), { ssr: false });

function P5Sketch() {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });
  const [rufer, setRufer] = useState([]);
  const ballsRef = useRef([]);
  const [hoveredBall, setHoveredBall] = useState(null);

  useEffect(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      setDimensions({ w: clientWidth, h: clientHeight });
    }
  }, []);

  useEffect(() => {
    async function fetchRufer() {
      const data = await get_rufer();
      if (data.length > 0) {
        const fixedData = fix_data(data, dimensions);
        fixedData.sort((a, b) => b[3] - a[3]);
        setRufer(fixedData);
      }
    }
    if (dimensions.w > 0 && dimensions.h > 0) {
      fetchRufer();
    }
  }, [dimensions]);

  async function get_rufer() {
    try {
      const response = await fetch('/api/pgapi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queryType: 'getMostInterruptedIndividuals' })
      });
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      return data.map(d => [d.vorname, d.nachname, d.partei_kurz, d.anzahl]);
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      return [];
    }
  }

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

  function fix_data(data_set, dimensions) {
    if (!dimensions.w || !dimensions.h) return [];

    const canvasArea = dimensions.w * dimensions.h;
    const desiredTotalArea = canvasArea;

    // Berechne die Summe der Quadrate der ursprünglichen Radien
    const sumOfSquares = data_set.reduce((sum, d) => sum + Math.pow(d[3], 2), 0);

    // Berechne den Skalierungsfaktor
    const scalingFactor = Math.sqrt(desiredTotalArea / (Math.PI * sumOfSquares));

    // Skaliere jeden Kreis
    return data_set.map(d => {
      const scaledRadius = d[3] * scalingFactor;
      return [d[0], d[1], d[2], d[3], scaledRadius];
    });
  }

  function isDarkColor(hex) {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);
    let brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
  }

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
      // Kraft geteilt durch distance (einfachere "1/r" Gravitation
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

  const setup = useCallback((p5, canvasParentRef) => {
    p5.createCanvas(dimensions.w, dimensions.h).parent(canvasParentRef);

    if (rufer.length > 0) {
      ballsRef.current = rufer.map((item, i) => {
        const [vorname, nachname, partei, anzahl, size] = item;
        const color = partei_to_color(partei);
        const pinned = i === 0;
        return new Ball(vorname, nachname, partei, anzahl, size, color, p5, pinned);
      });
    }
  }, [rufer, dimensions]);

  const draw = useCallback((p5) => {
    p5.clear();
    setHoveredBall(null);

    // Überprüfe Hover-Zustände
    ballsRef.current.forEach(ball => ball.checkHover(p5));
    const hovered = ballsRef.current.find(ball => ball.hovered);
    if (hovered) {
      setHoveredBall(hovered);
    }

    let cx = p5.width / 2;
    let cy = p5.height / 2;
    ballsRef.current.forEach(ball => ball.applyGravity(cx, cy));

    ballsRef.current.forEach(ball => ball.updatePosition());

    let passes = 2;
    while (passes-- > 0) {
      for (let i = 0; i < ballsRef.current.length; i++) {
        for (let j = i + 1; j < ballsRef.current.length; j++) {
          if (ballsRef.current[i].isOverlapping(ballsRef.current[j])) {
            ballsRef.current[i].resolveOverlap(ballsRef.current[j]);
          }
        }
      }
    }

    ballsRef.current.forEach(ball => ball.draw(p5));

    if (hoveredBall) {
      hoveredBall.showPopup(p5);
    }
  }, [hoveredBall]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      {dimensions.w > 0 && dimensions.h > 0 && rufer.length > 0 && (
        <Sketch setup={setup} draw={draw} />
      )}
    </div>
  );
}

export default P5Sketch;
