import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiCheckCircle,
  FiMapPin,
  FiNavigation,
  FiRefreshCw,
} from "react-icons/fi";
import { FaCarSide } from "react-icons/fa";
import Navbar from "../components/navbar";
import {
  getAvailableRidesApi,
  getDriverRidesApi,
  acceptRideApi,
  updateRideStatusApi,
} from "../services/rideService";

function DriverDashboard() {
  const [availableRides, setAvailableRides] = useState([]);
  const [activeRide, setActiveRide] = useState(null);
  const [stats, setStats] = useState({
    totalRides: 0,
    completedCount: 0,
    cancelledCount: 0,
    totalEarnings: 0,
  });

  const [otpInput, setOtpInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadDashboardData = useCallback(async () => {
    try {
      setError("");
      const [availRes, myRidesRes] = await Promise.all([
        getAvailableRidesApi(),
        getDriverRidesApi(),
      ]);

      setAvailableRides(availRes?.data || []);

      // Fallback: agar backend activeRide alag se nahi bhej raha toh rides list se nikal lo
      const allMyRides = myRidesRes?.data || [];
      const foundActive =
        myRidesRes?.activeRide ||
        allMyRides.find((r) =>
          ["accepted", "arriving", "started"].includes(r.status)
        ) ||
        null;

      setActiveRide(foundActive);

      if (myRidesRes?.stats) {
        setStats(myRidesRes.stats);
      } else {
        const completed = allMyRides.filter((r) => r.status === "completed");
        const cancelled = allMyRides.filter((r) => r.status === "cancelled");
        setStats({
          totalRides: allMyRides.length,
          completedCount: completed.length,
          cancelledCount: cancelled.length,
          totalEarnings: completed.reduce(
            (sum, r) => sum + Number(r.fare || 0),
            0
          ),
        });
      }
    } catch (err) {
      setError(err?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 6000);
    return () => clearInterval(interval);
  }, [loadDashboardData]);

  const handleAcceptRide = async (rideId) => {
    try {
      setActionLoading(true);
      setError("");
      setMessage("");
      const res = await acceptRideApi(rideId);
      setMessage(res?.message || "Ride accepted!");
      await loadDashboardData();
    } catch (err) {
      setError(err?.message || "Could not accept ride");
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusUpdate = async (nextStatus) => {
    if (!activeRide?._id) return;

    if (nextStatus === "started" && !/^\d{4}$/.test(otpInput.trim())) {
      setError("Please enter valid 4-digit OTP from passenger.");
      return;
    }

    try {
      setActionLoading(true);
      setError("");
      setMessage("");

      const payload =
        nextStatus === "started"
          ? { status: nextStatus, otp: otpInput.trim() }
          : { status: nextStatus };

      const res = await updateRideStatusApi(activeRide._id, payload);
      setMessage(res?.message || `Ride marked as ${nextStatus}`);
      if (nextStatus === "started") setOtpInput("");
      await loadDashboardData();
    } catch (err) {
      setError(err?.message || "Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold sm:text-3xl">
              Captain <span className="text-orange-500">Dashboard</span>
            </h1>
            <p className="text-sm text-gray-500">
              Manage your active trip, accept nearby rides, and track earnings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={loadDashboardData}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100"
            >
              <FiRefreshCw /> Refresh
            </button>
            <Link
              to="/driver/history"
              className="rounded-xl bg-gray-900 px-4 py-2 text-xs font-bold text-white hover:bg-gray-800"
            >
              Ride History
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <p className="text-xs text-gray-400">Total Trips</p>
            <p className="mt-1 text-2xl font-extrabold">{stats.totalRides}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <p className="text-xs text-gray-400">Completed</p>
            <p className="mt-1 text-2xl font-extrabold text-green-600">
              {stats.completedCount}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <p className="text-xs text-gray-400">Cancelled</p>
            <p className="mt-1 text-2xl font-extrabold text-red-500">
              {stats.cancelledCount}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <p className="text-xs text-gray-400">Total Earnings</p>
            <p className="mt-1 text-2xl font-extrabold text-orange-600">
              ₹{stats.totalEarnings}
            </p>
          </div>
        </div>

        {message && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-3.5 text-xs font-semibold text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-600">
            {error}
          </div>
        )}

        {/* Active Accepted Ride Section */}
        {activeRide && (
          <section className="space-y-4 rounded-3xl border-2 border-orange-500 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold uppercase text-orange-600">
                  Active Ride · {activeRide.status}
                </span>
                <h2 className="mt-2 text-lg font-extrabold">
                  Booking #{activeRide.bookingId || activeRide._id}
                </h2>
              </div>
              <p className="text-xl font-extrabold text-orange-600">
                ₹{activeRide.fare}
              </p>
            </div>

            <div className="space-y-2 rounded-2xl bg-gray-50 p-4 text-sm">
              <p className="flex items-start gap-2 font-semibold">
                <FiMapPin className="mt-1 shrink-0 text-orange-500" />
                <span>Pickup: {activeRide.pickup?.name}</span>
              </p>
              <p className="flex items-start gap-2 font-semibold">
                <FiNavigation className="mt-1 shrink-0 text-gray-900" />
                <span>Drop: {activeRide.destination?.name}</span>
              </p>
              <p className="text-xs text-gray-500">
                Passenger: {activeRide.passenger?.name || "Passenger"} ·{" "}
                {Number(activeRide.distanceKm || 0).toFixed(1)} km ·{" "}
                {activeRide.durationMin || 0} min
              </p>
            </div>

            {activeRide.status === "accepted" && (
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleStatusUpdate("arriving")}
                className="w-full cursor-pointer rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {actionLoading ? "Updating..." : "Mark Arriving at Pickup"}
              </button>
            )}

            {activeRide.status === "arriving" && (
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  maxLength={4}
                  value={otpInput}
                  onChange={(e) =>
                    setOtpInput(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="Enter 4-digit OTP"
                  className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm font-bold tracking-widest focus:border-orange-500 focus:outline-none"
                />
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => handleStatusUpdate("started")}
                  className="cursor-pointer rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-60"
                >
                  {actionLoading ? "Verifying..." : "Start Ride"}
                </button>
              </div>
            )}

            {activeRide.status === "started" && (
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleStatusUpdate("completed")}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-green-700 py-3 text-sm font-bold text-white hover:bg-green-800 disabled:opacity-60"
              >
                <FiCheckCircle />
                {actionLoading ? "Completing..." : "Complete Trip"}
              </button>
            )}
          </section>
        )}

        {/* Available Rides List */}
        <section className="space-y-4 rounded-3xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-extrabold">
            Available Rides ({availableRides.length})
          </h2>

          {loading ? (
            <p className="py-6 text-center text-sm text-gray-500">
              Loading rides...
            </p>
          ) : availableRides.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-500">
              No ride requests available right now.
            </p>
          ) : (
            <div className="space-y-3">
              {availableRides.map((ride) => (
                <div
                  key={ride._id}
                  className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-100 p-4 sm:flex-row sm:items-center"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-bold uppercase text-orange-600">
                        <FaCarSide /> {ride.rideType}
                      </span>
                      <span className="text-xs text-gray-400">
                        {Number(ride.distanceKm || 0).toFixed(1)} km ·{" "}
                        {ride.durationMin || 0} min
                      </span>
                    </div>
                    <p className="text-sm font-bold text-gray-900">
                      {ride.pickup?.name} → {ride.destination?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Passenger: {ride.passenger?.name || "Passenger"} · Payment:{" "}
                      <span className="uppercase">
                        {typeof ride.payment === "object"
                          ? ride.payment?.method
                          : ride.payment || "cash"}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <span className="text-lg font-extrabold text-gray-900">
                      ₹{ride.fare}
                    </span>
                    <button
                      type="button"
                      disabled={actionLoading || Boolean(activeRide)}
                      onClick={() => handleAcceptRide(ride._id)}
                      className="cursor-pointer rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-bold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {activeRide ? "Trip Active" : "Accept Ride"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default DriverDashboard;