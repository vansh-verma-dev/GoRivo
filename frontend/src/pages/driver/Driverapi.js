
const API = import.meta.env.VITE_API_URL;

export const RIDE_STATUS = {
  arrived: "arriving",
  started: "started",
  completed: "completed",
};

const request = async (path, options = {}) => {
  let res;

  try {
    res = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        ...options.headers,
      },
    });
  } catch (error) {
    throw new Error("Unable to connect to server");
  }

  const result = await res.json().catch(() => ({}));

  if (!res.ok || result.success === false) {
    const error = new Error(result.message || "Something went wrong");
    error.status = res.status;
    throw error;
  }

  return result;
};

export const getAvailableRides = async () => {
  const result = await request("/api/drive/ride");
  return result.data || result.rides || [];
};

export const acceptRide = async (rideId) => {
  const result = await request(`/api/drive/${rideId}/accept`, {
    method: "PATCH",
  });

  return result.data;
};

export const updateRideStatus = async (rideId, status, extra = {}) => {
  const result = await request(`/api/drive/${rideId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, ...extra }),
  });

  return result.data;
};

export const getDriverHistory = async () => {
  const result = await request("/api/drive/history");
  return result.data || result.rides || [];
};

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

export const saveActiveRide = (ride) => {
  localStorage.setItem(ACTIVE_KEY, JSON.stringify(ride));
};

export const clearActiveRide = () => {
  localStorage.removeItem(ACTIVE_KEY);
};

export const loadCompletedRide = () => read(DONE_KEY);

export const saveCompletedRide = (ride) => {
  localStorage.setItem(DONE_KEY, JSON.stringify(ride));
};

export const clearCompletedRide = () => {
  localStorage.removeItem(DONE_KEY);
};

export const isOnline = () => {
  return localStorage.getItem("driverOnline") === "true";
};

export const setOnline = (value) => {
  localStorage.setItem("driverOnline", String(value));
};

export const getSavedUser = () => read("user") || {};

export const mergeRide = (oldRide, newData) => {
  if (!newData || typeof newData !== "object") return oldRide;

  const merged = { ...oldRide, ...newData };

  if (oldRide?.passenger && typeof newData.passenger !== "object") {
    merged.passenger = oldRide.passenger;
  }

  return merged;
};

export const getPassenger = (ride) => {
  return ride?.passenger && typeof ride.passenger === "object"
    ? ride.passenger
    : null;
};

export const formatDateTime = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};
