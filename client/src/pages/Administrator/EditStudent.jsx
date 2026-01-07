import NavbarA from "./NavbarA";
import "../../scss/EditStudent.scss";

export default function EditStudent() {
  return (
    <div className="edit-student-page">
      <NavbarA isAdmin={true} />

      <main className="main-content">
        <section className="form-card">
          <header className="card-header">
            <div className="icon-wrapper blue-circle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h1>Upravit studenta (Jméno Příjmení)</h1>
          </header>

          <div className="card-body">
            <div className="form-grid">
              <div className="form-group">
                <label>Jméno studenta</label>
                <input type="text" className="gray-input" defaultValue="Roman" />
              </div>
              <div className="form-group">
                <label>Příjmení studenta</label>
                <input type="text" className="gray-input" defaultValue="Brdlík" />
              </div>
              <div className="form-group">
                <label>Přihlašovací jméno studenta</label>
                <input type="text" className="gray-input" defaultValue="brdlik.roman" />
              </div>
              <div className="form-group">
                <label>Přihlašovací heslo studenta</label>
                <input type="password" className="gray-input" placeholder="••••••••" />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Email studenta</label>
                <input type="email" className="gray-input" defaultValue="roman.brdlik@skola.cz" />
              </div>
              <div className="form-group">
                <label>Datum narození studenta</label>
                <input type="text" className="gray-input" defaultValue="01.01.2005" />
              </div>
              <div className="form-group">
                <label>Pohlaví</label>
                <select className="gray-select">
                  <option>Výběr...</option>
                  <option value="male">Muž</option>
                  <option value="female">Žena</option>
                </select>
              </div>
              <div className="form-group">
                <label>Přiřadit třídu</label>
                <select className="gray-select">
                  <option>Výběr...</option>
                  <option value="1ai">1.Ai</option>
                </select>
              </div>
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