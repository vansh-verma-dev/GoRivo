import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  FiKey,
  FiCheckCircle,
  FiNavigation,
  FiFlag,
} from "react-icons/fi";
import { FaCarSide } from "react-icons/fa";

const DriverTripConsole = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [ride, setRide] = useState(
    location.state?.ride || {
      _id: rideId,
      bookingId: "GR-LIVE-01",
      status: "accepted",
      rideType: "go-mini",
      pickup: { name: "Shastri Nagar, Sector 4, Meerut" },
      destination: { name: "Meerut Cantt Railway Station" },
      distanceKm: 6.4,
      durationMin: 18,
      fare: 117,
      payment: { method: "cash", status: "pending" },
    }
  );

  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const callUpdateStatus = async (nextStatus, pinValue = null) => {
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const body = { status: nextStatus };
      if (nextStatus === "started") {
        body.otp = pinValue;
      }

      const res = await fetch(`/api/rides/${ride._id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update status");

      setRide(data.data);
      setMessage(data.message);
      setOtp("");
    } catch (err) {
      setError(err.message);
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

  return (
    <section className="min-h-screen bg-gray-50/70 py-8 lg:py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8 space-y-6">
          {/* Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div>
              <p className="text-xs font-semibold text-gray-400">ACTIVE TRIP</p>
              <h1 className="text-xl font-extrabold text-gray-900">
                {ride.bookingId}
              </h1>
            </div>

            <span className="rounded-full bg-orange-50 border border-orange-200 px-4 py-1.5 text-xs font-extrabold uppercase text-orange-600">
              {ride.status}
            </span>
          </div>

          {/* Route Summary */}
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

          {/* Trip Stats */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl border border-gray-100 p-3">
              <p className="text-[11px] text-gray-400">Fare</p>
              <p className="text-lg font-extrabold text-orange-600">
                ₹{ride.fare}
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 p-3">
              <p className="text-[11px] text-gray-400">Distance</p>
              <p className="text-sm font-bold text-gray-900 mt-1">
                {ride.distanceKm} km
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 p-3">
              <p className="text-[11px] text-gray-400">Class</p>
              <p className="text-sm font-bold uppercase text-gray-900 mt-1 inline-flex items-center justify-center gap-1">
                <FaCarSide className="text-orange-500" /> {ride.rideType}
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

          {/* Step 1: accepted -> arriving */}
          {ride.status === "accepted" && (
            <button
              type="button"
              disabled={submitting}
              onClick={() => callUpdateStatus("arriving")}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 text-sm font-bold text-white shadow-md shadow-orange-500/20 transition hover:bg-orange-600 cursor-pointer"
            >
              <FiNavigation />
              <span>{submitting ? "Updating..." : "Mark Arriving at Pickup"}</span>
            </button>
          )}

          {/* Step 2: arriving -> started (requires 4-digit OTP) */}
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
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="• • • •"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-center text-2xl font-extrabold tracking-[0.5em] text-gray-900 focus:border-orange-500 focus:outline-none"
              />

              <button
                type="submit"
                disabled={submitting || otp.length !== 4}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 text-sm font-bold text-white transition hover:bg-orange-600 disabled:opacity-50 cursor-pointer"
              >
                <FiCheckCircle />
                <span>{submitting ? "Verifying PIN..." : "Verify PIN & Start Trip"}</span>
              </button>
            </form>
          )}

          {/* Step 3: started -> completed */}
          {ride.status === "started" && (
            <button
              type="button"
              disabled={submitting}
              onClick={() => callUpdateStatus("completed")}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-green-700 cursor-pointer"
            >
              <FiFlag />
              <span>{submitting ? "Completing..." : "Complete Trip"}</span>
            </button>
          )}

          {/* Step 4: completed */}
          {ride.status === "completed" && (
            <div className="rounded-2xl bg-green-50 border border-green-200 p-5 text-center space-y-3">
              <FiCheckCircle className="mx-auto text-3xl text-green-600" />
              <p className="text-base font-extrabold text-green-800">
                Trip Completed • Earned ₹{ride.fare}
              </p>
              <button
                type="button"
                onClick={() => navigate("/driver/rides")}
                className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-5 py-2.5 text-xs font-bold text-white hover:bg-orange-600 cursor-pointer"
              >
                Back to Available Rides
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DriverTripConsole;