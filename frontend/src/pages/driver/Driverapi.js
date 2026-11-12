// src/api/driverApi.js
// Driver ki saari API calls aur chhote helper ek jagah

const API = import.meta.env.VITE_API_URL;

// Ride status ki values. Agar backend mein naam alag hain to sirf yahan badlo.
export const RIDE_STATUS = {
  arrived: "arriving",
  started: "started",
  completed: "completed",
};

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  } catch {
    throw new Error("Cannot reach the server. Please check your connection.");
  }

  const result = await res.json().catch(() => ({}));

  if (!res.ok || result.success === false) {
    const err = new Error(result.message || "Something went wrong");
    err.status = res.status;
    throw err;
  }

  return result;
}

/* ---------- API calls ---------- */

// GET /api/drive/ride
export const getAvailableRides = async () => {
  const result = await request("/api/drive/ride");
  return result.data || result.rides || [];
};

// PATCH /api/drive/:rideId/accept
export const acceptRide = async (rideId) => {
  const result = await request(`/api/drive/${rideId}/accept`, {
    method: "PATCH",
  });
  return result.data;
};

// PATCH /api/drive/:rideId/status
export const updateRideStatus = async (rideId, status, extra = {}) => {
  const result = await request(`/api/drive/${rideId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, ...extra }),
  });
  return result.data;
};

// GET /api/drive/history  (ye endpoint abhi banana baaki hai)
export const getDriverHistory = async () => {
  const result = await request("/api/drive/history");
  return result.data || result.rides || [];
};

/* ---------- localStorage helpers ---------- */
// Driver ke liye "meri current ride" wali API nahi hai, isliye accept ki hui ride
// browser mein save karte hain taaki refresh par bhi trip page chale.

const ACTIVE_KEY = "driverActiveRide";
const DONE_KEY = "driverLastCompletedRide";

const read = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
};

export const loadActiveRide = () => read(ACTIVE_KEY);
export const saveActiveRide = (ride) =>
  localStorage.setItem(ACTIVE_KEY, JSON.stringify(ride));
export const clearActiveRide = () => localStorage.removeItem(ACTIVE_KEY);

export const loadCompletedRide = () => read(DONE_KEY);
export const saveCompletedRide = (ride) =>
  localStorage.setItem(DONE_KEY, JSON.stringify(ride));
export const clearCompletedRide = () => localStorage.removeItem(DONE_KEY);

export const isOnline = () => localStorage.getItem("driverOnline") === "true";
export const setOnline = (value) =>
  localStorage.setItem("driverOnline", String(value));

export const getSavedUser = () => read("user") || {};

/* ---------- Chhote helpers ---------- */

// Backend ka naya data purani ride par merge karo, taaki passenger ki details na jayein
export const mergeRide = (oldRide, newData) => {
  if (!newData || typeof newData !== "object") return oldRide;
  const merged = { ...oldRide, ...newData };
  if (oldRide?.passenger && typeof newData.passenger !== "object") {
    merged.passenger = oldRide.passenger;
  }
  return merged;
};

// Passenger tabhi object hota hai jab backend ne populate kiya ho
export const getPassenger = (ride) =>
  ride?.passenger && typeof ride.passenger === "object" ? ride.passenger : null;

export const formatDateTime = (date) =>
  date
    ? new Date(date).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "";