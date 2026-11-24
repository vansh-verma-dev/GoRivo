import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiClock, FiArrowRight, FiAlertCircle } from "react-icons/fi";
import { FaCarSide } from "react-icons/fa";
import Navbar from "../components/navbar";
import { getMyRidesApi } from "../services/rideService";

const ACTIVE_STATUSES = ["searching", "accepted", "arriving", "started"];

const MyRides = () => {
  const [rides, setRides] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyRides = async () => {
      try {
        setError("");
        const res = await getMyRidesApi();
        setRides(res.data || []);
      } catch (err) {
        console.error("Fetch my rides error:", err);
        if (err.status === 401) {
          setError("Session expired. Please login again.");
        } else {
          setError(err.message || "Could not load your rides.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMyRides();
  }, []);

  const filteredRides = rides.filter((ride) => {
    if (filter === "all") return true;
    if (filter === "active") return ACTIVE_STATUSES.includes(ride.status);
    if (filter === "cancelled")
      return ["cancelled", "no_driver_found"].includes(ride.status);
    return ride.status === filter;
  });

  const statusBadge = (status) => {
    if (status === "completed") return "bg-green-50 text-green-600";
    if (status === "cancelled" || status === "no_driver_found")
      return "bg-red-50 text-red-600";
    return "bg-orange-50 text-orange-600";
  };

  const paymentMethod = (ride) =>
    typeof ride.payment === "object" ? ride.payment?.method : ride.payment;

  return (
    <>
      <Navbar />

      <section className="min-h-screen bg-gray-50/70 py-8 lg:py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Header & filter tabs */}
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                My <span className="text-orange-500">Rides</span>
              </h1>
              <p className="text-sm text-gray-500">
                Total {rides.length} bookings on GoRivo
              </p>
            </div>

            <div className="flex w-fit gap-1 rounded-xl border border-gray-200 bg-white p-1">
              {["all", "active", "completed", "cancelled"].map((tab) => (
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

          {/* Rides list */}
          {loading ? (
            <div className="rounded-2xl bg-white p-10 text-center text-sm text-gray-500">
              Loading your rides...
            </div>
          ) : error ? (
            <div className="flex items-center justify-center gap-2.5 rounded-2xl bg-red-50 p-6 text-sm font-semibold text-red-600">
              <FiAlertCircle className="shrink-0 text-base" />
              <span>{error}</span>
            </div>
          ) : filteredRides.length === 0 ? (
            <div className="space-y-3 rounded-2xl border border-gray-100 bg-white p-10 text-center">
              <p className="text-sm font-semibold text-gray-600">
                No rides found in this category.
              </p>
              <Link
                to="/passenger/bookRide"
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-xs font-bold text-white hover:bg-orange-600"
              >
                Book a Ride <FiArrowRight />
              </Link>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredRides.map((ride) => (
                <Link
                  key={ride._id}
                  to={`/passenger/activeride/${ride._id}`}
                  className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:border-orange-300 sm:flex-row sm:items-center"
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
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}
                      </span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1 font-semibold uppercase text-gray-600">
                        <FaCarSide className="text-orange-500" /> {ride.rideType}
                      </span>
                    </div>

                    <p className="break-words text-sm font-bold text-gray-900">
                      {ride.pickup?.name}{" "}
                      <span className="mx-1 text-orange-500">→</span>{" "}
                      {ride.destination?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {Number(ride.distanceKm || 0).toFixed(1)} km •{" "}
                      {ride.durationMin} mins • Pay via{" "}
                      <span className="font-semibold capitalize">
                        {paymentMethod(ride)}
                      </span>
                    </p>
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
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default MyRides;