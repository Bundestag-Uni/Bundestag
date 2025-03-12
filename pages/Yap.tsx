import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Hero from '../components/hero';
import Header from '../components/header';
import MyBarChart from '@/components/diagramme/BarChartParty';
import PoliticianPodium from '@/components/diagramme/PoliticianPodium';
import Heatmap from '@/components/diagramme/Heatmap';
import styles from '../styles/Home.module.css';

export default function Yap() {
  return (
    <div>
        <title>Bundestagsscraper</title>
        <meta name="description" content="A website inspired by the Bundestag displaying curated data." />

      <Header />
      <Navbar />
      <main>
        <div className={styles.diagramGrid}>
          <h1 className={styles.gridHeader2}>
            Welche Partei *x* am meisten?
          </h1>
          <h1 className={styles.gridHeader2}>
            Welcher Politiker *x* am meisten?
          </h1>
          <MyBarChart />
          <PoliticianPodium />
        </div>
        <div >
          <h1 className={styles.gridHeader3}>
            Überblick über Parteieneffizienz
          </h1>
          <Heatmap />
        </div>
      </main>
      <Footer />
    </div>
  );
}
