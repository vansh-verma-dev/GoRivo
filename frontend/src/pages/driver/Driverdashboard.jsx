import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaIndianRupeeSign, FaRoute, FaStar } from "react-icons/fa6";
import DriverHeader from "../driver/Driverheader";
import RouteMap from "../../components/RouteMap";
import {
  getAvailableRides,
  getDriverHistory,
  getSavedUser,
  isOnline,
  loadActiveRide,
  setOnline,
} from "../driver/Driverapi";

const isToday = (date) =>
  new Date(date).toDateString() === new Date().toDateString();

function Stat({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <span className="text-orange-500">{icon}</span>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

function DriverDashboard() {
  const [online, setOnlineState] = useState(isOnline());
  const [requests, setRequests] = useState([]);
  const [requestError, setRequestError] = useState("");
  const [history, setHistory] = useState(null); // null = abhi nahi mila
  const [location, setLocation] = useState(null);

  const activeRide = loadActiveRide();

  const toggleOnline = () => {
    const next = !online;
    setOnline(next);
    setOnlineState(next);
    if (!next) setRequests([]);
  };

  // Earnings aur trips history se nikalte hain
  useEffect(() => {
    getDriverHistory()
      .then(setHistory)
      .catch(() => setHistory(null));
  }, []);

  // Driver ki current location
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      ({ coords }) =>
        setLocation({
          name: "You are here",
          lat: coords.latitude,
          lng: coords.longitude,
        }),
      () => {}
    );
  }, []);

  // Online ho tabhi har 5 second mein nayi requests lao
  useEffect(() => {
    if (!online) return;

    let stopped = false;

    const loadRequests = async () => {
      try {
        const rides = await getAvailableRides();
        if (!stopped) {
          setRequests(rides);
          setRequestError("");
        }
      } catch (err) {
        if (!stopped) setRequestError(err.message);
      }
    };

    loadRequests();
    const timer = setInterval(loadRequests, 5000);
    return () => {
      stopped = true;
      clearInterval(timer);
    };
  }, [online]);

  const completed = history ? history.filter((r) => r.status === "completed") : [];
  const todayEarnings = completed
    .filter((r) => isToday(r.completedAt || r.updatedAt))
    .reduce((sum, r) => sum + r.fare, 0);
  const rating = getSavedUser().rating;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <DriverHeader />

      <main className="mx-auto max-w-5xl space-y-5 px-4 py-6">
        {/* Online / Offline */}
        <section className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5">
          <div>
            <h1 className="text-xl font-bold">
              You are {online ? "online" : "offline"}
            </h1>
            <p className="text-sm text-gray-500">
              {online
                ? "You will receive nearby ride requests."
                : "Go online to start receiving ride requests."}
            </p>
          </div>

          <button
            onClick={toggleOnline}
            className={`relative h-8 w-14 shrink-0 rounded-full transition ${
              online ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all ${
                online ? "left-7" : "left-1"
              }`}
            ></span>
          </button>
        </section>

        {/* Active ride banner */}
        {activeRide && (
          <Link
            to="/driver/trip"
            className="block rounded-2xl border border-orange-200 bg-orange-50 p-4 text-center font-semibold text-orange-700"
          >
            You have an active ride. Tap to continue →
          </Link>
        )}

        {/* Stats */}
        <section className="grid grid-cols-3 gap-3">
          <Stat
            icon={<FaIndianRupeeSign />}
            label="Today's earnings"
            value={history ? `₹${todayEarnings}` : "—"}
          />
          <Stat
            icon={<FaRoute />}
            label="Total trips"
            value={history ? completed.length : "—"}
          />
          <Stat icon={<FaStar />} label="Rating" value={rating || "—"} />
        </section>

        <div className="grid items-start gap-5 lg:grid-cols-2">
          {/* Nearby requests */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Nearby ride requests</h2>
              <Link
                to="/driver/rideRequest"
                className="text-sm font-semibold text-orange-500 hover:underline"
              >
                View all
              </Link>
            </div>

            {!online && (
              <p className="py-6 text-center text-sm text-gray-500">
                You are offline. Turn on the switch above to see requests.
              </p>
            )}

            {online && requestError && (
              <p className="py-6 text-center text-sm text-red-600">
                {requestError}
              </p>
            )}

            {online && !requestError && requests.length === 0 && (
              <p className="py-6 text-center text-sm text-gray-500">
                No ride requests right now. We will keep looking...
              </p>
            )}

            <div className="space-y-3">
              {online &&
                requests.slice(0, 3).map((ride) => (
                  <Link
                    key={ride._id}
                    to="/driver/rideRequest"
                    className="block rounded-xl border border-gray-100 p-4 hover:border-orange-300"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {ride.pickup?.name}
                        </p>
                        <p className="mt-1 truncate text-sm text-gray-500">
                          to {ride.destination?.name}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-bold">₹{ride.fare}</p>
                        <p className="text-xs text-gray-500">
                          {Number(ride.distanceKm).toFixed(1)} km
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </section>

          {/* Map */}
          <section className="relative z-0 h-72 overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
            {location ? (
              <RouteMap pickup={location} destination={null} route={[]} />
            ) : (
              <p className="flex h-full items-center justify-center px-6 text-center text-sm text-gray-500">
                Allow location access to see your position on the map.
              </p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default DriverDashboard;