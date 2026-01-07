import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarA from "./NavbarA";
import Modal from "../../components/Modal";
import { getAllSubjects, deleteSubject } from "../../models/subject";
import "../../scss/Subjects.scss";

export default function Subjects() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const subjectsRes = await getAllSubjects();
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

  const getTeacherCount = (subject) => {
    if (!subject.teachers || !Array.isArray(subject.teachers)) return 0;
    return subject.teachers.length;
  };

  const handleDeleteClick = (subject) => {
    setSelectedSubject(subject);
    setModalOpen(true);
    setErrorMessage("");
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSubject) return;

    setDeletingId(selectedSubject._id);
    setModalOpen(false);
    
    try {
      const result = await deleteSubject(selectedSubject._id);
      if (result && result.status === 200) {
        setSubjects(subjects.filter(s => s._id !== selectedSubject._id));
      } else {
        setErrorMessage(result?.message || "Chyba při mazání předmětu");
        setModalOpen(true);
      }
    } catch (err) {
      setErrorMessage("Chyba při mazání předmětu");
      setModalOpen(true);
      console.error("Error deleting subject:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedSubject(null);
    setErrorMessage("");
  };

  if (loading) {
    return (
      <div className="subject-list-page">
        <NavbarA isAdmin={true} />
        <main className="main-content">
          <div style={{ textAlign: "center", padding: "2rem" }}>Načítání...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="subject-list-page">
      <NavbarA isAdmin={true} />

      <main className="main-content">
        <section className="list-card">
          <header className="card-header">
            <div className="icon-wrapper blue-circle">
              <span className="doc-icon">📄</span>
            </div>
            <h1>Seznam předmětů ({subjects.length})</h1>
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
              {subjects.map((subject) => (
                <div key={subject._id} className="table-row">
                  <div className="col-id">{subject._id.toString().slice(-6)}</div>
                  <div className="col-code">{subject.short_name}</div>
                  <div className="col-name">{subject.name}</div>
                  <div className="col-count">{getTeacherCount(subject)}</div>
                  <div className="col-actions">
                    <button 
                      className="btn-edit" 
                      onClick={() => navigate(`/administrators/editSubject/${subject._id}`)}
                    >
                      Editace předmětu
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDeleteClick(subject)}
                      disabled={deletingId === subject._id}
                    >
                      {deletingId === subject._id ? "Mažu..." : "Smazat"}
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
        title={errorMessage ? "Chyba" : "Smazat předmět"}
        message={errorMessage || `Opravdu chcete smazat předmět ${selectedSubject ? selectedSubject.name : ""}?`}
        confirmText={errorMessage ? "Zavřít" : "Smazat"}
        cancelText={errorMessage ? null : "Zrušit"}
        type={errorMessage ? "confirm" : "danger"}
      />
    </div>
  );
}