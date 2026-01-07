import Navbar from "../../components/Navbar/Navbar";
import "../../scss/TimetableChange.scss";
import calendar from "../../assets/icons/calendar.png"

export default function TimetableChange() {
  return (
    <div className="change-lesson-page">
      <Navbar />
      
      <main className="main-content">
        <section className="change-card">
          <header className="card-header">
                <img src={calendar} alt="" />
            <h1>Změna výuky (PRO 5.1.2026)</h1>
          </header>

          <div className="card-body">
            <div className="form-group">
              <label>Typ změny:</label>
              <select className="select-input" defaultValue="">
                <option value="" disabled>Výběr...</option>
                <option value="suplovani">Suplování</option>
                <option value="odpadlo">Odpadlo</option>
                <option value="presun">Přesun</option>
              </select>
            </div>

            <div className="form-group">
              <label>Poznámka:</label>
              <input type="text" className="text-input" />
            </div>

            <div className="form-group">
              <label>Jiný vyučující:</label>
              <select className="select-input" defaultValue="">
                <option value="" disabled>Výběr...</option>
                <option value="1">Mgr. Jan Novák</option>
                <option value="2">Ing. Marie Svobodová</option>
              </select>
            </div>

            <footer className="card-footer">
              <button className="btn-save">Uložit</button>
            </footer>
          </div>
        </section>
      </main>
    </div>
  );
}