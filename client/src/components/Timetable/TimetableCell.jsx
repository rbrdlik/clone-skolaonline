import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

export default function TimetableCell({ lesson, selectedDate }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleGradingClick = () => {
    if (lesson && lesson.classId && lesson.subjectId && lesson.teacherId && lesson.hour !== undefined) {
      const date = format(selectedDate, "yyyy-MM-dd");
      const params = new URLSearchParams({
        classId: lesson.classId,
        subjectId: lesson.subjectId,
        teacherId: lesson.teacherId,
        date: date,
        hour: lesson.hour.toString(),
        dayOfWeek: lesson.dayOfWeek?.toString() || ""
      });
      navigate(`/grading?${params.toString()}`);
    } else {
      navigate("/grading");
    }
    setOpen(false);
  };

  // Určení CSS tříd podle typu změny
  const getCellClasses = () => {
    if (!lesson) return "lesson-cell";
    
    let classes = "lesson-cell filled";
    
    if (lesson.isCancelled || lesson.changeType === "cancel") {
      classes += " cancelled";
    } else if (lesson.changeType === "change") {
      classes += " substitution";
    } else if (lesson.changeType === "room_change") {
      classes += " room-change"; // Změna místnosti má červenou barvu
    } else if (lesson.changeType === "note") {
      classes += " note-change"; // Poznámka má modrou barvu
    }
    
    return classes;
  };

  return (
    <div className="lesson-wrapper">
      <div
        className={getCellClasses()}
        onContextMenu={(e) => {
          e.preventDefault();
          if (lesson) {
            setOpen(true);
          }
        }}
      >
        {lesson && (
          <>
            {lesson.hasGrades && (
              <div className="grade-indicator" style={{ 
                right: lesson.note ? '26px' : '4px' 
              }}>Z</div>
            )}
            {lesson.note && (
              <div className="note-indicator" title={lesson.note}>
                P
              </div>
            )}
            <strong>{lesson.subject}</strong>
            {lesson.teacher && (
              <span className={lesson.isTeacherChanged ? "changed-text" : ""}>
                {lesson.teacher}
              </span>
            )}
            {lesson.room && (
              <span className={lesson.isRoomChanged ? "changed-text" : ""}>
                {lesson.room}
              </span>
            )}
            {lesson.class && <span>{lesson.class}</span>}
          </>
        )}
      </div>

      {open && lesson && (
        <div className="context-menu" ref={menuRef}>
          <button onClick={handleGradingClick}>
            Zadat hodnocení
          </button>
          <button onClick={() => {
            if (lesson && lesson.classId && lesson.subjectId && lesson.teacherId && lesson.hour !== undefined) {
              const date = format(selectedDate, "yyyy-MM-dd");
              const params = new URLSearchParams({
                classId: lesson.classId,
                subjectId: lesson.subjectId,
                teacherId: lesson.teacherId,
                date: date,
                hour: lesson.hour.toString(),
                room: lesson.room || ""
              });
              navigate(`/timetable-change?${params.toString()}`);
            } else {
              navigate("/timetable-change");
            }
            setOpen(false);
          }}>
            Změna v rozvrhu
          </button>
        </div>
      )}
    </div>
  );
}
