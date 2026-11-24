import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiClock, FiMapPin, FiNavigation } from "react-icons/fi";
import Navbar from "../components/navbar";
import { getDriverRidesApi } from "../services/rideService";

const STATUS_STYLES = {
  accepted: "bg-blue-50 text-blue-600 border-blue-200",
  arriving: "bg-indigo-50 text-indigo-600 border-indigo-200",
  started: "bg-amber-50 text-amber-700 border-amber-200",
  completed: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-600 border-red-200",
};

function DriverHistory() {
  const [rides, setRides] = useState([]);
  const [filter, setFilter] = useState("all"); // all | completed | cancelled
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getDriverRidesApi(filter);
      setRides(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      setError(err?.message || "Failed to load driver ride history");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Client-side safety filter bhi rakha hai taaki filter tab hamesha accurate rahe
  const filteredRides = useMemo(() => {
    if (filter === "all") return rides;
    return rides.filter((ride) => ride.status === filter);
  }, [rides, filter]);

  const completedEarnings = useMemo(
    () =>
      rides
        .filter((r) => r.status === "completed")
        .reduce((sum, r) => sum + Number(r.fare || 0), 0),
    [rides]
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      <main className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link
              to="/driver/dashboard"
              className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold text-orange-500 hover:underline"
            >
              <FiArrowLeft /> Back to Dashboard
            </Link>
            <h1 className="text-2xl font-extrabold sm:text-3xl">
              My Accepted <span className="text-orange-500">Rides</span>
            </h1>
            <p className="mt-1 text-xs text-gray-500">
              Showing {filteredRides.length} ride(s) · Completed Earnings:{" "}
              <span className="font-bold text-green-700">
                ₹{completedEarnings}
              </span>
            </p>
          </div>

          <div className="flex gap-1.5 rounded-xl bg-gray-200/70 p-1">
            {["all", "completed", "cancelled"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-bold capitalize transition ${
                  filter === tab
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
            Loading ride history...
          </div>
        ) : filteredRides.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
            No {filter === "all" ? "" : filter} rides found for this captain.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRides.map((ride) => (
              <div
                key={ride._id}
                className="space-y-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-400">
                      BOOKING #{ride.bookingId || ride._id}
                    </p>
                    <p className="inline-flex items-center gap-1 text-xs text-gray-500">
                      <FiClock />
                      {ride.createdAt
                        ? new Date(ride.createdAt).toLocaleString()
                        : ""}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-bold capitalize ${
                        STATUS_STYLES[ride.status] ||
                        "border-gray-200 bg-gray-100 text-gray-700"
                      }`}
                    >
                      {ride.status}
                    </span>
                    <span className="text-lg font-extrabold text-gray-900">
                      ₹{ride.fare}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-sm">
                  <p className="flex items-start gap-2 font-semibold">
                    <FiMapPin className="mt-1 shrink-0 text-orange-500" />
                    <span>{ride.pickup?.name || "Pickup location"}</span>
                  </p>
                  <p className="flex items-start gap-2 font-semibold">
                    <FiNavigation className="mt-1 shrink-0 text-gray-900" />
                    <span>{ride.destination?.name || "Destination"}</span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-gray-500">
                  <span>
                    Passenger:{" "}
                    <strong>{ride.passenger?.name || "Passenger"}</strong> ·{" "}
                    {Number(ride.distanceKm || 0).toFixed(1)} km ·{" "}
                    {ride.durationMin || 0} min ·{" "}
                    <span className="uppercase">
                      {ride.payment?.method || ride.payment || "cash"}
                    </span>
                  </span>
                  {ride.status === "cancelled" && ride.cancellationReason && (
                    <span className="font-semibold text-red-500">
                      Reason: {ride.cancellationReason}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default DriverHistory;