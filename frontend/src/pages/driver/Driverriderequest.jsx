import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPhone, FaUser } from "react-icons/fa6";
import DriverHeader from "../driver/Driverheader";

import {
  acceptRide,
  getAvailableRides,
  getPassenger,
  isOnline,
  loadActiveRide,
  mergeRide,
  saveActiveRide,
} from "../driver/Driverapi";

// Driver ke paas request accept karne ka time (sirf frontend par chalta hai)
const REQUEST_SECONDS = 30;

function RequestCard({ ride, disabled, accepting, onAccept, onDecline }) {
  const [seconds, setSeconds] = useState(REQUEST_SECONDS);
  const passenger = getPassenger(ride);

  // Countdown, 0 par request apne aap hat jati hai
  useEffect(() => {
    if (seconds <= 0) {
      onDecline(ride._id);
      return;
    }
    const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      {/* Countdown bar */}
      <div className="h-1.5 bg-gray-100">
        <div
          className="h-full bg-orange-500 transition-all duration-1000 ease-linear"
          style={{ width: `${(seconds / REQUEST_SECONDS) * 100}%` }}
        ></div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-600">
              <FaUser />
            </span>
            <div>
              <p className="font-semibold">{passenger?.name || "Passenger"}</p>
              {passenger?.phone && (
                <p className="flex items-center gap-1.5 text-xs text-gray-500">
                  <FaPhone className="text-[10px]" /> {passenger.phone}
                </p>
              )}
            </div>
          </div>
          <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-bold text-orange-600">
            {seconds}s
          </span>
        </div>

        <div className="mt-4 flex gap-4">
          <div className="flex flex-col items-center py-1">
            <span className="h-3 w-3 rounded-full bg-gray-900"></span>
            <span className="my-1 w-px flex-1 bg-gray-300"></span>
            <span className="h-3 w-3 bg-orange-500"></span>
          </div>
          <div className="min-w-0 space-y-4">
            <div>
              <p className="text-xs text-gray-500">Pickup</p>
              <p className="break-words text-sm font-semibold">
                {ride.pickup?.name}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Destination</p>
              <p className="break-words text-sm font-semibold">
                {ride.destination?.name}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 rounded-xl bg-gray-50 p-3 text-center">
          <div>
            <p className="font-bold">{Number(ride.distanceKm).toFixed(1)} km</p>
            <p className="text-xs text-gray-500">Distance</p>
          </div>
          <div>
            <p className="font-bold">{ride.durationMin} min</p>
            <p className="text-xs text-gray-500">Time</p>
          </div>
          <div>
            <p className="font-bold text-orange-500">₹{ride.fare}</p>
            <p className="text-xs capitalize text-gray-500">
              {ride.payment?.method || "cash"}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            onClick={() => onDecline(ride._id)}
            disabled={accepting}
            className="rounded-xl bg-gray-100 py-3 font-semibold hover:bg-gray-200 disabled:opacity-60"
          >
            Decline
          </button>
          <button
            onClick={() => onAccept(ride)}
            disabled={disabled || accepting}
            className="rounded-xl bg-orange-500 py-3 font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {accepting ? "Accepting..." : "Accept"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DriverRideRequest() {
  const navigate = useNavigate();
  const online = isOnline();
  const activeRide = loadActiveRide();

  const [rides, setRides] = useState([]);
  const [declined, setDeclined] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [acceptingId, setAcceptingId] = useState(null);
  const [acceptError, setAcceptError] = useState("");

  // Online ho tabhi requests lao, har 5 second mein refresh
  useEffect(() => {
    if (!online) {
      setLoading(false);
      return;
    }

    let stopped = false;

    const loadRides = async () => {
      try {
        const data = await getAvailableRides();
        if (!stopped) {
          setRides(data);
          setError("");
        }
      } catch (err) {
        if (!stopped) setError(err.message);
      } finally {
        if (!stopped) setLoading(false);
      }
    };

    loadRides();
    const timer = setInterval(loadRides, 5000);
    return () => {
      stopped = true;
      clearInterval(timer);
    };
  }, [online]);

  const decline = (id) => setDeclined((prev) => [...prev, id]);

  const handleAccept = async (ride) => {
    try {
      setAcceptingId(ride._id);
      setAcceptError("");

      const data = await acceptRide(ride._id);
      const accepted = mergeRide({ ...ride, status: "accepted" }, data);

      saveActiveRide(accepted);
      navigate("/driver/trip");
    } catch (err) {
      // Kisi aur driver ne pehle accept kar li ho to yahan error aayega
      setAcceptError(err.message);
      decline(ride._id);
    } finally {
      setAcceptingId(null);
    }
  };

  const visibleRides = rides.filter((r) => !declined.includes(r._id));

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <DriverHeader />

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-6">
        <div>
          <h1 className="text-2xl font-bold">Ride requests</h1>
          <p className="text-sm text-gray-500">
            Accept a request before the timer runs out.
          </p>
        </div>

        {activeRide && (
          <Link
            to="/driver/trip"
            className="block rounded-2xl border border-orange-200 bg-orange-50 p-4 text-center font-semibold text-orange-700"
          >
            Finish your active ride before accepting a new one →
          </Link>
        )}

        {acceptError && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {acceptError}
          </p>
        )}

        {!online && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-12 text-center">
            <p className="font-semibold">You are offline</p>
            <p className="mt-1 text-sm text-gray-500">
              Go online from the dashboard to receive requests.
            </p>
            <Link
              to="/driver/dashboard"
              className="mt-4 inline-block rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white"
            >
              Go to dashboard
            </Link>
          </div>
        )}

        {online && loading && (
          <div className="space-y-3">
            {[1, 2].map((n) => (
              <div key={n} className="h-64 animate-pulse rounded-2xl bg-gray-200"></div>
            ))}
          </div>
        )}

        {online && !loading && error && (
          <p className="rounded-2xl bg-white py-10 text-center text-sm text-red-600">
            {error}
          </p>
        )}

        {online && !loading && !error && visibleRides.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-12 text-center">
            <p className="font-semibold">No requests right now</p>
            <p className="mt-1 text-sm text-gray-500">
              New requests will appear here automatically.
            </p>
          </div>
        )}

        {online && (
          <div className="space-y-4">
            {visibleRides.map((ride) => (
              <RequestCard
                key={ride._id}
                ride={ride}
                disabled={Boolean(activeRide)}
                accepting={acceptingId === ride._id}
                onAccept={handleAccept}
                onDecline={decline}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default DriverRideRequest;