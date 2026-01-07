export const getMessagesForStudent = async (studentId) => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  const req = await fetch(`http://localhost:3000/message/student/${studentId}`, {
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

export const getMessageDetail = async (id) => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  const req = await fetch(`http://localhost:3000/message/${id}`, {
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

export const createMessage = async (messageData) => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  const req = await fetch("http://localhost:3000/message", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(messageData),
  });

  const data = await req.json();

  return {
    status: req.status,
    message: data.message || data.error,
    payload: data.payload,
  };
};
