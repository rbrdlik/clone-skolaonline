import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar/Navbar";
import NavbarA from "../Administrator/NavbarA";
import "../../scss/Profile.scss";
import signedinuser from "../../assets/icons/signedin-user.png";

export default function Profile() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  if (!user) {
    return (
      <div className="profile-page">
        {isAdmin ? <NavbarA /> : <Navbar />}
        <main className="main-content">
          <div style={{ textAlign: "center", padding: "2rem" }}>Načítání...</div>
        </main>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("cs-CZ", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    } catch {
      return dateString;
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "admin":
        return "Administrátor/ka";
      case "učitel":
        return "Učitel/ka";
      case "student":
        return "Student/ka";
      default:
        return role || "-";
    }
  };

  const getGenderLabel = (gender) => {
    switch (gender) {
      case "muž":
        return "Muž";
      case "žena":
        return "Žena";
      default:
        return gender || "-";
    }
  };

  return (
    <div className="profile-page">
      {isAdmin ? <NavbarA /> : <Navbar />}

      <main className="main-content">
        <section className="profile-card">
          <div className="card-body">
            <div className="profile-avatar-section">
              <img src={signedinuser} alt="Avatar" className="profile-avatar" />
            </div>

            <div className="profile-info-grid">
              <div className="info-row">
                <div className="info-label">Jméno</div>
                <div className="info-value">
                  {user.title ? `${user.title} ` : ""}
                  {user.first_name || "-"}
                </div>
              </div>

              <div className="info-row">
                <div className="info-label">Příjmení</div>
                <div className="info-value">{user.last_name || "-"}</div>
              </div>

              <div className="info-row">
                <div className="info-label">Přihlašovací jméno</div>
                <div className="info-value">{user.username || "-"}</div>
              </div>

              <div className="info-row">
                <div className="info-label">Email</div>
                <div className="info-value">{user.email || "-"}</div>
              </div>

              <div className="info-row">
                <div className="info-label">Role</div>
                <div className="info-value">{getRoleLabel(user.role)}</div>
              </div>

              {user.date_of_birth && (
                <div className="info-row">
                  <div className="info-label">Datum narození</div>
                  <div className="info-value">{formatDate(user.date_of_birth)}</div>
                </div>
              )}

              {user.gender && (
                <div className="info-row">
                  <div className="info-label">Pohlaví</div>
                  <div className="info-value">{getGenderLabel(user.gender)}</div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
