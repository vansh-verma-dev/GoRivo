import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaCarSide,
  FaCircleCheck,
  FaClock,
  FaCreditCard,
  FaLocationDot,
  FaMessage,
  FaMoneyBillWave,
  FaPhone,
  FaShareNodes,
  FaShieldHalved,
  FaStar,
  FaXmark,
} from "react-icons/fa6";
import Navbar from "../components/navbar";

/*
  Data aata hai BookRide se, router state ke through:

  navigate("/booking-confirmation", {
    state: { pickup, destination, ride: selected, payment },
  });

  State na mile to neeche ka sample data dikhega.
*/
const fallbackBooking = {
  pickup: "Pickup location (sample)",
  destination: "Destination (sample)",
  ride: {
    name: "Go Comfort",
    passengers: 4,
    time: "5 min",
    price: 219,
  },
  payment: "cash",
};

// Demo driver — real app mein backend se aayega
const demoDriver = {
  name: "Rahul Sharma",
  rating: 4.8,
  trips: 1240,
  car: "Swift Dzire",
  plate: "UP 15 AB 1234",
};

function BookingConfirmation() {
  const location = useLocation();
  const booking = { ...fallbackBooking, ...(location.state || {}) };
  const ride = { ...fallbackBooking.ride, ...(booking.ride || {}) };

  const [status, setStatus] = useState("searching"); // searching | assigned | cancelled
  const [confirmCancel, setConfirmCancel] = useState(false);

  const bookingId = useMemo(
    () => booking.bookingId ?? `GR${Math.floor(100000 + Math.random() * 900000)}`,
    [booking.bookingId]
  );
  const otp = useMemo(() => String(Math.floor(1000 + Math.random() * 9000)), []);

  // Demo: 3 sec baad driver "mil jata hai"
  useEffect(() => {
    if (status !== "searching") return;
    const t = setTimeout(() => setStatus("assigned"), 3000);
    return () => clearTimeout(t);
  }, [status]);

  const isOnline = booking.payment === "online";

  /* ---------- Cancelled ---------- */
  if (status === "cancelled") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-4xl text-red-500">
            <FaXmark />
          </span>
          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            Ride cancelled
          </h1>
          <p className="mt-2 text-base text-gray-500">
            Booking #{bookingId} has been cancelled. You can book a new ride
            anytime.
          </p>
          <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
            <Link
              to="/trip"
              className="flex-1 rounded-2xl bg-orange-500 py-4 text-base font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600"
            >
              Book another ride
            </Link>
            <Link
              to="/"
              className="flex-1 rounded-2xl border border-gray-300 bg-white py-4 text-base font-semibold text-gray-800 transition hover:border-gray-900"
            >
              Go home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <div className="text-center">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-5xl text-green-500">
            <FaCircleCheck />
          </span>
          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
            Booking confirmed
          </h1>
          <p className="mt-2 text-base text-gray-500">
            Booking ID{" "}
            <span className="font-semibold text-gray-900">#{bookingId}</span>
          </p>
        </div>

        <div className="mt-8 space-y-5">
          {/* Driver status */}
          <section className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6">
            {status === "searching" ? (
              <div className="flex items-center gap-4">
                <span className="h-12 w-12 shrink-0 animate-spin rounded-full border-4 border-orange-100 border-t-orange-500" />
                <div>
                  <h2 className="text-lg font-bold">Finding your driver…</h2>
                  <p className="text-sm text-gray-500">
                    This usually takes less than a minute.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-green-600">
                      Driver assigned
                    </p>
                    <h2 className="mt-0.5 text-lg font-bold">
                      Arriving in {ride.time}
                    </h2>
                  </div>
                  <div className="rounded-2xl bg-gray-900 px-4 py-2 text-center text-white">
                    <p className="text-[11px] uppercase tracking-wider text-gray-400">
                      Ride PIN
                    </p>
                    <p className="text-xl font-bold tracking-[0.25em]">{otp}</p>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-4">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-orange-500 text-lg font-bold text-white">
                    {demoDriver.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-semibold">
                      {demoDriver.name}
                    </p>
                    <p className="flex items-center gap-1.5 text-sm text-gray-500">
                      <FaStar className="text-xs text-orange-500" />
                      {demoDriver.rating} · {demoDriver.trips} trips
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{demoDriver.plate}</p>
                    <p className="text-xs text-gray-500">{demoDriver.car}</p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 rounded-xl bg-gray-100 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-200"
                  >
                    <FaPhone /> Call
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 rounded-xl bg-gray-100 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-200"
                  >
                    <FaMessage /> Message
                  </button>
                </div>
              </>
            )}
          </section>

          {/* Trip details */}
          <section className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6">
            <h2 className="text-lg font-bold">Trip details</h2>

            <div className="mt-4 flex gap-4">
              <div className="flex flex-col items-center py-1.5">
                <span className="h-3 w-3 rounded-full bg-gray-900" />
                <span className="my-1 w-px flex-1 bg-gray-300" />
                <span className="h-3 w-3 bg-orange-500" />
              </div>
              <div className="min-w-0 flex-1 space-y-5">
                <div>
                  <p className="text-xs font-medium text-gray-500">Pickup</p>
                  <p className="break-words text-base font-semibold">
                    {booking.pickup}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Destination
                  </p>
                  <p className="break-words text-base font-semibold">
                    {booking.destination}
                  </p>
                </div>
              </div>
            </div>

            <hr className="my-5 border-gray-100" />

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-xl text-gray-700">
                  <FaCarSide />
                </span>
                <div>
                  <p className="text-base font-semibold">{ride.name}</p>
                  <p className="flex items-center gap-1.5 text-xs text-gray-500">
                    <FaClock className="text-[10px]" />
                    {ride.passengers} seats · {ride.time} away
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Payment */}
          <section className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6">
            <h2 className="text-lg font-bold">Payment</h2>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Estimated fare</span>
                <span className="font-medium text-gray-900">₹{ride.price}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Booking fee</span>
                <span className="font-medium text-green-600">Included</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3.5">
              <span className="text-base font-semibold">Total estimate</span>
              <span className="text-2xl font-bold text-orange-500">
                ₹{ride.price}
              </span>
            </div>

            <p className="mt-4 flex items-center gap-2 text-sm text-gray-600">
              {isOnline ? (
                <FaCreditCard className="text-gray-700" />
              ) : (
                <FaMoneyBillWave className="text-gray-700" />
              )}
              {isOnline ? "Paying online" : "Pay with cash to the driver"}
            </p>
          </section>

          {/* Safety note */}
          <div className="flex items-start gap-3 rounded-2xl bg-orange-50 p-4 text-sm text-orange-900">
            <FaShieldHalved className="mt-0.5 shrink-0 text-orange-500" />
            <p>
              Share the Ride PIN with your driver only after you verify the
              number plate and car.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={() =>
                navigator.share?.({
                  title: "My GoRivo ride",
                  text: `Booking #${bookingId}: ${booking.pickup} → ${booking.destination}`,
                })
              }
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 py-4 text-base font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600 active:scale-[0.99]"
            >
              <FaShareNodes />
              Share trip details
            </button>

            {!confirmCancel ? (
              <button
                type="button"
                onClick={() => setConfirmCancel(true)}
                className="w-full rounded-2xl bg-gray-100 py-4 text-base font-semibold text-red-600 transition hover:bg-red-50"
              >
                Cancel ride
              </button>
            ) : (
              <div
                role="alertdialog"
                className="rounded-2xl border border-red-200 bg-white p-4"
              >
                <p className="text-center text-sm font-semibold text-gray-900">
                  Cancel this ride?
                </p>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setConfirmCancel(false)}
                    className="rounded-xl bg-gray-100 py-3 text-sm font-semibold text-gray-900"
                  >
                    Keep ride
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus("cancelled")}
                    className="rounded-xl bg-red-600 py-3 text-sm font-semibold text-white"
                  >
                    Yes, cancel
                  </button>
                </div>
              </div>
            )}

            <Link
              to="/"
              className="block py-2 text-center text-sm font-semibold text-gray-600 transition hover:text-orange-500"
            >
              Back to home
            </Link>
          </div>

          <p className="text-center text-xs text-gray-400">
            Demo screen — driver details and status are sample data.
          </p>
        </div>
      </main>
    </div>
  );
}

export default BookingConfirmation;