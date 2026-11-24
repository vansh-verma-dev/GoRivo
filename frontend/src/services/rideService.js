import request from "./api";

// ================= PASSENGER RIDE APIs =================

export const createRideApi = (ridePayload) =>
  request("/ride", {
    method: "POST",
    body: JSON.stringify(ridePayload),
  });

export const getMyRidesApi = () => request("/ride", { method: "GET" });

export const getSingleRideApi = (rideId) =>
  request(`/ride/${rideId}`, { method: "GET" });

export const cancelRideApi = (rideId, cancellationReason) =>
  request(`/ride/${rideId}/cancel`, {
    method: "PATCH",
    body: JSON.stringify({ cancellationReason }),
  });

// ================= DRIVER RIDE APIs =================

export const getAvailableRidesApi = () =>
  request("/drive/ride", { method: "GET" });

export const getDriverRidesApi = (status = "") => {
  const query = status && status !== "all" ? `?status=${status}` : "";
  return request(`/drive/my-rides${query}`, { method: "GET" });
};

export const acceptRideApi = (rideId) =>
  request(`/drive/${rideId}/accept`, { method: "PATCH" });

export const updateRideStatusApi = (rideId, payload) =>
  request(`/drive/${rideId}/status`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });