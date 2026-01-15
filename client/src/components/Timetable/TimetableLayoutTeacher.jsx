import { useState } from "react";
import CalendarPicker from "./CalendarPicker";
import TimetableGridTeacher from "./TimetableGridTeacher";
import "../../scss/Timetable.scss";

export default function TimetableLayoutTeacher({ teacherId, selectedDate: propSelectedDate, onDateChange }) {
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
        <TimetableGridTeacher selectedDate={selectedDate} teacherId={teacherId} />
      </section>
    </div>
  );
}
