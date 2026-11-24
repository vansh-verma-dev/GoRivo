import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiAlertCircle, FiArrowRight, FiClock } from "react-icons/fi";
import { FaCarSide } from "react-icons/fa";
import Navbar from "../components/navbar";
import { getDriverRidesApi } from "../services/rideService";

const ACTIVE_STATUSES = ["accepted", "arriving", "started"];
const TABS = ["all", "active", "completed", "cancelled"];

const statusBadge = (status) => {
  if (status === "completed") return "bg-green-50 text-green-600";
  if (status === "cancelled") return "bg-red-50 text-red-600";
  return "bg-orange-50 text-orange-600";
};

const paymentMethod = (ride) =>
  typeof ride.payment === "object" ? ride.payment?.method : ride.payment;

const DriverHistory = () => {
  const [rides, setRides] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setError("");
        const res = await getDriverRidesApi();
        setRides(res.data || []);
      } catch (err) {
        console.error("Driver history error:", err);
        if (err.status === 401) {
          setError("Session expired. Please login again.");
        } else {
          setError(err.message || "Could not load trip history.");
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filteredRides = useMemo(
    () =>
      rides.filter((ride) => {
        if (filter === "all") return true;
        if (filter === "active") return ACTIVE_STATUSES.includes(ride.status);
        return ride.status === filter;
      }),
    [rides, filter]
  );

  const totalEarned = useMemo(
    () =>
      filteredRides
        .filter((r) => r.status === "completed")
        .reduce((t, r) => t + (Number(r.fare) || 0), 0),
    [filteredRides]
  );

  return (
    <>
      <Navbar />

      <section className="min-h-screen bg-gray-50/70 py-8 lg:py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Header & filter tabs */}
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                Trip <span className="text-orange-500">History</span>
              </h1>
              <p className="text-sm text-gray-500">
                {filteredRides.length} trips • Earned ₹{totalEarned}
              </p>
            </div>

            <div className="flex w-fit gap-1 rounded-xl border border-gray-200 bg-white p-1">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFilter(tab)}
                  className={`cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-bold capitalize transition ${
                    filter === tab
                      ? "bg-orange-500 text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          {loading ? (
            <div className="rounded-2xl bg-white p-10 text-center text-sm text-gray-500">
              Loading your trips...
            </div>
          ) : error ? (
            <div className="flex items-center justify-center gap-2.5 rounded-2xl bg-red-50 p-6 text-sm font-semibold text-red-600">
              <FiAlertCircle className="shrink-0 text-base" />
              <span>{error}</span>
            </div>
          ) : filteredRides.length === 0 ? (
            <div className="space-y-3 rounded-2xl border border-gray-100 bg-white p-10 text-center">
              <p className="text-sm font-semibold text-gray-600">
                No trips found in this category.
              </p>
              <Link
                to="/driver/availableRides"
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-xs font-bold text-white hover:bg-orange-600"
              >
                Find Rides <FiArrowRight />
              </Link>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredRides.map((ride) => {
                const isActive = ACTIVE_STATUSES.includes(ride.status);
                const Wrapper = isActive ? Link : "div";
                const wrapperProps = isActive
                  ? {
                      to: `/driver/driverTrip/${ride._id}`,
                      state: { ride },
                    }
                  : {};

                return (
                  <Wrapper
                    key={ride._id}
                    {...wrapperProps}
                    className={`flex flex-col justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center ${
                      isActive ? "transition hover:border-orange-300" : ""
                    }`}
                  >
                    <div className="min-w-0 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                        <span className="font-bold text-gray-700">
                          {ride.bookingId || ride._id.slice(-6).toUpperCase()}
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1">
                          <FiClock className="text-orange-500" />
                          {ride.createdAt
                            ? new Date(ride.createdAt).toLocaleString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "-"}
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1 font-semibold uppercase text-gray-600">
                          <FaCarSide className="text-orange-500" />
                          {ride.rideType}
                        </span>
                      </div>

                      <p className="break-words text-sm font-bold text-gray-900">
                        {ride.pickup?.name}{" "}
                        <span className="mx-1 text-orange-500">→</span>{" "}
                        {ride.destination?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {Number(ride.distanceKm || 0).toFixed(1)} km •{" "}
                        {ride.durationMin} mins • Payment:{" "}
                        <span className="font-semibold capitalize">
                          {paymentMethod(ride)}
                        </span>
                      </p>
                      {ride.status === "cancelled" && ride.cancellationReason && (
                        <p className="text-xs font-semibold text-red-500">
                          Reason: {ride.cancellationReason}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:gap-1.5">
                      <span className="text-lg font-extrabold text-gray-900">
                        ₹{ride.fare}
                      </span>
                      <span
                        className={`rounded-full px-3 py-0.5 text-xs font-bold capitalize ${statusBadge(
                          ride.status
                        )}`}
                      >
                        {ride.status.replaceAll("_", " ")}
                      </span>
                    </div>
                  </Wrapper>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default DriverHistory;