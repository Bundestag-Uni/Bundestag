import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Hero from '../components/hero';
import Header from '../components/header';
import Gallery from '../components/gallery';

export default function Home() {
  return (
    <div className='style.body'>
        <title>Bundestagsscraper</title>
        <meta name="description" content="A website inspired by the Bundestag displaying curated data." />
      <Header />
      <Navbar />
      <main>
        <p>Das ist die Startseite.</p>
        <Gallery/>
      </main>
      <Footer />
    </div>
  );
}
