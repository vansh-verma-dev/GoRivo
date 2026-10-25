import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaCarSide,
  FaCheck,
  FaCircleCheck,
  FaMessage,
  FaPhone,
  FaRotateRight,
  FaShareNodes,
  FaShieldHalved,
  FaStar,
  FaTriangleExclamation,
} from "react-icons/fa6";
import Navbar from "../components/navbar";

/*
  BookingConfirmation se aise bhejo:

  navigate("/track", {
    state: { bookingId, pickup, destination, ride, payment, otp },
  });

  State na mile to sample data dikhega.
*/
const fallbackBooking = {
  bookingId: "GR000000",
  pickup: "Pickup location (sample)",
  destination: "Destination (sample)",
  ride: { name: "Go Comfort", price: 219 },
  payment: "cash",
  otp: "4821",
};

// Demo driver — real app mein backend se aayega
const demoDriver = {
  name: "Rahul Sharma",
  rating: 4.8,
  car: "Swift Dzire",
  plate: "UP 15 AB 1234",
};

const stages = [
  "Driver on the way",
  "Driver arrived",
  "On trip",
  "Completed",
];

// Demo simulation: progress 0 → 100
const PICKUP_AT = 35; // % jahan driver pickup pe pahunchta hai
const TRIP_STARTS_AT = 45; // % jahan trip start hoti hai

function getStage(p) {
  if (p < PICKUP_AT) return 0;
  if (p < TRIP_STARTS_AT) return 1;
  if (p < 100) return 2;
  return 3;
}

const ROUTE_PATH =
  "M 50 220 C 100 190 120 150 160 135 S 230 130 260 100 S 320 60 355 45";

function LiveRideTracking() {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = { ...fallbackBooking, ...(location.state || {}) };
  const ride = { ...fallbackBooking.ride, ...(booking.ride || {}) };

  const [progress, setProgress] = useState(0);
  const [geom, setGeom] = useState(null);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [rating, setRating] = useState(0);
  const [rated, setRated] = useState(false);
  const pathRef = useRef(null);

  const stage = getStage(progress);

  // Demo: har second progress badhao
  useEffect(() => {
    if (progress >= 100) return;
    const t = setInterval(() => {
      setProgress((p) => Math.min(100, p + 2.5));
    }, 1000);
    return () => clearInterval(t);
  }, [progress >= 100]); // eslint-disable-line react-hooks/exhaustive-deps

  // Car, pickup aur destination ki position route path se nikalo
  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    setGeom({
      len,
      car: path.getPointAtLength((len * progress) / 100),
      pickup: path.getPointAtLength((len * PICKUP_AT) / 100),
      dest: path.getPointAtLength(len),
    });
  }, [progress]);

  // ETA (demo numbers)
  const etaMin =
    stage === 0
      ? Math.max(1, Math.ceil(((PICKUP_AT - progress) / PICKUP_AT) * 5))
      : stage === 2
      ? Math.max(
          1,
          Math.ceil(((100 - progress) / (100 - TRIP_STARTS_AT)) * 10)
        )
      : 0;

  const headline = [
    `Arriving in ${etaMin} min`,
    "Your driver is here",
    `Reaching in ${etaMin} min`,
    "You've arrived",
  ][stage];

  const canCancel = stage < 2;

  const replay = () => {
    setProgress(0);
    setRating(0);
    setRated(false);
    setConfirmCancel(false);
  };

  const handleShare = () =>
    navigator.share?.({
      title: "Track my GoRivo ride",
      text: `${booking.pickup} → ${booking.destination} (#${booking.bookingId})`,
    });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:py-10">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.2fr_1fr]">
          {/* ---------- Map ---------- */}
          <section
            aria-label="Live map"
            className="relative h-72 overflow-hidden rounded-3xl border border-gray-200 bg-gray-100 sm:h-96 lg:sticky lg:top-24 lg:h-[34rem]"
          >
            <div
              className="absolute inset-0 opacity-70"
              style={{
                backgroundImage:
                  "linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)",
                backgroundSize: "36px 36px",
              }}
            />
            <div className="absolute -left-[10%] top-[58%] h-4 w-[120%] -rotate-12 bg-white" />
            <div className="absolute -top-[20%] left-[40%] h-[140%] w-4 rotate-[16deg] bg-white" />

            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 400 260"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden="true"
            >
              {/* Full route */}
              <path
                ref={pathRef}
                d={ROUTE_PATH}
                fill="none"
                stroke="#d1d5db"
                strokeWidth="5"
                strokeLinecap="round"
              />

              {geom && (
                <>
                  {/* Travelled part */}
                  <path
                    d={ROUTE_PATH}
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={`${(geom.len * progress) / 100} ${geom.len}`}
                  />

                  {/* Pickup */}
                  <circle
                    cx={geom.pickup.x}
                    cy={geom.pickup.y}
                    r="7"
                    fill="#111827"
                    stroke="#fff"
                    strokeWidth="3"
                  />
                  <text
                    x={geom.pickup.x}
                    y={geom.pickup.y - 14}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="600"
                    fill="#111827"
                  >
                    Pickup
                  </text>

                  {/* Destination */}
                  <rect
                    x={geom.dest.x - 7}
                    y={geom.dest.y - 7}
                    width="14"
                    height="14"
                    fill="#f97316"
                    stroke="#fff"
                    strokeWidth="3"
                  />
                  <text
                    x={geom.dest.x}
                    y={geom.dest.y + 24}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="600"
                    fill="#111827"
                  >
                    Destination
                  </text>

                  {/* Car */}
                  <circle
                    cx={geom.car.x}
                    cy={geom.car.y}
                    r="16"
                    fill="#f97316"
                    opacity="0.2"
                  />
                  <circle
                    cx={geom.car.x}
                    cy={geom.car.y}
                    r="9"
                    fill="#f97316"
                    stroke="#fff"
                    strokeWidth="3"
                  />
                </>
              )}
            </svg>

            <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold shadow-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              {stage === 3 ? "Trip ended" : "Live"}
            </div>
          </section>

          {/* ---------- Details ---------- */}
          <div className="space-y-5">
            {/* Status */}
            <section className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6">
              <p className="text-sm font-semibold text-orange-500">
                {stages[stage]}
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight">
                {headline}
              </h1>

              <div
                className="mt-5 h-2 overflow-hidden rounded-full bg-gray-100"
                role="progressbar"
                aria-valuenow={Math.round(progress)}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full rounded-full bg-orange-500 transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <ol className="mt-5 grid grid-cols-4 gap-1">
                {stages.map((label, i) => {
                  const done = i < stage || stage === 3;
                  const active = i === stage && stage !== 3;
                  return (
                    <li key={label} className="flex flex-col items-center text-center">
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                          done
                            ? "bg-orange-500 text-white"
                            : active
                            ? "border-2 border-orange-500 text-orange-500"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {done ? <FaCheck className="text-[10px]" /> : i + 1}
                      </span>
                      <span
                        className={`mt-2 text-[11px] leading-tight ${
                          active || done
                            ? "font-semibold text-gray-900"
                            : "text-gray-400"
                        }`}
                      >
                        {label}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </section>

            {/* Completed: rating */}
            {stage === 3 && (
              <section className="rounded-3xl border border-gray-200 bg-white p-5 text-center sm:p-6">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-3xl text-green-500">
                  <FaCircleCheck />
                </span>
                <h2 className="mt-3 text-lg font-bold">
                  Total fare ₹{ride.price}
                </h2>
                <p className="text-sm text-gray-500">
                  {booking.payment === "online"
                    ? "Paid online"
                    : "Pay with cash to the driver"}
                </p>

                {rated ? (
                  <p className="mt-4 text-sm font-semibold text-green-600">
                    Thanks for rating your ride!
                  </p>
                ) : (
                  <>
                    <p className="mt-5 text-sm font-semibold">
                      Rate {demoDriver.name}
                    </p>
                    <div className="mt-2 flex justify-center gap-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setRating(n)}
                          aria-label={`${n} star${n > 1 ? "s" : ""}`}
                          className={`p-1 text-3xl transition ${
                            n <= rating ? "text-orange-500" : "text-gray-300"
                          }`}
                        >
                          <FaStar />
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      disabled={rating === 0}
                      onClick={() => setRated(true)}
                      className="mt-4 w-full rounded-2xl bg-orange-500 py-3.5 text-base font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
                    >
                      Submit rating
                    </button>
                  </>
                )}
              </section>
            )}

            {/* Driver */}
            <section className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6">
              <div className="flex items-center gap-4">
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
                    {demoDriver.rating} · {demoDriver.car}
                  </p>
                </div>
                <div className="text-right">
                  <p className="rounded-lg bg-gray-100 px-2.5 py-1 text-sm font-bold">
                    {demoDriver.plate}
                  </p>
                </div>
              </div>

              {stage < 2 && (
                <div className="mt-4 flex items-center justify-between rounded-2xl bg-gray-900 px-4 py-3 text-white">
                  <span className="text-sm text-gray-300">
                    Share PIN with driver
                  </span>
                  <span className="text-xl font-bold tracking-[0.3em]">
                    {booking.otp}
                  </span>
                </div>
              )}

              {stage < 3 && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 rounded-xl bg-gray-100 py-3 text-sm font-semibold transition hover:bg-gray-200"
                  >
                    <FaPhone /> Call
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 rounded-xl bg-gray-100 py-3 text-sm font-semibold transition hover:bg-gray-200"
                  >
                    <FaMessage /> Message
                  </button>
                </div>
              )}
            </section>

            {/* Trip */}
            <section className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Your trip</h2>
                <span className="flex items-center gap-1.5 text-sm text-gray-500">
                  <FaCarSide /> {ride.name}
                </span>
              </div>

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
            </section>

            {/* Safety + actions */}
            {stage < 3 && (
              <section className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-white py-3.5 text-sm font-semibold ring-1 ring-gray-200 transition hover:ring-gray-900"
                  >
                    <FaShareNodes /> Share trip
                  </button>
                  <a
                    href="tel:112"
                    className="flex items-center justify-center gap-2 rounded-2xl bg-red-50 py-3.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                  >
                    <FaTriangleExclamation /> Emergency 112
                  </a>
                </div>

                {canCancel &&
                  (!confirmCancel ? (
                    <button
                      type="button"
                      onClick={() => setConfirmCancel(true)}
                      className="w-full rounded-2xl bg-gray-100 py-3.5 text-base font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      Cancel ride
                    </button>
                  ) : (
                    <div
                      role="alertdialog"
                      className="rounded-2xl border border-red-200 bg-white p-4"
                    >
                      <p className="text-center text-sm font-semibold">
                        Cancel this ride?
                      </p>
                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setConfirmCancel(false)}
                          className="rounded-xl bg-gray-100 py-3 text-sm font-semibold"
                        >
                          Keep ride
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate("/trip")}
                          className="rounded-xl bg-red-600 py-3 text-sm font-semibold text-white"
                        >
                          Yes, cancel
                        </button>
                      </div>
                    </div>
                  ))}

                <p className="flex items-center justify-center gap-2 pt-1 text-xs text-gray-500">
                  <FaShieldHalved className="text-orange-500" />
                  Verify the number plate before you get in.
                </p>
              </section>
            )}

            {stage === 3 && (
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/"
                  className="flex-1 rounded-2xl border border-gray-300 bg-white py-3.5 text-center text-base font-semibold transition hover:border-gray-900"
                >
                  Back to home
                </Link>
                <button
                  type="button"
                  onClick={replay}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gray-100 py-3.5 text-base font-semibold transition hover:bg-gray-200"
                >
                  <FaRotateRight /> Replay demo
                </button>
              </div>
            )}

            <p className="text-center text-xs text-gray-400">
              Demo screen — location and progress are simulated, not real GPS.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LiveRideTracking;