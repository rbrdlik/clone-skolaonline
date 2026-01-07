import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarA from "./NavbarA";
import NotificationToast from "../../components/Notification/Notification";
import { createSubject } from "../../models/subject";
import { getAllTeachers } from "../../models/user";
import "../../scss/NewSubject.scss";

export default function NewSubject() {
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
    const loadTeachers = async () => {
      try {
        const teachersRes = await getAllTeachers();
        if (teachersRes && teachersRes.status === 200) {
          const teachers = teachersRes.payload || [];
          setAllTeachers(teachers);
          setAvailableTeachers(teachers);
        }
      } catch (err) {
        console.error("Error loading teachers:", err);
      } finally {
        setLoading(false);
      }
    };
    loadTeachers();
  }, []);

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
    setAvailableTeachers(availableTeachers.filter(t => t._id !== teacher._id));
  };

  const handleRemoveTeacher = (teacher) => {
    setAssignedTeachers(assignedTeachers.filter(t => t._id !== teacher._id));
    setAvailableTeachers([...availableTeachers, teacher]);
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
        teachers: assignedTeachers.map(t => t._id)
      };

      const result = await createSubject(subjectData);

      if (result && result.status === 201) {
        setSuccess("Předmět byl úspěšně vytvořen");
        setName("");
        setShortName("");
        setAssignedTeachers([]);
        setAvailableTeachers(allTeachers);
      } else {
        setError(result?.message || "Chyba při vytváření předmětu");
      }
    } catch (err) {
      setError("Chyba při vytváření předmětu");
      console.error("Error creating subject:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="create-subject-page">
        <NavbarA isAdmin={true} />
        <main className="main-content">
          <div style={{ textAlign: "center", padding: "2rem" }}>Načítání...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="create-subject-page">
      <NavbarA isAdmin={true} />

      <main className="main-content">
        <section className="form-card">
          <header className="card-header">
            <div className="icon-wrapper">
              <span className="doc-icon">📄</span>
            </div>
            <h1>Nový předmět</h1>
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
                      assignedTeachers.map((teacher) => (
                        <div key={teacher._id} className="teacher-item">
                          <span>{teacher.first_name} {teacher.last_name}</span>
                          <button
                            type="button"
                            className="btn-remove"
                            onClick={() => handleRemoveTeacher(teacher)}
                          >
                            Odebrat
                          </button>
                        </div>
                      ))
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
                  {saving ? "Vytváření..." : "Vytvořit"}
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