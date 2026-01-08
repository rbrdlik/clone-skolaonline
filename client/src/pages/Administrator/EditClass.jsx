import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavbarA from "./NavbarA";
import NotificationToast from "../../components/Notification/Notification";
import { getClassById, updateClass } from "../../models/class";
import { getStudentsWithoutClass, getAllStudents } from "../../models/user";
import "../../scss/EditClass.scss";

export default function EditClass() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [allStudents, setAllStudents] = useState([]);
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [classRes, studentsWithoutClassRes, allStudentsRes] = await Promise.all([
          getClassById(id),
          getStudentsWithoutClass(),
          getAllStudents()
        ]);

        if (classRes && classRes.status === 200 && classRes.payload) {
          const classData = classRes.payload;
          setName(classData.name || "");
          
          const assigned = classData.students || [];
          setAssignedStudents(Array.isArray(assigned) ? assigned : []);
        }

        if (studentsWithoutClassRes && studentsWithoutClassRes.status === 200) {
          const students = Array.isArray(studentsWithoutClassRes.payload) 
            ? studentsWithoutClassRes.payload 
            : [];
          setAvailableStudents(students);
        }

        if (allStudentsRes && allStudentsRes.status === 200) {
          const students = Array.isArray(allStudentsRes.payload) 
            ? allStudentsRes.payload 
            : [];
          setAllStudents(students);
        }
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Chyba při načítání dat třídy");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadData();
    }
  }, [id]);

  useEffect(() => {
    const assignedIds = assignedStudents.map(s => {
      const studentId = typeof s === 'object' && s._id ? s._id.toString() : s.toString();
      return studentId;
    });
    
    const available = allStudents.filter(student => 
      !assignedIds.includes(student._id.toString())
    );
    setAvailableStudents(available);
  }, [assignedStudents, allStudents]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess("");
        navigate("/administrators/classes");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const handleAddStudent = (student) => {
    setAssignedStudents([...assignedStudents, student]);
  };

  const handleRemoveStudent = (student) => {
    setAssignedStudents(assignedStudents.filter(s => {
      const sId = typeof s === 'object' && s._id ? s._id.toString() : s.toString();
      return sId !== student._id.toString();
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    if (!name) {
      setError("Prosím vyplňte název třídy");
      setSaving(false);
      return;
    }

    try {
      const classData = {
        name,
        students: assignedStudents.map(s => {
          return typeof s === 'object' && s._id ? s._id : s;
        })
      };

      const result = await updateClass(id, classData);

      if (result && result.status === 200) {
        setSuccess("Třída byla úspěšně upravena");
      } else {
        setError(result?.message || "Chyba při úpravě třídy");
      }
    } catch (err) {
      setError("Chyba při úpravě třídy");
      console.error("Error updating class:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-class-page">
        <NavbarA isAdmin={true} />
        <main className="main-content">
          <div style={{ textAlign: "center", padding: "2rem" }}>Načítání...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="edit-class-page">
      <NavbarA isAdmin={true} />

      <main className="main-content">
        <section className="form-card">
          <header className="card-header">
            <div className="icon-wrapper">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4a90e2"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <h1>Upravit třídu ({name})</h1>
          </header>

          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="subject-flex-container">
                
                <div className="left-column">
                  <div className="form-group">
                    <label>Název třídy</label>
                    <input
                      type="text"
                      className="text-input"
                      placeholder="např. 1.Ai"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="right-column">
                  <div className="form-group">
                    <label>Přidat studenty</label>
                    <select
                      className="select-input"
                      value=""
                      onChange={(e) => {
                        if (e.target.value) {
                          const student = availableStudents.find(s => s._id === e.target.value);
                          if (student) {
                            handleAddStudent(student);
                            e.target.value = "";
                          }
                        }
                      }}
                      disabled={availableStudents.length === 0}
                    >
                      <option value="">Přidat studenta...</option>
                      {availableStudents.map((student) => (
                        <option key={student._id} value={student._id}>
                          {student.first_name} {student.last_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="assigned-list">
                    {assignedStudents.length === 0 ? (
                      <div style={{ padding: "1rem", color: "#999", textAlign: "center" }}>
                        Žádní studenti nejsou přiřazeni
                      </div>
                    ) : (
                      assignedStudents.map((student) => {
                        const studentObj = typeof student === 'object' ? student : allStudents.find(s => s._id.toString() === student.toString());
                        if (!studentObj) return null;
                        return (
                          <div key={studentObj._id} className="teacher-item">
                            <span>{studentObj.first_name} {studentObj.last_name}</span>
                            <button
                              type="button"
                              className="btn-remove"
                              onClick={() => handleRemoveStudent(studentObj)}
                            >
                              Odebrat
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

              </div>

              <footer className="card-footer">
                <button
                  type="submit"
                  className="btn-create"
                  disabled={saving}
                  style={{ width: "100%" }}
                >
                  {saving ? "Ukládání..." : "Upravit"}
                </button>
              </footer>
            </form>
          </div>
        </section>
      </main>

      <NotificationToast
        message={success}
        type="success"
        isVisible={!!success}
        onClose={() => setSuccess("")}
      />

      <NotificationToast
        message={error}
        type="error"
        isVisible={!!error}
        onClose={() => setError("")}
      />
    </div>
  );
}