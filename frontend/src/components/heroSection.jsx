import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiNavigation, FiRepeat, FiClock, FiShield, FiArrowRight } from "react-icons/fi";
import { MdLocationOn } from "react-icons/md";
import HeroPNG from "../assits/GoRivo_Hero.png";

const HeroSection = () => {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [rideType, setRideType] = useState("now");
  const navigate = useNavigate();

  const handleSwapLocations = () => {
    setPickup(dropoff);
    setDropoff(pickup);
  };

  const handleSearchRide = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  const tabClass = (type) =>
    `flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-semibold transition cursor-pointer ${
      rideType === type
        ? "bg-white text-gray-900 shadow-sm"
        : "text-gray-500 hover:text-gray-800"
    }`;

  const inputBox =
    "flex items-center rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition focus-within:border-orange-500 focus-within:bg-white";

  return (
    <section className="bg-white pt-5 pb-12 lg:pt-8 lg:pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            {/* Upgraded Typography Heading */}
            <div className="space-y-3.5">
              <h1
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                className="text-4xl font-extrabold leading-[1.08] tracking-[-0.03em] text-gray-950 sm:text-5xl lg:text-[3.5rem]"
              >
                Go anywhere with{" "}
                <span className="relative inline-block text-orange-500">
                  GoRivo.
                  <span className="absolute -bottom-1 left-0 h-1.5 w-full rounded-full bg-orange-500/20" />
                </span>
              </h1>
              <p className="max-w-lg text-base leading-relaxed text-gray-600 sm:text-lg">
                Book a ride in a few taps and get picked up by a verified driver
                within minutes, anywhere in your city.
              </p>
            </div>

            {/* Ride Booking Card */}
            <div className="max-w-xl rounded-2xl border border-gray-100 bg-white p-5 shadow-lg sm:p-6">
              <div className="mb-5 flex w-fit items-center gap-1 rounded-xl bg-gray-100 p-1">
                <button
                  type="button"
                  onClick={() => setRideType("now")}
                  className={tabClass("now")}
                >
                  Ride Now
                </button>
                <button
                  type="button"
                  onClick={() => setRideType("schedule")}
                  className={tabClass("schedule")}
                >
                  <FiClock className="text-orange-500" />
                  Schedule
                </button>
              </div>

              <form onSubmit={handleSearchRide} className="space-y-3">
                <div className={inputBox}>
                  <span className="mr-3.5 h-3 w-3 shrink-0 rounded-full bg-orange-500 ring-4 ring-orange-100" />
                  <input
                    type="text"
                    required
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    placeholder="Enter pickup location"
                    className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none sm:text-base"
                  />
                  <button
                    type="button"
                    title="Use current location"
                    className="ml-2 text-gray-400 transition hover:text-orange-500 cursor-pointer"
                  >
                    <FiNavigation />
                  </button>
                </div>

                <div className="relative z-10 -my-1 flex justify-end pr-3">
                  <button
                    type="button"
                    onClick={handleSwapLocations}
                    title="Swap locations"
                    className="rounded-full border border-gray-200 bg-white p-2 text-gray-600 shadow-sm transition hover:border-orange-300 hover:text-orange-500 cursor-pointer"
                  >
                    <FiRepeat className="rotate-90" />
                  </button>
                </div>

                <div className={inputBox}>
                  <MdLocationOn className="mr-3 shrink-0 text-xl text-gray-800" />
                  <input
                    type="text"
                    required
                    value={dropoff}
                    onChange={(e) => setDropoff(e.target.value)}
                    placeholder="Enter destination"
                    className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none sm:text-base"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 font-semibold text-white transition hover:bg-orange-600 cursor-pointer"
                >
                  <span>See Prices & Rides</span>
                  <FiArrowRight className="text-lg" />
                </button>
              </form>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FiShield className="text-lg text-orange-500" />
              <span>Live trip tracking for every ride</span>
            </div>
          </div>

          <div>
            <img
              src={HeroPNG}
              alt="GoRivo ride illustration"
              className="mx-auto w-full max-w-xl object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;