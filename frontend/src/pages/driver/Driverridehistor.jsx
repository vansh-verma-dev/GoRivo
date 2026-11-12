import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaChevronDown, FaCircleExclamation } from "react-icons/fa6";
import DriverHeader from "../driver/Driverheader";
import { formatDateTime, getDriverHistory, getPassenger } from "../driver/Driverapi";

const statusStyle = {
  completed: { label: "Completed", color: "bg-green-50 text-green-700" },
  cancelled: { label: "Cancelled", color: "bg-red-50 text-red-600" },
};

function DriverRideHistory() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        setError("");
        setRides(await getDriverHistory());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [reloadKey]);

  const completed = rides.filter((r) => r.status === "completed");
  const totalEarned = completed.reduce((sum, r) => sum + r.fare, 0);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <DriverHeader />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-bold">Ride history</h1>
        <p className="mt-1 text-sm text-gray-500">All the trips you have driven.</p>

        {loading && (
          <div className="mt-6 space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-24 animate-pulse rounded-2xl bg-gray-200"></div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center">
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

        {!loading && !error && (
          <>
            <section className="mt-6 grid grid-cols-2 divide-x divide-gray-100 rounded-2xl border border-gray-200 bg-white py-5 text-center">
              <div>
                <p className="text-2xl font-bold">{completed.length}</p>
                <p className="text-xs text-gray-500">Completed trips</p>
              </div>
              <div>
                <p className="text-2xl font-bold">₹{totalEarned}</p>
                <p className="text-xs text-gray-500">Total earned</p>
              </div>
            </section>

            <div className="mt-5 space-y-3">
              {rides.length === 0 && (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-12 text-center">
                  <p className="font-semibold">No rides yet</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Your completed trips will show up here.
                  </p>
                  <Link
                    to="/driver/rideRequest"
                    className="mt-4 inline-block rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white"
                  >
                    View requests
                  </Link>
                </div>
              )}

              {rides.map((ride) => {
                const status = statusStyle[ride.status] || {
                  label: ride.status,
                  color: "bg-gray-100 text-gray-600",
                };
                const open = openId === ride._id;
                const passenger = getPassenger(ride);

                return (
                  <div
                    key={ride._id}
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
                  >
                    <button
                      onClick={() => setOpenId(open ? null : ride._id)}
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
                          {formatDateTime(ride.completedAt || ride.createdAt)}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p
                          className={`text-lg font-bold ${
                            ride.status === "cancelled"
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
                      <div className="grid grid-cols-2 gap-3 border-t border-gray-100 bg-gray-50 p-5 text-sm">
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
                        {passenger?.name && (
                          <p>
                            <span className="text-gray-500">Passenger: </span>
                            {passenger.name}
                          </p>
                        )}
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

export default DriverRideHistory;