import NavbarA from "./NavbarA";
import "../../scss/NewStudent.scss";

export default function NewStudent() {
  return (
    <div className="create-student-page">
      <NavbarA isAdmin={true} />

      <main className="main-content">
        <section className="form-card">
          <header className="card-header">
            <div className="icon-wrapper">
              <span className="user-plus-icon">👥</span>
            </div>
            <h1>Nový student</h1>
          </header>

          <div className="card-body">
            <form className="student-grid-form">
              <div className="form-group">
                <label>Jméno studenta</label>
                <input type="text" className="text-input" />
              </div>

              <div className="form-group">
                <label>Příjmení studenta</label>
                <input type="text" className="text-input" />
              </div>

              <div className="form-group">
                <label>Přihlašovací jméno studenta</label>
                <input type="text" className="text-input" />
              </div>

              <div className="form-group">
                <label>Přihlašovací heslo studenta</label>
                <input type="password" className="text-input" />
              </div>

              <div className="form-group">
                <label>Email studenta</label>
                <input type="email" className="text-input" />
              </div>

              <div className="form-group">
                <label>Datum narození studenta</label>
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

              <div className="form-group">
                <label>Přiřadit třídu</label>
                <select className="select-input" defaultValue="">
                  <option value="" disabled>Výběr...</option>
                  <option value="1.Ai">1.Ai</option>
                  <option value="1.Bi">1.Bi</option>
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