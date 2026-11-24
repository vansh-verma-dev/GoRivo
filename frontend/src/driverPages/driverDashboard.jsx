import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiAlertCircle,
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiNavigation,
  FiTrendingUp,
} from "react-icons/fi";
import { FaCarSide, FaMoneyBillWave } from "react-icons/fa";
import Navbar from "../components/navbar";
import { getDriverRidesApi } from "../services/rideService";

const ACTIVE_STATUSES = ["accepted", "arriving", "started"];

const isToday = (dateStr) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
};

const statusBadge = (status) => {
  if (status === "completed") return "bg-green-50 text-green-600";
  if (status === "cancelled") return "bg-red-50 text-red-600";
  return "bg-orange-50 text-orange-600";
};

const DriverDashboard = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setError("");
        const res = await getDriverRidesApi();
        setRides(res.data || []);
      } catch (err) {
        console.error("Driver dashboard error:", err);
        if (err.status === 401) {
          setError("Session expired. Please login again.");
        } else {
          setError(err.message || "Could not load dashboard.");
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const stats = useMemo(() => {
    const completed = rides.filter((r) => r.status === "completed");
    const todayCompleted = completed.filter((r) =>
      isToday(r.completedAt || r.updatedAt)
    );
    const sum = (list) => list.reduce((t, r) => t + (Number(r.fare) || 0), 0);

    return {
      todayEarning: sum(todayCompleted),
      todayTrips: todayCompleted.length,
      totalEarning: sum(completed),
      totalTrips: completed.length,
      cancelled: rides.filter((r) => r.status === "cancelled").length,
    };
  }, [rides]);

  const activeRide = rides.find((r) => ACTIVE_STATUSES.includes(r.status));
  const recentRides = rides.slice(0, 5);

  const statCards = [
    {
      label: "Today's Earning",
      value: `₹${stats.todayEarning}`,
      sub: `${stats.todayTrips} trips today`,
      icon: <FaMoneyBillWave />,
      accent: "bg-orange-50 text-orange-500",
    },
    {
      label: "Total Earning",
      value: `₹${stats.totalEarning}`,
      sub: "All completed trips",
      icon: <FiTrendingUp />,
      accent: "bg-green-50 text-green-600",
    },
    {
      label: "Completed Trips",
      value: stats.totalTrips,
      sub: "Lifetime",
      icon: <FiCheckCircle />,
      accent: "bg-blue-50 text-blue-600",
    },
    {
      label: "Cancelled",
      value: stats.cancelled,
      sub: "Cancelled rides",
      icon: <FiAlertCircle />,
      accent: "bg-red-50 text-red-600",
    },
  ];

  return (
    <>
      <Navbar />

      <section className="min-h-screen bg-gray-50/70 py-8 lg:py-12">
        <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                Captain Dashboard
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                Your <span className="text-orange-500">Overview</span>
              </h1>
              <p className="text-sm text-gray-500">
                Earnings and trips at a glance.
              </p>
            </div>

            <Link
              to="/driver/availableRides"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-orange-500/20 transition hover:bg-orange-600"
            >
              <FiNavigation /> Find Rides
            </Link>
          </div>

          {error && (
            <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-600">
              <FiAlertCircle className="shrink-0 text-base" />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center text-sm text-gray-500">
              Loading your dashboard...
            </div>
          ) : (
            <>
              {/* Active trip */}
              {activeRide && (
                <div className="flex flex-col justify-between gap-4 rounded-2xl border border-orange-200 bg-orange-50/60 p-5 sm:flex-row sm:items-center">
                  <div className="min-w-0 space-y-1">
                    <p className="text-xs font-bold uppercase text-orange-600">
                      Trip in progress • {activeRide.status}
                    </p>
                    <p className="break-words text-sm font-bold text-gray-900">
                      {activeRide.pickup?.name}{" "}
                      <span className="mx-1 text-orange-500">→</span>{" "}
                      {activeRide.destination?.name}
                    </p>
                  </div>
                  <Link
                    to={`/driver/driverTrip/${activeRide._id}`}
                    state={{ ride: activeRide }}
                    className="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-xs font-bold text-white hover:bg-orange-600"
                  >
                    Continue Trip <FiArrowRight />
                  </Link>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {statCards.map((card) => (
                  <div
                    key={card.label}
                    className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5"
                  >
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${card.accent}`}
                    >
                      {card.icon}
                    </span>
                    <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      {card.label}
                    </p>
                    <p className="text-2xl font-extrabold text-gray-900">
                      {card.value}
                    </p>
                    <p className="text-xs text-gray-500">{card.sub}</p>
                  </div>
                ))}
              </div>

              {/* Recent rides */}
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">
                    Recent Trips
                  </h2>
                  <Link
                    to="/driver/history"
                    className="inline-flex items-center gap-1 text-xs font-bold text-orange-500 hover:underline"
                  >
                    View all <FiArrowRight />
                  </Link>
                </div>

                {recentRides.length === 0 ? (
                  <p className="py-6 text-center text-sm text-gray-500">
                    No trips yet. Accept your first ride to get started.
                  </p>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {recentRides.map((ride) => (
                      <div
                        key={ride._id}
                        className="flex flex-col justify-between gap-2 py-3.5 sm:flex-row sm:items-center"
                      >
                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                            <span className="font-bold text-gray-700">
                              {ride.bookingId ||
                                ride._id.slice(-6).toUpperCase()}
                            </span>
                            <span>•</span>
                            <span className="inline-flex items-center gap-1">
                              <FiClock className="text-orange-500" />
                              {ride.createdAt
                                ? new Date(ride.createdAt).toLocaleString(
                                    "en-IN",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )
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
                        </div>

                        <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end sm:gap-1">
                          <span className="text-base font-extrabold text-gray-900">
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
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default DriverDashboard;