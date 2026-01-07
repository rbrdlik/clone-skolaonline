import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import cs from "date-fns/locale/cs";
import Navbar from "../../components/Navbar/Navbar";
import NotificationToast from "../../components/Notification/Notification";
import { getAllTeachers, getUserById } from "../../models/user";
import { getClassById } from "../../models/class";
import { getSubjectById } from "../../models/subject";
import { createScheduleChange } from "../../models/scheduleChanges";
import "../../scss/TimetableChange.scss";
import calendar from "../../assets/icons/calendar.png";

export default function TimetableChange() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const classId = searchParams.get("classId");
  const subjectId = searchParams.get("subjectId");
  const teacherId = searchParams.get("teacherId");
  const dateParam = searchParams.get("date");
  const hourParam = searchParams.get("hour");
  const roomParam = searchParams.get("room");

  const [changeType, setChangeType] = useState("");
  const [substituteTeacherId, setSubstituteTeacherId] = useState("");
  const [newRoom, setNewRoom] = useState("");
  const [note, setNote] = useState("");
  const [allTeachers, setAllTeachers] = useState([]);
  const [classData, setClassData] = useState(null);
  const [subjectData, setSubjectData] = useState(null);
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadData = async () => {
      if (!classId || !subjectId || !teacherId || !dateParam || !hourParam) {
        setLoading(false);
        return;
      }

      try {
        const [teachersRes, classRes, subjectRes, teacherRes] = await Promise.all([
          getAllTeachers(),
          getClassById(classId),
          getSubjectById(subjectId),
          getUserById(teacherId)
        ]);

        if (teachersRes && teachersRes.status === 200) {
          const teachers = Array.isArray(teachersRes.payload)
            ? teachersRes.payload
            : (teachersRes.payload?.payload || []);
          setAllTeachers(teachers.filter(t => t._id !== teacherId && t.role === "učitel"));
        }

        if (classRes && classRes.status === 200 && classRes.payload) {
          setClassData(classRes.payload);
        }

        if (subjectRes && subjectRes.status === 200 && subjectRes.payload) {
          setSubjectData(subjectRes.payload);
        }

        if (teacherRes && teacherRes.status === 200 && teacherRes.payload) {
          setTeacherData(teacherRes.payload);
        }
      } catch (err) {
        console.error("Error loading data:", err);
        setErrorMessage("Chyba při načítání dat");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [classId, subjectId, teacherId, dateParam, hourParam]);

  const handleSave = async () => {
    if (!classId || !subjectId || !teacherId || !dateParam || !hourParam) {
      setErrorMessage("Chybí potřebné parametry");
      return;
    }

    if (!changeType) {
      setErrorMessage("Vyberte typ změny");
      return;
    }

    if (changeType === "change" && !substituteTeacherId) {
      setErrorMessage("Vyberte náhradního učitele");
      return;
    }

    if (changeType === "note" && !note.trim()) {
      setErrorMessage("Zadejte poznámku");
      return;
    }

    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const changeData = {
        class_id: classId,
        date: dateParam,
        hour: parseInt(hourParam),
        type: changeType === "change" ? "change" : changeType === "room_change" ? "room_change" : changeType === "cancel" ? "cancel" : "note",
        subject: subjectData?.name || "",
        teacher: teacherId,
        room: changeType === "room_change" ? newRoom : (roomParam || ""),
        substitute_teacher: changeType === "change" ? substituteTeacherId : null,
        note: changeType === "note" ? note : null
      };

      const result = await createScheduleChange(changeData);

      if (result && (result.status === 201 || result.status === 200)) {
        setSuccessMessage("Změna rozvrhu byla úspěšně uložena");
        setTimeout(() => {
          setSuccessMessage("");
          navigate(-1);
        }, 2000);
      } else {
        setErrorMessage(result?.message || "Chyba při ukládání změny");
      }
    } catch (err) {
      console.error("Error saving change:", err);
      setErrorMessage("Chyba při ukládání změny");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = parseISO(dateString);
      return format(date, "d.M.yyyy", { locale: cs });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="change-lesson-page">
        <Navbar />
        <main className="main-content">
          <div style={{ textAlign: "center", padding: "2rem" }}>Načítání...</div>
        </main>
      </div>
    );
  }

  if (!classId || !subjectId || !teacherId || !dateParam || !hourParam) {
    return (
      <div className="change-lesson-page">
        <Navbar />
        <main className="main-content">
          <div style={{ textAlign: "center", padding: "2rem" }}>Chybí potřebné parametry</div>
        </main>
      </div>
    );
  }

  const className = classData?.name || "Neznámá třída";
  const subjectName = subjectData?.name || "Neznámý předmět";
  const teacherName = teacherData ? `${teacherData.first_name} ${teacherData.last_name}` : "Neznámý učitel";

  return (
    <div className="change-lesson-page">
      <Navbar />
      
      <main className="main-content">
        <section className="change-card">
          <header className="card-header">
            <img src={calendar} alt="" />
            <h1>Změna výuky ({formatDate(dateParam)})</h1>
          </header>

          <div className="card-body">
            <div className="form-group">
              <label>Třída:</label>
              <div className="info-text">{className}</div>
            </div>

            <div className="form-group">
              <label>Předmět:</label>
              <div className="info-text">{subjectName}</div>
            </div>

            <div className="form-group">
              <label>Učitel:</label>
              <div className="info-text">{teacherName}</div>
            </div>

            <div className="form-group">
              <label>Hodina:</label>
              <div className="info-text">{hourParam}. hodina</div>
            </div>

            <div className="form-group">
              <label>Typ změny:</label>
              <select 
                className="select-input" 
                value={changeType}
                onChange={(e) => {
                  setChangeType(e.target.value);
                  setSubstituteTeacherId("");
                  setNewRoom("");
                  setNote("");
                }}
              >
                <option value="" disabled>Výběr...</option>
                <option value="change">Suplování</option>
                <option value="room_change">Změna učebny</option>
                <option value="cancel">Hodina odpadla</option>
                <option value="note">Poznámka k hodině</option>
              </select>
            </div>

            {changeType === "change" && (
              <div className="form-group">
                <label>Náhradní učitel:</label>
                <select 
                  className="select-input" 
                  value={substituteTeacherId}
                  onChange={(e) => setSubstituteTeacherId(e.target.value)}
                >
                  <option value="" disabled>Výběr...</option>
                  {allTeachers.map(teacher => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.title ? `${teacher.title} ` : ""}
                      {teacher.first_name} {teacher.last_name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {changeType === "room_change" && (
              <div className="form-group">
                <label>Nová učebna:</label>
                <input 
                  type="text" 
                  className="text-input" 
                  value={newRoom}
                  onChange={(e) => setNewRoom(e.target.value)}
                  placeholder="Zadejte novou učebnu..."
                />
              </div>
            )}

            {changeType === "note" && (
              <div className="form-group">
                <label>Poznámka:</label>
                <input 
                  type="text" 
                  className="text-input" 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Zadejte poznámku k hodině..."
                />
              </div>
            )}

            <footer className="card-footer">
              <button 
                className="btn-save" 
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Ukládání..." : "Uložit"}
              </button>
            </footer>
          </div>
        </section>
      </main>

      <NotificationToast
        message={successMessage}
        type="success"
        isVisible={!!successMessage}
        onClose={() => setSuccessMessage("")}
      />

      <NotificationToast
        message={errorMessage}
        type="error"
        isVisible={!!errorMessage}
        onClose={() => setErrorMessage("")}
      />
    </div>
  );
}
