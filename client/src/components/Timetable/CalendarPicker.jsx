import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  isToday,
  addMonths,
} from "date-fns";
import cs from "date-fns/locale/cs";

export default function CalendarPicker({ selectedDate, onChange }) {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  return (
    <div className="calendar">
      <div className="panel-title">Výběr data</div>
      <div className="panel-divider" />

      <div className="calendar-header">
        <button onClick={() => onChange(addMonths(selectedDate, -1))}>‹</button>
        <div className="calendar-month">
          {format(selectedDate, "LLLL yyyy", { locale: cs })}
        </div>
        <button onClick={() => onChange(addMonths(selectedDate, 1))}>›</button>
      </div>

      <div className="calendar-weekdays">
        {["Po", "Út", "St", "Čt", "Pá", "So", "Ne"].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      <div className="calendar-grid">
        {days.map((day) => (
          <button
            key={day}
            className={`calendar-day
              ${!isSameMonth(day, selectedDate) ? "outside" : ""}
              ${isToday(day) ? "today" : ""}
              ${isSameDay(day, selectedDate) ? "active" : ""}
            `}
            onClick={() => onChange(day)}
          >
            {format(day, "d")}
          </button>
        ))}
      </div>
    </div>
  );
}
