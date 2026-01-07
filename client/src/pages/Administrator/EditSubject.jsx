import NavbarA from "./NavbarA";
import "../../scss/EditSubject.scss";

export default function EditSubject() {
  const teachers = Array(6).fill("RNDr. Iva Lišková");

  return (
    <div className="edit-subject-page">
      <NavbarA isAdmin={true} />

      <main className="main-content">
        <section className="form-card">
          <header className="card-header">
            <div className="icon-wrapper blue-circle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
            </div>
            <h1>Upravit předmět (Programování)</h1>
          </header>

          <div className="card-body split-layout">
            <div className="form-column">
              <div className="form-group">
                <label>Celý název předmětu</label>
                <input type="text" className="gray-input" defaultValue="Programování" />
              </div>
              <div className="form-group">
                <label>Zkratka předmětu (Max 4 znaky)</label>
                <input type="text" className="gray-input" defaultValue="PRO" />
              </div>
            </div>

            <div className="form-column">
              <div className="form-group">
                <label>Učitelé vyučující tento předmět</label>
                <select className="gray-select">
                  <option>Přidat...</option>
                </select>
              </div>

              <div className="teacher-list">
                {teachers.map((name, index) => (
                  <div key={index} className="teacher-row">
                    <span className="teacher-name">{name}</span>
                    <button className="btn-remove">Odebrat</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <footer className="form-footer">
            <button className="btn-save">Upravit</button>
          </footer>
        </section>
      </main>
    </div>
  );
}