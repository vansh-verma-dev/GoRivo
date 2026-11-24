import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiRefreshCw,
  FiCheckCircle,
  FiClock,
  FiNavigation,
} from "react-icons/fi";
import { FaCarSide, FaMoneyBillWave } from "react-icons/fa";

const AvailableRides = () => {
  const navigate = useNavigate();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);
  const [error, setError] = useState("");

  const fetchAvailableRides = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/rides/available", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load rides");
      setRides(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableRides();
    const timer = setInterval(fetchAvailableRides, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleAcceptRide = async (rideId) => {
    setAcceptingId(rideId);
    setError("");
    try {
      const res = await fetch(`/api/rides/${rideId}/accept`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Ride already taken");

      // Move captain straight to trip execution console
      navigate(`/driver/trip/${data.data._id}`, { state: { ride: data.data } });
    } catch (err) {
      setError(err.message);
      fetchAvailableRides();
    } finally {
      setAcceptingId(null);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50/70 py-8 lg:py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-green-50 border border-green-200 px-3 py-1 text-xs font-bold text-green-700 mb-2">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Online • Live Ride Requests
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
              Available <span className="text-orange-500">Rides</span>
            </h1>
            <p className="text-sm text-gray-500">
              {rides.length} nearby passenger requests waiting
            </p>
          </div>

          <button
            type="button"
            onClick={fetchAvailableRides}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 shadow-2xs transition hover:border-orange-300 hover:text-orange-600 cursor-pointer"
          >
            <FiRefreshCw className={loading ? "animate-spin text-orange-500" : ""} />
            <span>Refresh</span>
          </button>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-600">
            {error}
          </div>
        )}

        {/* Rides List */}
        {loading && rides.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center text-sm text-gray-500">
            Scanning for nearby ride requests...
          </div>
        ) : rides.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-xl text-orange-500">
              <FiNavigation />
            </div>
            <p className="text-base font-bold text-gray-900">
              No ride requests right now
            </p>
            <p className="text-xs text-gray-500">
              Stay online — new GoRivo requests will appear automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {rides.map((ride) => (
              <div
                key={ride._id}
                className="flex flex-col justify-between gap-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-2xs transition hover:border-orange-300 md:flex-row md:items-center"
              >
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-md bg-gray-100 px-2.5 py-1 font-bold text-gray-800">
                      {ride.bookingId}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-orange-50 px-2.5 py-1 font-bold uppercase text-orange-600">
                      <FaCarSide /> {ride.rideType}
                    </span>
                    <span className="inline-flex items-center gap-1 text-gray-500">
                      <FiClock className="text-orange-500" />
                      {ride.distanceKm} km • {ride.durationMin} min
                    </span>
                  </div>

                  <div className="space-y-1.5 pl-1">
                    <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-orange-500 shrink-0" />
                      {ride.pickup?.name}
                    </p>
                    <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-sm bg-gray-900 shrink-0" />
                      {ride.destination?.name}
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 capitalize">
                    <FaMoneyBillWave className="text-green-600" />
                    Payment: {ride.payment?.method}
                  </div>
                </div>

                {/* Fare & Accept Button */}
                <div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-4 md:flex-col md:items-end md:border-t-0 md:pt-0">
                  <div className="md:text-right">
                    <p className="text-[11px] uppercase tracking-wider text-gray-400">
                      Est. Earning
                    </p>
                    <p className="text-2xl font-extrabold text-gray-900">
                      ₹{ride.fare}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={acceptingId === ride._id}
                    onClick={() => handleAcceptRide(ride._id)}
                    className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-orange-500/20 transition hover:bg-orange-600 disabled:opacity-60 cursor-pointer"
                  >
                    <FiCheckCircle />
                    <span>
                      {acceptingId === ride._id ? "Accepting..." : "Accept Ride"}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AvailableRides;