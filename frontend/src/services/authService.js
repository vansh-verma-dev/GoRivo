export const loginApi = async (payload) => {
  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (data?.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.user?.role || data.role);
    window.dispatchEvent(new Event("auth-change"));
  }
  return data;
};

export const logoutApi = async () => {
  try {
    return await request("/auth/logout", { method: "POST" });
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.dispatchEvent(new Event("auth-change"));
  }
};