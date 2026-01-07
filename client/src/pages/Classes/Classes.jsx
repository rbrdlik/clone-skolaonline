import Navbar from "../../components/Navbar/Navbar";
import "../../scss/Classes.scss";
import people from "../../assets/icons/people.png";
import { useNavigate } from "react-router-dom";

export default function Classes() {
  const navigate = useNavigate();

  const classes = Array(120).fill({
    id: 1,
    name: "1.Ai",
    studentCount: 27
  });

  return (
    <div className="class-list-page">
      <Navbar />

      <main className="main-content">
        <section className="list-card">
          <header className="card-header">
            <div className="icon-wrapper">
              <img src={people} alt="" />
            </div>
            <h1>Seznam tříd</h1>
          </header>

          <div className="card-body">
            <div className="table-header">
              <div className="col-id">ID</div>
              <div className="col-name">Třída</div>
              <div className="col-count">Počet studentů</div>
              <div className="col-actions">Akce</div>
            </div>

            <div className="table-content">
              {classes.map((item, index) => (
                <div key={index} className="table-row">
                  <div className="col-id">{item.id}</div>
                  <div className="col-name">{item.name}</div>
                  <div className="col-count">{item.studentCount}</div>
                  <div className="col-actions">
                    <button 
                      className="btn-action primary" 
                      onClick={() => navigate("/students")}
                    >
                      Seznam studentů
                    </button>
                    <button 
                      className="btn-action secondary" 
                      onClick={() => navigate("/timetable")}
                    >
                      Rozvrh
                    </button>
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