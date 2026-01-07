import { useNavigate } from "react-router-dom";
import NavbarA from "./NavbarA";
import "../../scss/Subjects.scss";

export default function Subjects() {
  const navigate = useNavigate();

  const subjects = [
    { id: 1, code: "MAT", name: "Matematika", teacherCount: 10 },
    { id: 1, code: "PRO", name: "Programování", teacherCount: 10 },
    { id: 1, code: "PRA", name: "Praxe", teacherCount: 10 },
    { id: 1, code: "HW", name: "Hardware", teacherCount: 10 },
    { id: 1, code: "TEL", name: "Tělesná výchova", teacherCount: 10 },
  ];

  return (
    <div className="subject-list-page">
      <NavbarA isAdmin={true} />

      <main className="main-content">
        <section className="list-card">
          <header className="card-header">
            <div className="icon-wrapper blue-circle">
              <span className="doc-icon">📄</span>
            </div>
            <h1>Seznam předmětů (145)</h1>
          </header>

          <div className="card-body">
            <div className="table-header">
              <div className="col-id">ID</div>
              <div className="col-code">Zkratka předmětu</div>
              <div className="col-name">Celý název</div>
              <div className="col-count">Počet vyučujících učitelů</div>
              <div className="col-actions">Akce</div>
            </div>

            <div className="table-content">
              {subjects.map((sub, index) => (
                <div key={index} className="table-row">
                  <div className="col-id">{sub.id}</div>
                  <div className="col-code">{sub.code}</div>
                  <div className="col-name">{sub.name}</div>
                  <div className="col-count">{sub.teacherCount}</div>
                  <div className="col-actions">
                    <button 
                      className="btn-edit" 
                      onClick={() => navigate("/administrators/editSubject")}
                    >
                      Editace předmětu
                    </button>
                    <button className="btn-delete">Smazat</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}