import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Header from '../components/header';
import MyBarChart from '@/components/diagramme/BarChartParty';
import PoliticianPodium from '@/components/diagramme/PoliticianPodium';
import Heatmap from '@/components/diagramme/Heatmap';
import Dropdown from '@/components/DropdownPolitician'; // <-- Neue Dropdown-Komponente
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
          <div className={styles.gridHeader2}>
            <h1 style={{ margin: 0 }}>
              Welcher Politiker *x* am meisten?
            </h1>
            <Dropdown /> 
          </div>

          <div className={styles.chartBox}>
            <MyBarChart />
          </div>
          <div className={styles.chartBox}>
            <PoliticianPodium />
          </div>
        </div>

        <div>
          <h1 className={styles.gridHeader3}>
            Überblick über Parteieneffizienz
          </h1>
          <div className={styles.chartBox}>
            <Heatmap />
          </div>  
        </div>
      </main>
      <Footer />
    </div>
  );
}
