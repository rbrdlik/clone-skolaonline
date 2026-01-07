import { useNavigate } from "react-router-dom";
import NavbarA from "./NavbarA";
import "../../scss/Teachers.scss";
import people from "../../assets/icons/people.png";

export default function Teachers() {
  const navigate = useNavigate();

  const teachers = Array(5).fill({
    id: 1,
    name: "Roman Brdlík",
    subjects: "Programování, Webové aplikace, Hardware"
  });

  return (
    <div className="admin-teacher-page">
      <NavbarA isAdmin={true} />

      <main className="main-content">
        <section className="list-card">
          <header className="card-header">
            <div className="icon-wrapper">
              <img src={people} alt="Učitelé" />
            </div>
            <h1>Seznam učitelů (145)</h1>
          </header>

          <div className="card-body">
            <div className="table-header">
              <div className="col-id">ID</div>
              <div className="col-name">Jméno a příjmení</div>
              <div className="col-subjects">Vyučující předměty</div>
              <div className="col-actions">Akce</div>
            </div>

            <div className="table-content">
              {teachers.map((teacher, index) => (
                <div key={index} className="table-row">
                  <div className="col-id">{teacher.id}</div>
                  <div className="col-name">{teacher.name}</div>
                  <div className="col-subjects">{teacher.subjects}</div>
                  <div className="col-actions">
                    <button 
                      className="btn-edit" 
                      onClick={() => navigate("/administrators/editTeacher")}
                    >
                      Editace učitele
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