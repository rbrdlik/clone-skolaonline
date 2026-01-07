import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home/Home";
import SignIn from "./SignIn/SignIn";
import Grading from "./Grading/Grading";
import TimetableChange from "./TimetableChange/TimetableChange";
import Classes from "./Classes/Classes";
import Messages from "./Messages/Messages";
import Students from "./Students/Students";
import StudentsA from "./Administrator/Students";
import NewStudent from "./Administrator/NewStudent";
import Teachers from "./Administrator/Teachers";
import NewTeacher from "./Administrator/NewTeacher";
import Subjects from "./Administrator/Subjects";
import NewSubject from "./Administrator/NewSubject";
import ClassesA from "./Administrator/ClassesA";
import NewClass from "./Administrator/NewClass";
import TimetableA from "./Administrator/TimetableA";
import EditStudent from "./Administrator/EditStudent";
import EditTeacher from "./Administrator/EditTeacher";
import EditSubject from "./Administrator/EditSubject";
import EditClass from "./Administrator/EditClass";

export default function AppRoutes() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signIn" element={<SignIn />} />
          <Route path="/grading" element={<Grading />} />
          <Route path="/timetable-change" element={<TimetableChange />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/students" element={<Students />} />
          <Route path="/administrators/students" element={<StudentsA />} />
          <Route path="/administrators/newStudent" element={<NewStudent />} />
          <Route path="/administrators/teachers" element={<Teachers />} />
          <Route path="/administrators/newTeacher" element={<NewTeacher />} />
          <Route path="/administrators/subjects" element={<Subjects />} />
          <Route path="/administrators/newSubject" element={<NewSubject />} />
          <Route path="/administrators/classes" element={<ClassesA />} />
          <Route path="/administrators/newClass" element={<NewClass />} />
          <Route path="/administrators/timetable" element={<TimetableA />} />
          <Route path="/administrators/editStudent" element={<EditStudent />} />
          <Route path="/administrators/editTeacher" element={<EditTeacher />} />
          <Route path="/administrators/editSubject" element={<EditSubject />} />
          <Route path="/administrators/editClass" element={<EditClass />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}