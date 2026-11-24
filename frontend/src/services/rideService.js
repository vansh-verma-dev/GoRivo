import request from "./api";

// ================= PASSENGER RIDE APIs =================

// POST /api/ride -> createRide
export const createRideApi = (ridePayload) =>
  request("/ride", {
    method: "POST",
    body: JSON.stringify(ridePayload),
  });

// GET /api/ride -> GetRide
export const getMyRidesApi = () =>
  request("/ride", {
    method: "GET",
  });

// GET /api/ride/:rideId -> SingleRideDetails
export const getSingleRideApi = (rideId) =>
  request(`/ride/${rideId}`, {
    method: "GET",
  });

// PATCH /api/ride/:rideId/cancel -> CancelRide
export const cancelRideApi = (rideId, cancellationReason) =>
  request(`/ride/${rideId}/cancel`, {
    method: "PATCH",
    body: JSON.stringify({ cancellationReason }),
  });

// ================= DRIVER RIDE APIs =================

// GET /api/drive/ride -> GetAvailableRides
export const getAvailableRidesApi = () =>
  request("/drive/ride", {
    method: "GET",
  });

// PATCH /api/drive/:rideId/accept -> AcceptRide
export const acceptRideApi = (rideId) =>
  request(`/drive/${rideId}/accept`, {
    method: "PATCH",
  });

// PATCH /api/drive/:rideId/status -> UpdateStatus
export const updateRideStatusApi = (rideId, payload) =>
  request(`/drive/${rideId}/status`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  export const getDriverRidesApi = () => request("/drive/my-rides");