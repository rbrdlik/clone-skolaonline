import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Modal from "../../components/Modal";
import NotificationToast from "../../components/Notification/Notification";
import { getAllStudents } from "../../models/user";
import { getAllStudentGrades, updateGrade, deleteGrade } from "../../models/grade";
import { format, parseISO } from "date-fns";
import cs from "date-fns/locale/cs";
import "../../scss/StudentGrades.scss";
import calendar from "../../assets/icons/calendar.png";

const GRADE_VALUES = {
  "1": 1,
  "1-": 1.5,
  "2": 2,
  "2-": 2.5,
  "3": 3,
  "3-": 3.5,
  "4": 4,
  "4-": 4.5,
  "5": 5,
  "NH": 0
};

const GRADE_OPTIONS = ["1", "1-", "2", "2-", "3", "3-", "4", "4-", "5", "NH"];

export default function StudentGrades() {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gradesLoading, setGradesLoading] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [gradeToDelete, setGradeToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const studentsRes = await getAllStudents();
        if (studentsRes && studentsRes.status === 200) {
          const studentsData = Array.isArray(studentsRes.payload) 
            ? studentsRes.payload 
            : (studentsRes.payload?.payload || []);
          setStudents(studentsData);
        }
      } catch (err) {
        console.error("Error loading students:", err);
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, []);

  useEffect(() => {
    if (!selectedStudentId) {
      setGrades([]);
      return;
    }

    const loadGrades = async () => {
      setGradesLoading(true);
      try {
        const gradesRes = await getAllStudentGrades(selectedStudentId);
        if (gradesRes && gradesRes.status === 200) {
          const gradesData = Array.isArray(gradesRes.payload) 
            ? gradesRes.payload 
            : [];
          setGrades(gradesData);
        }
      } catch (err) {
        console.error("Error loading grades:", err);
        setErrorMessage("Chyba při načítání známek");
      } finally {
        setGradesLoading(false);
      }
    };

    loadGrades();
  }, [selectedStudentId]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
      return format(date, "d.M.yyyy", { locale: cs });
    } catch {
      return dateString;
    }
  };

  const handleEdit = (grade) => {
    setEditingGrade({
      ...grade,
      value: grade.value === "NH" ? "NH" : grade.value.toString()
    });
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSaveEdit = async () => {
    if (!editingGrade) return;

    try {
      const result = await updateGrade(editingGrade._id, {
        value: editingGrade.value,
        weight: editingGrade.weight,
        description: editingGrade.description || ""
      });

      if (result && result.status === 200) {
        setGrades(grades.map(g => 
          g._id === editingGrade._id ? result.payload : g
        ));
        setEditingGrade(null);
        setSuccessMessage("Známka byla úspěšně upravena");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrorMessage(result?.message || "Chyba při úpravě známky");
      }
    } catch (err) {
      console.error("Error updating grade:", err);
      setErrorMessage("Chyba při úpravě známky");
    }
  };

  const handleDeleteClick = (grade) => {
    setGradeToDelete(grade);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!gradeToDelete) return;

    try {
      const result = await deleteGrade(gradeToDelete._id);
      if (result && result.status === 200) {
        setGrades(grades.filter(g => g._id !== gradeToDelete._id));
        setDeleteModalOpen(false);
        setGradeToDelete(null);
        setSuccessMessage("Známka byla úspěšně smazána");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrorMessage(result?.message || "Chyba při mazání známky");
        setDeleteModalOpen(false);
      }
    } catch (err) {
      console.error("Error deleting grade:", err);
      setErrorMessage("Chyba při mazání známky");
      setDeleteModalOpen(false);
    }
  };

  const selectedStudent = students.find(s => s._id === selectedStudentId);

  if (loading) {
    return (
      <div className="student-grades-page">
        <Navbar />
        <main className="main-content">
          <div style={{ textAlign: "center", padding: "2rem" }}>Načítání...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="student-grades-page">
      <Navbar />
      
      <main className="main-content">
        <section className="grades-card">
          <header className="card-header">
            <div className="icon-wrapper">
              <img src={calendar} alt="" />
            </div>
            <h1>Známky studentů</h1>
          </header>

          <div className="card-body">
            <div className="student-select-section">
              <label>Vyberte studenta:</label>
              <select 
                className="select-input"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
              >
                <option value="">-- Vyberte studenta --</option>
                {students.map(student => (
                  <option key={student._id} value={student._id}>
                    {student.title ? `${student.title} ` : ""}
                    {student.first_name} {student.last_name}
                  </option>
                ))}
              </select>
            </div>

            {selectedStudentId && (
              <>
                {gradesLoading ? (
                  <div style={{ textAlign: "center", padding: "2rem" }}>Načítání známek...</div>
                ) : (
                  <>
                    {grades.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "2rem" }}>
                        Student nemá žádné známky
                      </div>
                    ) : (
                      <div className="grades-table">
                        <div className="table-header">
                          <div className="col-date">Datum</div>
                          <div className="col-subject">Předmět</div>
                          <div className="col-teacher">Učitel</div>
                          <div className="col-grade">Známka</div>
                          <div className="col-weight">Váha</div>
                          <div className="col-description">Popis</div>
                          <div className="col-actions">Akce</div>
                        </div>

                        <div className="table-content">
                          {grades.map((grade) => (
                            <div key={grade._id} className="table-row">
                              {editingGrade && editingGrade._id === grade._id ? (
                                <>
                                  <div className="col-date">{formatDate(grade.date)}</div>
                                  <div className="col-subject">{grade.subjectShort || grade.subject}</div>
                                  <div className="col-teacher">{grade.teacher}</div>
                                  <div className="col-grade">
                                    <select
                                      className="select-input small"
                                      value={editingGrade.value}
                                      onChange={(e) => setEditingGrade({...editingGrade, value: e.target.value})}
                                    >
                                      {GRADE_OPTIONS.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="col-weight">
                                    <input
                                      type="number"
                                      className="text-input small"
                                      min="1"
                                      max="10"
                                      value={editingGrade.weight}
                                      onChange={(e) => setEditingGrade({...editingGrade, weight: parseInt(e.target.value) || 1})}
                                    />
                                  </div>
                                  <div className="col-description">
                                    <input
                                      type="text"
                                      className="text-input small"
                                      value={editingGrade.description || ""}
                                      onChange={(e) => setEditingGrade({...editingGrade, description: e.target.value})}
                                      placeholder="Popis..."
                                    />
                                  </div>
                                  <div className="col-actions">
                                    <button 
                                      className="btn-action save"
                                      onClick={handleSaveEdit}
                                    >
                                      Uložit
                                    </button>
                                    <button 
                                      className="btn-action cancel"
                                      onClick={() => setEditingGrade(null)}
                                    >
                                      Zrušit
                                    </button>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="col-date">{formatDate(grade.date)}</div>
                                  <div className="col-subject">{grade.subjectShort || grade.subject}</div>
                                  <div className="col-teacher">{grade.teacher}</div>
                                  <div className="col-grade">{grade.value}</div>
                                  <div className="col-weight">{grade.weight}</div>
                                  <div className="col-description">{grade.description || "-"}</div>
                                  <div className="col-actions">
                                    <button 
                                      className="btn-action edit"
                                      onClick={() => handleEdit(grade)}
                                    >
                                      Upravit
                                    </button>
                                    <button 
                                      className="btn-action delete"
                                      onClick={() => handleDeleteClick(grade)}
                                    >
                                      Smazat
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setGradeToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        type="danger"
        title="Smazat známku"
        message={`Opravdu chcete smazat známku ${gradeToDelete?.value} z předmětu ${gradeToDelete?.subjectShort || gradeToDelete?.subject}?`}
      />

      <NotificationToast
        message={successMessage}
        type="success"
        isVisible={!!successMessage}
        onClose={() => setSuccessMessage("")}
      />

      <NotificationToast
        message={errorMessage}
        type="error"
        isVisible={!!errorMessage}
        onClose={() => setErrorMessage("")}
      />
    </div>
  );
}
