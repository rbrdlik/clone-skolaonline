import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import cs from "date-fns/locale/cs";
import Navbar from "../../components/Navbar/Navbar";
import NotificationToast from "../../components/Notification/Notification";
import { getStudentsByClass, getUserById } from "../../models/user";
import { getClassById } from "../../models/class";
import { createGradesBulk } from "../../models/grade";
import { getSubjectById } from "../../models/subject";
import "../../scss/Grading.scss";
import calendar from "../../assets/icons/calendar.png";

const GRADE_VALUES = {
  "1": 1,
  "1-": 1.5,
  "2": 2,
  "2-": 2.5,
  "3": 3,
  "3-": 3.5,
  "4": 4,
  "4-": 4.5,
  "5": 5,
  "NH": 0
};

export default function Grading() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const classId = searchParams.get("classId");
  const subjectId = searchParams.get("subjectId");
  const teacherId = searchParams.get("teacherId");
  const dateParam = searchParams.get("date");
  const hourParam = searchParams.get("hour");

  const [students, setStudents] = useState([]);
  const [classData, setClassData] = useState(null);
  const [subjectName, setSubjectName] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [loading, setLoading] = useState(true);
  const [weight, setWeight] = useState(1);
  const [description, setDescription] = useState("");
  const [studentGrades, setStudentGrades] = useState({});
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const grades = ["1", "1-", "2", "2-", "3", "3-", "4", "4-", "5", "NH"];

  useEffect(() => {
    const loadData = async () => {
      if (!classId || !subjectId || !teacherId || !dateParam || !hourParam) {
        setLoading(false);
        return;
      }

      try {
        const [studentsRes, classRes, subjectRes, teacherRes] = await Promise.all([
          getStudentsByClass(classId),
          getClassById(classId),
          getSubjectById(subjectId),
          getUserById(teacherId)
        ]);

        if (studentsRes && studentsRes.status === 200) {
          const studentsData = Array.isArray(studentsRes.payload) 
            ? studentsRes.payload 
            : (studentsRes.payload?.payload || []);
          setStudents(studentsData);
        }

        if (classRes && classRes.status === 200 && classRes.payload) {
          setClassData(classRes.payload);
        }

        if (subjectRes && subjectRes.status === 200 && subjectRes.payload) {
          setSubjectName(subjectRes.payload.name || "");
        }

        if (teacherRes && teacherRes.status === 200 && teacherRes.payload) {
          setTeacherName(`${teacherRes.payload.first_name} ${teacherRes.payload.last_name}`);
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

  const handleGradeChange = (studentId, grade) => {
    setStudentGrades(prev => ({
      ...prev,
      [studentId]: grade
    }));
  };

  const handleSave = async () => {
    if (!classId || !subjectId || !teacherId) {
      setErrorMessage("Chybí potřebné parametry");
      return;
    }

    const gradesToSave = Object.entries(studentGrades)
      .filter(([_, grade]) => grade && grade !== "")
      .map(([studentId, grade]) => ({
        student_id: studentId,
        value: GRADE_VALUES[grade] !== undefined ? GRADE_VALUES[grade] : 0
      }));

    if (gradesToSave.length === 0) {
      setErrorMessage("Nebyly zadány žádné známky");
      return;
    }

    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const result = await createGradesBulk({
        subject_id: subjectId,
        teacher_id: teacherId,
        class_id: classId,
        weight: weight,
        description: description || null,
        date: dateParam,
        grades: gradesToSave
      });

      if (result && result.status === 201) {
        setSuccessMessage("Známky byly úspěšně uloženy");
        setTimeout(() => {
          navigate(`/timetable/${classId}`);
        }, 1500);
      } else {
        setErrorMessage(result?.message || "Chyba při ukládání známek");
      }
    } catch (err) {
      console.error("Error saving grades:", err);
      setErrorMessage("Chyba při ukládání známek");
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
      <div className="grading-page">
        <Navbar />
        <main className="main-content">
          <div style={{ textAlign: "center", padding: "2rem" }}>Načítání...</div>
        </main>
      </div>
    );
  }

  if (!classId || !subjectId || !teacherId || !dateParam || !hourParam) {
    return (
      <div className="grading-page">
        <Navbar />
        <main className="main-content">
          <div style={{ textAlign: "center", padding: "2rem" }}>Chybí potřebné parametry</div>
        </main>
      </div>
    );
  }

  return (
    <div className="grading-page">
      <Navbar />
      
      <main className="main-content">
        <section className="grading-card">
          <header className="card-header">
            <div className="icon-wrapper">
              <img src={calendar} alt="" />
            </div>
            <h1>Zadat hodnocení ({subjectName} {formatDate(dateParam)})</h1>
          </header>

          <div className="card-body">
            <div className="settings-section">
              <div className="form-group">
                <label>Váha známky:</label>
                <select 
                  className="select-input" 
                  value={weight}
                  onChange={(e) => setWeight(parseInt(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(vaha => (
                    <option key={vaha} value={vaha}>{vaha}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Popis známky:</label>
                <input 
                  type="text" 
                  className="text-input" 
                  placeholder="Např. Čtvrtletní práce..." 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            <hr className="divider" />

            <div className="list-container">
              {students.map((student, index) => (
                <div key={student._id} className="student-row">
                  <span className="student-number">{index + 1}</span>
                  <span className="student-name">
                    {student.title ? `${student.title} ` : ""}
                    {student.first_name} {student.last_name}
                  </span>
                  <div className="select-wrapper">
                    <select 
                      className="select-input small" 
                      value={studentGrades[student._id] || ""}
                      onChange={(e) => handleGradeChange(student._id, e.target.value)}
                    >
                      <option value="">Známka</option>
                      {grades.map(grade => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>

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