import { useEffect, useState } from "react";
import {
  FaArrowRight,
  FaClock,
  FaIndianRupeeSign,
  FaLocationCrosshairs,
  FaLocationDot,
  FaRoute,
  FaStar,
  FaXmark,
} from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";
import RouteMap from "../../components/RouteMap";

const REQUEST_SECONDS = 30;

// Demo data. Baad me backend API se aayega
const recentTrips = [
  { id: 1, from: "Civil Lines", to: "Railway Station", fare: 180, time: "10:15 AM" },
  { id: 2, from: "Rampur Garden", to: "Bareilly Junction", fare: 240, time: "11:40 AM" },
  { id: 3, from: "Pilibhit Bypass", to: "Phoenix Mall", fare: 150, time: "1:05 PM" },
];

// Demo request. Real app me socket ya polling se aayegi
const demoRequest = {
  id: "req-1",
  passenger: "Rahul S.",
  rating: 4.8,
  pickup: { name: "Civil Lines, Bareilly", lat: 28.3649, lng: 79.4208 },
  destination: { name: "Bareilly Railway Station", lat: 28.3543, lng: 79.4304 },
  distanceKm: 4.2,
  pickupKm: 1.1,
  fare: 219,
  payment: "cash",
};

function DriverHome() {
  const navigate = useNavigate();

  const [online, setOnline] = useState(false);
  const [myPoint, setMyPoint] = useState(null);
  const [request, setRequest] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(REQUEST_SECONDS);
  const [error, setError] = useState("");

  const userName = localStorage.getItem("name") || "Driver";

  // Login aur role check
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token) navigate("/login");
    else if (role !== "driver") navigate("/passenger/bookRide");
  }, [navigate]);

  // Online hote hi driver ki location lo
  useEffect(() => {
    if (!online) return;

    if (!navigator.geolocation) {
      setError("Location is not supported in this browser.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      ({ coords }) =>
        setMyPoint({ name: "You", lat: coords.latitude, lng: coords.longitude }),
      () => setError("Turn on location to receive ride requests."),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [online]);

  // Demo: online hone ke 3 second baad ek request aati hai
  useEffect(() => {
    if (!online) {
      setRequest(null);
      return;
    }
    const timer = setTimeout(() => {
      setRequest(demoRequest);
      setSecondsLeft(REQUEST_SECONDS);
    }, 3000);
    return () => clearTimeout(timer);
  }, [online]);

  // Request ka countdown, 0 hone pe apne aap hat jati hai
  useEffect(() => {
    if (!request) return;

    if (secondsLeft <= 0) {
      setRequest(null);
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [request, secondsLeft]);

  const toggleOnline = () => {
    setError("");
    setOnline((prev) => !prev);
  };

  const acceptRide = () => {
    // TODO: PATCH /api/rides/:id/accept
    navigate("/driver/trip", { state: { ride: request } });
  };

  const declineRide = () => {
    // TODO: PATCH /api/rides/:id/decline
    setRequest(null);
  };

  const stats = [
    { label: "Today's earnings", value: "₹570", icon: <FaIndianRupeeSign /> },
    { label: "Trips", value: "3", icon: <FaRoute /> },
    { label: "Online time", value: "2h 10m", icon: <FaClock /> },
    { label: "Rating", value: "4.9", icon: <FaStar /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
        {/* Heading + online toggle */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Hi, <span className="text-orange-500">{userName}</span>
            </h1>
            <p className="mt-2 text-base text-gray-500">
              {online
                ? "You are online. Waiting for ride requests."
                : "Go online to start receiving rides."}
            </p>
          </div>

          <button
            type="button"
            onClick={toggleOnline}
            aria-pressed={online}
            className={`flex w-full items-center justify-between gap-4 rounded-2xl border-2 px-5 py-3 text-base font-semibold transition sm:w-auto ${
              online
                ? "border-orange-500 bg-orange-50/50 text-orange-600"
                : "border-gray-200 bg-white text-gray-700"
            }`}
          >
            {online ? "You're online" : "You're offline"}
            <span
              className={`relative h-6 w-11 rounded-full transition ${
                online ? "bg-orange-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                  online ? "left-[22px]" : "left-0.5"
                }`}
              />
            </span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-500">
                {item.icon}
              </span>
              <p className="mt-3 text-2xl font-bold">{item.value}</p>
              <p className="text-sm text-gray-500">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_400px] lg:gap-8">
          {/* ---------- Left column ---------- */}
          <div className="space-y-6">
            {/* Map */}
            <section
              className="relative z-0 h-64 overflow-hidden rounded-3xl border border-gray-200 sm:h-80"
              aria-label="Your location"
            >
              <RouteMap
                pickup={myPoint}
                destination={request ? request.pickup : null}
                route={[]}
              />

              {!online && (
                <div className="absolute inset-0 z-[500] flex items-center justify-center bg-white/70 backdrop-blur-sm">
                  <p className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow">
                    Go online to see the map
                  </p>
                </div>
              )}
            </section>

            {error && (
              <p role="alert" className="text-sm font-medium text-red-600">
                {error}
              </p>
            )}

            {/* Recent trips */}
            <section className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6">
              <h2 className="text-lg font-bold">Today's trips</h2>

              <div className="mt-4 space-y-3">
                {recentTrips.map((trip) => (
                  <div
                    key={trip.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 p-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold">
                        {trip.from} to {trip.to}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">{trip.time}</p>
                    </div>
                    <span className="shrink-0 text-lg font-bold text-orange-500">
                      ₹{trip.fare}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ---------- Right column ---------- */}
          <div className="space-y-6 lg:sticky lg:top-24">
            <section className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6">
              <h2 className="text-lg font-bold">Ride request</h2>

              {/* Empty states */}
              {!online && (
                <p className="mt-3 text-sm text-gray-500">
                  You are offline. Turn on the switch at the top to get requests.
                </p>
              )}

              {online && !request && (
                <div className="mt-4 flex items-center gap-3 rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">
                  <FaLocationCrosshairs className="animate-pulse text-orange-500" />
                  Looking for riders near you...
                </div>
              )}

              {/* Request card */}
              {online && request && (
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-base font-semibold">{request.passenger}</p>
                      <p className="flex items-center gap-1 text-xs text-gray-500">
                        <FaStar className="text-orange-500" />
                        {request.rating}
                      </p>
                    </div>
                    <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-600">
                      {secondsLeft}s
                    </span>
                  </div>

                  {/* Countdown bar */}
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-orange-500 transition-all duration-1000 ease-linear"
                      style={{ width: `${(secondsLeft / REQUEST_SECONDS) * 100}%` }}
                    />
                  </div>

                  <div className="mt-5 space-y-3">
                    <div className="flex items-start gap-3">
                      <FaLocationDot className="mt-1 shrink-0 text-gray-900" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-500">
                          Pickup · {request.pickupKm} km away
                        </p>
                        <p className="break-words text-sm font-semibold">
                          {request.pickup.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FaLocationDot className="mt-1 shrink-0 text-orange-500" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-500">
                          Destination · {request.distanceKm} km trip
                        </p>
                        <p className="break-words text-sm font-semibold">
                          {request.destination.name}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3.5">
                    <span className="text-base font-semibold">
                      {request.payment === "cash" ? "Cash fare" : "Online fare"}
                    </span>
                    <span className="text-2xl font-bold text-orange-500">
                      ₹{request.fare}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-[auto_1fr] gap-3">
                    <button
                      type="button"
                      onClick={declineRide}
                      aria-label="Decline ride"
                      className="flex items-center justify-center gap-2 rounded-2xl border border-gray-300 px-5 py-4 text-base font-semibold text-gray-700 transition hover:border-red-400 hover:text-red-500"
                    >
                      <FaXmark />
                      Decline
                    </button>
                    <button
                      type="button"
                      onClick={acceptRide}
                      className="flex items-center justify-center gap-2 rounded-2xl bg-orange-500 py-4 text-base font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600 active:scale-[0.99]"
                    >
                      Accept ride
                      <FaArrowRight />
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DriverHome;