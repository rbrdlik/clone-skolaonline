import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { getAllClasses } from "../../models/class";
import "../../scss/Classes.scss";
import people from "../../assets/icons/people.png";

export default function Classes() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const classesRes = await getAllClasses();
        if (classesRes && classesRes.status === 200) {
          setClasses(classesRes.payload || []);
        }
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getStudentCount = (classItem) => {
    if (!classItem.students || !Array.isArray(classItem.students)) return 0;
    return classItem.students.length;
  };

  if (loading) {
    return (
      <div className="class-list-page">
        <Navbar />
        <main className="main-content">
          <div style={{ textAlign: "center", padding: "2rem" }}>Načítání...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="class-list-page">
      <Navbar />

      <main className="main-content">
        <section className="list-card">
          <header className="card-header">
            <div className="icon-wrapper">
              <img src={people} alt="" />
            </div>
            <h1>Seznam tříd ({classes.length})</h1>
          </header>

          <div className="card-body">
            <div className="table-header">
              <div className="col-id">ID</div>
              <div className="col-name">Třída</div>
              <div className="col-count">Počet studentů</div>
              <div className="col-actions">Akce</div>
            </div>

            <div className="table-content">
              {classes.map((classItem) => (
                <div key={classItem._id} className="table-row">
                  <div className="col-id">{classItem._id.toString().slice(-6)}</div>
                  <div className="col-name">{classItem.name}</div>
                  <div className="col-count">{getStudentCount(classItem)}</div>
                  <div className="col-actions">
                    <button 
                      className="btn-action primary" 
                      onClick={() => navigate(`/students/${classItem._id}`)}
                    >
                      Seznam studentů
                    </button>
                    <button 
                      className="btn-action secondary" 
                      onClick={() => navigate(`/timetable/${classItem._id}`)}
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