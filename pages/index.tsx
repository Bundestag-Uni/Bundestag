import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Hero from '../components/hero';
import Header from '../components/header';

export default function Home() {
  return (
    <div>
        <title>Bundestagsscraper</title>
        <meta name="description" content="A website inspired by the Bundestag displaying curated data." />
      <Header />
      <Navbar />
      <main>
        <p>Das ist die Startseite. Hier wird diese Box stehen.</p>
        <Hero/>
      </main>
      <Footer />
    </div>
  );
}
