import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { api } from "./services/api";
import { timetableData } from "./data/timetable";
import { useRouter } from "expo-router";
import Header from "./components/Header";
import { Ionicons } from "@expo/vector-icons";

export default function Rozvrh() {
  const { user } = useAuth();
  const router = useRouter();
  const [lessons, setLessons] = useState([]);
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  // selectedDate se inicializuje po načtení dní
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/23a33630-ca00-4190-9bc8-ab7683a4bfd2',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'rozvrh.jsx:19',message:'useEffect triggered',data:{currentWeek:currentWeek.toISOString()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    loadTimetable();
  }, [currentWeek]);

  // Funkce pro generování hodin pro konkrétní datum (přesunuto z timetable.js)
  const generateLessonsForDate = (dateStr, dayOfWeek) => {
    const baseLessons = [
      {
        _id: `lesson-${dateStr}-1`,
        lessonNumber: 1,
        subject: "Český jazyk a literatura",
        teacher: "Věra Svárovská",
        room: "Učebna 060 (C60)",
        classroom: "060",
        time: "7:55 - 8:40",
        color: "#EEF3FF",
        date: dateStr,
      },
      {
        _id: `lesson-${dateStr}-2`,
        lessonNumber: "2-3",
        subject: "Programování",
        teacher: "Věra Svárovská",
        room: "Učebna 060 (C60)",
        classroom: "060",
        time: "8:45 - 10:15",
        color: "#FFEEDD",
        date: dateStr,
      },
      {
        _id: `lesson-${dateStr}-4`,
        lessonNumber: 4,
        subject: "Český jazyk a literatura",
        teacher: "Věra Svárovská",
        room: "Učebna 060 (C60)",
        classroom: "060",
        time: "10:30 - 11:15",
        color: "#EEF3FF",
        date: dateStr,
      },
      {
        _id: `lesson-${dateStr}-5`,
        lessonNumber: 5,
        subject: "Český jazyk a literatura",
        teacher: "Věra Svárovská",
        room: "Učebna 060 (C60)",
        classroom: "060",
        time: "11:25 - 12:10",
        color: "#EEF3FF",
        date: dateStr,
      },
      {
        _id: `lesson-${dateStr}-6`,
        lessonNumber: 6,
        subject: "Český jazyk a literatura",
        teacher: "Věra Svárovská",
        room: "Učebna 060 (C60)",
        classroom: "060",
        time: "12:20 - 13:05",
        color: "#EEF3FF",
        date: dateStr,
      },
      {
        _id: `lesson-${dateStr}-8`,
        lessonNumber: 8,
        subject: "Český jazyk a literatura",
        teacher: "Věra Svárovská",
        room: "Učebna 060 (C60)",
        classroom: "060",
        time: "14:00 - 14:45",
        color: "#EEF3FF",
        date: dateStr,
      },
      {
        _id: `lesson-${dateStr}-9`,
        lessonNumber: 9,
        subject: "Český jazyk a literatura",
        teacher: "Věra Svárovská",
        room: "Učebna 060 (C60)",
        classroom: "060",
        time: "14:55 - 15:40",
        color: "#EEF3FF",
        date: dateStr,
      },
    ];

    // Pro pondělí a středu přidáme více hodin
    if (dayOfWeek === 1 || dayOfWeek === 3) {
      baseLessons.push({
        _id: `lesson-${dateStr}-extra`,
        lessonNumber: 7,
        subject: "Matematika",
        teacher: "Jan Novák",
        room: "Učebna 101",
        classroom: "101",
        time: "13:15 - 14:00",
        color: "#E8F5E9",
        date: dateStr,
      });
    }

    return baseLessons;
  };

  const loadTimetable = async () => {
    setLoading(true);
    try {
      const weekStr = formatWeekDate(currentWeek);
      if (user?.studentId) {
        const data = await api.getTimetable(user.studentId, weekStr);
        setLessons(data.lessons || []);
        setDays(data.days || []);
      } else {
        // Fallback na mock data - generujeme dny pro aktuální týden
        const weekDays = generateWeekDays(currentWeek);
        // Dynamicky generujeme hodiny pro každý den v týdnu
        const weekLessons = [];
        weekDays.forEach(day => {
          if (day.fullDate) {
            const dateStr = day.fullDate.toISOString().split('T')[0];
            const dayLessons = generateLessonsForDate(dateStr, day.fullDate.getDay());
            weekLessons.push(...dayLessons);
          }
        });
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/23a33630-ca00-4190-9bc8-ab7683a4bfd2',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'rozvrh.jsx:35',message:'Mock lessons loaded',data:{lessonsCount:weekLessons.length,daysCount:weekDays.length,weekStart:weekDays[0]?.fullDate?.toISOString()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
        // #endregion
        setDays(weekDays);
        setLessons(weekLessons);
        // Nastavit selectedDate na první den nebo dnešní den
        if (!selectedDate) {
          const todayDay = weekDays.find(d => d.today);
          setSelectedDate(todayDay?.fullDate || weekDays[0]?.fullDate || new Date());
        }
      }
    } catch (error) {
      console.error("Error loading timetable:", error);
      const weekDays = generateWeekDays(currentWeek);
      const weekLessons = [];
      weekDays.forEach(day => {
        if (day.fullDate) {
          const dateStr = day.fullDate.toISOString().split('T')[0];
          const dayLessons = generateLessonsForDate(dateStr, day.fullDate.getDay());
          weekLessons.push(...dayLessons);
        }
      });
      setDays(weekDays);
      setLessons(weekLessons);
      // Nastavit selectedDate na první den nebo dnešní den
      if (!selectedDate) {
        const todayDay = weekDays.find(d => d.today);
        setSelectedDate(todayDay?.fullDate || weekDays[0]?.fullDate || new Date());
      }
    } finally {
      setLoading(false);
    }
  };

  // Generování dní pro týden
  const generateWeekDays = (weekStart) => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/23a33630-ca00-4190-9bc8-ab7683a4bfd2',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'rozvrh.jsx:48',message:'generateWeekDays called',data:{weekStart:weekStart.toISOString()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    const days = [];
    const startOfWeek = new Date(weekStart);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Začátek v pondělí
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/23a33630-ca00-4190-9bc8-ab7683a4bfd2',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'rozvrh.jsx:51',message:'startOfWeek calculated',data:{startOfWeek:startOfWeek.toISOString(),dayOfWeek:startOfWeek.getDay()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    
    const dayLabels = ["Po", "Út", "St", "Čt", "Pá"];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 5; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dateStr = date.toDateString();
      const todayStr = today.toDateString();
      
      days.push({
        _id: `day-${i}`,
        label: dayLabels[i],
        date: date.getDate(),
        fullDate: date,
        today: dateStr === todayStr,
      });
    }
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/23a33630-ca00-4190-9bc8-ab7683a4bfd2',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'rozvrh.jsx:71',message:'generateWeekDays result',data:{daysCount:days.length,firstDay:days[0]?.fullDate?.toISOString(),lastDay:days[4]?.fullDate?.toISOString()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    return days;
  };

  // Formátování data pro API (YYYY-MM-DD)
  const formatWeekDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Změna týdne
  const changeWeek = (direction) => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/23a33630-ca00-4190-9bc8-ab7683a4bfd2',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'rozvrh.jsx:84',message:'changeWeek called',data:{direction,currentWeekBefore:currentWeek.toISOString()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + (direction * 7));
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/23a33630-ca00-4190-9bc8-ab7683a4bfd2',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'rozvrh.jsx:87',message:'newWeek calculated',data:{newWeek:newWeek.toISOString(),direction},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    setCurrentWeek(newWeek);
    // Reset selectedDate na první den nového týdne
    const newWeekStart = new Date(newWeek);
    newWeekStart.setDate(newWeekStart.getDate() - newWeekStart.getDay() + 1); // Pondělí
    setSelectedDate(newWeekStart);
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/23a33630-ca00-4190-9bc8-ab7683a4bfd2',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'rozvrh.jsx:92',message:'Week changed and date reset',data:{newWeek:newWeek.toISOString(),selectedDate:newWeekStart.toISOString()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
  };

  // Získání aktuálního měsíce a roku
  const monthNames = [
    "Leden", "Únor", "Březen", "Duben", "Květen", "Červen",
    "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"
  ];
  const currentMonth = monthNames[currentWeek.getMonth()];
  const currentYear = currentWeek.getFullYear();

  // Filtrování hodin pro vybraný den
  const getLessonsForDay = (day) => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/23a33630-ca00-4190-9bc8-ab7683a4bfd2',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'rozvrh.jsx:99',message:'getLessonsForDay called',data:{day:day?.fullDate?.toISOString(),lessonsCount:lessons.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
    // #endregion
    if (!day || !day.fullDate) return lessons;
    const dayStr = day.fullDate.toISOString().split('T')[0]; // YYYY-MM-DD
    // Filtrujeme hodiny podle data
    const filtered = lessons.filter(lesson => {
      if (lesson.date) {
        return lesson.date === dayStr;
      }
      // Pokud není datum, zobrazíme všechny (pro mock data)
      return true;
    });
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/23a33630-ca00-4190-9bc8-ab7683a4bfd2',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'rozvrh.jsx:110',message:'getLessonsForDay result',data:{dayStr,filteredCount:filtered.length,allLessonsCount:lessons.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
    // #endregion
    return filtered;
  };

  const selectedDayData = selectedDate 
    ? days.find(d => {
        if (!d.fullDate) return false;
        return d.fullDate.toDateString() === selectedDate.toDateString();
      })
    : null;
  
  const activeDayData = selectedDayData || days.find(d => d.today) || days[0];

  const dayLessons = getLessonsForDay(activeDayData);

  const renderDay = (day) => {
    const isSelected = activeDayData?._id === day._id;
    return (
      <TouchableOpacity
        key={day._id}
        style={[styles.dayBox, isSelected && styles.dayBoxActive]}
        onPress={() => setSelectedDate(day.fullDate || new Date())}
      >
        <Text style={[styles.dayLabel, isSelected && styles.dayLabelActive]}>
          {day.label}
        </Text>
        <Text style={[styles.dayNum, isSelected && styles.dayNumActive]}>
          {day.date}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderLesson = (lesson) => {
    return (
      <TouchableOpacity
        key={lesson._id}
        style={[styles.lesson, { backgroundColor: lesson.color || "#EEF3FF" }]}
        onPress={() => router.push({
          pathname: "/lesson-detail",
          params: { lessonId: lesson._id }
        })}
      >
        <View style={styles.lessonNumberBox}>
          <Text style={styles.lessonNumber}>{lesson.lessonNumber || lesson._id}</Text>
        </View>
        <View style={styles.lessonInfo}>
          <Text style={styles.lessonTime}>{lesson.time}</Text>
          <Text style={styles.lessonTitle}>{lesson.subject}</Text>
          <Text style={styles.lessonTeacher}>{lesson.teacher}</Text>
          <Text style={styles.lessonDetails}>
            {lesson.room || lesson.classroom}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#999" style={styles.chevron} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Rozvrh hodin" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Month selector */}
        <View style={styles.monthRow}>
          <TouchableOpacity 
            onPress={() => {
              // #region agent log
              fetch('http://127.0.0.1:7242/ingest/23a33630-ca00-4190-9bc8-ab7683a4bfd2',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'rozvrh.jsx:171',message:'Previous week button pressed',data:{currentWeek:currentWeek.toISOString()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
              // #endregion
              changeWeek(-1);
            }}
            style={styles.arrowButton}
          >
            <Ionicons name="chevron-back" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={styles.monthText}>
            {currentMonth} {currentYear}
          </Text>
          <TouchableOpacity 
            onPress={() => {
              // #region agent log
              fetch('http://127.0.0.1:7242/ingest/23a33630-ca00-4190-9bc8-ab7683a4bfd2',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'rozvrh.jsx:179',message:'Next week button pressed',data:{currentWeek:currentWeek.toISOString()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
              // #endregion
              changeWeek(1);
            }}
            style={styles.arrowButton}
          >
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Days row */}
        <View style={styles.daysRow}>
          {days.map(renderDay)}
        </View>

        {/* Lessons */}
        <View style={styles.lessonsContainer}>
          {dayLessons.length > 0 ? (
            dayLessons.map(renderLesson)
          ) : (
            <Text style={styles.noLessons}>Žádné hodiny na tento den</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  monthRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
    paddingHorizontal: 20,
  },
  arrowButton: {
    padding: 10,
    minWidth: 44,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  monthText: {
    fontSize: 20,
    fontWeight: "700",
    marginHorizontal: 20,
  },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  dayBox: {
    width: "19%",
    height: 70,
    borderRadius: 15,
    backgroundColor: "#F1F1F1",
    justifyContent: "center",
    alignItems: "center",
  },
  dayBoxActive: {
    backgroundColor: "#4C8DEF",
  },
  dayLabel: {
    fontSize: 14,
    color: "#333",
  },
  dayLabelActive: {
    color: "#fff",
  },
  dayNum: {
    fontSize: 18,
    marginTop: 3,
    color: "#444",
  },
  dayNumActive: {
    color: "#fff",
  },
  lessonsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  lesson: {
    flexDirection: "row",
    marginBottom: 12,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    // Android shadow
    elevation: 2,
  },
  lessonNumberBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  lessonNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTime: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 2,
  },
  lessonTeacher: {
    fontSize: 14,
    color: "#444",
    marginBottom: 2,
  },
  lessonDetails: {
    fontSize: 13,
    color: "#666",
  },
  chevron: {
    marginLeft: 8,
  },
  noLessons: {
    textAlign: "center",
    color: "#999",
    marginTop: 40,
    fontSize: 16,
  },
});
