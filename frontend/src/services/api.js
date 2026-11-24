const rawUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
const cleanOrigin = rawUrl.replace(/\/+$/, "").replace(/\/api$/, "");
const BASE_URL = `${cleanOrigin}/api`;

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    credentials: "include",
    ...options,
  };

  const response = await fetch(`${BASE_URL}${normalizedEndpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || `Request failed (${response.status})`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

export default request;