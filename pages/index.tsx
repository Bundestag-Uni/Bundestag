import React, { useEffect } from 'react';
import './Home.css';
import Navbar from '@/components/navbar';

export default function Home() {

  useEffect(() => {
    // IntersectionObserver, um Timeline-Events beim Scrollen zu animieren
    const timelineEvents = document.querySelectorAll('.timeline-event');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.2 }
    );

    timelineEvents.forEach((event) => {
      observer.observe(event);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="home-container">
      {/* Navigation oder Header, wenn gewünscht */}
      {/*  <nav className="navbar">
        <ul>
          <li><a href="#start">Start</a></li>
          <li><a href="#timeline">Timeline</a></li>
          <li><a href="#contact">Kontakt</a></li>
        </ul>
      </nav> */}
      <Navbar />
      {/* Hero-Section oder einfach nur Überschrift */}
      <header className="hero">
        <h1>Bundestag-Scraper</h1>
        <p>Spannende Fakten & Daten aus dem Bundestag</p>
      </header>

      {/* Timeline-Bereich */}
      <section id="timeline" className="timeline-container">
        <div className="timeline-line"></div>

        {/* Beispiel-Events (links/rechts) */}
        <div className="timeline-event left">
          <div className="timeline-content">
            <span className="year">Personensuche</span>
            <p>Suche mit unserer Personensuche nach spannenden Fakten zu deinem Lieblingspolitiker!</p>
          </div>
        </div>

        <div className="timeline-event right">
          <div className="timeline-content">
            <span className="date">62940</span>
            <p>Reden haben wir analysiert</p>
          </div>
        </div>

        <div className="timeline-event left">
          <div className="timeline-content">
            <span className="date">Yap-o-Meter</span>
            <p>Entdecke unser Politik-Ranking auf dem Yap-o-Meter</p>
          </div>
        </div>

        <div className="timeline-event right">
          <div className="timeline-content">
            <span className="date">6 Wochen</span>
            <p>hat unsere effizienze Berechnung benötigt</p>
          </div>
        </div>

        <div className="timeline-event left">
          <div className="timeline-content">
            <span className="date">Zwischenrufe</span>
            <p>Die Grünen sind #1 was Zwischenrufe angeht!</p>
          </div>
        </div>

        <div className="timeline-event right">
          <div className="timeline-content">
            <span className="date">Nvidia A40 48GB</span>
            <p>dieses Beast hat uns bei der Brechnung unterstützt</p>
          </div>
        </div>

        {/* ...weitere Timeline-Events nach Bedarf */}
      </section>
      {/* Rechenzeuit 1 Monat */}
      {/* 60.000 Reden */}
      {/* Footer oder sonstige Inhalte */}
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Bundestag-Scraper</p>
      </footer>
    </div>
  );
}
