import { useState } from "react";
import CalendarPicker from "./CalendarPicker";
import TimetableGrid from "./TimetableGrid";
import "../../scss/Timetable.scss";

export default function TimetableLayout({ classId, selectedDate: propSelectedDate, onDateChange }) {
  const [internalDate, setInternalDate] = useState(new Date());
  const selectedDate = propSelectedDate || internalDate;
  const handleDateChange = onDateChange || setInternalDate;

  return (
    <div className="timetable-layout">
      <aside className="left-panel">
        <CalendarPicker
          selectedDate={selectedDate}
          onChange={handleDateChange}
        />
      </aside>

      <section className="right-panel">
        <TimetableGrid selectedDate={selectedDate} classId={classId} />
      </section>
    </div>
  );
}
