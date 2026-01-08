// Mock data pro známky - struktura odpovídá backend API

// Funkce pro převod známky na číslo (pro výpočet průměru)
const gradeToNumber = (grade) => {
  if (typeof grade === 'number') return grade;
  const gradeStr = String(grade).trim();
  
  const hasPlus = gradeStr.includes('+');
  const hasMinus = gradeStr.includes('-');
  
  // Nejdřív zkontrolujeme znaménka, pak odstraníme
  const hasPlus = gradeStr.includes('+');
  const hasMinus = gradeStr.includes('-');
  
  // Odstranění znamének pro získání čísla
  const cleanGrade = gradeStr.replace(/[+-]/g, '');
  const num = parseFloat(cleanGrade);
  
  if (isNaN(num)) return null;
  
  // Úprava podle znamének
  if (hasPlus) {
    return num + 0.25;
  } else if (hasMinus) {
    return num - 0.25;
  }
  
  return num;
};

// Funkce pro výpočet průměru z pole známek
export const calculateAverage = (grades) => {
  if (!grades || grades.length === 0) return 0;
  
  const numbers = grades
    .map(grade => gradeToNumber(grade.value || grade))
    .filter(num => num !== null && num > 0);
  
  if (numbers.length === 0) return 0;
  
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length;
};

// Mock data pro předměty s reálnými známkami
export const mockSubjectsWithGrades = {
  "cj-1": {
    subject: "Český jazyk a literatura",
    subjectId: "cj-1",
    grades: [
      { _id: "grade-1", value: "4-", name: "Maturitní opakování", date: "12.12.2025", teacher: "Věra Svárovská", weight: 0.0 },
      { _id: "grade-2", value: "1", name: "Test z literatury", date: "10.12.2025", teacher: "Věra Svárovská", weight: 1.0 },
      { _id: "grade-3", value: "5", name: "Ústní zkoušení", date: "8.12.2025", teacher: "Věra Svárovská", weight: 1.0 },
      { _id: "grade-4", value: "1", name: "Písemná práce", date: "5.12.2025", teacher: "Věra Svárovská", weight: 1.0 },
      { _id: "grade-5", value: "1", name: "Diktát", date: "3.12.2025", teacher: "Věra Svárovská", weight: 1.0 },
      { _id: "grade-6", value: "2", name: "Čtení", date: "1.12.2025", teacher: "Věra Svárovská", weight: 1.0 },
    ]
  },
  "mat-1": {
    subject: "Matematika",
    subjectId: "mat-1",
    grades: [
      { _id: "grade-mat-1", value: "1", name: "Test z algebry", date: "15.12.2025", teacher: "Jan Novák", weight: 1.0 },
      { _id: "grade-mat-2", value: "1", name: "Domácí úkol", date: "12.12.2025", teacher: "Jan Novák", weight: 0.5 },
      { _id: "grade-mat-3", value: "1", name: "Písemka", date: "10.12.2025", teacher: "Jan Novák", weight: 1.0 },
    ]
  },
  "aj-1": {
    subject: "Angličtina",
    subjectId: "aj-1",
    grades: [
      { _id: "grade-aj-1", value: "2", name: "Test z gramatiky", date: "14.12.2025", teacher: "Marie Svobodová", weight: 1.0 },
      { _id: "grade-aj-2", value: "2", name: "Ústní zkoušení", date: "11.12.2025", teacher: "Marie Svobodová", weight: 1.0 },
      { _id: "grade-aj-3", value: "2", name: "Poslech", date: "9.12.2025", teacher: "Marie Svobodová", weight: 1.0 },
      { _id: "grade-aj-4", value: "2", name: "Esej", date: "7.12.2025", teacher: "Marie Svobodová", weight: 1.0 },
      { _id: "grade-aj-5", value: "2", name: "Prezentace", date: "5.12.2025", teacher: "Marie Svobodová", weight: 1.0 },
    ]
  },
  "prog-1": {
    subject: "Programování",
    subjectId: "prog-1",
    grades: [
      { _id: "grade-prog-1", value: "1", name: "Projekt - Webová aplikace", date: "15.12.2025", teacher: "Věra Svárovská", weight: 2.0 },
      { _id: "grade-prog-2", value: "1", name: "Test z Reactu", date: "10.12.2025", teacher: "Věra Svárovská", weight: 1.0 },
      { _id: "grade-prog-3", value: "2", name: "Domácí úkol - Komponenty", date: "8.12.2025", teacher: "Věra Svárovská", weight: 1.0 },
      { _id: "grade-prog-4", value: "1", name: "Praktická zkouška", date: "5.12.2025", teacher: "Věra Svárovská", weight: 1.5 },
    ]
  },
};

// Funkce pro získání předmětů s vypočítanými průměry
export const getSubjectsWithAverages = () => {
  return Object.values(mockSubjectsWithGrades).map(subjectData => {
    const average = calculateAverage(subjectData.grades);
    return {
      subject: subjectData.subject,
      subjectId: subjectData.subjectId,
      average: average,
      gradeCount: subjectData.grades.length,
      grades: subjectData.grades,
    };
  });
};

