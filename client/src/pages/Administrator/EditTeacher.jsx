import NavbarA from "./NavbarA";
import "../../scss/EditTeacher.scss";

export default function EditTeacher() {
  return (
    <div className="edit-teacher-page">
      <NavbarA isAdmin={true} />

      <main className="main-content">
        <section className="form-card">
          <header className="card-header">
            <div className="icon-wrapper blue-circle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h1>Upravit učitele (Jméno Příjmení)</h1>
          </header>

          <div className="card-body">
            <div className="form-grid first-row">
              <div className="form-group">
                <label>Jméno učitele</label>
                <input type="text" className="gray-input" defaultValue="Iva" />
              </div>
              <div className="form-group">
                <label>Příjmení učitele</label>
                <input type="text" className="gray-input" defaultValue="Lišková" />
              </div>
              <div className="form-group">
                <label>Přihlašovací jméno učitele</label>
                <input type="text" className="gray-input" defaultValue="liskova.iva" />
              </div>
              <div className="form-group">
                <label>Přihlašovací heslo učitele</label>
                <input type="password" className="gray-input" placeholder="••••••••" />
              </div>
            </div>

            <div className="form-grid second-row">
              <div className="form-group">
                <label>Email učitele</label>
                <input type="email" className="gray-input" defaultValue="iva.liskova@skola.cz" />
              </div>
              <div className="form-group">
                <label>Datum narození učitele</label>
                <input type="text" className="gray-input" defaultValue="12.05.1985" />
              </div>
              <div className="form-group">
                <label>Pohlaví</label>
                <select className="gray-select" defaultValue="female">
                  <option value="">Výběr...</option>
                  <option value="male">Muž</option>
                  <option value="female">Žena</option>
                </select>
              </div>
              <div className="form-group empty"></div>
            </div>

            <footer className="form-footer">
              <button className="btn-save">Upravit</button>
            </footer>
          </div>
        </section>
      </main>
    </div>
  );
}