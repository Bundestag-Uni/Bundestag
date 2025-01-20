import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Hero from '../components/hero';
import Header from '../components/header';
import PersonenDiagramm from '../components/p5-scripte/zwischenrufer';
import ParteienDiagramm from '../components/p5-scripte/parteien';


export default function Zwischenrufe() {
  return (
    <div>
      <title>Bundestagsscraper</title>
      <meta
        name="description"
        content="A website inspired by the Bundestag displaying curated data."
      />
      <Header />
      <Navbar />

      <main>
        <h1 class='Home-module__g21JLG__diagramquestion'>Wer ruft am meisten dazwischen?</h1>

        {/* Grid-Container mit eindeutigem Klassennamen */}
        <div className="Home-module__g21JLG__diagram-grid">
          <div className="Home-module__g21JLG__grid-header">
            <h2>Personen</h2>
          </div>
          <div className="Home-module__g21JLG__grid-header">
            <h2>Partei</h2>
          </div>
          <div className="Home-module__g21JLG__grid-item">
            <PersonenDiagramm />
          </div>
          <div className="Home-module__g21JLG__grid-item">
            <ParteienDiagramm />
          </div>
        </div>

        <h1 class='Home-module__g21JLG__diagramquestion'>Wer ruft am meisten dazwischen?</h1>
        {/* Grid-Container mit eindeutigem Klassennamen */}
        <div className="Home-module__g21JLG__diagram-grid">
          <div className="Home-module__g21JLG__grid-header">
            <h2>Personen</h2>
          </div>
          <div className="Home-module__g21JLG__grid-header">
            <h2>Partei</h2>
          </div>
          <div className="Home-module__g21JLG__grid-item">
            <PersonenDiagramm />
          </div>
          <div className="Home-module__g21JLG__grid-item">
            <ParteienDiagramm />
          </div>
        </div>
        <h1 class='Home-module__g21JLG__diagramquestion'>TODO</h1>
        <Hero />
      </main>
      <Footer />
    </div>
  );
}
