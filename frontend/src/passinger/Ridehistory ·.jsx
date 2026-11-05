import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaChevronDown, FaCircleExclamation } from "react-icons/fa6";
import Navbar from "../components/navbar";

const API = import.meta.env.VITE_API_URL;

const rideNames = {
  "go-bike": "Go Bike",
  "go-auto": "Go Auto",
  "go-mini": "Go Mini",
  "go-comfort": "Go Comfort",
  "go-xl": "Go XL",
  "go-premium": "Go Premium",
};

// Tab ke hisaab se kaunse status dikhane hain
const tabs = [
  { id: "all", label: "All", statuses: null },
  {
    id: "active",
    label: "Active",
    statuses: ["searching", "accepted", "arriving", "started"],
  },
  { id: "completed", label: "Completed", statuses: ["completed"] },
  {
    id: "cancelled",
    label: "Cancelled",
    statuses: ["cancelled", "no_driver_found"],
  },
];

const statusStyle = {
  searching: { label: "Searching", color: "bg-orange-50 text-orange-600" },
  accepted: { label: "Accepted", color: "bg-green-50 text-green-700" },
  arriving: { label: "Arriving", color: "bg-green-50 text-green-700" },
  started: { label: "Started", color: "bg-green-50 text-green-700" },
  completed: { label: "Completed", color: "bg-green-50 text-green-700" },
  cancelled: { label: "Cancelled", color: "bg-red-50 text-red-600" },
  no_driver_found: { label: "No driver", color: "bg-red-50 text-red-600" },
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

function RideHistory() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [tab, setTab] = useState("all");
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    const getRides = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API}/api/ride/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const result = await res.json();

        if (!res.ok || !result.success) {
          throw new Error(result.message || "Could not load your rides");
        }

        setRides(result.data);
      } catch (err) {
        setError(
          err.message === "Failed to fetch"
            ? "Cannot reach the server. Please check your connection."
            : err.message
        );
      } finally {
        setLoading(false);
      }
    };

    getRides();
  }, [reloadKey]);

  const currentTab = tabs.find((t) => t.id === tab);
  const shownRides = currentTab.statuses
    ? rides.filter((r) => currentTab.statuses.includes(r.status))
    : rides;

  const countFor = (t) =>
    t.statuses ? rides.filter((r) => t.statuses.includes(r.status)).length : rides.length;

  const completedRides = rides.filter((r) => r.status === "completed");
  const totalSpent = completedRides.reduce((sum, r) => sum + r.fare, 0);

  const toggle = (id) => setOpenId(openId === id ? null : id);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-bold">
          My <span className="text-orange-500">rides</span>
        </h1>
        <p className="mt-1 text-gray-500">Your past and current trips.</p>

        {/* ---------- Loading ---------- */}
        {loading && (
          <div className="mt-6 space-y-3">
            <div className="h-20 animate-pulse rounded-2xl bg-gray-200"></div>
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-24 animate-pulse rounded-2xl bg-gray-200"></div>
            ))}
          </div>
        )}

        {/* ---------- Error ---------- */}
        {!loading && error && (
          <div className="mt-10 rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center">
            <FaCircleExclamation className="mx-auto text-4xl text-red-500" />
            <p className="mt-3 font-semibold">{error}</p>
            <button
              onClick={() => setReloadKey((k) => k + 1)}
              className="mt-5 rounded-xl bg-orange-500 px-6 py-2.5 font-semibold text-white hover:bg-orange-600"
            >
              Try again
            </button>
          </div>
        )}

        {/* ---------- Rides ---------- */}
        {!loading && !error && (
          <>
            {/* Stats */}
            <section className="mt-6 grid grid-cols-3 divide-x divide-gray-100 rounded-2xl border border-gray-200 bg-white py-5 text-center">
              <div>
                <p className="text-2xl font-bold">{completedRides.length}</p>
                <p className="text-xs text-gray-500">Completed</p>
              </div>
              <div>
                <p className="text-2xl font-bold">₹{totalSpent}</p>
                <p className="text-xs text-gray-500">Total spent</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {countFor(tabs.find((t) => t.id === "cancelled"))}
                </p>
                <p className="text-xs text-gray-500">Cancelled</p>
              </div>
            </section>

            {/* Tabs */}
            <div className="mt-5 flex gap-2 overflow-x-auto">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                    tab === t.id
                      ? "bg-gray-900 text-white"
                      : "bg-white text-gray-600 ring-1 ring-gray-200"
                  }`}
                >
                  {t.label}
                  <span className="text-xs opacity-70">{countFor(t)}</span>
                </button>
              ))}
            </div>

            {/* List */}
            <div className="mt-5 space-y-3">
              {shownRides.length === 0 && (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-12 text-center">
                  <p className="font-semibold">No rides found</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {rides.length === 0
                      ? "You have not booked any ride yet."
                      : "No rides in this tab."}
                  </p>
                  <Link
                    to="/passenger/bookRide"
                    className="mt-4 inline-block rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600"
                  >
                    Book a ride
                  </Link>
                </div>
              )}

              {shownRides.map((ride) => {
                const status = statusStyle[ride.status] || {
                  label: ride.status,
                  color: "bg-gray-100 text-gray-600",
                };
                const open = openId === ride._id;
                const isActive = ["searching", "accepted", "arriving", "started"].includes(
                  ride.status
                );

                return (
                  <div
                    key={ride._id}
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
                  >
                    <button
                      onClick={() => toggle(ride._id)}
                      className="flex w-full items-center gap-4 p-5 text-left"
                    >
                      <div className="flex flex-col items-center py-1">
                        <span className="h-2.5 w-2.5 rounded-full bg-gray-900"></span>
                        <span className="my-1 h-5 w-px bg-gray-300"></span>
                        <span className="h-2.5 w-2.5 bg-orange-500"></span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">
                          {ride.pickup?.name}
                        </p>
                        <p className="mt-2 truncate text-sm font-semibold">
                          {ride.destination?.name}
                        </p>
                        <p className="mt-2 text-xs text-gray-500">
                          {formatDate(ride.createdAt)} ·{" "}
                          {rideNames[ride.rideType] || ride.rideType}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p
                          className={`text-lg font-bold ${
                            ["cancelled", "no_driver_found"].includes(ride.status)
                              ? "text-gray-400 line-through"
                              : ""
                          }`}
                        >
                          ₹{ride.fare}
                        </p>
                        <span
                          className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.color}`}
                        >
                          {status.label}
                        </span>
                        <FaChevronDown
                          className={`ml-auto mt-2 text-xs text-gray-400 ${
                            open ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </button>

                    {open && (
                      <div className="border-t border-gray-100 bg-gray-50 p-5 text-sm">
                        <div className="grid grid-cols-2 gap-3">
                          <p>
                            <span className="text-gray-500">Booking ID: </span>#
                            {ride.bookingId}
                          </p>
                          <p>
                            <span className="text-gray-500">Payment: </span>
                            <span className="capitalize">{ride.payment?.method}</span>
                            {ride.payment?.status && ` (${ride.payment.status})`}
                          </p>
                          <p>
                            <span className="text-gray-500">Distance: </span>
                            {Number(ride.distanceKm).toFixed(1)} km
                          </p>
                          <p>
                            <span className="text-gray-500">Duration: </span>
                            {ride.durationMin} min
                          </p>
                          {ride.driver?.name && (
                            <p>
                              <span className="text-gray-500">Driver: </span>
                              {ride.driver.name}
                            </p>
                          )}
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3">
                          <Link
                            to={`/passenger/BookConform/${ride._id}`}
                            className="rounded-lg bg-orange-500 py-2 text-center font-semibold text-white hover:bg-orange-600"
                          >
                            {isActive ? "Track booking" : "View booking"}
                          </Link>
                          <Link
                            to="/passenger/bookRide"
                            className="rounded-lg bg-white py-2 text-center font-semibold ring-1 ring-gray-200 hover:ring-gray-900"
                          >
                            Book again
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default RideHistory;