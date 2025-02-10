import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Hero from '../components/hero';
import Header from '../components/header';
import PersonenDiagrammRufer from '../components/p5-scripte/zwischenruferZ';
import PersonenDiagrammRedner from '../components/p5-scripte/zwischenruferR';
import ParteienDiagrammRufer from '../components/p5-scripte/parteienZ';
import ParteienDiagrammRedner from '../components/p5-scripte/parteienR';
import SearchChart from '../components/diagramme/SearchChart';

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
        <h1 className='Home-module__g21JLG__diagramquestion'>
          Wer ruft am meisten dazwischen?
        </h1>

        <div className="Home-module__g21JLG__diagram-grid">
          <div className="Home-module__g21JLG__grid-header">
            <h2>Personen</h2>
          </div>
          <div className="Home-module__g21JLG__grid-header">
            <h2>Partei</h2>
          </div>
          <div className="Home-module__g21JLG__grid-item">
            <PersonenDiagrammRufer />
          </div>
          <div className="Home-module__g21JLG__grid-item">
            <ParteienDiagrammRufer />
          </div>
        </div>

        <hr className="Home-module__g21JLG__spacer" />

        <h1 className='Home-module__g21JLG__diagramquestion'>
          Bei wem wird am meisten dazwischen gerufen?
        </h1>
        <div className="Home-module__g21JLG__diagram-grid">
          <div className="Home-module__g21JLG__grid-header">
            <h2>Personen</h2>
          </div>
          <div className="Home-module__g21JLG__grid-header">
            <h2>Partei</h2>
          </div>
          <div className="Home-module__g21JLG__grid-item">
            <PersonenDiagrammRedner />
          </div>
          <div className="Home-module__g21JLG__grid-item">
            <ParteienDiagrammRedner />
          </div>
        </div>
        <hr className="Home-module__g21JLG__spacer" />
        <h1 className='Home-module__g21JLG__diagramquestion'>Such selbst!</h1>
        <SearchChart />
        <hr
          className="Home-module__g21JLG__spacer"
          style={{ border: 'none' }}
        />
      </main>

      <Footer />
    </div>
  );
}
