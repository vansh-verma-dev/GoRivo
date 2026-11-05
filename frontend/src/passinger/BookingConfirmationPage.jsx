import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaCircleCheck, FaStar } from "react-icons/fa6";
import Navbar from "../components/navbar";
import TripRoute from "../components/tripForm";
import { driver } from "../passinger/rider";

function BookingConfirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // BookRide page se data aata hai, na aaye to ye default values dikhengi
  const pickup = state?.pickup || "Sector 12 Market";
  const destination = state?.destination || "City Railway Station";
  const ride = state?.ride || { name: "Go Comfort", time: "5 min", price: 219 };
  const payment = state?.payment || "cash";

  const [bookingId] = useState(
    () => "GR" + Math.floor(100000 + Math.random() * 900000)
  );
  const [otp] = useState(() => String(Math.floor(1000 + Math.random() * 9000)));
  const [searching, setSearching] = useState(true);
  const [showCancel, setShowCancel] = useState(false);

  // 3 second baad driver mil jata hai (fake, backend aane tak)
  useEffect(() => {
    const timer = setTimeout(() => setSearching(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-10">
        <div className="text-center">
          <FaCircleCheck className="mx-auto text-6xl text-green-500" />
          <h1 className="mt-4 text-3xl font-bold">Booking confirmed</h1>
          <p className="mt-1 text-gray-500">Booking ID #{bookingId}</p>
        </div>

        {/* Driver */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5">
          {searching ? (
            <div className="flex items-center gap-4">
              <span className="h-10 w-10 animate-spin rounded-full border-4 border-orange-100 border-t-orange-500"></span>
              <div>
                <h2 className="font-bold">Finding your driver...</h2>
                <p className="text-sm text-gray-500">Please wait a moment</p>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-green-600">
                    Driver assigned
                  </p>
                  <h2 className="text-lg font-bold">Arriving in {ride.time}</h2>
                </div>
                <div className="rounded-xl bg-gray-900 px-4 py-2 text-center text-white">
                  <p className="text-xs text-gray-400">Ride PIN</p>
                  <p className="text-xl font-bold tracking-widest">{otp}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{driver.name}</p>
                  <p className="flex items-center gap-1 text-sm text-gray-500">
                    <FaStar className="text-orange-500" />
                    {driver.rating} · {driver.trips} trips
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{driver.plate}</p>
                  <p className="text-sm text-gray-500">{driver.car}</p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Trip */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-lg font-bold">Trip details</h2>
          <TripRoute pickup={pickup} destination={destination} />
          <p className="mt-4 border-t border-gray-100 pt-4 text-sm text-gray-500">
            {ride.name}
          </p>
        </section>

        {/* Payment */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5">
          <h2 className="text-lg font-bold">Payment</h2>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-gray-500">
              {payment === "online" ? "Paying online" : "Cash to driver"}
            </span>
            <span className="text-2xl font-bold text-orange-500">
              ₹{ride.price}
            </span>
          </div>
        </section>

        {/* Buttons */}
        {!searching && (
          <Link
            to="/passenger/liveRideTrack"
            state={{ bookingId, pickup, destination, ride, payment, otp }}
            className="block rounded-xl bg-orange-500 py-3 text-center font-semibold text-white hover:bg-orange-600"
          >
            Track ride
          </Link>
        )}

        {showCancel ? (
          <div className="rounded-xl border border-red-200 bg-white p-4">
            <p className="text-center font-semibold">Cancel this ride?</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowCancel(false)}
                className="rounded-lg bg-gray-100 py-2 font-semibold"
              >
                No
              </button>
              <button
                onClick={() => navigate("/passenger/bookRide")}
                className="rounded-lg bg-red-600 py-2 font-semibold text-white"
              >
                Yes, cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowCancel(true)}
            className="w-full rounded-xl bg-gray-100 py-3 font-semibold text-red-600 hover:bg-red-50"
          >
            Cancel ride
          </button>
        )}
      </main>
    </div>
  );
}

export default BookingConfirmation;