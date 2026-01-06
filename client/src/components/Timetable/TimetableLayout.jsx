import { useState } from "react";
import CalendarPicker from "./CalendarPicker";
import TimetableGrid from "./TimetableGrid";
import "../../scss/Timetable.scss";

export default function TimetableLayout() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="timetable-layout">
      <aside className="left-panel">
        <CalendarPicker
          selectedDate={selectedDate}
          onChange={setSelectedDate}
        />
      </aside>

      <section className="right-panel">
        <TimetableGrid selectedDate={selectedDate} />
      </section>
    </div>
  );
}
