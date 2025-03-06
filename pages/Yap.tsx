import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Hero from '../components/hero';
import Header from '../components/header';
import MyBarChart from '@/components/diagramme/BarChartParty';

export default function Yap() {
  return (
    <div>
        <title>Bundestagsscraper</title>
        <meta name="description" content="A website inspired by the Bundestag displaying curated data." />
      <Header />
      <Navbar />
      <main>
        <MyBarChart />
      </main>
      <Footer />
    </div>
  );
}
