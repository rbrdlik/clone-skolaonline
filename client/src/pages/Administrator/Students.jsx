import { useNavigate } from "react-router-dom";
import NavbarA from "./NavbarA";
import "../../scss/StudentsA.scss";
import people from "../../assets/icons/people.png";

export default function Students() {
  const navigate = useNavigate();

  const students = [
    { id: 1, class: "1.Ai", name: "Roman Brdlík" },
    { id: 1, class: "1.Ai", name: "Roman Brdlík" },
    { id: 1, class: "1.Cs", name: "Roman Brdlík" },
    { id: 1, class: "1.Bi", name: "Roman Brdlík" },
    { id: 1, class: "2.Ai", name: "Roman Brdlík" },
  ];

  return (
    <div className="admin-student-page">
      <NavbarA isAdmin={true} />

      <main className="main-content">
        <section className="list-card">
          <header className="card-header">
            <div className="icon-wrapper">
              <img src={people} alt="Students" />
            </div>
            <h1>Seznam studentů (145)</h1>
          </header>

          <div className="card-body">
            <div className="table-header">
              <div className="col-id">ID</div>
              <div className="col-class">Třída</div>
              <div className="col-name">Jméno a příjmení</div>
              <div className="col-actions">Akce</div>
            </div>

            <div className="table-content">
              {students.map((student, index) => (
                <div key={index} className="table-row">
                  <div className="col-id">{student.id}</div>
                  <div className="col-class">{student.class}</div>
                  <div className="col-name">{student.name}</div>
                  <div className="col-actions">
                    <button 
                      className="btn-edit" 
                      onClick={() => navigate("/administrators/editStudent")}
                    >
                      Editace studenta
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