import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function TimetableCell({ lesson }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const cellRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="lesson-wrapper" ref={cellRef}>
      <div
        className={`lesson-cell ${lesson ? "filled" : ""}`}
        onContextMenu={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        {lesson && (
          <>
            <strong>{lesson.subject}</strong>
            <span>{lesson.class}</span>
            <span>{lesson.room}</span>
          </>
        )}
      </div>

      {open && (
        <div className="context-menu" ref={menuRef}>
          <button onClick={() => navigate("/hodnoceni")}>
            Zadat hodnocení
          </button>
          <button onClick={() => navigate("/zmena-rozvrhu")}>
            Změna v rozvrhu
          </button>
        </div>
      )}
    </div>
  );
}
