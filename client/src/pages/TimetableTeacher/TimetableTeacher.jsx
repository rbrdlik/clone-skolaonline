import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import TimetableLayoutTeacher from "../../components/Timetable/TimetableLayoutTeacher";

export default function TimetableTeacher() {
  const { id } = useParams();

  return (
    <>
      <Navbar />
      <TimetableLayoutTeacher teacherId={id} />
    </>
  );
}
