import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  FiKey,
  FiCheckCircle,
  FiNavigation,
  FiFlag,
  FiAlertCircle,
} from "react-icons/fi";
import { FaCarSide } from "react-icons/fa";
import Navbar from "../components/navbar";
import { getSingleRideApi, updateRideStatusApi } from "../services/rideService";

const DriverTripConsole = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // AvailableRides se aaya ride (refresh par ye state chali jaati hai)
  const [ride, setRide] = useState(location.state?.ride || null);
  const [loading, setLoading] = useState(!location.state?.ride);
  const [loadError, setLoadError] = useState("");

  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Page refresh hone par ride backend se wapas lao
  useEffect(() => {
    if (ride) return;

    const loadRide = async () => {
      try {
        const res = await getSingleRideApi(rideId);
        setRide(res.data);
      } catch (err) {
        console.error("Load trip error:", err);
        setLoadError(err.message || "Could not load this trip.");
      } finally {
        setLoading(false);
      }
    };

    loadRide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rideId]);

  const callUpdateStatus = async (nextStatus, pinValue = null) => {
    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      const payload = { status: nextStatus };
      if (nextStatus === "started") {
        payload.otp = pinValue;
      }

      const res = await updateRideStatusApi(ride._id, payload);

      setRide(res.data);
      setMessage(res.message || "Status updated");
      setOtp("");
    } catch (err) {
      console.error("Update status error:", err);
      setError(err.message || "Failed to update status");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartRideWithOtp = (e) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(otp)) {
      setError("Please enter a valid 4-digit PIN from passenger.");
      return;
    }
    callUpdateStatus("started", otp);
  };

  const paymentLabel = (r) =>
    typeof r.payment === "object"
      ? `${r.payment?.method} (${r.payment?.status})`
      : r.payment;

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-[70vh] items-center justify-center text-sm font-semibold text-gray-500">
          Loading trip details...
        </div>
      </>
    );
  }

  if (!ride) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center">
          <p className="text-sm font-semibold text-red-500">
            {loadError || "Trip not found."}
          </p>
          <button
            type="button"
            onClick={() => navigate("/driver/availableRides")}
            className="cursor-pointer rounded-xl bg-orange-500 px-5 py-2.5 text-xs font-bold text-white hover:bg-orange-600"
          >
            Back to Available Rides
          </button>
        </div>
      </>
    );
  }

  const isCancelled = ride.status === "cancelled";

  return (
    <>
      <Navbar />

      <section className="min-h-screen bg-gray-50/70 py-8 lg:py-12">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            {/* Top bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
              <div>
                <p className="text-xs font-semibold text-gray-400">
                  ACTIVE TRIP
                </p>
                <h1 className="text-xl font-extrabold text-gray-900">
                  {ride.bookingId || ride._id}
                </h1>
              </div>

              <span
                className={`rounded-full border px-4 py-1.5 text-xs font-extrabold uppercase ${
                  isCancelled
                    ? "border-red-200 bg-red-50 text-red-600"
                    : "border-orange-200 bg-orange-50 text-orange-600"
                }`}
              >
                {ride.status.replaceAll("_", " ")}
              </span>
            </div>

            {/* Route summary */}
            <div className="space-y-3 rounded-xl bg-gray-50 p-4">
              <div>
                <p className="text-[11px] font-bold uppercase text-orange-500">
                  Pickup Point
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {ride.pickup?.name}
                </p>
              </div>
              <div className="border-t border-gray-200/70 pt-2.5">
                <p className="text-[11px] font-bold uppercase text-gray-400">
                  Dropoff Point
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {ride.destination?.name}
                </p>
              </div>
            </div>

            {/* Trip stats */}
            <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
              <div className="rounded-xl border border-gray-100 p-3">
                <p className="text-[11px] text-gray-400">Fare</p>
                <p className="text-lg font-extrabold text-orange-600">
                  ₹{ride.fare}
                </p>
              </div>
              <div className="rounded-xl border border-gray-100 p-3">
                <p className="text-[11px] text-gray-400">Distance</p>
                <p className="mt-1 text-sm font-bold text-gray-900">
                  {Number(ride.distanceKm || 0).toFixed(1)} km
                </p>
              </div>
              <div className="rounded-xl border border-gray-100 p-3">
                <p className="text-[11px] text-gray-400">Class</p>
                <p className="mt-1 inline-flex items-center justify-center gap-1 text-sm font-bold uppercase text-gray-900">
                  <FaCarSide className="text-orange-500" /> {ride.rideType}
                </p>
              </div>
              <div className="rounded-xl border border-gray-100 p-3">
                <p className="text-[11px] text-gray-400">Payment</p>
                <p className="mt-1 text-xs font-bold capitalize text-gray-900">
                  {paymentLabel(ride)}
                </p>
              </div>
            </div>

            {message && (
              <div className="rounded-xl bg-green-50 px-4 py-2.5 text-xs font-semibold text-green-700">
                {message}
              </div>
            )}

            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-600">
                {error}
              </div>
            )}

            {/* Cancelled */}
            {isCancelled && (
              <div className="space-y-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-center">
                <FiAlertCircle className="mx-auto text-3xl text-red-500" />
                <p className="text-sm font-extrabold text-red-700">
                  This ride was cancelled
                  {ride.cancellationReason
                    ? `: ${ride.cancellationReason}`
                    : "."}
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/driver/availableRides")}
                  className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-orange-500 px-5 py-2.5 text-xs font-bold text-white hover:bg-orange-600"
                >
                  Back to Available Rides
                </button>
              </div>
            )}

            {/* Step 1: accepted -> arriving */}
            {ride.status === "accepted" && (
              <button
                type="button"
                disabled={submitting}
                onClick={() => callUpdateStatus("arriving")}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 text-sm font-bold text-white shadow-md shadow-orange-500/20 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FiNavigation />
                <span>
                  {submitting ? "Updating..." : "Mark Arriving at Pickup"}
                </span>
              </button>
            )}

            {/* Step 2: arriving -> started (4-digit OTP) */}
            {ride.status === "arriving" && (
              <form
                onSubmit={handleStartRideWithOtp}
                className="space-y-4 rounded-2xl border border-orange-200 bg-orange-50/40 p-5"
              >
                <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                  <FiKey className="text-orange-500" />
                  <span>Enter 4-Digit Passenger PIN to Start Ride</span>
                </div>

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, ""));
                    setError("");
                  }}
                  placeholder="• • • •"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-center text-2xl font-extrabold tracking-[0.5em] text-gray-900 focus:border-orange-500 focus:outline-none"
                />

                <button
                  type="submit"
                  disabled={submitting || otp.length !== 4}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FiCheckCircle />
                  <span>
                    {submitting ? "Verifying PIN..." : "Verify PIN & Start Trip"}
                  </span>
                </button>
              </form>
            )}

            {/* Step 3: started -> completed */}
            {ride.status === "started" && (
              <button
                type="button"
                disabled={submitting}
                onClick={() => callUpdateStatus("completed")}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-green-600 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FiFlag />
                <span>{submitting ? "Completing..." : "Complete Trip"}</span>
              </button>
            )}

            {/* Step 4: completed */}
            {ride.status === "completed" && (
              <div className="space-y-3 rounded-2xl border border-green-200 bg-green-50 p-5 text-center">
                <FiCheckCircle className="mx-auto text-3xl text-green-600" />
                <p className="text-base font-extrabold text-green-800">
                  Trip Completed • Earned ₹{ride.fare}
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/driver/availableRides")}
                  className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-orange-500 px-5 py-2.5 text-xs font-bold text-white hover:bg-orange-600"
                >
                  Back to Available Rides
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default DriverTripConsole;