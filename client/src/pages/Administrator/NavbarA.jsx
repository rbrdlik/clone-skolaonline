import { NavLink, useNavigate } from "react-router-dom";
import "../../scss/NavbarA.scss";
import logo from "../../assets/icons/logo-notext.png";
import avatar from "../../assets/icons/signedin-user.png";

export default function NavbarA() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <header className="header-admin">
      {/* HORNÍ ČÁST (TOPBAR) */}
      <div className="topbar">
        <div className="topbar-left" onClick={() => navigate("/")} style={{cursor: 'pointer'}}>
          <img src={logo} alt="Logo" className="logo" />
          <span className="app-name">MojeŠkola</span>
        </div>

        <div className="topbar-right">
          <img src={avatar} alt="Iva Lišková" className="user-avatar" />
          <div className="user-text">
            <div className="user-name">Iva Lišková</div>
            <div className="user-role">Administrátor/ka</div>
          </div>
          <div className="vertical-divider"></div>
          <button className="logout-btn" onClick={() => navigate("/login")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>

      <nav className="nav">
        <NavLink to="/administrators/students" className="nav-link">Seznam studentů</NavLink>
        <NavLink to="/administrators/newStudent" className="nav-link">Vytvořit studenta</NavLink>
        <NavLink to="/administrators/teachers" className="nav-link">Seznam učitelů</NavLink>
        <NavLink to="/administrators/newTeacher" className="nav-link">Vytvořit učitele</NavLink>
        <NavLink to="/administrators/subjects" className="nav-link">Seznam předmětů</NavLink>
        <NavLink to="/administrators/newSubject" className="nav-link">Vytvořit předmět</NavLink>
        <NavLink to="/administrators/classes" className="nav-link">Seznam tříd</NavLink>
        <NavLink to="/administrators/newClass" className="nav-link">Vytvořit třídu</NavLink>
      </nav>
    </header>
  );
}