import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavbarA from "./NavbarA";
import NotificationToast from "../../components/Notification/Notification";
import { getUserById, updateUser } from "../../models/user";
import { getAllClasses } from "../../models/class";
import "../../scss/EditStudent.scss";

export default function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [classId, setClassId] = useState("");
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const userRes = await getUserById(id);
        const classesRes = await getAllClasses();

        if (userRes && userRes.status === 200 && userRes.payload) {
          const user = userRes.payload;
          setFirstName(user.first_name || "");
          setLastName(user.last_name || "");
          setUsername(user.username || "");
          setEmail(user.email || "");
          if (user.date_of_birth) {
            const date = new Date(user.date_of_birth);
            setDateOfBirth(date.toISOString().split('T')[0]);
          }
          setGender(user.gender === "muž" ? "male" : user.gender === "žena" ? "female" : "");
        }

        if (classesRes && classesRes.status === 200) {
          setClasses(classesRes.payload || []);
          const userRes = await getUserById(id);
          if (userRes && userRes.status === 200 && userRes.payload) {
            const user = userRes.payload;
            const studentClass = classesRes.payload.find(cls => 
              cls.students && cls.students.some(sId => sId.toString() === user._id.toString())
            );
            if (studentClass) {
              setClassId(studentClass._id);
            }
          }
        }
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Chyba při načítání dat studenta");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadData();
    }
  }, [id]);

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
        navigate("/administrators/students");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    if (!firstName || !lastName || !username || !email || !dateOfBirth || !gender) {
      setError("Prosím vyplňte všechna povinná pole");
      setSaving(false);
      return;
    }

    try {
      const userData = {
        first_name: firstName,
        last_name: lastName,
        username,
        email,
        date_of_birth: dateOfBirth,
        gender: gender === "male" ? "muž" : "žena"
      };

      if (password) {
        userData.password = password;
      }

      const result = await updateUser(id, userData);

      if (result && result.status === 200) {
        setSuccess("Student byl úspěšně upraven");
      } else {
        setError(result?.message || "Chyba při úpravě studenta");
      }
    } catch (err) {
      setError("Chyba při úpravě studenta");
      console.error("Error updating student:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-student-page">
        <NavbarA isAdmin={true} />
        <main className="main-content">
          <div style={{ textAlign: "center", padding: "2rem" }}>Načítání...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="edit-student-page">
      <NavbarA isAdmin={true} />

      <main className="main-content">
        <section className="form-card">
          <header className="card-header">
            <div className="icon-wrapper blue-circle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h1>Upravit studenta ({firstName} {lastName})</h1>
          </header>

          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Jméno studenta</label>
                  <input
                    type="text"
                    className="gray-input"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Příjmení studenta</label>
                  <input
                    type="text"
                    className="gray-input"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Přihlašovací jméno studenta</label>
                  <input
                    type="text"
                    className="gray-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Přihlašovací heslo studenta</label>
                  <input
                    type="password"
                    className="gray-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Email studenta</label>
                  <input
                    type="email"
                    className="gray-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Datum narození studenta</label>
                  <input
                    type="date"
                    className="gray-input"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Pohlaví</label>
                  <select
                    className="gray-select"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                  >
                    <option value="">Výběr...</option>
                    <option value="male">Muž</option>
                    <option value="female">Žena</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Přiřadit třídu</label>
                  <select
                    className="gray-select"
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                  >
                    <option value="">Výběr...</option>
                    {classes.map(cls => (
                      <option key={cls._id} value={cls._id}>{cls.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <footer className="form-footer">
                <button
                  type="submit"
                  className="btn-save"
                  disabled={saving}
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