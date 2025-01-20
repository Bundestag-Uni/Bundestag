import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Hero from '../components/hero';
import Header from '../components/header';

export default function Methodik() {
  return (
    <div>
        <title>Bundestagsscraper</title>
        <meta name="description" content="A website inspired by the Bundestag displaying curated data." />
      <Header />
      <Navbar />
      <main>
        <p>Das ist die Seite für die Methodik. Hier werden die Daten für die Methodik stehen.</p>
        <Hero/>
      </main>
      <Footer />
    </div>
  );
}
