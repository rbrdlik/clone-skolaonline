import Navbar from "../../components/Navbar/Navbar";
import "../../scss/Grading.scss";
import calendar from "../../assets/icons/calendar.png"
export default function Grading() {
  const students = Array(12).fill({ id: 1, name: "Roman Brdlík" });

  const grades = ["1", "1-", "2", "2-", "3", "3-", "4", "4-", "5", "NH"];

  return (
    <div className="grading-page">
      <Navbar />
      
      <main className="main-content">
        <section className="grading-card">
          <header className="card-header">
            <div className="icon-wrapper">
            <img src={calendar} alt="" />
            </div>
            <h1>Zadat hodnocení (PRO 5.1.2026)</h1>
          </header>

          <div className="card-body">
            <div className="settings-section">
              <div className="form-group">
                <label>Váha známky:</label>
                <select className="select-input" defaultValue="">
                  <option value="" disabled>Výběr...</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(vaha => (
                    <option key={vaha} value={vaha}>{vaha}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Popis známky:</label>
                <input type="text" className="text-input" placeholder="Např. Čtvrtletní práce..." />
              </div>
            </div>

            <hr className="divider" />

            <div className="list-container">
              {students.map((student, index) => (
                <div key={index} className="student-row">
                  <span className="student-number">{index + 1}</span>
                  <span className="student-name">{student.name}</span>
                  <div className="select-wrapper">
                    <select className="select-input small" defaultValue="">
                      <option value="" disabled>Známka</option>
                      {grades.map(grade => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
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