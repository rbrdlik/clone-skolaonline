import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavbarA from "./NavbarA";
import NotificationToast from "../../components/Notification/Notification";
import { getSubjectById, updateSubject } from "../../models/subject";
import { getAllTeachers } from "../../models/user";
import "../../scss/EditSubject.scss";

export default function EditSubject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [allTeachers, setAllTeachers] = useState([]);
  const [assignedTeachers, setAssignedTeachers] = useState([]);
  const [availableTeachers, setAvailableTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [subjectRes, teachersRes] = await Promise.all([
          getSubjectById(id),
          getAllTeachers()
        ]);

        if (subjectRes && subjectRes.status === 200 && subjectRes.payload) {
          const subject = subjectRes.payload;
          setName(subject.name || "");
          setShortName(subject.short_name || "");
          
          const assigned = subject.teachers || [];
          setAssignedTeachers(Array.isArray(assigned) ? assigned : []);
        }

        if (teachersRes && teachersRes.status === 200) {
          const teachers = teachersRes.payload || [];
          setAllTeachers(teachers);
        }
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Chyba při načítání dat předmětu");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadData();
    }
  }, [id]);

  useEffect(() => {
    const assignedIds = assignedTeachers.map(t => {
      const teacherId = typeof t === 'object' && t._id ? t._id.toString() : t.toString();
      return teacherId;
    });
    
    const available = allTeachers.filter(teacher => 
      !assignedIds.includes(teacher._id.toString())
    );
    setAvailableTeachers(available);
  }, [assignedTeachers, allTeachers]);

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
        navigate("/administrators/subjects");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const handleAddTeacher = (teacher) => {
    setAssignedTeachers([...assignedTeachers, teacher]);
  };

  const handleRemoveTeacher = (teacher) => {
    setAssignedTeachers(assignedTeachers.filter(t => {
      const tId = typeof t === 'object' && t._id ? t._id.toString() : t.toString();
      return tId !== teacher._id.toString();
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    if (!name || !shortName) {
      setError("Prosím vyplňte název a zkratku předmětu");
      setSaving(false);
      return;
    }

    if (shortName.length > 4) {
      setError("Zkratka může mít maximálně 4 znaky");
      setSaving(false);
      return;
    }

    try {
      const subjectData = {
        name,
        short_name: shortName,
        teachers: assignedTeachers.map(t => {
          return typeof t === 'object' && t._id ? t._id : t;
        })
      };

      const result = await updateSubject(id, subjectData);

      if (result && result.status === 200) {
        setSuccess("Předmět byl úspěšně upraven");
      } else {
        setError(result?.message || "Chyba při úpravě předmětu");
      }
    } catch (err) {
      setError("Chyba při úpravě předmětu");
      console.error("Error updating subject:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-subject-page">
        <NavbarA isAdmin={true} />
        <main className="main-content">
          <div style={{ textAlign: "center", padding: "2rem" }}>Načítání...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="edit-subject-page">
      <NavbarA isAdmin={true} />

      <main className="main-content">
        <section className="form-card">
          <header className="card-header">
            <div className="icon-wrapper">
              <span className="doc-icon">📄</span>
            </div>
            <h1>Upravit předmět ({name})</h1>
          </header>

          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="subject-flex-container">
                
                <div className="left-column">
                  <div className="form-group">
                    <label>Celý název předmětu</label>
                    <input
                      type="text"
                      className="text-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Zkratka předmětu (Max 4 znaky)</label>
                    <input
                      type="text"
                      className="text-input"
                      maxLength="4"
                      value={shortName}
                      onChange={(e) => setShortName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="right-column">
                  <div className="form-group">
                    <label>Učitelé vyučující tento předmět</label>
                    <select
                      className="select-input"
                      value=""
                      onChange={(e) => {
                        if (e.target.value) {
                          const teacher = availableTeachers.find(t => t._id === e.target.value);
                          if (teacher) {
                            handleAddTeacher(teacher);
                            e.target.value = "";
                          }
                        }
                      }}
                      disabled={availableTeachers.length === 0}
                    >
                      <option value="">Přidat učitele...</option>
                      {availableTeachers.map((teacher) => (
                        <option key={teacher._id} value={teacher._id}>
                          {teacher.first_name} {teacher.last_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="assigned-list">
                    {assignedTeachers.length === 0 ? (
                      <div style={{ padding: "1rem", color: "#999", textAlign: "center" }}>
                        Žádní učitelé nejsou přiřazeni
                      </div>
                    ) : (
                      assignedTeachers.map((teacher) => {
                        const teacherObj = typeof teacher === 'object' ? teacher : allTeachers.find(t => t._id.toString() === teacher.toString());
                        if (!teacherObj) return null;
                        return (
                          <div key={teacherObj._id} className="teacher-item">
                            <span>{teacherObj.first_name} {teacherObj.last_name}</span>
                            <button
                              type="button"
                              className="btn-remove"
                              onClick={() => handleRemoveTeacher(teacherObj)}
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