import { useState } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Header from '../components/header';
import MyBarChart from '@/components/diagramme/BarChartParty';
import PoliticianPodium from '@/components/diagramme/PoliticianPodium';
import Heatmap from '@/components/diagramme/Heatmap';
import DropdownPolitician from '@/components/DropdownPolitician'; 
import DropdownParty from '@/components/DropdownParty';
import styles from '../styles/Home.module.css';

export default function Yap() {
  const [partyQuery, setPartyQuery] = useState("getBestPartysEfficiency");
  const [politicianQuery, setPoliticianQuery] = useState("getEfficiencyTop5Person");

  return (
    <div>
      <title>Bundestagsscraper</title>
      <meta name="description" content="A website inspired by the Bundestag displaying curated data." />

      <Header />
      <Navbar />
      <main>
        <div className={styles.yapItem}>
          <div className={styles.gridHeader}>
            <h1>Parteien Ranking</h1>
            <DropdownParty onSelect={(queryType) => setPartyQuery(queryType)} />
          </div>
          <div className={styles.gridItem}>
            <MyBarChart queryType={partyQuery} />
          </div>
          
          <div className={styles.gridHeader}>
            <h1 style={{ margin: 0 }}>
              Politiker Ranking
            </h1>
            <DropdownPolitician onSelect={(queryType) => setPoliticianQuery(queryType)} />
          </div>          <div className={styles.gridItem}>
            <PoliticianPodium queryType={politicianQuery} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
