import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./SignIn/SignIn";
import Grading from "./Grading/Grading";
import TimetableChange from "./TimetableChange/TimetableChange";
import Classes from "./Classes/Classes";
import Messages from "./Messages/Messages";
import Students from "./Students/Students";
import StudentGrades from "./StudentGrades/StudentGrades";
import Timetable from "./Timetable/Timetable";
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
import Profile from "./Profile/Profile";
import TimetableTeacher from "./TimetableTeacher/TimetableTeacher";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminRoute from "../components/AdminRoute";
import RootRedirect from "../components/RootRedirect";
import Home from "./Home/Home";

export default function AppRoutes() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signIn" element={<SignIn />} />
          <Route
            path="/grading"
            element={
              <ProtectedRoute>
                <Grading />
              </ProtectedRoute>
            }
          />
          <Route
            path="/timetable-change"
            element={
              <ProtectedRoute>
                <TimetableChange />
              </ProtectedRoute>
            }
          />
          <Route
            path="/classes"
            element={
              <ProtectedRoute>
                <Classes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students/:id"
            element={
              <ProtectedRoute>
                <Students />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student-grades"
            element={
              <ProtectedRoute>
                <StudentGrades />
              </ProtectedRoute>
            }
          />
          <Route
            path="/administrators/students"
            element={
              <AdminRoute>
                <StudentsA />
              </AdminRoute>
            }
          />
          <Route
            path="/administrators/newStudent"
            element={
              <AdminRoute>
                <NewStudent />
              </AdminRoute>
            }
          />
          <Route
            path="/administrators/teachers"
            element={
              <AdminRoute>
                <Teachers />
              </AdminRoute>
            }
          />
          <Route
            path="/administrators/newTeacher"
            element={
              <AdminRoute>
                <NewTeacher />
              </AdminRoute>
            }
          />
          <Route
            path="/administrators/subjects"
            element={
              <AdminRoute>
                <Subjects />
              </AdminRoute>
            }
          />
          <Route
            path="/administrators/newSubject"
            element={
              <AdminRoute>
                <NewSubject />
              </AdminRoute>
            }
          />
          <Route
            path="/administrators/classes"
            element={
              <AdminRoute>
                <ClassesA />
              </AdminRoute>
            }
          />
          <Route
            path="/administrators/newClass"
            element={
              <AdminRoute>
                <NewClass />
              </AdminRoute>
            }
          />
          <Route
            path="/administrators/timetable/:id"
            element={
              <AdminRoute>
                <TimetableA />
              </AdminRoute>
            }
          />
          <Route
            path="/administrators/editStudent/:id"
            element={
              <AdminRoute>
                <EditStudent />
              </AdminRoute>
            }
          />
          <Route
            path="/administrators/editTeacher/:id"
            element={
              <AdminRoute>
                <EditTeacher />
              </AdminRoute>
            }
          />
          <Route
            path="/administrators/editSubject/:id"
            element={
              <AdminRoute>
                <EditSubject />
              </AdminRoute>
            }
          />
          <Route
            path="/administrators/editClass/:id"
            element={
              <AdminRoute>
                <EditClass />
              </AdminRoute>
            }
          />
          <Route
            path="/timetable"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/timetable/:id"
            element={
              <ProtectedRoute>
                <Timetable />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<RootRedirect />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
