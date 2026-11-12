import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { FaCircleCheck, FaStar } from "react-icons/fa6";
import DriverHeader from "../driver/Driverheader";
import {
  clearCompletedRide,
  formatDateTime,
  getPassenger,
  loadCompletedRide,
} from "../driver/Driverapi";

const paymentTone = {
  pending: "bg-orange-50 text-orange-600",
  processing: "bg-orange-50 text-orange-600",
  paid: "bg-green-50 text-green-700",
  failed: "bg-red-50 text-red-600",
  refunded: "bg-gray-100 text-gray-600",
};

function Row({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex justify-between gap-4 py-2 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-right font-semibold">{value}</span>
    </div>
  );
}

function DriverRideCompleted() {
  const [ride] = useState(loadCompletedRide());
  const [rating, setRating] = useState(0);
  const [rated, setRated] = useState(false);

  // Seedha URL kholne par koi completed ride nahi hoti
  if (!ride) {
    return <Navigate to="/driver/dashboard" replace />;
  }

  const passenger = getPassenger(ride);
  const method = ride.payment?.method || "cash";
  const paymentStatus = ride.payment?.status || "pending";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <DriverHeader />

      <main className="mx-auto max-w-md space-y-5 px-4 py-8">
        <div className="text-center">
          <FaCircleCheck className="mx-auto text-6xl text-green-500" />
          <h1 className="mt-4 text-3xl font-bold">Ride completed</h1>
          <p className="mt-1 text-gray-500">Booking ID #{ride.bookingId}</p>
        </div>

        {/* Fare */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5 text-center">
          <p className="text-sm text-gray-500">Total fare</p>
          <p className="mt-1 text-4xl font-bold text-orange-500">₹{ride.fare}</p>
          {method === "cash" && (
            <p className="mt-2 text-sm text-gray-500">
              Collect ₹{ride.fare} in cash from the passenger.
            </p>
          )}
        </section>

        {/* Details */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5">
          <h2 className="mb-2 text-lg font-bold">Ride details</h2>
          <div className="divide-y divide-gray-100">
            <Row label="Passenger" value={passenger?.name} />
            <Row label="Pickup" value={ride.pickup?.name} />
            <Row label="Destination" value={ride.destination?.name} />
            <Row
              label="Distance"
              value={`${Number(ride.distanceKm).toFixed(1)} km`}
            />
            <Row label="Duration" value={`${ride.durationMin} min`} />
            <Row label="Completed at" value={formatDateTime(ride.completedAt)} />
            <Row
              label="Payment method"
              value={method === "online" ? "Online" : "Cash"}
            />
            <div className="flex items-center justify-between py-2 text-sm">
              <span className="text-gray-500">Payment status</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                  paymentTone[paymentStatus] || "bg-gray-100"
                }`}
              >
                {paymentStatus}
              </span>
            </div>
          </div>
        </section>

        {/* Rating (abhi sirf UI, rating ki API baad mein) */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5 text-center">
          {rated ? (
            <p className="font-semibold text-green-600">Thanks for your rating!</p>
          ) : (
            <>
              <p className="font-semibold">
                Rate {passenger?.name || "the passenger"}
              </p>
              <div className="mt-2 flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <FaStar
                    key={n}
                    onClick={() => setRating(n)}
                    className={`cursor-pointer text-3xl ${
                      n <= rating ? "text-orange-500" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => setRated(true)}
                disabled={rating === 0}
                className="mt-4 w-full rounded-xl bg-gray-900 py-3 font-semibold text-white disabled:bg-gray-200 disabled:text-gray-400"
              >
                Submit rating
              </button>
            </>
          )}
        </section>

        <Link
          to="/driver/dashboard"
          onClick={clearCompletedRide}
          className="block rounded-xl bg-orange-500 py-4 text-center font-semibold text-white hover:bg-orange-600"
        >
          Back to dashboard
        </Link>
      </main>
    </div>
  );
}

export default DriverRideCompleted;