import Head from 'next/head';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Hero from '../components/hero';
import Header from '../components/header';
import PersonenDiagrammRufer from '../components/p5-scripte/zwischenruferZ';
import PersonenDiagrammRedner from '../components/p5-scripte/zwischenruferR';
import ParteienDiagrammRufer from '../components/p5-scripte/parteienZ';
import ParteienDiagrammRedner from '../components/p5-scripte/parteienR';
import SearchChart from '../components/diagramme/SearchChart';
import styles from '../styles/Home.module.css';

export default function Zwischenrufe() {
  return (
    <div>
      <Head>
        <title>Bundestagsscraper</title>
        <meta
          name="description"
          content="A website inspired by the Bundestag displaying curated data."
        />
      </Head>
      <Header />
      <Navbar />

      <main>
        <h1 className={styles.diagramquestion}>
          Wer ruft am meisten dazwischen?
        </h1>

        <div className={styles.diagramGrid}>
          <div className={styles.gridHeader}>
            <h2>Personen</h2>
          </div>
          <div className={styles.gridHeader}>
            <h2>Partei</h2>
          </div>
          <div className={styles.gridItem}>
            <PersonenDiagrammRufer />
          </div>
          <div className={styles.gridItem}>
            <ParteienDiagrammRufer />
          </div>
        </div>

        <hr className={styles.spacer} />

        <h1 className={styles.diagramquestion}>
          Bei wem wird am meisten dazwischen gerufen?
        </h1>
        <div className={styles.diagramGrid}>
          <div className={styles.gridHeader}>
            <h2>Personen</h2>
          </div>
          <div className={styles.gridHeader}>
            <h2>Partei</h2>
          </div>
          <div className={styles.gridItem}>
            <PersonenDiagrammRedner />
          </div>
          <div className={styles.gridItem}>
            <ParteienDiagrammRedner />
          </div>
        </div>
        
        <hr className={styles.spacer} />

        <h1 className={styles.diagramquestion}>Such selbst!</h1>
        <SearchChart />
        <hr className={styles.spacer} style={{ border: 'none' }} />
      </main>

      <Footer />
    </div>
  );
}
