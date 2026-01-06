import React from "react";
import { startOfWeek, addDays, format } from "date-fns";
import cs from "date-fns/locale/cs";
import TimetableCell from "./TimetableCell";
import { mockLessons } from "./mockLessons";
import calendar from "../../assets/icons/calendar.png"

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

export default function TimetableGrid({ selectedDate }) {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });

  return (
    <div className="timetable">
      <div className="panel-title">
        <img src={calendar} alt="" />
        Rozvrh hodin
      </div>
      <div className="panel-divider" />

      {/* HEADER */}
      <div className="timetable-header">
        <div />
        {HOURS.map((h, i) => (
          <div key={i} className="hour-header">
            <strong>{i}</strong>
            <span>{h}</span>
          </div>
        ))}
      </div>

      {/* ROWS */}
      {DAYS.map((day, i) => (
        <React.Fragment key={day}>
          <div className="timetable-row">
            <div className="day-label">
              <strong>{day}</strong>
              <span>
                {format(addDays(weekStart, i), "d.M.", { locale: cs })}
              </span>
            </div>

            {HOURS.map((_, h) => (
              <TimetableCell
                key={h}
                lesson={mockLessons[`${day}-${h}`] || null}
              />
            ))}
          </div>

          <div className="timetable-row-divider" />
        </React.Fragment>
      ))}
    </div>
  );
}
