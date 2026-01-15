import { NavLink, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../scss/Navbar.scss";
import logo from "../../assets/icons/logo-notext.png";
import signedinuser from "../../assets/icons/signedin-user.png";

export default function Navbar() {
  const navigate = useNavigate();
  const { user } = useAuth(); 

  const handleLogout = () => {
    navigate("/signin");
  };

  return (
    <>
      <header className="header">
        <div className="topbar">
          <Link to="/" className="topbar-left" style={{ textDecoration: 'none', color: 'inherit' }}>
            <img src={logo} alt="MojeŠkola" className="logo" />
            <span className="app-name">MojeŠkola</span>
          </Link>

          <div className="topbar-right">
            <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <img src={signedinuser} alt="uživatel" className="user-avatar" />

              <div className="user-text">
                <div className="user-name">
                  {user?.title ? `${user.title} ` : ""}
                  {user?.first_name || ""} {user?.last_name || ""}
                  {!user?.first_name && !user?.last_name && "Uživatel"}
                </div>
                <div className="user-role">
                  {user?.role === "admin" ? "Administrátor/ka" : 
                   user?.role === "učitel" ? "Učitel/ka" : 
                   user?.role === "student" ? "Student/ka" : 
                   "Uživatel"}
                </div>
              </div>
            </Link>

            <span className="vertical-divider" />

            <button 
              className="logout-btn" 
              aria-label="Odhlásit se"
              onClick={handleLogout}
            >
              <svg viewBox="0 0 640 640">
                <path d="M569 337C578.4 327.6 578.4 312.4 569 303.1L425 159C418.1 152.1 407.8 150.1 398.8 153.8C389.8 157.5 384 166.3 384 176L384 256L272 256C245.5 256 224 277.5 224 304L224 336C224 362.5 245.5 384 272 384L384 384L384 464C384 473.7 389.8 482.5 398.8 486.2C407.8 489.9 418.1 487.9 425 481L569 337zM224 160C241.7 160 256 145.7 256 128C256 110.3 241.7 96 224 96L160 96C107 96 64 139 64 192L64 448C64 501 107 544 160 544L224 544C241.7 544 256 529.7 256 512C256 494.3 241.7 480 224 480L160 480C142.3 480 128 465.7 128 448L128 192C128 174.3 142.3 160 160 160L224 160z" />
              </svg>
            </button>
          </div>
        </div>

        <nav className="nav">
          <NavLink to="/" className="nav-link">
            Můj rozvrh
          </NavLink>
          <NavLink to="/classes" className="nav-link">
            Seznam tříd
          </NavLink>
          <NavLink to="/messages" className="nav-link">
            Odeslat zprávu
          </NavLink>
          <NavLink to="/student-grades" className="nav-link">
            Známky studentů
          </NavLink>
          {user?.role === "admin" && (
            <NavLink to="/administrators/students" className="nav-link">
              Pohled administrátora
            </NavLink>
          )}
        </nav>
      </header>
    </>
  );
}