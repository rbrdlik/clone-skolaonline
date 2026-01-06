import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home/Home";
import SignIn from "./SignIn/SignIn";
import Grading from "./Grading/Grading";
import TimetableChange from "./TimetableChange/TimetableChange";
import Classes from "./Classes/Classes";
import Messages from "./Messages/Messages";
import Students from "./Students/Students";

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
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}