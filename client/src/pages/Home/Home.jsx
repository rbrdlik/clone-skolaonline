import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import TimetableLayout from "../../components/Timetable/TimetableLayout";
import TimetableLayoutTeacher from "../../components/Timetable/TimetableLayoutTeacher";
import { useAuth } from "../../context/AuthContext";
import { getAllClasses } from "../../models/class";

export default function Home() {
  const { user } = useAuth();
  const [studentClassId, setStudentClassId] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const findStudentClass = async () => {
      if (user?.role === "student") {
        try {
          const classesRes = await getAllClasses();
          if (classesRes && classesRes.status === 200) {
            const classes = Array.isArray(classesRes.payload) ? classesRes.payload : [];
            const studentClass = classes.find(cls => {
              if (!cls.students || !Array.isArray(cls.students)) return false;
              return cls.students.some(student => {
                const studentIdValue = typeof student === 'object' && student._id 
                  ? student._id.toString() 
                  : student.toString();
                return studentIdValue === user._id.toString();
              });
            });
            if (studentClass) {
              setStudentClassId(studentClass._id);
            }
          }
        } catch (err) {
          console.error("Error finding student class:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    
    findStudentClass();
  }, [user]);
  
  if (loading) {
    return (
      <>
        <Navbar />
        <main className="main-content">
          <div style={{ textAlign: "center", padding: "2rem" }}>Načítání...</div>
        </main>
      </>
    );
  }
  
  // Pokud je uživatel učitel, zobrazíme jeho rozvrh
  if (user?.role === "učitel") {
    return (
      <>
        <Navbar />
        <TimetableLayoutTeacher teacherId={user._id} />
      </>
    );
  }
  
  // Pro studenty zobrazíme rozvrh jejich třídy
  return (
    <>
      <Navbar />
      <TimetableLayout classId={studentClassId} />
    </>
  );
}
