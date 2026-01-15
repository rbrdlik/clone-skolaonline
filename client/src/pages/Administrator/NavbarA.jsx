import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../scss/NavbarA.scss";
import logo from "../../assets/icons/logo-notext.png";
import avatar from "../../assets/icons/signedin-user.png";

export default function NavbarA() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRefs = {
    students: useRef(null),
    teachers: useRef(null),
    subjects: useRef(null),
    classes: useRef(null)
  };

  // Zavření dropdown při kliknutí mimo
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Zkontrolujeme, jestli kliknutí nebylo na link v dropdown menu
      const isDropdownLink = event.target.closest('.dropdown-item');
      if (isDropdownLink) {
        return; // Nezavíráme, pokud je to kliknutí na link
      }

      Object.values(dropdownRefs).forEach(ref => {
        if (ref.current && !ref.current.contains(event.target)) {
          setOpenDropdown(null);
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Zavření dropdown při změně route
  useEffect(() => {
    setOpenDropdown(null);
  }, [location.pathname]);

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  // Zkontrolujeme, jestli je některá z položek v dropdown aktivní
  const isDropdownActive = (paths) => {
    return paths.some(path => location.pathname.startsWith(path));
  };

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
          <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <img src={avatar} alt="Uživatel" className="user-avatar" />
            <div className="user-text">
              <div className="user-name">
                {user?.title ? `${user.title} ` : ""}
                {user?.first_name || ""} {user?.last_name || ""}
                {!user?.first_name && !user?.last_name && "Uživatel"}
              </div>
              <div className="user-role">Administrátor/ka</div>
            </div>
          </Link>
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

      <nav className="nav" id="redbackground">
        <div className="nav-dropdown" ref={dropdownRefs.students}>
          <button 
            className={`nav-link dropdown-toggle ${openDropdown === 'students' || isDropdownActive(['/administrators/students', '/administrators/newStudent']) ? 'active' : ''}`}
            onClick={() => toggleDropdown('students')}
          >
            Studenti
            <svg 
              className={`dropdown-arrow ${openDropdown === 'students' ? 'open' : ''}`}
              width="12" 
              height="12" 
              viewBox="0 0 12 12" 
              fill="none"
            >
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {openDropdown === 'students' && (
            <div className="dropdown-menu">
              <NavLink 
                to="/administrators/students" 
                className={({ isActive }) => `dropdown-item ${isActive ? 'active' : ''}`}
                onClick={() => setOpenDropdown(null)}
              >
                Seznam studentů
              </NavLink>
              <NavLink 
                to="/administrators/newStudent" 
                className={({ isActive }) => `dropdown-item ${isActive ? 'active' : ''}`}
                onClick={() => setOpenDropdown(null)}
              >
                Vytvořit studenta
              </NavLink>
            </div>
          )}
        </div>

        <div className="nav-dropdown" ref={dropdownRefs.teachers}>
          <button 
            className={`nav-link dropdown-toggle ${openDropdown === 'teachers' || isDropdownActive(['/administrators/teachers', '/administrators/newTeacher']) ? 'active' : ''}`}
            onClick={() => toggleDropdown('teachers')}
          >
            Učitelé
            <svg 
              className={`dropdown-arrow ${openDropdown === 'teachers' ? 'open' : ''}`}
              width="12" 
              height="12" 
              viewBox="0 0 12 12" 
              fill="none"
            >
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {openDropdown === 'teachers' && (
            <div className="dropdown-menu">
              <NavLink 
                to="/administrators/teachers" 
                className={({ isActive }) => `dropdown-item ${isActive ? 'active' : ''}`}
                onClick={() => setOpenDropdown(null)}
              >
                Seznam učitelů
              </NavLink>
              <NavLink 
                to="/administrators/newTeacher" 
                className={({ isActive }) => `dropdown-item ${isActive ? 'active' : ''}`}
                onClick={() => setOpenDropdown(null)}
              >
                Vytvořit učitele
              </NavLink>
            </div>
          )}
        </div>

        <div className="nav-dropdown" ref={dropdownRefs.subjects}>
          <button 
            className={`nav-link dropdown-toggle ${openDropdown === 'subjects' || isDropdownActive(['/administrators/subjects', '/administrators/newSubject']) ? 'active' : ''}`}
            onClick={() => toggleDropdown('subjects')}
          >
            Předměty
            <svg 
              className={`dropdown-arrow ${openDropdown === 'subjects' ? 'open' : ''}`}
              width="12" 
              height="12" 
              viewBox="0 0 12 12" 
              fill="none"
            >
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {openDropdown === 'subjects' && (
            <div className="dropdown-menu">
              <NavLink 
                to="/administrators/subjects" 
                className={({ isActive }) => `dropdown-item ${isActive ? 'active' : ''}`}
                onClick={() => setOpenDropdown(null)}
              >
                Seznam předmětů
              </NavLink>
              <NavLink 
                to="/administrators/newSubject" 
                className={({ isActive }) => `dropdown-item ${isActive ? 'active' : ''}`}
                onClick={() => setOpenDropdown(null)}
              >
                Vytvořit předmět
              </NavLink>
            </div>
          )}
        </div>

        <div className="nav-dropdown" ref={dropdownRefs.classes}>
          <button 
            className={`nav-link dropdown-toggle ${openDropdown === 'classes' || isDropdownActive(['/administrators/classes', '/administrators/newClass']) ? 'active' : ''}`}
            onClick={() => toggleDropdown('classes')}
          >
            Třídy
            <svg 
              className={`dropdown-arrow ${openDropdown === 'classes' ? 'open' : ''}`}
              width="12" 
              height="12" 
              viewBox="0 0 12 12" 
              fill="none"
            >
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {openDropdown === 'classes' && (
            <div className="dropdown-menu">
              <NavLink 
                to="/administrators/classes" 
                className={({ isActive }) => `dropdown-item ${isActive ? 'active' : ''}`}
                onClick={() => setOpenDropdown(null)}
              >
                Seznam tříd
              </NavLink>
              <NavLink 
                to="/administrators/newClass" 
                className={({ isActive }) => `dropdown-item ${isActive ? 'active' : ''}`}
                onClick={() => setOpenDropdown(null)}
              >
                Vytvořit třídu
              </NavLink>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}