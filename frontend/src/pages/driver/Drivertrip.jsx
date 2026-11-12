import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPhone, FaUser } from "react-icons/fa6";
import DriverHeader from "../driver/Driverheader";
import RouteMap from "../../components/RouteMap";
import {
  RIDE_STATUS,
  clearActiveRide,
  getPassenger,
  loadActiveRide,
  mergeRide,
  saveActiveRide,
  saveCompletedRide,
  updateRideStatus,
} from "../driver/Driverapi";

const steps = [
  { status: "accepted", label: "Accepted" },
  { status: "arriving", label: "At pickup" },
  { status: "started", label: "On trip" },
];

function DriverTrip() {
  const navigate = useNavigate();

  const [ride, setRide] = useState(loadActiveRide());
  const [pin, setPin] = useState("");
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [route, setRoute] = useState([]);

  const pLat = ride?.pickup?.lat;
  const pLng = ride?.pickup?.lng;
  const dLat = ride?.destination?.lat;
  const dLng = ride?.destination?.lng;

  // Map par pickup se destination tak ki line
  useEffect(() => {
    if (pLat === undefined || dLat === undefined) return;

    const controller = new AbortController();

    fetch(
      `https://router.project-osrm.org/route/v1/driving/${pLng},${pLat};${dLng},${dLat}?overview=full&geometries=geojson`,
      { signal: controller.signal }
    )
      .then((res) => res.json())
      .then((data) => {
        const r = data.routes?.[0];
        if (r) setRoute(r.geometry.coordinates.map(([lng, lat]) => [lat, lng]));
      })
      .catch(() => {});

    return () => controller.abort();
  }, [pLat, pLng, dLat, dLng]);

  const changeStatus = async (status, extra = {}) => {
    try {
      setUpdating(true);
      setError("");

      const data = await updateRideStatus(ride._id, status, extra);
      const updated = mergeRide({ ...ride, status }, data);

      if (status === RIDE_STATUS.completed) {
        saveCompletedRide(updated);
        clearActiveRide();
        navigate("/driver/rideCompleted");
        return;
      }

      saveActiveRide(updated);
      setRide(updated);
      setPin("");
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  /* ---------- Koi active ride nahi ---------- */
  if (!ride) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DriverHeader />
        <main className="mx-auto max-w-md px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">No active ride</h1>
          <p className="mt-2 text-gray-500">
            Accept a ride request to start a trip.
          </p>
          <Link
            to="/driver/rideRequest"
            className="mt-6 inline-block rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
          >
            View requests
          </Link>
        </main>
      </div>
    );
  }

  const passenger = getPassenger(ride);
  const currentStep = Math.max(
    0,
    steps.findIndex((s) => s.status === ride.status)
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <DriverHeader />

      <main className="mx-auto max-w-5xl space-y-5 px-4 py-6">
        {/* Progress */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Active ride</h1>
            <span className="text-sm text-gray-500">#{ride.bookingId}</span>
          </div>

          <ol className="mt-4 grid grid-cols-3 gap-2">
            {steps.map((step, index) => (
              <li key={step.status}>
                <div
                  className={`h-1.5 rounded-full ${
                    index <= currentStep ? "bg-orange-500" : "bg-gray-200"
                  }`}
                ></div>
                <p
                  className={`mt-2 text-xs ${
                    index <= currentStep
                      ? "font-semibold text-gray-900"
                      : "text-gray-400"
                  }`}
                >
                  {step.label}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <div className="grid items-start gap-5 lg:grid-cols-[1fr_380px]">
          {/* Map */}
          <section className="relative z-0 h-72 overflow-hidden rounded-2xl border border-gray-200 lg:h-[30rem]">
            <RouteMap
              pickup={ride.pickup}
              destination={ride.destination}
              route={route}
            />
          </section>

          <div className="space-y-5">
            {/* Passenger */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                    <FaUser />
                  </span>
                  <div>
                    <p className="font-semibold">
                      {passenger?.name || "Passenger"}
                    </p>
                    <p className="text-xs capitalize text-gray-500">
                      {ride.payment?.method || "cash"} · ₹{ride.fare}
                    </p>
                  </div>
                </div>

                {passenger?.phone && (
                  <a
                    href={`tel:${passenger.phone}`}
                    className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold hover:bg-gray-200"
                  >
                    <FaPhone /> Call
                  </a>
                )}
              </div>

              <div className="mt-5 flex gap-4">
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

              <p className="mt-4 border-t border-gray-100 pt-4 text-sm text-gray-500">
                {Number(ride.distanceKm).toFixed(1)} km · {ride.durationMin} min
              </p>
            </section>

            {/* Actions */}
            <section className="space-y-3">
              {error && (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </p>
              )}

              {ride.status === "accepted" && (
                <button
                  onClick={() => changeStatus(RIDE_STATUS.arrived)}
                  disabled={updating}
                  className="w-full rounded-xl bg-orange-500 py-4 font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
                >
                  {updating ? "Updating..." : "I have arrived at pickup"}
                </button>
              )}

              {ride.status === "arriving" && (
                <div className="rounded-2xl border border-gray-200 bg-white p-4">
                  <label className="text-sm font-semibold">
                    Ask the passenger for their Ride PIN
                  </label>
                  <input
                    value={pin}
                    onChange={(e) =>
                      setPin(e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                    inputMode="numeric"
                    placeholder="4-digit PIN"
                    className="mt-2 w-full rounded-xl bg-gray-100 px-4 py-3 text-center text-xl font-bold tracking-widest outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <button
                    onClick={() => changeStatus(RIDE_STATUS.started, { otp: pin })}
                    disabled={updating || pin.length !== 4}
                    className="mt-3 w-full rounded-xl bg-orange-500 py-4 font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {updating ? "Starting..." : "Start ride"}
                  </button>
                </div>
              )}

              {ride.status === "started" && (
                <button
                  onClick={() => changeStatus(RIDE_STATUS.completed)}
                  disabled={updating}
                  className="w-full rounded-xl bg-green-600 py-4 font-semibold text-white hover:bg-green-700 disabled:opacity-60"
                >
                  {updating ? "Completing..." : "Complete ride"}
                </button>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DriverTrip;