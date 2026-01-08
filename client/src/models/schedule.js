export const getStudentScheduleForDay = async (studentId, date) => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  const req = await fetch(`http://localhost:3000/schedule/student?studentId=${studentId}&date=${date}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "GET",
  });

  const data = await req.json();

  return {
    status: req.status,
    message: data.message,
    payload: data,
  };
};

export const getTeacherScheduleForDay = async (teacherId, date) => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  const req = await fetch(`http://localhost:3000/schedule/teacher?teacherId=${teacherId}&date=${date}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "GET",
  });

  const data = await req.json();

  return {
    status: req.status,
    message: data.message,
    payload: data,
  };
};

export const getClassScheduleForDay = async (classId, date) => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  const req = await fetch(`http://localhost:3000/schedule/class?classId=${classId}&date=${date}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "GET",
  });

  const data = await req.json();

  return {
    status: req.status,
    message: data.message,
    payload: data,
  };
};

export const createSchedule = async (scheduleData) => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  const req = await fetch("http://localhost:3000/schedule", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(scheduleData),
  });

  const data = await req.json();

  return {
    status: req.status,
    message: data.message,
    payload: data,
  };
};

export const updateSchedule = async (id, scheduleData) => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  const req = await fetch(`http://localhost:3000/schedule/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: JSON.stringify(scheduleData),
  });

  const data = await req.json();

  return {
    status: req.status,
    message: data.message,
    payload: data,
  };
};

export const getStudentLessonDetail = async (studentId, date, hour) => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  const req = await fetch(`http://localhost:3000/schedule/student/lesson-detail?studentId=${studentId}&date=${date}&hour=${hour}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "GET",
  });

  const data = await req.json();

  return {
    status: req.status,
    message: data.message,
    payload: data,
  };
};

const getDateForDayOfWeek = (dayOfWeek, baseDate = null) => {
  const referenceDate = baseDate ? new Date(baseDate) : new Date();
  const currentDay = referenceDate.getDay();
  const diff = dayOfWeek - (currentDay === 0 ? 7 : currentDay);
  const targetDate = new Date(referenceDate);
  targetDate.setDate(referenceDate.getDate() + diff);
  return targetDate.toISOString().split('T')[0];
};

export const getScheduleByClassAndDay = async (classId, dayOfWeek, includeCancelled = false, baseDate = null) => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  const date = getDateForDayOfWeek(dayOfWeek, baseDate);
  const url = `http://localhost:3000/schedule/class?classId=${classId}&date=${date}${includeCancelled ? "&includeCancelled=true" : ""}`;
  const req = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "GET",
  });

  const data = await req.json();
  return Array.isArray(data) ? data : [];
};