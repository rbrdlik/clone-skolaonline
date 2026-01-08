import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavbarA from "./NavbarA";
import NotificationToast from "../../components/Notification/Notification";
import { getUserById, updateUser } from "../../models/user";
import "../../scss/EditTeacher.scss";

export default function EditTeacher() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const userRes = await getUserById(id);

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
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Chyba při načítání dat učitele");
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
        navigate("/administrators/teachers");
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
        setSuccess("Učitel byl úspěšně upraven");
      } else {
        setError(result?.message || "Chyba při úpravě učitele");
      }
    } catch (err) {
      setError("Chyba při úpravě učitele");
      console.error("Error updating teacher:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-teacher-page">
        <NavbarA isAdmin={true} />
        <main className="main-content">
          <div style={{ textAlign: "center", padding: "2rem" }}>Načítání...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="edit-teacher-page">
      <NavbarA isAdmin={true} />

      <main className="main-content">
        <section className="form-card">
          <header className="card-header">
            <div className="icon-wrapper blue-circle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h1>Upravit učitele ({firstName} {lastName})</h1>
          </header>

          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-grid first-row">
                <div className="form-group">
                  <label>Jméno učitele</label>
                  <input
                    type="text"
                    className="gray-input"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Příjmení učitele</label>
                  <input
                    type="text"
                    className="gray-input"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Přihlašovací jméno učitele</label>
                  <input
                    type="text"
                    className="gray-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Přihlašovací heslo učitele</label>
                  <input
                    type="password"
                    className="gray-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-grid second-row">
                <div className="form-group">
                  <label>Email učitele</label>
                  <input
                    type="email"
                    className="gray-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Datum narození učitele</label>
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
                <div className="form-group empty"></div>
              </div>

              <footer className="form-footer">
                <button
                  type="submit"
                  className="btn-save"
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