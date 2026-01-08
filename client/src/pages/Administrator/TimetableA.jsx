import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavbarA from "./NavbarA";
import NotificationToast from "../../components/Notification/Notification";
import { getClassById } from "../../models/class";
import { getAllSubjects } from "../../models/subject";
import { getAllTeachers } from "../../models/user";
import { getScheduleByClassAndDay, createSchedule } from "../../models/schedule";
import "../../scss/TimetableA.scss";

export default function TimetableA() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [className, setClassName] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [allTeachers, setAllTeachers] = useState([]);
  const [lessons, setLessons] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const days = [
    { name: "Po", dayOfWeek: 1 },
    { name: "Út", dayOfWeek: 2 },
    { name: "St", dayOfWeek: 3 },
    { name: "Čt", dayOfWeek: 4 },
    { name: "Pá", dayOfWeek: 5 },
  ];

  const hours = Array.from({ length: 13 }, (_, i) => i);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [classRes, subjectsRes, teachersRes] = await Promise.all([
          getClassById(id),
          getAllSubjects(),
          getAllTeachers()
        ]);

        if (classRes && classRes.status === 200 && classRes.payload) {
          setClassName(classRes.payload.name || "");
        }

        if (subjectsRes && subjectsRes.status === 200) {
          setSubjects(subjectsRes.payload || []);
        }

        if (teachersRes && teachersRes.status === 200) {
          setAllTeachers(teachersRes.payload || []);
        }

        const lessonsData = {};
        for (let day = 1; day <= 5; day++) {
          try {
            const dayLessons = await getScheduleByClassAndDay(id, day);
            if (Array.isArray(dayLessons)) {
              dayLessons.forEach(lesson => {
                const key = `${day}-${lesson.hour}`;
                lessonsData[key] = {
                  subject: typeof lesson.subject === 'object' ? lesson.subject._id : lesson.subject,
                  teacher: typeof lesson.teacher === 'object' ? lesson.teacher._id : lesson.teacher,
                  room: lesson.room
                };
              });
            }
          } catch (err) {
            console.error(`Error loading schedule for day ${day}:`, err);
          }
        }
        setLessons(lessonsData);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Chyba při načítání dat");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadData();
    }
  }, [id]);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const getTeachersForSubject = (subjectId) => {
    if (!subjectId) return [];
    const subject = subjects.find(s => s._id === subjectId);
    if (!subject || !subject.teachers) return [];
    
    const teacherIds = subject.teachers.map(t => {
      return typeof t === 'object' && t._id ? t._id.toString() : t.toString();
    });
    
    return allTeachers.filter(teacher => 
      teacherIds.includes(teacher._id.toString())
    );
  };

  const handleSubjectChange = (dayOfWeek, hour, subjectId) => {
    const key = `${dayOfWeek}-${hour}`;
    setLessons(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        subject: subjectId,
        teacher: ""
      }
    }));
  };

  const handleTeacherChange = (dayOfWeek, hour, teacherId) => {
    const key = `${dayOfWeek}-${hour}`;
    setLessons(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        teacher: teacherId
      }
    }));
  };

  const handleRoomChange = (dayOfWeek, hour, room) => {
    const key = `${dayOfWeek}-${hour}`;
    setLessons(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        room
      }
    }));
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      for (const day of days) {
        const dayLessons = [];
        for (const hour of hours) {
          const key = `${day.dayOfWeek}-${hour}`;
          const lesson = lessons[key];
          if (lesson && lesson.subject && lesson.teacher && lesson.room) {
            dayLessons.push({
              hour,
              subject: lesson.subject,
              teacher: lesson.teacher,
              room: lesson.room
            });
          }
        }

        try {
          await createSchedule({
            class_id: id,
            dayOfWeek: day.dayOfWeek,
            lessons: dayLessons
          });
        } catch (err) {
          console.error(`Error saving schedule for day ${day.dayOfWeek}:`, err);
          setError(`Chyba při ukládání rozvrhu pro ${day.name}`);
        }
      }

      setSuccess("Rozvrh byl úspěšně uložen");
    } catch (err) {
      setError("Chyba při ukládání rozvrhu");
      console.error("Error saving schedule:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="schedule-page">
        <NavbarA isAdmin={true} />
        <main className="main-content">
          <div style={{ textAlign: "center", padding: "2rem" }}>Načítání...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="schedule-page">
      <NavbarA isAdmin={true} />
      <main className="main-content">
        <section className="schedule-card">
          <header className="card-header">
            <div className="icon-box">📅</div>
            <h1>Rozvrh hodin (Třída: {className})</h1>
          </header>

          <div className="schedule-wrapper">
            <div className="schedule-grid">
              <div className="grid-corner"></div>

              {hours.map((h) => (
                <div key={h} className="hour-block">
                  <span className="num">{h}</span>
                  <span className="time">7:05 - 7:50</span>
                </div>
              ))}

              {days.map((day) => (
                <div key={day.name} className="day-row">
                  <div className="day-info">
                    <span className="name">{day.name}</span>
                  </div>

                  {hours.map((h) => {
                    const key = `${day.dayOfWeek}-${h}`;
                    const lesson = lessons[key] || {};
                    const teachers = getTeachersForSubject(lesson.subject);

                    return (
                      <div key={`${day.name}-${h}`} className="schedule-cell">
                        <select
                          className="cell-select"
                          value={lesson.subject || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "") {
                              const key = `${day.dayOfWeek}-${h}`;
                              setLessons(prev => {
                                const newLessons = { ...prev };
                                delete newLessons[key];
                                return newLessons;
                              });
                            } else {
                              handleSubjectChange(day.dayOfWeek, h, value);
                            }
                          }}
                        >
                          <option value="">-</option>
                          {subjects.map((subject) => (
                            <option key={subject._id} value={subject._id}>
                              {subject.name}
                            </option>
                          ))}
                        </select>
                        <select
                          className="cell-select"
                          value={lesson.teacher || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "") {
                              const key = `${day.dayOfWeek}-${h}`;
                              setLessons(prev => ({
                                ...prev,
                                [key]: {
                                  ...prev[key],
                                  teacher: ""
                                }
                              }));
                            } else {
                              handleTeacherChange(day.dayOfWeek, h, value);
                            }
                          }}
                          disabled={!lesson.subject || teachers.length === 0}
                        >
                          <option value="">-</option>
                          {teachers.map((teacher) => (
                            <option key={teacher._id} value={teacher._id}>
                              {teacher.first_name} {teacher.last_name}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          className="cell-input"
                          placeholder="Učebna"
                          value={lesson.room || ""}
                          onChange={(e) => handleRoomChange(day.dayOfWeek, h, e.target.value)}
                        />
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
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