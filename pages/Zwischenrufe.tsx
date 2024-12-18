import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Hero from '../components/hero';
import Header from '../components/header';

export default function Zwischenrufe() {
  return (
    <div>
        <title>Bundestagsscraper</title>
        <meta name="description" content="A website inspired by the Bundestag displaying curated data." />
      <Header />
      <Navbar />
      <main>
        <p>Das ist die Seite für Zwischenrufe. Hier werden die Daten für die Zwischenrufe stehen.</p>
        <Hero/>
      </main>
    </div>
  );
}
