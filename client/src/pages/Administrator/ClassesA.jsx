import { useNavigate } from "react-router-dom";
import NavbarA from "./NavbarA";
import "../../scss/ClassesA.scss";

export default function ClassesA() {
  const navigate = useNavigate();

  const classes = Array(5).fill({
    id: 1,
    name: "1.Ai",
    studentCount: 27
  });

  return (
    <div className="admin-class-page">
      <NavbarA isAdmin={true} />

      <main className="main-content">
        <section className="list-card">
          <header className="card-header">
            <div className="icon-wrapper blue-circle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
            </div>
            <h1>Seznam tříd (10)</h1>
          </header>

          <div className="card-body">
            <div className="table-header">
              <div className="col-id">ID</div>
              <div className="col-class">Třída</div>
              <div className="col-students">Počet studentů</div>
              <div className="col-actions">Akce</div>
            </div>

            <div className="table-content">
              {classes.map((item, index) => (
                <div key={index} className="table-row">
                  <div className="col-id">{item.id}</div>
                  <div className="col-class">{item.name}</div>
                  <div className="col-students">{item.studentCount}</div>
                  <div className="col-actions">
                    <button 
                      className="btn-blue" 
                      onClick={() => navigate("/administrators/timetable")}
                    >
                      Rozvrh
                    </button>
                    <button 
                      className="btn-blue" 
                      onClick={() => navigate("/administrators/editClass")}
                    >
                      Editace třídy
                    </button>
                    <button className="btn-red">Smazat</button>
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