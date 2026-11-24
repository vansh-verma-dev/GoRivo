import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiRefreshCw,
  FiCheckCircle,
  FiClock,
  FiNavigation,
} from "react-icons/fi";
import { FaCarSide, FaMoneyBillWave } from "react-icons/fa";
import Navbar from "../components/navbar";
import { getAvailableRidesApi, acceptRideApi } from "../services/rideService";

const POLL_INTERVAL = 6000;

const AvailableRides = () => {
  const navigate = useNavigate();

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true); // sirf pehli baar / manual refresh
  const [refreshing, setRefreshing] = useState(false);
  const [acceptingId, setAcceptingId] = useState(null);
  const [error, setError] = useState("");

  const fetchAvailableRides = useCallback(async (showSpinner = false) => {
    if (showSpinner) setRefreshing(true);
    try {
      const res = await getAvailableRidesApi();
      setRides(res.data || []);
      setError("");
    } catch (err) {
      console.error("Fetch available rides error:", err);
      if (err.status === 401) {
        setError("Session expired. Please login again.");
      } else if (err.status === 403) {
        setError("Only drivers can see available rides.");
      } else {
        setError(err.message || "Failed to load rides.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Auto refresh every 6 sec (accept ke dauran pause)
  useEffect(() => {
    fetchAvailableRides();
    const timer = setInterval(() => {
      if (!acceptingId) fetchAvailableRides();
    }, POLL_INTERVAL);
    return () => clearInterval(timer);
  }, [fetchAvailableRides, acceptingId]);

  const handleAcceptRide = async (rideId) => {
    try {
      setAcceptingId(rideId);
      setError("");

      const res = await acceptRideApi(rideId);

      // Captain ko seedha trip console par bhejo
      navigate(`/driver/driverTrip/${res.data._id}`, {
        state: { ride: res.data },
      });
    } catch (err) {
      console.error("Accept ride error:", err);
      setError(err.message || "Ride already taken.");
      fetchAvailableRides();
    } finally {
      setAcceptingId(null);
    }
  };

  const paymentMethod = (ride) =>
    typeof ride.payment === "object" ? ride.payment?.method : ride.payment;

  return (
    <>
      <Navbar />

      <section className="min-h-screen bg-gray-50/70 py-8 lg:py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
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
              onClick={() => fetchAvailableRides(true)}
              disabled={refreshing}
              className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 shadow-sm transition hover:border-orange-300 hover:text-orange-600 disabled:opacity-60"
            >
              <FiRefreshCw
                className={refreshing ? "animate-spin text-orange-500" : ""}
              />
              <span>Refresh</span>
            </button>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-600">
              {error}
            </div>
          )}

          {/* Rides list */}
          {loading ? (
            <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center text-sm text-gray-500">
              Scanning for nearby ride requests...
            </div>
          ) : rides.length === 0 ? (
            <div className="space-y-2 rounded-2xl border border-gray-100 bg-white p-12 text-center">
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
                  className="flex flex-col justify-between gap-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:border-orange-300 md:flex-row md:items-center"
                >
                  <div className="min-w-0 space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded-md bg-gray-100 px-2.5 py-1 font-bold text-gray-800">
                        {ride.bookingId || ride._id.slice(-6).toUpperCase()}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-orange-50 px-2.5 py-1 font-bold uppercase text-orange-600">
                        <FaCarSide /> {ride.rideType}
                      </span>
                      <span className="inline-flex items-center gap-1 text-gray-500">
                        <FiClock className="text-orange-500" />
                        {Number(ride.distanceKm || 0).toFixed(1)} km •{" "}
                        {ride.durationMin} min
                      </span>
                    </div>

                    <div className="space-y-1.5 pl-1">
                      <p className="flex items-center gap-2 text-sm font-bold text-gray-900">
                        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-orange-500" />
                        <span className="break-words">{ride.pickup?.name}</span>
                      </p>
                      <p className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <span className="h-2.5 w-2.5 shrink-0 rounded-sm bg-gray-900" />
                        <span className="break-words">
                          {ride.destination?.name}
                        </span>
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold capitalize text-gray-500">
                      <FaMoneyBillWave className="text-green-600" />
                      Payment: {paymentMethod(ride)}
                    </div>
                  </div>

                  {/* Fare & accept button */}
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
                      disabled={acceptingId !== null}
                      onClick={() => handleAcceptRide(ride._id)}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-orange-500/20 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <FiCheckCircle />
                      <span>
                        {acceptingId === ride._id
                          ? "Accepting..."
                          : "Accept Ride"}
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default AvailableRides;