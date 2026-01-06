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
  setMonth,
  setYear,
} from "date-fns";
import cs from "date-fns/locale/cs";

const MONTHS = Array.from({ length: 12 }, (_, i) =>
  format(new Date(2024, i, 1), "LLLL", { locale: cs })
);

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

      <div className="calendar-controls">
        <select
          value={selectedDate.getMonth()}
          onChange={(e) => onChange(setMonth(selectedDate, Number(e.target.value)))}
        >
          {MONTHS.map((m, i) => (
            <option key={m} value={i}>
              {m}
            </option>
          ))}
        </select>

        <select
          value={selectedDate.getFullYear()}
          onChange={(e) => onChange(setYear(selectedDate, Number(e.target.value)))}
        >
          {[2025, 2026].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
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
