import React, { useEffect } from 'react';
import Navbar from '@/components/navbar';
import '../styles/home.css';

export default function Home() {

  useEffect(() => {

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
    <div className="homeContainer">
      <Navbar />
      <header className="hero">
        <h1>Bundestag-Scraper</h1>
        <p>Spannende Fakten & Daten aus dem Bundestag</p>
      </header>
      <section className="timeline-container">
        <div className="timeline-line"></div>

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
            <p>dieses Beast hat uns bei der Berechnung unterstützt</p>
          </div>
        </div>
      </section>
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Bundestag-Scraper</p>
      </footer>
    </div>
  );
}
