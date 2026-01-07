import NavbarA from "./NavbarA";
import "../../scss/NewTeacher.scss";

export default function NewTeacher() {
  return (
    <div className="create-teacher-page">
      <NavbarA isAdmin={true} />

      <main className="main-content">
        <section className="form-card">
          <header className="card-header">
            <div className="icon-wrapper">
              <span className="user-icon">👤</span>
            </div>
            <h1>Nový učitel</h1>
          </header>

          <div className="card-body">
            <form className="teacher-grid-form">
              <div className="form-group">
                <label>Titul</label>
                <input type="text" className="text-input" placeholder="např. Mgr." />
              </div>

              <div className="form-group">
                <label>Jméno učitele</label>
                <input type="text" className="text-input" />
              </div>

              <div className="form-group">
                <label>Příjmení učitele</label>
                <input type="text" className="text-input" />
              </div>

              <div className="form-group">
                <label>Email učitele</label>
                <input type="email" className="text-input" />
              </div>

              <div className="form-group">
                <label>Přihlašovací jméno</label>
                <input type="text" className="text-input" />
              </div>

              <div className="form-group">
                <label>Přihlašovací heslo</label>
                <input type="password" className="text-input" />
              </div>

              <div className="form-group">
                <label>Datum narození</label>
                <input type="date" className="text-input" />
              </div>

              <div className="form-group">
                <label>Pohlaví</label>
                <select className="select-input" defaultValue="">
                  <option value="" disabled>Výběr...</option>
                  <option value="male">Muž</option>
                  <option value="female">Žena</option>
                </select>
              </div>
            </form>

            <footer className="card-footer">
              <button type="submit" className="btn-create">Vytvořit</button>
            </footer>
          </div>
        </section>
      </main>
    </div>
  );
}