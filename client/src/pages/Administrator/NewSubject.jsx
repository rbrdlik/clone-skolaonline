import NavbarA from "./NavbarA";
import "../../scss/NewSubject.scss";

export default function NewSubject() {
  const assignedTeachers = Array(6).fill("RNDr. Iva Lišková");

  return (
    <div className="create-subject-page">
      <NavbarA isAdmin={true} />

      <main className="main-content">
        <section className="form-card">
          <header className="card-header">
            <div className="icon-wrapper">
              <span className="doc-icon">📄</span>
            </div>
            <h1>Nový předmět</h1>
          </header>

          <div className="card-body">
            <div className="subject-flex-container">
              
              <div className="left-column">
                <div className="form-group">
                  <label>Celý název předmětu</label>
                  <input type="text" className="text-input" />
                </div>

                <div className="form-group">
                  <label>Zkratka předmětu (Max 4 znaky)</label>
                  <input type="text" className="text-input" maxLength="4" />
                </div>
              </div>

              <div className="right-column">
                <div className="form-group">
                  <label>Učitelé vyučující tento předmět</label>
                  <select className="select-input" defaultValue="">
                    <option value="" disabled>Přidat...</option>
                    <option value="1">Mgr. Jan Novák</option>
                    <option value="2">Ing. Petr Svoboda</option>
                  </select>
                </div>

                <div className="assigned-list">
                  {assignedTeachers.map((teacher, index) => (
                    <div key={index} className="teacher-item">
                      <span>{teacher}</span>
                      <button type="button" className="btn-remove">Odebrat</button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <footer className="card-footer">
              <button type="submit" className="btn-create">Vytvořit</button>
            </footer>
          </div>
        </section>
      </main>
    </div>
  );
}