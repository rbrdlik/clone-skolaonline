import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarA from "./NavbarA";
import Modal from "../../components/Modal";
import { getAllTeachers, deleteUser } from "../../models/user";
import { getAllSubjects } from "../../models/subject";
import "../../scss/Teachers.scss";
import people from "../../assets/icons/people.png";

export default function Teachers() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const teachersRes = await getAllTeachers();
        const subjectsRes = await getAllSubjects();

        if (teachersRes && teachersRes.status === 200) {
          setTeachers(teachersRes.payload || []);
        }

        if (subjectsRes && subjectsRes.status === 200) {
          setSubjects(subjectsRes.payload || []);
        }
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getTeacherSubjects = (teacherId) => {
    const teacherSubjects = subjects.filter(subject => {
      if (!subject.teachers || !Array.isArray(subject.teachers)) return false;
      return subject.teachers.some(teacher => {
        const teacherIdValue = typeof teacher === 'object' && teacher._id 
          ? teacher._id.toString() 
          : teacher.toString();
        return teacherIdValue === teacherId.toString();
      });
    });
    if (teacherSubjects.length === 0) return "-";
    return teacherSubjects.map(s => s.name).join(", ");
  };

  const handleDeleteClick = (teacher) => {
    setSelectedTeacher(teacher);
    setModalOpen(true);
    setErrorMessage("");
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTeacher) return;

    setDeletingId(selectedTeacher._id);
    setModalOpen(false);
    
    try {
      const result = await deleteUser(selectedTeacher._id);
      if (result && result.status === 200) {
        setTeachers(teachers.filter(t => t._id !== selectedTeacher._id));
      } else {
        setErrorMessage(result?.message || "Chyba při mazání učitele");
        setModalOpen(true);
      }
    } catch (err) {
      setErrorMessage("Chyba při mazání učitele");
      setModalOpen(true);
      console.error("Error deleting teacher:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedTeacher(null);
    setErrorMessage("");
  };

  if (loading) {
    return (
      <div className="admin-teacher-page">
        <NavbarA isAdmin={true} />
        <main className="main-content">
          <div style={{ textAlign: "center", padding: "2rem" }}>Načítání...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-teacher-page">
      <NavbarA isAdmin={true} />

      <main className="main-content">
        <section className="list-card">
          <header className="card-header">
            <div className="icon-wrapper">
              <img src={people} alt="Učitelé" />
            </div>
            <h1>Seznam učitelů ({teachers.length})</h1>
          </header>

          <div className="card-body">
            <div className="table-header">
              <div className="col-id">ID</div>
              <div className="col-name">Jméno a příjmení</div>
              <div className="col-subjects">Vyučující předměty</div>
              <div className="col-actions">Akce</div>
            </div>

            <div className="table-content">
              {teachers.map((teacher) => (
                <div key={teacher._id} className="table-row">
                  <div className="col-id">{teacher._id.toString().slice(-6)}</div>
                  <div className="col-name">{teacher.first_name} {teacher.last_name}</div>
                  <div className="col-subjects">{getTeacherSubjects(teacher._id)}</div>
                  <div className="col-actions">
                    <button 
                      className="btn-edit" 
                      onClick={() => navigate(`/administrators/editTeacher/${teacher._id}`)}
                    >
                      Editace učitele
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDeleteClick(teacher)}
                      disabled={deletingId === teacher._id}
                    >
                      {deletingId === teacher._id ? "Mažu..." : "Smazat"}
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
        title={errorMessage ? "Chyba" : "Smazat učitele"}
        message={errorMessage || `Opravdu chcete smazat učitele ${selectedTeacher ? `${selectedTeacher.first_name} ${selectedTeacher.last_name}` : ""}?`}
        confirmText={errorMessage ? "Zavřít" : "Smazat"}
        cancelText={errorMessage ? null : "Zrušit"}
        type={errorMessage ? "confirm" : "danger"}
      />
    </div>
  );
}