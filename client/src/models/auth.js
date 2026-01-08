export const register = async (userData) => {
  const req = await fetch("http://localhost:3000/auth/register", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(userData),
  });

  const data = await req.json();

  return {
    status: req.status,
    message: data.message || data.error,
    payload: data.payload,
  };
};

export const login = async (username, password) => {
  const req = await fetch("http://localhost:3000/auth/login", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  const data = await req.json();

  if (data.accessToken) {
    localStorage.setItem("token", data.accessToken);
    if (data.refreshToken) {
      localStorage.setItem("refreshToken", data.refreshToken);
    }
  }

  return {
    status: req.status,
    message: data.message || data.error,
    payload: data,
  };
};

export const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) return null;

  const req = await fetch("http://localhost:3000/auth/refresh", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });

  const data = await req.json();

  if (data.accessToken) {
    localStorage.setItem("token", data.accessToken);
  }

  return {
    status: req.status,
    message: data.message || data.error,
    payload: data,
  };
};

export const logout = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  const token = localStorage.getItem("token");

  if (!token) return null;

  const req = await fetch("http://localhost:3000/auth/logout", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });

  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");

  return {
    status: req.status,
  };
};

export const getMe = async () => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  let req = await fetch("http://localhost:3000/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "GET",
  });

  // Pokud dostaneme 401, zkusíme refresh token
  if (req.status === 401) {
    const refreshResponse = await refreshToken();
    if (refreshResponse && refreshResponse.status === 200) {
      // Zkusíme znovu s novým tokenem
      const newToken = localStorage.getItem("token");
      if (newToken) {
        req = await fetch("http://localhost:3000/auth/me", {
          headers: {
            Authorization: `Bearer ${newToken}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "GET",
        });
      }
    }
  }

  const data = await req.json();

  return {
    status: req.status,
    message: data.message,
    payload: data,
  };
};
