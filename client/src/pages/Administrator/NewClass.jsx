import NavbarA from "./NavbarA";
import "../../scss/NewClass.scss";

export default function NewClass() {
  const addedStudents = Array(6).fill("Roman Brdlík");
  return (
    <div className="create-class-page">
      <NavbarA isAdmin={true} />

      <main className="main-content">
        <section className="form-card">
          <header className="card-header">
            <div className="icon-wrapper">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4a90e2"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <h1>Nová třída</h1>
          </header>

          <div className="card-body">
            <div className="split-container">
              <div className="input-section">
                <div className="form-group">
                  <label>Název třídy</label>
                  <input
                    type="text"
                    className="text-input"
                    placeholder="např. 1.Ai"
                  />
                </div>
              </div>

              <div className="selection-section">
                <div className="form-group">
                  <label>Přidat studenty</label>
                  <select className="select-input" defaultValue="">
                    <option value="" disabled>
                      Přidat...
                    </option>
                    <option value="1">Roman Brdlík</option>
                    <option value="2">Jana Nováková</option>
                  </select>
                </div>

                <div className="student-list">
                  {addedStudents.map((name, index) => (
                    <div key={index} className="student-item">
                      <span className="student-name">{name}</span>
                      <button type="button" className="btn-remove">
                        Odebrat
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <footer className="card-footer">
              <button type="submit" className="btn-submit">
                Vytvořit
              </button>
            </footer>
          </div>
        </section>
      </main>
    </div>
  );
}
