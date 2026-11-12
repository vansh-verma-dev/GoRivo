
export function getAuth() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));

    
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return null;
    }

    const role = payload.role || localStorage.getItem("role"); // <- yahan field naam badal sakte ho
    return { role };
  } catch {
    localStorage.removeItem("token");
    return null;
  }
}

export const homeFor = (role) =>
  role === "driver" ? "/driver/dashboard" : "/passenger/bookRide";