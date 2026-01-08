import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { getStudentsByClass } from "../../models/user";
import { getClassById, getAllClasses } from "../../models/class";
import "../../scss/Students.scss";
import people from "../../assets/icons/people.png";

export default function Students() {
  const { id } = useParams();
  const classId = id;
  const [students, setStudents] = useState([]);
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!classId) {
        setLoading(false);
        return;
      }

      try {
        const [studentsRes, classRes] = await Promise.all([
          getStudentsByClass(classId),
          getClassById(classId)
        ]);

        if (studentsRes && studentsRes.status === 200) {
          const studentsData = Array.isArray(studentsRes.payload) 
            ? studentsRes.payload 
            : (studentsRes.payload?.payload || []);
          setStudents(studentsData);
        }

        if (classRes && classRes.status === 200 && classRes.payload) {
          setClassData(classRes.payload);
        } else {
          const allClassesRes = await getAllClasses();
          if (allClassesRes && allClassesRes.status === 200 && allClassesRes.payload) {
            const foundClass = Array.isArray(allClassesRes.payload)
              ? allClassesRes.payload.find(c => c._id === classId || c._id.toString() === classId)
              : null;
            if (foundClass) {
              setClassData(foundClass);
            }
          }
        }
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [classId]);

  if (loading) {
    return (
      <div className="student-list-page">
        <Navbar />
        <main className="main-content">
          <div style={{ textAlign: "center", padding: "2rem" }}>Načítání...</div>
        </main>
      </div>
    );
  }

  if (!classId) {
    return (
      <div className="student-list-page">
        <Navbar />
        <main className="main-content">
          <div style={{ textAlign: "center", padding: "2rem" }}>Třída nebyla nalezena</div>
        </main>
      </div>
    );
  }

  const className = classData?.name || "Neznámá třída";

  return (
    <div className="student-list-page">
      <Navbar />

      <main className="main-content">
        <section className="list-card">
          <header className="card-header">
            <div className="icon-wrapper">
              <img src={people} alt="Students" />
            </div>
            <h1>Třída {className} - Seznam studentů ({students.length})</h1>
          </header>

          <div className="card-body">
            <div className="table-header">
              <div className="col-id">ID</div>
              <div className="col-class">Třída</div>
              <div className="col-name">Jméno a příjmení</div>
            </div>

            <div className="table-content">
              {students.map((student) => (
                <div key={student._id} className="table-row">
                  <div className="col-id">{student._id.toString().slice(-6)}</div>
                  <div className="col-class">{className}</div>
                  <div className="col-name">
                    {student.title ? `${student.title} ` : ""}
                    {student.first_name} {student.last_name}
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