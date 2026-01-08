import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarA from "./NavbarA";
import Modal from "../../components/Modal";
import { getAllClasses, deleteClass } from "../../models/class";
import "../../scss/ClassesA.scss";

export default function ClassesA() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

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

  const handleDeleteClick = (classItem) => {
    setSelectedClass(classItem);
    setModalOpen(true);
    setErrorMessage("");
  };

  const handleDeleteConfirm = async () => {
    if (!selectedClass) return;

    setDeletingId(selectedClass._id);
    setModalOpen(false);
    
    try {
      const result = await deleteClass(selectedClass._id);
      if (result && result.status === 200) {
        setClasses(classes.filter(c => c._id !== selectedClass._id));
      } else {
        setErrorMessage(result?.message || "Chyba při mazání třídy");
        setModalOpen(true);
      }
    } catch (err) {
      setErrorMessage("Chyba při mazání třídy");
      setModalOpen(true);
      console.error("Error deleting class:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedClass(null);
    setErrorMessage("");
  };

  if (loading) {
    return (
      <div className="admin-class-page">
        <NavbarA isAdmin={true} />
        <main className="main-content">
          <div style={{ textAlign: "center", padding: "2rem" }}>Načítání...</div>
        </main>
      </div>
    );
  }

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
            <h1>Seznam tříd ({classes.length})</h1>
          </header>

          <div className="card-body">
            <div className="table-header">
              <div className="col-id">ID</div>
              <div className="col-class">Třída</div>
              <div className="col-students">Počet studentů</div>
              <div className="col-actions">Akce</div>
            </div>

            <div className="table-content">
              {classes.map((classItem) => (
                <div key={classItem._id} className="table-row">
                  <div className="col-id">{classItem._id.toString().slice(-6)}</div>
                  <div className="col-class">{classItem.name}</div>
                  <div className="col-students">{getStudentCount(classItem)}</div>
                  <div className="col-actions">
                    <button 
                      className="btn-blue" 
                      onClick={() => navigate(`/administrators/timetable/${classItem._id}`)}
                    >
                      Rozvrh
                    </button>
                    <button 
                      className="btn-blue" 
                      onClick={() => navigate(`/administrators/editClass/${classItem._id}`)}
                    >
                      Editace třídy
                    </button>
                    <button 
                      className="btn-red"
                      onClick={() => handleDeleteClick(classItem)}
                      disabled={deletingId === classItem._id}
                    >
                      {deletingId === classItem._id ? "Mažu..." : "Smazat"}
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
        title={errorMessage ? "Chyba" : "Smazat třídu"}
        message={errorMessage || `Opravdu chcete smazat třídu ${selectedClass ? selectedClass.name : ""}?`}
        confirmText={errorMessage ? "Zavřít" : "Smazat"}
        cancelText={errorMessage ? null : "Zrušit"}
        type={errorMessage ? "confirm" : "danger"}
      />
    </div>
  );
}