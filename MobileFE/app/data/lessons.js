const SUBJECT_IDS = {
  "Český jazyk a literatura": "cj-1",
  "Programování": "prog-1",
  "Matematika": "mat-1",
  "Angličtina": "aj-1",
};

export const getLessonDetail = (lessonId) => {
  if (!lessonId || !lessonId.startsWith('lesson-')) {
    return getDefaultLesson();
  }

  const parts = lessonId.replace('lesson-', '').split('-');
  if (parts.length < 4) {
    return getDefaultLesson();
  }

  const dateStr = `${parts[0]}-${parts[1]}-${parts[2]}`;
  const lessonNum = parts.slice(3).join('-');
  
  const date = new Date(dateStr);
  const dayOfWeek = date.getDay();
  const dayNames = ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"];
  const monthNames = [
    "Leden", "Únor", "Březen", "Duben", "Květen", "Červen",
    "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"
  ];
  
  const formattedDate = `${dayNames[dayOfWeek]} ${date.getDate()}.${date.getMonth() + 1}.`;

  let subject, teacher, classroom, classGroup, grade, homework, lessonInfo, coveredMaterial;
  
  if (lessonNum === "1" || lessonNum === "4" || lessonNum === "5" || lessonNum === "6" || lessonNum === "8" || lessonNum === "9") {
    subject = "Český jazyk a literatura";
    teacher = "Věra Svárovská";
    classroom = "060";
    classGroup = "4.AI (ANI2)";
    grade = {
      name: "Maturitní opakování",
      value: "4-",
      weight: 0.0,
    };
    homework = {
      task: "Přepsat zápis",
      dueDate: `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} 16:00`,
    };
    lessonInfo = "Opakování maturitních témat";
    coveredMaterial = "Literární období, básnické formy";
  } else if (lessonNum === "2" || lessonNum === "2-3") {
    subject = "Programování";
    teacher = "Věra Svárovská";
    classroom = "060";
    classGroup = "4.AI (ANI2)";
    grade = {
      name: "Projekt - Webová aplikace",
      value: "1",
      weight: 2.0,
    };
    homework = {
      task: "Dokončit projekt",
      dueDate: `${date.getDate() + 7}.${date.getMonth() + 1}.${date.getFullYear()} 23:59`,
    };
    lessonInfo = "Vývoj webových aplikací v Reactu";
    coveredMaterial = "React komponenty, state management";
  } else if (lessonNum === "extra" || lessonNum === "7") {
    subject = "Matematika";
    teacher = "Jan Novák";
    classroom = "101";
    classGroup = "4.AI (ANI2)";
    grade = {
      name: "Test z algebry",
      value: "1",
      weight: 1.0,
    };
    homework = {
      task: "Cvičení 5-10",
      dueDate: `${date.getDate() + 3}.${date.getMonth() + 1}.${date.getFullYear()} 8:00`,
    };
    lessonInfo = "Lineární algebra";
    coveredMaterial = "Matice, determinanty, soustavy rovnic";
  } else {
    return getDefaultLesson();
  }

  return {
    _id: lessonId,
    subject,
    teacher,
    class: "4.AI",
    group: classGroup,
    classroom,
    date: formattedDate,
    lessonNumber: lessonNum === "2-3" ? "2-3" : parseInt(lessonNum) || 1,
    time: getTimeForLesson(lessonNum),
    grade,
    homework,
    lessonInfo,
    coveredMaterial,
    subjectId: SUBJECT_IDS[subject],
  };
};

const getTimeForLesson = (lessonNum) => {
  const times = {
    "1": "7:55 - 8:40",
    "2": "8:45 - 9:30",
    "2-3": "8:45 - 10:15",
    "3": "9:40 - 10:25",
    "4": "10:30 - 11:15",
    "5": "11:25 - 12:10",
    "6": "12:20 - 13:05",
    "7": "13:15 - 14:00",
    "8": "14:00 - 14:45",
    "9": "14:55 - 15:40",
    "extra": "13:15 - 14:00",
  };
  return times[lessonNum] || "7:55 - 8:40";
};

const getDefaultLesson = () => {
  return {
    _id: "default",
    subject: "Český jazyk a literatura",
    teacher: "Věra Svárovská",
    class: "4.AI",
    group: "4.AI (ANI2)",
    classroom: "060",
    date: "Po 15.12.",
    lessonNumber: 1,
    time: "7:55 - 8:40",
    grade: {
      name: "Maturitní opakování",
      value: "1-",
      weight: 0.0,
    },
    homework: {
      task: "Přepsat zápis",
      dueDate: "12.12.2025 16:00",
    },
    lessonInfo: "-",
    coveredMaterial: "-",
    subjectId: "cj-1",
  };
};
