import NavbarA from "./NavbarA";
import "../../scss/TimetableA.scss";

export default function TimetableA() {
  const days = [
    { name: "Po", date: "5.1." },
    { name: "Út", date: "6.1." },
    { name: "St", date: "7.1." },
    { name: "Čt", date: "8.1." },
    { name: "Pá", date: "9.1." },
  ];

  const hours = Array.from({ length: 13 }, (_, i) => i);

  return (
    <div className="schedule-page">
      <NavbarA isAdmin={true} />
      <main className="main-content">
        <section className="schedule-card">
          <header className="card-header">
            <div className="icon-box">📅</div>
            <h1>Rozvrh hodin (Třída: 1.Ai)</h1>
          </header>

          <div className="schedule-wrapper">
            <div className="schedule-grid">
              <div className="grid-corner"></div>

              {hours.map((h) => (
                <div key={h} className="hour-block">
                  <span className="num">{h}</span>
                  <span className="time">7:05 - 7:50</span>
                </div>
              ))}

              {days.map((day) => (
                <div key={day.name} className="day-row">
                  <div className="day-info">
                    <span className="name">{day.name}</span>
                    <span className="date">{day.date}</span>
                  </div>

                  {hours.map((h) => (
                    <div key={`${day.name}-${h}`} className="schedule-cell">
                      <select className="cell-select">
                        <option>Vybrat předmět</option>
                      </select>
                      <select className="cell-select">
                        <option>Vybrat učitele</option>
                      </select>
                      <input 
                        type="text" 
                        className="cell-input" 
                        placeholder="Vybrat učebnu" 
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <footer className="card-footer">
            <button className="btn-save">Uložit</button>
          </footer>
        </section>
      </main>
    </div>
  );
}