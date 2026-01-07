import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import TimetableLayout from "../../components/Timetable/TimetableLayout";

export default function Timetable() {
  const { id } = useParams();

  return (
    <>
      <Navbar />
      <TimetableLayout classId={id} />
    </>
  );
}
