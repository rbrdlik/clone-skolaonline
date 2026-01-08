// Mock data pro rozvrh - struktura odpovídá backend API
// Přidáno více hodin na různé dny pro testování

// Funkce pro generování hodin pro konkrétní datum
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

const now = new Date();
const currentWeekStart = new Date(now);
currentWeekStart.setDate(now.getDate() - now.getDay() + 1);
// Generování dat pro aktuální týden
const now = new Date();
const currentWeekStart = new Date(now);
currentWeekStart.setDate(now.getDate() - now.getDay() + 1); // Pondělí

const allLessons = [];
for (let i = 0; i < 5; i++) {
  const date = new Date(currentWeekStart);
  date.setDate(currentWeekStart.getDate() + i);
  const dateStr = date.toISOString().split('T')[0];
  const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
  const dayLessons = generateLessonsForDate(dateStr, date.getDay());
  allLessons.push(...dayLessons);
}

export const timetableData = {
  days: [
    { _id: "1", label: "Po", date: 19 },
    { _id: "2", label: "Út", date: 20, today: true },
    { _id: "3", label: "St", date: 21 },
    { _id: "4", label: "Čt", date: 22 },
    { _id: "5", label: "Pá", date: 23 }
  ],
  lessons: allLessons,
  // Funkce pro získání hodin pro konkrétní datum
  getLessonsForDate: (dateStr) => {
    return allLessons.filter(lesson => lesson.date === dateStr);
  }
};
