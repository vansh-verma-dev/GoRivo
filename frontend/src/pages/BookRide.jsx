import { useState } from "react";
import {
  FaArrowRight,
  FaArrowRightArrowLeft,
  FaCar,
  FaCarSide,
  FaCheck,
  FaClock,
  FaCreditCard,
  FaLocationDot,
  FaMoneyBillWave,
  FaShieldHalved,
  FaStar,
  FaUser,
  FaVanShuttle,
} from "react-icons/fa6";
import Navbar from "../components/navbar";
import { useNavigate } from "react-router-dom";

const rideOptions = [
  {
    id: "go-mini",
    name: "Go Mini",
    description: "Affordable everyday rides",
    passengers: 4,
    time: "3 min",
    price: 149,
    icon: <FaCar />,
  },
  {
    id: "go-comfort",
    name: "Go Comfort",
    description: "Extra comfort for your trip",
    passengers: 4,
    time: "5 min",
    price: 219,
    icon: <FaCarSide />,
    popular: true,
  },
  {
    id: "go-xl",
    name: "Go XL",
    description: "More space for everyone",
    passengers: 6,
    time: "7 min",
    price: 329,
    icon: <FaVanShuttle />,
  },
];

const trustItems = [
  { icon: <FaShieldHalved />, text: "Safety first" },
  { icon: <FaCreditCard />, text: "Cash or online payment" },
  { icon: <FaStar />, text: "Comfortable rides" },
];

function BookRide() {
  const Navigate = useNavigate();
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [selectedRide, setSelectedRide] = useState("go-comfort");
  const [payment, setPayment] = useState("cash");
  const [rideRequested, setRideRequested] = useState(false);
  const [error, setError] = useState("");

  const selected = rideOptions.find((ride) => ride.id === selectedRide);

  const resetStatus = () => {
    setRideRequested(false);
    setError("");
  };

  const swapLocations = () => {
    setPickup(destination);
    setDestination(pickup);
    resetStatus();
  };

  const handleBookRide = () => {
      Navigate("/BookConform");
    if (!pickup.trim() || !destination.trim()) {
      setError("Please enter both pickup and destination.");
      return;
    }
    setError("");
    setRideRequested(true);
  
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Book your <span className="text-orange-500">ride</span>
          </h1>
          <p className="mt-2 text-base text-gray-500">
            Wherever life takes you, get there comfortably and on time.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_400px] lg:gap-8">
          {/* ---------- Left column ---------- */}
          <div className="space-y-6">
            {/* Locations */}
            <section className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6">
              <h2 className="text-lg font-bold">Where to?</h2>

              <div className="mt-4 flex items-stretch gap-3">
                {/* Timeline */}
                <div className="flex flex-col items-center py-5">
                  <span className="h-3 w-3 rounded-full bg-gray-900" />
                  <span className="my-1 w-px flex-1 bg-gray-300" />
                  <span className="h-3 w-3 bg-orange-500" />
                </div>

                {/* Inputs */}
                <div className="min-w-0 flex-1 space-y-3">
                  <div>
                    <label htmlFor="pickup" className="sr-only">
                      Pickup location
                    </label>
                    <input
                      id="pickup"
                      value={pickup}
                      onChange={(e) => {
                        setPickup(e.target.value);
                        resetStatus();
                      }}
                      placeholder="Pickup location"
                      className="w-full rounded-xl bg-gray-100 px-4 py-3.5 text-base text-gray-900 outline-none ring-2 ring-transparent transition placeholder:text-gray-500 focus:bg-white focus:ring-orange-400"
                    />
                  </div>
                  <div>
                    <label htmlFor="destination" className="sr-only">
                      Destination
                    </label>
                    <input
                      id="destination"
                      value={destination}
                      onChange={(e) => {
                        setDestination(e.target.value);
                        resetStatus();
                      }}
                      placeholder="Where are you going?"
                      className="w-full rounded-xl bg-gray-100 px-4 py-3.5 text-base text-gray-900 outline-none ring-2 ring-transparent transition placeholder:text-gray-500 focus:bg-white focus:ring-orange-400"
                    />
                  </div>
                </div>

                {/* Swap */}
                <button
                  type="button"
                  onClick={swapLocations}
                  aria-label="Swap pickup and destination"
                  className="flex h-10 w-10 shrink-0 items-center justify-center self-center rounded-full border border-gray-200 text-gray-600 transition hover:border-orange-400 hover:text-orange-500"
                >
                  <FaArrowRightArrowLeft className="rotate-90" />
                </button>
              </div>

              {error && (
                <p role="alert" className="mt-3 text-sm font-medium text-red-600">
                  {error}
                </p>
              )}
            </section>

            {/* Ride options */}
            <section className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6">
              <h2 className="text-lg font-bold">Choose a ride</h2>
              <p className="mt-1 text-sm text-gray-500">
                Prices and arrival times are sample data.
              </p>

              <div className="mt-4 space-y-3">
                {rideOptions.map((ride) => {
                  const isSelected = selectedRide === ride.id;
                  return (
                    <button
                      key={ride.id}
                      type="button"
                      onClick={() => {
                        setSelectedRide(ride.id);
                        resetStatus();
                      }}
                      aria-pressed={isSelected}
                      className={`flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition ${
                        isSelected
                          ? "border-orange-500 bg-orange-50/50"
                          : "border-gray-100 hover:border-gray-300"
                      }`}
                    >
                      <span
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl ${
                          isSelected
                            ? "bg-orange-500 text-white"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {ride.icon}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="text-base font-semibold">
                            {ride.name}
                          </span>
                          {ride.popular && (
                            <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-semibold text-orange-600">
                              Popular
                            </span>
                          )}
                        </span>
                        <span className="mt-0.5 block text-sm text-gray-500">
                          {ride.description}
                        </span>
                        <span className="mt-1.5 flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1.5">
                            <FaUser className="text-[10px]" />
                            {ride.passengers} seats
                          </span>
                          <span className="flex items-center gap-1.5">
                            <FaClock className="text-[10px]" />
                            {ride.time} away
                          </span>
                        </span>
                      </span>

                      <span className="shrink-0 text-right">
                        <span className="block text-lg font-bold">
                          ₹{ride.price}
                        </span>
                        <span className="text-xs text-gray-400">estimated</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          {/* ---------- Right column ---------- */}
          <div className="space-y-6 lg:sticky lg:top-24">
            {/* Map preview */}
            <section
              className="relative h-52 overflow-hidden rounded-3xl border border-gray-200 bg-gray-100"
              aria-label="Route preview"
            >
              {/* Light grid */}
              <div
                className="absolute inset-0 opacity-70"
                style={{
                  backgroundImage:
                    "linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)",
                  backgroundSize: "36px 36px",
                }}
              />
              {/* Roads */}
              <div className="absolute -left-[10%] top-[52%] h-4 w-[120%] -rotate-12 bg-white" />
              <div className="absolute left-[55%] -top-[20%] h-[140%] w-4 rotate-[16deg] bg-white" />

              {/* Route */}
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 400 210"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M 80 60 Q 150 100 210 120 T 320 150"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="1 8"
                />
              </svg>

              {/* Pins */}
              <div className="absolute left-[16%] top-[20%] flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border-4 border-white bg-gray-900 shadow" />
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold shadow-sm">
                  Pickup
                </span>
              </div>
              <div className="absolute bottom-[18%] right-[12%] flex items-center gap-2">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold shadow-sm">
                  Destination
                </span>
                <span className="h-4 w-4 border-4 border-white bg-orange-500 shadow" />
              </div>
            </section>

            {/* Summary */}
            <section className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6">
              <h2 className="text-lg font-bold">Booking summary</h2>

              {/* Route */}
              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-3">
                  <FaLocationDot className="mt-1 shrink-0 text-gray-900" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-500">Pickup</p>
                    <p className="break-words text-sm font-semibold">
                      {pickup.trim() || "Not selected yet"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaLocationDot className="mt-1 shrink-0 text-orange-500" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-500">
                      Destination
                    </p>
                    <p className="break-words text-sm font-semibold">
                      {destination.trim() || "Not selected yet"}
                    </p>
                  </div>
                </div>
              </div>

              <hr className="my-5 border-gray-100" />

              {/* Selected ride */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-xl text-gray-700">
                    {selected.icon}
                  </span>
                  <div>
                    <p className="text-base font-semibold">{selected.name}</p>
                    <p className="text-xs text-gray-500">
                      {selected.passengers} seats · {selected.time} away
                    </p>
                  </div>
                </div>
                <span className="text-base font-bold">₹{selected.price}</span>
              </div>

              <div className="mt-5 space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Estimated fare</span>
                  <span className="font-medium text-gray-900">
                    ₹{selected.price}
                  </span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Booking fee</span>
                  <span className="font-medium text-green-600">Included</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3.5">
                <span className="text-base font-semibold">Total estimate</span>
                <span className="text-2xl font-bold text-orange-500">
                  ₹{selected.price}
                </span>
              </div>

              {/* Payment */}
              <p className="mb-2 mt-5 text-sm font-semibold">Payment method</p>
              <div className="grid grid-cols-2 gap-1 rounded-xl bg-gray-100 p-1">
                {[
                  { id: "cash", label: "Cash", icon: <FaMoneyBillWave /> },
                  { id: "online", label: "Online", icon: <FaCreditCard /> },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setPayment(p.id);
                      resetStatus();
                    }}
                    aria-pressed={payment === p.id}
                    className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition ${
                      payment === p.id
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    {p.icon}
                    {p.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleBookRide}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 py-4 text-base font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600 active:scale-[0.99]"
              >
                Confirm booking
                <FaArrowRight />
              </button>

              {rideRequested && (
                <div
                  role="status"
                  className="mt-4 rounded-2xl bg-green-50 p-4 text-green-800"
                >
                  <p className="flex items-center gap-2 text-sm font-semibold">
                    <FaCheck />
                    Booking confirmed (demo)
                  </p>
                  <p className="mt-1 text-sm">
                    {selected.name} · ₹{selected.price} ·{" "}
                    {payment === "cash" ? "Cash payment" : "Online payment"}
                  </p>
                  <p className="mt-1 text-xs text-green-700">
                    Demo only — no ride or payment was created.
                  </p>
                </div>
              )}

              <p className="mt-4 text-center text-xs text-gray-400">
                By confirming, you agree to GoRivo&apos;s ride booking terms.
              </p>
            </section>
          </div>
        </div>

        {/* Trust strip */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-gray-200 pt-6 text-sm text-gray-500">
          {trustItems.map((item) => (
            <span key={item.text} className="flex items-center gap-2">
              <span className="text-orange-500">{item.icon}</span>
              {item.text}
            </span>
          ))}
        </div>
      </main>
    </div>
  );
}

export default BookRide;