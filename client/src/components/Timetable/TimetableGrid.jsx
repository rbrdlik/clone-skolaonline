import { useState, useEffect } from "react";
import { startOfWeek, addDays, format } from "date-fns";
import cs from "date-fns/locale/cs";
import TimetableCell from "./TimetableCell";
import { mockLessons } from "./mockLessons";
import { getScheduleByClassAndDay } from "../../models/schedule";
import { checkGradesForLesson } from "../../models/grade";
import { getScheduleChangesByClassAndDate } from "../../models/scheduleChanges";
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

export default function TimetableGrid({ selectedDate, classId }) {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const [lessons, setLessons] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!classId) {
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

          const [dayLessons, scheduleChanges] = await Promise.all([
            getScheduleByClassAndDay(classId, DAY_MAPPING[day], true, dateString),
            getScheduleChangesByClassAndDate(classId, dateString)
          ]);

          const changesMap = {};
          if (scheduleChanges && scheduleChanges.status === 200 && Array.isArray(scheduleChanges.payload)) {
            scheduleChanges.payload.forEach(change => {
              changesMap[change.hour] = change;
            });
          }

          if (Array.isArray(dayLessons)) {
            for (const lesson of dayLessons) {
              const key = `${day}-${lesson.hour}`;
              const formatTeacherName = (firstName, lastName) => {
                if (!firstName || !lastName) return "";
                const firstInitial = firstName.charAt(0).toUpperCase();
                return `${firstInitial}. ${lastName}`;
              };
              
              const teacher = typeof lesson.teacher === 'object' 
                ? formatTeacherName(lesson.teacher.first_name, lesson.teacher.last_name)
                : "";
              const teacherId = typeof lesson.teacher === 'object' ? lesson.teacher._id : null;
              const subjectId = typeof lesson.subject === 'object' ? lesson.subject._id : null;
              const subjectName = typeof lesson.subject === 'object' 
                ? (lesson.subject.short_name || lesson.subject.name) 
                : lesson.subject;
              
              const change = changesMap[lesson.hour];
              const isCancelled = change && change.type === "cancel";
              const isSubstitution = change && change.type === "change";
              const isRoomChange = change && change.type === "room_change";
              const hasNote = change && change.type === "note" && change.note;
              const displayTeacher = isSubstitution && change?.substitute_teacher
                ? formatTeacherName(change.substitute_teacher.first_name, change.substitute_teacher.last_name)
                : teacher;
              const displayRoom = isRoomChange && change?.room ? change.room : (lesson.room || "");
              
              let hasGrades = false;
              if (subjectId && classId) {
                try {
                  const gradeCheck = await checkGradesForLesson(classId, subjectId, dateString);
                  hasGrades = gradeCheck?.hasGrades || false;
                } catch (err) {
                  console.error(`Error checking grades for ${day}-${lesson.hour}:`, err);
                }
              }
              
              lessonsData[key] = {
                subject: subjectName,
                subjectId: subjectId,
                teacher: displayTeacher,
                teacherId: teacherId,
                class: "",
                room: displayRoom,
                hour: lesson.hour,
                dayOfWeek: DAY_MAPPING[day],
                classId: classId,
                hasGrades: hasGrades,
                isCancelled: isCancelled,
                changeType: change ? change.type : null,
                note: hasNote ? change.note : null,
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
  }, [classId, selectedDate]);

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
                  lesson={classId ? (lessons[`${day}-${h}`] || null) : (mockLessons[`${day}-${h}`] || null)}
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
