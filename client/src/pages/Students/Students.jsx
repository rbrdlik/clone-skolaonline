import Navbar from "../../components/Navbar/Navbar";
import "../../scss/Students.scss";
import people from "../../assets/icons/people.png";

export default function Students() {
  const students = Array(27).fill({
    id: 1,
    class: "1.Ai",
    name: "Roman Brdlík",
    groups: "ANJ2, IT1"
  });

  return (
    <div className="student-list-page">
      <Navbar />

      <main className="main-content">
        <section className="list-card">
          <header className="card-header">
            <div className="icon-wrapper">
              <img src={people} alt="Students" />
            </div>
            <h1>Třída 1.Ai - Seznam studentů ({students.length})</h1>
          </header>

          <div className="card-body">
            <div className="table-header">
              <div className="col-id">ID</div>
              <div className="col-class">Třída</div>
              <div className="col-name">Jméno a příjmení</div>
              <div className="col-groups">Dělící skupina</div>
            </div>

            <div className="table-content">
              {students.map((student, index) => (
                <div key={index} className="table-row">
                  <div className="col-id">{student.id}</div>
                  <div className="col-class">{student.class}</div>
                  <div className="col-name">{student.name}</div>
                  <div className="col-groups">{student.groups}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}