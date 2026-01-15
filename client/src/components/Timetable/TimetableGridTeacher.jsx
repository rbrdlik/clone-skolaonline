import { useState, useEffect } from "react";
import { startOfWeek, addDays, format } from "date-fns";
import cs from "date-fns/locale/cs";
import TimetableCell from "./TimetableCell";
import { mockLessons } from "./mockLessons";
import { getScheduleByTeacherAndDay } from "../../models/schedule";
import { checkGradesForLesson } from "../../models/grade";
import calendar from "../../assets/icons/calendar.png";
import React from "react";

const HOURS = [
  "7:05–7:50",
  "7:55–8:40",
  "8:45–9:30",
  "9:50–10:35",
  "10:40–11:25",
  "11:30–12:15",
  "12:20–13:05",
  "13:10–13:55",
  "14:00–14:45",
  "14:50–15:35",
  "15:40–16:25",
  "16:30–17:15",
  "17:20–18:05",
];

const DAYS = ["Po", "Út", "St", "Čt", "Pá"];
const DAY_MAPPING = { "Po": 1, "Út": 2, "St": 3, "Čt": 4, "Pá": 5 };

export default function TimetableGridTeacher({ selectedDate, teacherId }) {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const [lessons, setLessons] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!teacherId) {
      setLessons({});
      return;
    }

    const loadSchedule = async () => {
      setLoading(true);
      const lessonsData = {};
      const currentWeekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });

      for (const day of DAYS) {
        try {
          const dayDate = addDays(currentWeekStart, DAYS.indexOf(day));
          const dateString = format(dayDate, "yyyy-MM-dd");

          // Použijeme endpoint který už vrací aplikované změny
          const dayLessons = await getScheduleByTeacherAndDay(teacherId, DAY_MAPPING[day], true, dateString);

          if (Array.isArray(dayLessons)) {
            for (const lesson of dayLessons) {
              const key = `${day}-${lesson.hour}`;
              const formatTeacherName = (teacherObj) => {
                if (!teacherObj) return "";
                if (typeof teacherObj === 'string') return teacherObj;
                const firstName = teacherObj.first_name || "";
                const lastName = teacherObj.last_name || "";
                if (!firstName || !lastName) return "";
                const firstInitial = firstName.charAt(0).toUpperCase();
                return `${firstInitial}. ${lastName}`;
              };
              
              const teacher = formatTeacherName(lesson.teacher);
              const teacherIdFromLesson = typeof lesson.teacher === 'object' && lesson.teacher._id 
                ? lesson.teacher._id 
                : null;
              const subjectId = typeof lesson.subject === 'object' && lesson.subject._id
                ? lesson.subject._id 
                : null;
              const subjectName = typeof lesson.subject === 'object' 
                ? (lesson.subject.short_name || lesson.subject.name) 
                : (lesson.subject || "");
              
              // Zkontrolujeme scheduleChangeType z backendu (může být kombinace více změn)
              const scheduleChangeType = lesson.scheduleChangeType;
              const scheduleChange = lesson.scheduleChange;
              const scheduleChangeTypes = lesson.scheduleChangeTypes || [];
              const isCancelled = scheduleChangeType === "cancel" || scheduleChangeTypes.includes("cancel");
              const isSubstitution = scheduleChangeType === "change" || scheduleChangeTypes.includes("change");
              const isRoomChange = scheduleChangeType === "room_change" || scheduleChangeTypes.includes("room_change");
              // Poznámka může být samostatně nebo v kombinaci s jinými změnami
              const hasNote = lesson.note && (scheduleChangeType === "note" || scheduleChangeTypes.includes("note") || lesson.note);
              
              // Backend už aplikuje změny, takže lesson.teacher už obsahuje správného učitele
              // (substitute_teacher pro suplování, nebo původního učitele)
              const displayTeacher = teacher;
              
              // Backend už aplikuje změny, takže lesson.room už obsahuje správnou místnost
              const displayRoom = lesson.room || "";
              
              // Pro učitele zobrazujeme třídu místo učitele
              const displayClass = lesson.class || "";
              
              let hasGrades = false;
              if (subjectId && lesson.class_id) {
                try {
                  const gradeCheck = await checkGradesForLesson(lesson.class_id, subjectId, dateString);
                  hasGrades = gradeCheck?.hasGrades || false;
                } catch (err) {
                  console.error(`Error checking grades for ${day}-${lesson.hour}:`, err);
                }
              }
              
              lessonsData[key] = {
                subject: subjectName,
                subjectId: subjectId,
                teacher: displayTeacher,
                teacherId: teacherIdFromLesson,
                class: displayClass,
                room: displayRoom,
                hour: lesson.hour,
                dayOfWeek: DAY_MAPPING[day],
                classId: lesson.class_id || null,
                hasGrades: hasGrades,
                isCancelled: isCancelled,
                changeType: scheduleChangeType || null,
                note: lesson.note || null, // Poznámka se zobrazí vždy, pokud existuje (i v kombinaci)
                isTeacherChanged: isSubstitution,
                isRoomChanged: isRoomChange
              };
            }
          }
        } catch (err) {
          console.error(`Error loading schedule for ${day}:`, err);
        }
      }

      setLessons(lessonsData);
      setLoading(false);
    };

    loadSchedule();
  }, [teacherId, selectedDate]);

  return (
    <div className="timetable">
      <div className="panel-title">
        <img src={calendar} alt="" />
        Rozvrh hodin
      </div>
      <div className="panel-divider" />

      <div className="timetable-header">
        <div />
        {HOURS.map((h, i) => (
          <div key={i} className="hour-header">
            <strong>{i}</strong>
            <span>{h}</span>
          </div>
        ))}
      </div>

      {DAYS.map((day, i) => {
        const dayDate = addDays(weekStart, i);
        return (
          <React.Fragment key={day}>
            <div className="timetable-row">
              <div className="day-label">
                <strong>{day}</strong>
                <span>
                  {format(dayDate, "d.M.", { locale: cs })}
                </span>
              </div>

              {HOURS.map((_, h) => (
                <TimetableCell
                  key={h}
                  lesson={teacherId ? (lessons[`${day}-${h}`] || null) : (mockLessons[`${day}-${h}`] || null)}
                  selectedDate={dayDate}
                />
              ))}
            </div>

            <div className="timetable-row-divider" />
          </React.Fragment>
        );
      })}
    </div>
  );
}
