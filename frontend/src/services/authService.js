import request from "./api";

// ================= AUTH APIs =================

// POST /api/auth/signup -> signup
export const signupApi = (payload) =>
  request("/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });

// POST /api/auth/login -> loginUser
export const loginApi = async (payload) => {
  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const role = data?.user?.role || data?.role;

  if (data?.token) {
    localStorage.setItem("token", data.token);
    if (role) localStorage.setItem("role", role);
    window.dispatchEvent(new Event("auth-change"));
  }

  return data;
};

// POST /api/auth/logout -> Logout
export const logoutApi = async () => {
  try {
    return await request("/auth/logout", { method: "POST" });
  } finally {
    // server fail ho tab bhi local logout ho jaye
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.dispatchEvent(new Event("auth-change"));
  }
};

// ================= PROFILE APIs =================

// GET /api/auth/me -> getProfile
export const getProfileApi = () => request("/auth/me");

// PATCH /api/auth/me -> UpdateProfile
export const updateProfileApi = (payload) =>
  request("/auth/me", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

// ================= HELPERS =================

export const getToken = () => localStorage.getItem("token");

export const getRole = () => {
  const role = localStorage.getItem("role");
  return role && role !== "undefined" ? role : null;
};

export const isLoggedIn = () => Boolean(getToken());