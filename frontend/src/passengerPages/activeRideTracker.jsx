import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  FiShield,
  FiXCircle,
  FiPhone,
  FiAlertCircle,
  FiCheckCircle,
  FiX,
  FiRefreshCw,
  FiArrowLeft,
  FiStar,
} from "react-icons/fi";
import { FaCarSide } from "react-icons/fa";
import Navbar from "../components/navbar";
import { getSingleRideApi, cancelRideApi } from "../services/rideService";

const STATUS_BADGES = {
  searching: {
    label: "Searching for nearby captain...",
    color: "bg-orange-50 text-orange-600 border-orange-200",
  },
  accepted: {
    label: "Captain accepted your ride",
    color: "bg-blue-50 text-blue-600 border-blue-200",
  },
  arriving: {
    label: "Captain is arriving at pickup",
    color: "bg-indigo-50 text-indigo-600 border-indigo-200",
  },
  started: {
    label: "Trip in progress",
    color: "bg-green-50 text-green-700 border-green-200",
  },
  completed: {
    label: "Trip completed",
    color: "bg-green-100 text-green-800 border-green-300",
  },
  cancelled: {
    label: "Ride cancelled",
    color: "bg-red-50 text-red-600 border-red-200",
  },
  no_driver_found: {
    label: "No driver found nearby",
    color: "bg-gray-100 text-gray-700 border-gray-300",
  },
};

const CANCEL_REASONS = [
  "Driver is taking too long",
  "Changed my travel plans",
  "Booked by mistake",
  "Entered wrong pickup location",
];

const TERMINAL_STATUSES = ["completed", "cancelled", "no_driver_found"];

// Safely extract ride object regardless of API wrapper shape
const extractRideData = (res) => {
  if (!res) return null;
  if (res.data?.ride) return res.data.ride;
  if (res.data && (res.data._id || res.data.status)) return res.data;
  if (res.ride) return res.ride;
  if (res._id || res.status) return res;
  return null;
};

// Dismissible + Toggleable Alert Toast
const ToggleAlert = ({ alert, onClose, onToggleDetail }) => {
  if (!alert?.visible) return null;

  const styles = {
    success: "border-green-200 bg-white text-gray-900",
    error: "border-red-200 bg-white text-gray-900",
    info: "border-orange-200 bg-white text-gray-900",
  };

  const iconColors = {
    success: "bg-green-100 text-green-600",
    error: "bg-red-100 text-red-600",
    info: "bg-orange-100 text-orange-600",
  };

  const type = alert.type || "info";

  return (
    <div
      role="status"
      className={`fixed bottom-5 right-5 z-50 w-[calc(100%-2.5rem)] max-w-sm rounded-2xl border p-4 shadow-xl transition-all ${styles[type]}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${iconColors[type]}`}
        >
          {type === "success" ? (
            <FiCheckCircle className="text-base" />
          ) : (
            <FiAlertCircle className="text-base" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-extrabold uppercase tracking-wider text-orange-500">
              {alert.title || "GoRivo Alert"}
            </p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Dismiss alert"
              className="cursor-pointer rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            >
              <FiX className="text-sm" />
            </button>
          </div>

          <p className="mt-1 text-sm font-semibold text-gray-800">
            {alert.message}
          </p>

          {alert.detail && (
            <div className="mt-2.5 flex items-center justify-between border-t border-gray-100 pt-2">
              <span className="truncate pr-2 text-xs text-gray-500">
                {alert.showDetail ? alert.detail : "Tap toggle for details"}
              </span>
              <button
                type="button"
                onClick={onToggleDetail}
                className="shrink-0 cursor-pointer rounded-full bg-orange-50 px-2.5 py-0.5 text-[11px] font-bold text-orange-600 hover:bg-orange-100"
              >
                {alert.showDetail ? "Hide" : "Details"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ActiveRideTracker = () => {
  const { rideId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const initialRide =
    location.state?.ride &&
    (location.state.ride._id === rideId ||
      location.state.ride.bookingId === rideId)
      ? location.state.ride
      : null;

  const [ride, setRide] = useState(initialRide);
  const [loading, setLoading] = useState(!initialRide);
  const [loadError, setLoadError] = useState("");

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState(CANCEL_REASONS[0]);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");

  const [alert, setAlert] = useState(
    initialRide
      ? {
          visible: true,
          type: "success",
          title: "Ride Booked",
          message: "Your ride request is live. Searching for a captain.",
          detail: `Booking ID: ${initialRide.bookingId || initialRide._id}`,
          showDetail: false,
        }
      : { visible: false }
  );

  // Prevent overlapping API calls & memory leaks
  const isFetchingRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Reset state if rideId in URL changes
  useEffect(() => {
    const matchedStateRide =
      location.state?.ride &&
      (location.state.ride._id === rideId ||
        location.state.ride.bookingId === rideId)
        ? location.state.ride
        : null;

    setRide(matchedStateRide);
    setLoading(!matchedStateRide);
    setLoadError("");
    setShowCancelModal(false);
  }, [rideId, location.state]);

  const isTerminal = ride ? TERMINAL_STATUSES.includes(ride.status) : false;

  const triggerAlert = useCallback((nextAlert) => {
    if (!isMountedRef.current) return;
    setAlert({
      visible: true,
      showDetail: false,
      ...nextAlert,
    });
  }, []);

  // Auto-hide toast after 5 seconds
  useEffect(() => {
    if (!alert.visible) return;
    const timer = setTimeout(() => {
      if (isMountedRef.current) {
        setAlert((prev) => ({ ...prev, visible: false }));
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [alert.visible, alert.message]);

  const fetchRideDetails = useCallback(async () => {
    if (!rideId || isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      const res = await getSingleRideApi(rideId);
      const updatedRide = extractRideData(res);

      if (!updatedRide) {
        throw new Error("Invalid ride data received from server.");
      }

      if (!isMountedRef.current) return;

      setRide((prev) => {
        if (prev && updatedRide.status && prev.status !== updatedRide.status) {
          const statusLabel =
            STATUS_BADGES[updatedRide.status]?.label ||
            updatedRide.status.replace(/_/g, " ");

          triggerAlert({
            type: updatedRide.status === "cancelled" ? "error" : "info",
            title: "Status Updated",
            message: statusLabel,
            detail: `Booking ID: ${updatedRide.bookingId || updatedRide._id}`,
          });
        }
        return updatedRide;
      });
      setLoadError("");
    } catch (err) {
      if (!isMountedRef.current) return;
      console.error("Fetch ride error:", err);
      const statusCode = err?.response?.status || err?.status;

      if (statusCode === 401) {
        setLoadError("Session expired. Please login again.");
      } else if (statusCode === 404) {
        setLoadError("Ride not found.");
      } else {
        setLoadError(
          err?.response?.data?.message || err?.message || "Could not load ride."
        );
      }
    } finally {
      isFetchingRef.current = false;
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [rideId, triggerAlert]);

  useEffect(() => {
    fetchRideDetails();
    if (isTerminal) return;

    const interval = setInterval(fetchRideDetails, 5000);
    return () => clearInterval(interval);
  }, [fetchRideDetails, isTerminal]);

  const handleCancelRide = async () => {
    try {
      setCancelling(true);
      setCancelError("");
      const res = await cancelRideApi(rideId, cancellationReason);
      const updatedRide = extractRideData(res);

      if (updatedRide) {
        setRide(updatedRide);
      } else {
        setRide((prev) =>
          prev ? { ...prev, status: "cancelled", cancellationReason } : prev
        );
      }

      setShowCancelModal(false);
      triggerAlert({
        type: "error",
        title: "Ride Cancelled",
        message: "Your ride has been cancelled.",
        detail: `Reason: ${cancellationReason}`,
      });
    } catch (err) {
      console.error("Cancel ride error:", err);
      setCancelError(
        err?.response?.data?.message || err?.message || "Could not cancel ride."
      );
    } finally {
      if (isMountedRef.current) {
        setCancelling(false);
      }
    }
  };

  const openCancelModal = () => {
    setCancelError("");
    setShowCancelModal(true);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 text-sm font-semibold text-gray-500">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
          <p>Loading ride details...</p>
        </div>
      </>
    );
  }

  if (!ride) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
          <p className="text-sm font-semibold text-red-500">
            {loadError || "Ride not found."}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                fetchRideDetails();
              }}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
            >
              <FiRefreshCw /> Retry
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold text-white hover:bg-orange-600"
            >
              <FiArrowLeft /> Back to Home
            </button>
          </div>
        </div>
      </>
    );
  }

  const badge = STATUS_BADGES[ride.status] || STATUS_BADGES.searching;
  const canCancel = ["searching", "accepted", "arriving"].includes(ride.status);
  const otp = ride.otp ?? location.state?.otp;
  const showOtp =
    ["searching", "accepted", "arriving"].includes(ride.status) && Boolean(otp);

  return (
    <>
      <Navbar />

      <ToggleAlert
        alert={alert}
        onClose={() => setAlert((prev) => ({ ...prev, visible: false }))}
        onToggleDetail={() =>
          setAlert((prev) => ({ ...prev, showDetail: !prev.showDetail }))
        }
      />

      <section className="min-h-screen bg-gray-50/70 py-8 lg:py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            {/* Booking ID & live status */}
            <div className="flex flex-col justify-between gap-3 border-b border-gray-100 pb-5 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-semibold text-gray-400">BOOKING ID</p>
                <h1 className="text-lg font-extrabold text-gray-900">
                  {ride.bookingId || ride._id}
                </h1>
              </div>

              <span
                className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold ${badge.color}`}
              >
                <span
                  className={`h-2 w-2 rounded-full bg-current ${
                    isTerminal ? "" : "animate-pulse"
                  }`}
                />
                {badge.label}
              </span>
            </div>

            {/* OTP box */}
            {showOtp && (
              <div className="flex flex-col justify-between gap-3 rounded-2xl border border-orange-200/80 bg-orange-50 p-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white">
                    <FiShield />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">
                      Share OTP with Captain
                    </p>
                    <p className="text-[11px] text-gray-500">
                      Required to start your GoRivo trip
                    </p>
                  </div>
                </div>

                <div className="flex gap-1.5 self-end sm:self-auto">
                  {String(otp)
                    .split("")
                    .map((digit, i) => (
                      <span
                        key={i}
                        className="flex h-10 w-9 items-center justify-center rounded-lg border border-orange-200 bg-white text-lg font-extrabold text-orange-600 shadow-sm"
                      >
                        {digit}
                      </span>
                    ))}
                </div>
              </div>
            )}

            {/* Driver info */}
            {ride.driver && (
              <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-100 text-lg font-bold text-orange-600">
                    {ride.driver.name?.charAt(0)?.toUpperCase() || "C"}
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase text-gray-400">
                      Your captain
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {ride.driver.name || "Captain"}
                    </p>
                    {ride.driver.vehicleNumber && (
                      <p className="mt-0.5 text-xs font-semibold text-gray-500">
                        {ride.driver.vehicleModel
                          ? `${ride.driver.vehicleModel} • `
                          : ""}
                        <span className="uppercase text-gray-800">
                          {ride.driver.vehicleNumber}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                {ride.driver.rating && (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                    <FiStar className="fill-amber-400 text-amber-500" />
                    {Number(ride.driver.rating).toFixed(1)}
                  </span>
                )}
              </div>
            )}

            {/* Route details */}
            <div className="space-y-3 rounded-xl bg-gray-50 p-4">
              <div className="flex items-start gap-3">
                <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-orange-500" />
                <div>
                  <p className="text-[11px] font-semibold uppercase text-gray-400">
                    Pickup
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {ride.pickup?.name || ride.pickup?.address || "Pickup point"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t border-gray-200/70 pt-3">
                <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-sm bg-gray-900" />
                <div>
                  <p className="text-[11px] font-semibold uppercase text-gray-400">
                    Destination
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {ride.destination?.name ||
                      ride.destination?.address ||
                      "Drop point"}
                  </p>
                </div>
              </div>
            </div>

            {/* Ride meta info */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-gray-100 p-3">
                <p className="text-[11px] text-gray-400">Ride Class</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-sm font-bold uppercase text-gray-900">
                  <FaCarSide className="text-orange-500" />{" "}
                  {ride.rideType || "Standard"}
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 p-3">
                <p className="text-[11px] text-gray-400">Distance & Time</p>
                <p className="mt-0.5 text-sm font-bold text-gray-900">
                  {Number(ride.distanceKm || 0).toFixed(1)} km •{" "}
                  {ride.durationMin || 0}m
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 p-3">
                <p className="text-[11px] text-gray-400">Total Fare</p>
                <p className="mt-0.5 text-sm font-extrabold text-orange-600">
                  ₹{ride.fare ?? 0}
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 p-3">
                <p className="text-[11px] text-gray-400">Payment</p>
                <p className="mt-0.5 text-sm font-bold capitalize text-gray-900">
                  {typeof ride.payment === "object" && ride.payment !== null
                    ? `${ride.payment.method || "Cash"} (${
                        ride.payment.status || "Pending"
                      })`
                    : ride.payment || "Cash"}
                </p>
              </div>
            </div>

            {/* Cancelled banner */}
            {ride.status === "cancelled" && (
              <div className="flex items-center gap-2.5 rounded-xl bg-red-50 p-4 text-xs font-semibold text-red-600">
                <FiAlertCircle className="shrink-0 text-base" />
                <span>
                  Reason: {ride.cancellationReason || "Not provided"}
                </span>
              </div>
            )}

            {/* No driver found banner */}
            {ride.status === "no_driver_found" && (
              <div className="rounded-xl bg-gray-100 p-4 text-xs font-semibold text-gray-600">
                Abhi koi captain available nahi hai. Thodi der baad dobara try karo.
              </div>
            )}

            {/* Completed banner */}
            {ride.status === "completed" && (
              <div className="flex items-center gap-2.5 rounded-xl bg-green-50 p-4 text-xs font-semibold text-green-700">
                <FiCheckCircle className="shrink-0 text-base" />
                <span>
                  Your trip is complete! Thanks for riding with GoRivo.
                </span>
              </div>
            )}

            {/* Action buttons (Active Ride) */}
            {!isTerminal && (
              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                {ride.driver?.phone && (
                  <a
                    href={`tel:${ride.driver.phone}`}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-bold text-white hover:bg-orange-600"
                  >
                    <FiPhone /> Call Captain
                  </a>
                )}

                {canCancel && (
                  <button
                    type="button"
                    onClick={openCancelModal}
                    className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-200 bg-white py-3 text-sm font-bold text-red-600 hover:bg-red-50"
                  >
                    <FiXCircle /> Cancel Ride
                  </button>
                )}
              </div>
            )}

            {/* Action buttons (Terminal States: Completed / Cancelled / No Driver) */}
            {isTerminal && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-bold text-white hover:bg-orange-600"
                >
                  Book Another Ride
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Cancel confirmation modal */}
        {showCancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-xl">
              <h3 className="text-lg font-extrabold text-gray-900">
                Cancel this ride?
              </h3>
              <p className="text-xs text-gray-500">
                Please select a reason for cancelling booking{" "}
                <span className="font-bold text-gray-700">
                  {ride.bookingId || ride._id}
                </span>
                :
              </p>

              <div className="space-y-2">
                {CANCEL_REASONS.map((reason) => (
                  <label
                    key={reason}
                    className={`flex cursor-pointer items-center gap-2.5 rounded-xl border p-3 text-xs font-semibold ${
                      cancellationReason === reason
                        ? "border-orange-500 bg-orange-50 text-orange-700"
                        : "border-gray-200 text-gray-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name="cancelReason"
                      checked={cancellationReason === reason}
                      onChange={() => setCancellationReason(reason)}
                      className="accent-orange-500"
                    />
                    {reason}
                  </label>
                ))}
              </div>

              {cancelError && (
                <p className="text-xs font-semibold text-red-600">
                  {cancelError}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  disabled={cancelling}
                  className="flex-1 cursor-pointer rounded-xl border border-gray-200 py-2.5 text-xs font-bold text-gray-700 disabled:opacity-60"
                >
                  Keep Ride
                </button>
                <button
                  type="button"
                  disabled={cancelling}
                  onClick={handleCancelRide}
                  className="flex-1 cursor-pointer rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {cancelling ? "Cancelling..." : "Confirm Cancel"}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default ActiveRideTracker;