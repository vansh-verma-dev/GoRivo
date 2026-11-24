import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiClock, FiArrowRight } from "react-icons/fi";
import { FaCarSide } from "react-icons/fa";

const MyRides = () => {
  const [rides, setRides] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyRides = async () => {
      try {
        const res = await fetch("/api/rides", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        if (res.ok) setRides(data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyRides();
  }, []);

  const filteredRides = rides.filter((ride) => {
    if (filter === "all") return true;
    if (filter === "active")
      return ["searching", "accepted", "arriving", "started"].includes(
        ride.status
      );
    return ride.status === filter;
  });

  const statusBadge = (status) => {
    if (status === "completed")
      return "bg-green-50 text-green-600";
    if (status === "cancelled" || status === "no_driver_found")
      return "bg-red-50 text-red-600";
    return "bg-orange-50 text-orange-600";
  };

  return (
    <section className="min-h-screen bg-gray-50/70 py-8 lg:py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header & Filter Tabs */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
              My <span className="text-orange-500">Rides</span>
            </h1>
            <p className="text-sm text-gray-500">
              Total {rides.length} bookings on GoRivo
            </p>
          </div>

          <div className="flex w-fit gap-1 rounded-xl bg-white p-1 border border-gray-200">
            {["all", "active", "completed", "cancelled"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-bold capitalize transition cursor-pointer ${
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

        {/* Rides List */}
        {loading ? (
          <div className="rounded-2xl bg-white p-10 text-center text-sm text-gray-500">
            Loading your rides...
          </div>
        ) : filteredRides.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center space-y-3">
            <p className="text-sm font-semibold text-gray-600">
              No rides found in this category.
            </p>
            <Link
              to="/book"
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
                to={`/rides/${ride._id}`}
                className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-2xs transition hover:border-orange-300 sm:flex-row sm:items-center"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                    <span className="font-bold text-gray-700">
                      {ride.bookingId}
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <FiClock className="text-orange-500" />
                      {new Date(ride.createdAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 uppercase font-semibold text-gray-600">
                      <FaCarSide className="text-orange-500" /> {ride.rideType}
                    </span>
                  </div>

                  <p className="text-sm font-bold text-gray-900">
                    {ride.pickup?.name}{" "}
                    <span className="mx-1 text-orange-500">→</span>{" "}
                    {ride.destination?.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {ride.distanceKm} km • {ride.durationMin} mins • Paid via{" "}
                    <span className="capitalize font-semibold">
                      {ride.payment?.method}
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
                    {ride.status.replace("_", " ")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyRides;