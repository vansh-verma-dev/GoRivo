import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaArrowRightArrowLeft,
  FaCar,
  FaCarSide,
  FaClock,
  FaCreditCard,
  FaLocationCrosshairs,
  FaLocationDot,
  FaMoneyBillWave,
  FaUser,
  FaVanShuttle,
} from "react-icons/fa6";
import Navbar from "../components/navbar";
import RouteMap from "../components/RouteMap";
import LocationInput from "../components/LocationInput";

const rideOptions = [
  {
    id: "go-mini",
    name: "Go Mini",
    description: "Affordable everyday rides",
    passengers: 4,
    time: "3 min",
    base: 40,
    perKm: 12,
    icon: <FaCar />,
  },
  {
    id: "go-comfort",
    name: "Go Comfort",
    description: "Extra comfort for your trip",
    passengers: 4,
    time: "5 min",
    base: 60,
    perKm: 16,
    icon: <FaCarSide />,
    popular: true,
  },
  {
    id: "go-xl",
    name: "Go XL",
    description: "More space for everyone",
    passengers: 6,
    time: "7 min",
    base: 90,
    perKm: 22,
    icon: <FaVanShuttle />,
  },
];

function BookRide() {
  const navigate = useNavigate();

  // input ka text
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");

  // suggestion se select hui jagah (name, lat, lng)
  const [pickupPoint, setPickupPoint] = useState(null);
  const [destinationPoint, setDestinationPoint] = useState(null);

  // route ki info
  const [route, setRoute] = useState([]);
  const [distanceKm, setDistanceKm] = useState(0);
  const [durationMin, setDurationMin] = useState(0);

  const [selectedRide, setSelectedRide] = useState("go-comfort");
  const [payment, setPayment] = useState("cash");
  const [error, setError] = useState("");
  const [isBooking, setIsBooking] = useState(false);

  const selected = rideOptions.find((ride) => ride.id === selectedRide);

  // fare = base + per km * distance
  const getPrice = (ride) =>
    distanceKm ? Math.round(ride.base + ride.perKm * distanceKm) : ride.base;

  // Pickup aur destination dono aane par route nikalo (OSRM, free)
  useEffect(() => {
    if (!pickupPoint || !destinationPoint) {
      setRoute([]);
      setDistanceKm(0);
      setDurationMin(0);
      return;
    }

    const controller = new AbortController();

    fetch(
      `https://router.project-osrm.org/route/v1/driving/${pickupPoint.lng},${pickupPoint.lat};${destinationPoint.lng},${destinationPoint.lat}?overview=full&geometries=geojson`,
      { signal: controller.signal }
    )
      .then((res) => res.json())
      .then((data) => {
        const r = data.routes?.[0];
        if (!r) return;
        // GeoJSON [lng, lat] deta hai, Leaflet ko [lat, lng] chahiye
        setRoute(r.geometry.coordinates.map(([lng, lat]) => [lat, lng]));
        setDistanceKm(r.distance / 1000);
        setDurationMin(Math.round(r.duration / 60));
      })
      .catch(() => {});

    return () => controller.abort();
  }, [pickupPoint, destinationPoint]);

  const swapLocations = () => {
    setPickup(destination);
    setDestination(pickup);
    setPickupPoint(destinationPoint);
    setDestinationPoint(pickupPoint);
    setError("");
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setError("Location is not supported in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`
          );
          const data = await res.json();
          setPickup(data.display_name);
          setPickupPoint({
            name: data.display_name,
            lat: coords.latitude,
            lng: coords.longitude,
          });
          setError("");
        } catch {
          setError("Could not get your address. Try typing it.");
        }
      },
      () => setError("Location permission denied.")
    );
  };

  const handleBookRide = async () => {
    if (!pickupPoint || !destinationPoint) {
      setError("Please select pickup and destination from the suggestions.");
      return;
    }

    if (!distanceKm || !durationMin) {
      setError("Please wait until route details are calculated.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login to book a ride.");
      return;
    }

  
    const bookingData = {
      pickup: pickupPoint,
      destination: destinationPoint,
      rideType: selected.id,
      distanceKm,
      durationMin,
      fare: getPrice(selected),
      payment ,
    };
    console.log("Sending to backend:", bookingData);

    try {
      setIsBooking(true);
      setError("");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ride`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();
      console.log("Backend response:", result);

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to create booking");
      }

      const booking = result.data;

      navigate(`/passenger/BookConform/${booking._id}`, {
        state: { otp: booking.otp },
      });
    } catch (err) {
      console.error("Ride booking error:", err);

      
      if (err.message === "Failed to fetch") {
        setError("Cannot reach the server. Check that the backend is running.");
      } else {
        setError(err.message || "Something went wrong.");
      }
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold sm:text-4xl">
            Book your <span className="text-orange-500">ride</span>
          </h1>
          <p className="mt-2 text-gray-500">
            Wherever life takes you, get there comfortably and on time.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_400px] lg:gap-8">
          {/* ---------- Left ---------- */}
          <div className="space-y-6">
            {/* Locations */}
            <section className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6">
              <h2 className="text-lg font-bold">Where to?</h2>

              <div className="mt-4 flex items-stretch gap-3">
                <div className="flex flex-col items-center py-5">
                  <span className="h-3 w-3 rounded-full bg-gray-900"></span>
                  <span className="my-1 w-px flex-1 bg-gray-300"></span>
                  <span className="h-3 w-3 bg-orange-500"></span>
                </div>

                <div className="min-w-0 flex-1 space-y-3">
                  <div>
                    <LocationInput
                      id="pickup"
                      value={pickup}
                      onChange={(v) => {
                        setPickup(v);
                        setPickupPoint(null);
                        setError("");
                      }}
                      onSelect={(p) => {
                        setPickup(p.name);
                        setPickupPoint(p);
                        setError("");
                      }}
                      placeholder="Pickup location"
                    />
                    <button
                      type="button"
                      onClick={useMyLocation}
                      className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-orange-500 hover:underline"
                    >
                      <FaLocationCrosshairs />
                      Use my current location
                    </button>
                  </div>

                  <LocationInput
                    id="destination"
                    value={destination}
                    onChange={(v) => {
                      setDestination(v);
                      setDestinationPoint(null);
                      setError("");
                    }}
                    onSelect={(p) => {
                      setDestination(p.name);
                      setDestinationPoint(p);
                      setError("");
                    }}
                    placeholder="Where are you going?"
                  />
                </div>

                <button
                  type="button"
                  onClick={swapLocations}
                  className="flex h-10 w-10 shrink-0 items-center justify-center self-center rounded-full border border-gray-200 text-gray-600 hover:border-orange-400 hover:text-orange-500"
                >
                  <FaArrowRightArrowLeft className="rotate-90" />
                </button>
              </div>

              {error && (
                <p className="mt-3 text-sm font-medium text-red-600">{error}</p>
              )}
            </section>

            {/* Ride options */}
            <section className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6">
              <h2 className="text-lg font-bold">Choose a ride</h2>
              <p className="mt-1 text-sm text-gray-500">
                {distanceKm
                  ? "Fare is calculated from your route distance."
                  : "Select pickup and destination to see exact fare."}
              </p>

              <div className="mt-4 space-y-3">
                {rideOptions.map((ride) => {
                  const isSelected = selectedRide === ride.id;
                  return (
                    <button
                      key={ride.id}
                      type="button"
                      onClick={() => setSelectedRide(ride.id)}
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
                          <span className="font-semibold">{ride.name}</span>
                          {ride.popular && (
                            <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-600">
                              Popular
                            </span>
                          )}
                        </span>
                        <span className="block text-sm text-gray-500">
                          {ride.description}
                        </span>
                        <span className="mt-1 flex items-center gap-4 text-xs text-gray-500">
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
                          ₹{getPrice(ride)}
                        </span>
                        <span className="text-xs text-gray-400">estimated</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          {/* ---------- Right ---------- */}
          <div className="space-y-6 lg:sticky lg:top-24">
            {/* Map */}
            <section className="relative z-0 h-64 overflow-hidden rounded-3xl border border-gray-200 sm:h-72">
              <RouteMap
                pickup={pickupPoint}
                destination={destinationPoint}
                route={route}
              />
            </section>

            {/* Summary */}
            <section className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6">
              <h2 className="text-lg font-bold">Booking summary</h2>

              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-3">
                  <FaLocationDot className="mt-1 shrink-0 text-gray-900" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Pickup</p>
                    <p className="break-words text-sm font-semibold">
                      {pickup.trim() || "Not selected yet"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaLocationDot className="mt-1 shrink-0 text-orange-500" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Destination</p>
                    <p className="break-words text-sm font-semibold">
                      {destination.trim() || "Not selected yet"}
                    </p>
                  </div>
                </div>
              </div>

              {distanceKm > 0 && (
                <p className="mt-3 text-sm text-gray-500">
                  {distanceKm.toFixed(1)} km · about {durationMin} min
                </p>
              )}

              <hr className="my-5 border-gray-100" />

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-xl text-gray-700">
                    {selected.icon}
                  </span>
                  <div>
                    <p className="font-semibold">{selected.name}</p>
                    <p className="text-xs text-gray-500">
                      {selected.passengers} seats · {selected.time} away
                    </p>
                  </div>
                </div>
                <span className="font-bold">₹{getPrice(selected)}</span>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3.5">
                <span className="font-semibold">Total estimate</span>
                <span className="text-2xl font-bold text-orange-500">
                  ₹{getPrice(selected)}
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
                    onClick={() => setPayment(p.id)}
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
                disabled={isBooking}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 py-4 font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isBooking ? "Creating booking..." : "Confirm booking"}
                {!isBooking && <FaArrowRight />}
              </button>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default BookRide;