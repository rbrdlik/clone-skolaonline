export const createScheduleChange = async (changeData) => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  const req = await fetch("http://localhost:3000/schedule-changes", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(changeData),
  });

  const data = await req.json();

  return {
    status: req.status,
    message: data.message || data.error,
    payload: data.payload,
  };
};

export const deleteScheduleChangeHour = async (classId, date, hour) => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  const req = await fetch("http://localhost:3000/schedule-changes/hour", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "DELETE",
    body: JSON.stringify({ class_id: classId, date, hour }),
  });

  const data = await req.json();

  return {
    status: req.status,
    message: data.message || data.error,
    payload: data.payload,
  };
};

export const deleteScheduleChangeDay = async (classId, date) => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  const req = await fetch("http://localhost:3000/schedule-changes/day", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "DELETE",
    body: JSON.stringify({ class_id: classId, date }),
  });

  return {
    status: req.status,
  };
};

export const getScheduleChangesByClassAndDate = async (classId, date) => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  const req = await fetch(`http://localhost:3000/schedule-changes?classId=${classId}&date=${date}`, {
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
    message: data.message || data.error,
    payload: data.changes || [],
  };
};
