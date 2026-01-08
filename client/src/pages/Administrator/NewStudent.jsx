import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarA from "./NavbarA";
import NotificationToast from "../../components/Notification/Notification";
import { createUser } from "../../models/user";
import "../../scss/NewStudent.scss";

export default function NewStudent() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    setLoading(true);

    if (!firstName || !lastName || !username || !password || !email || !dateOfBirth || !gender) {
      setError("Prosím vyplňte všechna pole");
      setLoading(false);
      return;
    }

    try {
      const userData = {
        first_name: firstName,
        last_name: lastName,
        username,
        password,
        email,
        date_of_birth: dateOfBirth,
        gender: gender === "male" ? "muž" : "žena",
        role: "student"
      };

      const result = await createUser(userData);

      if (result && result.status === 201) {
        setSuccess("Student byl úspěšně vytvořen");
        setFirstName("");
        setLastName("");
        setUsername("");
        setPassword("");
        setEmail("");
        setDateOfBirth("");
        setGender("");
      } else {
        setError(result?.message || "Chyba při vytváření studenta");
      }
    } catch (err) {
      setError("Chyba při vytváření studenta");
      console.error("Error creating student:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-student-page">
      <NavbarA isAdmin={true} />

      <main className="main-content">
        <section className="form-card">
          <header className="card-header">
            <div className="icon-wrapper">
              <span className="user-plus-icon">👥</span>
            </div>
            <h1>Nový student</h1>
          </header>

          <div className="card-body">
            <form className="student-grid-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Jméno studenta</label>
                <input
                  type="text"
                  className="text-input"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Příjmení studenta</label>
                <input
                  type="text"
                  className="text-input"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Přihlašovací jméno studenta</label>
                <input
                  type="text"
                  className="text-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Přihlašovací heslo studenta</label>
                <input
                  type="password"
                  className="text-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email studenta</label>
                <input
                  type="email"
                  className="text-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Datum narození studenta</label>
                <input
                  type="date"
                  className="text-input"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Pohlaví</label>
                <select
                  className="select-input"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                >
                  <option value="" disabled>Výběr...</option>
                  <option value="male">Muž</option>
                  <option value="female">Žena</option>
                </select>
              </div>

            </form>

            <footer className="card-footer">
              <button
                type="submit"
                className="btn-create"
                disabled={loading}
                onClick={handleSubmit}
              >
                {loading ? "Vytváření..." : "Vytvořit"}
              </button>
            </footer>
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