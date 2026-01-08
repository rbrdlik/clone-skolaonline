import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarA from "./NavbarA";
import Modal from "../../components/Modal";
import { getAllStudents } from "../../models/user";
import { getAllClasses } from "../../models/class";
import { deleteUser } from "../../models/user";
import "../../scss/StudentsA.scss";
import people from "../../assets/icons/people.png";

export default function Students() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const studentsRes = await getAllStudents();
        const classesRes = await getAllClasses();

        if (studentsRes && studentsRes.status === 200) {
          setStudents(studentsRes.payload || []);
        }

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

  const getStudentClass = (studentId) => {
    const studentClass = classes.find(cls => {
      if (!cls.students || !Array.isArray(cls.students)) return false;
      return cls.students.some(student => {
        const studentIdValue = typeof student === 'object' && student._id 
          ? student._id.toString() 
          : student.toString();
        return studentIdValue === studentId.toString();
      });
    });
    return studentClass ? studentClass.name : "-";
  };

  const handleDeleteClick = (student) => {
    setSelectedStudent(student);
    setModalOpen(true);
    setErrorMessage("");
  };

  const handleDeleteConfirm = async () => {
    if (!selectedStudent) return;

    setDeletingId(selectedStudent._id);
    setModalOpen(false);
    
    try {
      const result = await deleteUser(selectedStudent._id);
      if (result && result.status === 200) {
        setStudents(students.filter(s => s._id !== selectedStudent._id));
      } else {
        setErrorMessage(result?.message || "Chyba při mazání studenta");
        setModalOpen(true);
      }
    } catch (err) {
      setErrorMessage("Chyba při mazání studenta");
      setModalOpen(true);
      console.error("Error deleting student:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedStudent(null);
    setErrorMessage("");
  };

  if (loading) {
    return (
      <div className="admin-student-page">
        <NavbarA isAdmin={true} />
        <main className="main-content">
          <div style={{ textAlign: "center", padding: "2rem" }}>Načítání...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-student-page">
      <NavbarA isAdmin={true} />

      <main className="main-content">
        <section className="list-card">
          <header className="card-header">
            <div className="icon-wrapper">
              <img src={people} alt="Students" />
            </div>
            <h1>Seznam studentů ({students.length})</h1>
          </header>

          <div className="card-body">
            <div className="table-header">
              <div className="col-id">ID</div>
              <div className="col-class">Třída</div>
              <div className="col-name">Jméno a příjmení</div>
              <div className="col-actions">Akce</div>
            </div>

            <div className="table-content">
              {students.map((student) => (
                <div key={student._id} className="table-row">
                  <div className="col-id">{student._id.toString().slice(-6)}</div>
                  <div className="col-class">{getStudentClass(student._id)}</div>
                  <div className="col-name">{student.first_name} {student.last_name}</div>
                  <div className="col-actions">
                    <button 
                      className="btn-edit" 
                      onClick={() => navigate(`/administrators/editStudent/${student._id}`)}
                    >
                      Editace studenta
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDeleteClick(student)}
                      disabled={deletingId === student._id}
                    >
                      {deletingId === student._id ? "Mažu..." : "Smazat"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Modal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onConfirm={handleDeleteConfirm}
        title={errorMessage ? "Chyba" : "Smazat studenta"}
        message={errorMessage || `Opravdu chcete smazat studenta ${selectedStudent ? `${selectedStudent.first_name} ${selectedStudent.last_name}` : ""}?`}
        confirmText={errorMessage ? "Zavřít" : "Smazat"}
        cancelText={errorMessage ? null : "Zrušit"}
        type={errorMessage ? "confirm" : "danger"}
      />
    </div>
  );
}