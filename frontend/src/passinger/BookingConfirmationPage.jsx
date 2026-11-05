import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  FaCar,
  FaCarSide,
  FaCircleCheck,
  FaCircleExclamation,
  FaClock,
  FaCreditCard,
  FaLocationDot,
  FaMotorcycle,
  FaMoneyBillWave,
  FaPhone,
  FaRoute,
  FaStar,
  FaUser,
  FaVanShuttle,
} from "react-icons/fa6";
import Navbar from "../components/navbar";
import RouteMap from "../components/RouteMap";

const API = import.meta.env.VITE_API_URL;

// In status ke baad ride badalti nahi, to polling band
const finalStatuses = ["completed", "cancelled", "no_driver_found"];

// Ride type ki details (seats aur icon backend mein save nahi hote)
const rideTypes = {
  "go-bike": { name: "Go Bike", seats: 1, icon: <FaMotorcycle /> },
  "go-auto": { name: "Go Auto", seats: 3, icon: <FaCar /> },
  "go-mini": { name: "Go Mini", seats: 4, icon: <FaCar /> },
  "go-comfort": { name: "Go Comfort", seats: 4, icon: <FaCarSide /> },
  "go-xl": { name: "Go XL", seats: 6, icon: <FaVanShuttle /> },
  "go-premium": { name: "Go Premium", seats: 4, icon: <FaCarSide /> },
};

// Har status ka title, badge aur rang
const statusInfo = {
  searching: { title: "Finding your driver", badge: "Searching", tone: "orange" },
  accepted: { title: "Driver assigned", badge: "Accepted", tone: "green" },
  arriving: { title: "Driver is arriving", badge: "Arriving", tone: "green" },
  started: { title: "Ride in progress", badge: "Started", tone: "green" },
  completed: { title: "Ride completed", badge: "Completed", tone: "green" },
  cancelled: { title: "Ride cancelled", badge: "Cancelled", tone: "red" },
  no_driver_found: { title: "No driver found", badge: "No driver", tone: "red" },
};

const tones = {
  green: { badge: "bg-green-50 text-green-700", icon: "text-green-500" },
  orange: { badge: "bg-orange-50 text-orange-600", icon: "text-orange-500" },
  red: { badge: "bg-red-50 text-red-600", icon: "text-red-500" },
};

const paymentTone = {
  pending: "bg-orange-50 text-orange-600",
  processing: "bg-orange-50 text-orange-600",
  paid: "bg-green-50 text-green-700",
  failed: "bg-red-50 text-red-600",
  refunded: "bg-gray-100 text-gray-600",
};

/* ---------- Chhote helper components ---------- */

function Card({ title, children }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5">
      {title && <h2 className="mb-4 text-lg font-bold">{title}</h2>}
      {children}
    </section>
  );
}

// Value na ho to row dikhayenge hi nahi
function Row({ label, value }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex justify-between gap-4 py-2 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-right font-semibold">{value}</span>
    </div>
  );
}

function Skeleton({ className }) {
  return <div className={`animate-pulse rounded-xl bg-gray-200 ${className}`}></div>;
}

/* ---------- Page ---------- */

function BookingConfirmation() {
  const { rideId } = useParams();
  const location = useLocation();
  const otp = location.state?.otp; // sirf booking ke turant baad milta hai

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // { message, status }
  const [reloadKey, setReloadKey] = useState(0);
  const [route, setRoute] = useState([]);

  const [showCancel, setShowCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");

  const isFinal = finalStatuses.includes(booking?.status);

  // Ride ki details backend se lao, aur jab tak final na ho har 4 second mein refresh karo
  useEffect(() => {
    if (!rideId) {
      setLoading(false);
      return;
    }

    let stopped = false;

    const getRide = async () => {
      try {
        const res = await fetch(`${API}/api/ride/${rideId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const result = await res.json();

        if (!res.ok || !result.success) {
          const err = new Error(result.message || "Could not load this booking");
          err.status = res.status;
          throw err;
        }

        if (!stopped) {
          setBooking(result.data);
          setError(null);
        }
      } catch (err) {
        if (stopped) return;
        setError({
          status: err.status,
          message:
            err.message === "Failed to fetch"
              ? "Cannot reach the server. Please check your connection."
              : err.message,
        });
      } finally {
        if (!stopped) setLoading(false);
      }
    };

    getRide();
    if (isFinal) return () => (stopped = true);

    const timer = setInterval(getRide, 4000);
    return () => {
      stopped = true;
      clearInterval(timer);
    };
  }, [rideId, isFinal, reloadKey]);

  // Map ke liye route line (OSRM, free)
  const pLat = booking?.pickup?.lat;
  const pLng = booking?.pickup?.lng;
  const dLat = booking?.destination?.lat;
  const dLng = booking?.destination?.lng;

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

  const handleCancel = async () => {
    try {
      setCancelling(true);
      setCancelError("");

      const res = await fetch(`${API}/api/ride/${rideId}/cancel`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Could not cancel the ride");
      }

      // Sirf status badlo, driver ki populate ki hui details na jayein
      setBooking((prev) => ({
        ...prev,
        status: result.data.status,
        cancelledAt: result.data.cancelledAt,
      }));
      setShowCancel(false);
    } catch (err) {
      setCancelError(err.message);
    } finally {
      setCancelling(false);
    }
  };

  /* ---------- Ride ID missing ---------- */
  if (!rideId) {
    return (
      <Message
        title="Booking not found"
        text="We could not find a ride ID in this link."
        buttonText="Book a ride"
        to="/passenger/bookRide"
      />
    );
  }

  /* ---------- Loading ---------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="mx-auto max-w-5xl space-y-5 px-4 py-8">
          <Skeleton className="h-28" />
          <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
            <div className="space-y-5">
              <Skeleton className="h-44" />
              <Skeleton className="h-40" />
              <Skeleton className="h-36" />
            </div>
            <div className="space-y-5">
              <Skeleton className="h-56" />
              <Skeleton className="h-40" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  /* ---------- Error (pehli baar load nahi hua) ---------- */
  if (!booking) {
    const notLoggedIn = error?.status === 401;
    return (
      <Message
        title={notLoggedIn ? "Please login again" : "Could not load booking"}
        text={error?.message || "Something went wrong."}
        buttonText={notLoggedIn ? "Go to login" : "Try again"}
        to={notLoggedIn ? "/login" : undefined}
        onClick={() => {
          setLoading(true);
          setReloadKey((k) => k + 1);
        }}
      />
    );
  }

  /* ---------- Booking ka data ---------- */
  const status = booking.status;
  const info = statusInfo[status] || {
    title: status,
    badge: status,
    tone: "orange",
  };
  const tone = tones[info.tone];

  const type = rideTypes[booking.rideType] || {
    name: booking.rideType,
    seats: null,
    icon: <FaCar />,
  };

  // driver tabhi object hota hai jab backend ne populate kiya ho
  const driver =
    booking.driver && typeof booking.driver === "object" ? booking.driver : null;
  const vehicle = driver?.vehicle || {};
  const driverAssigned = ["accepted", "arriving", "started", "completed"].includes(
    status
  );

  const bookedAt = booking.createdAt
    ? new Date(booking.createdAt).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "";

  const payment = booking.payment || {};
  const StatusIcon =
    info.tone === "green"
      ? FaCircleCheck
      : info.tone === "red"
      ? FaCircleExclamation
      : FaClock;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      <main className="mx-auto max-w-5xl space-y-5 px-4 py-8 sm:px-6">
        {/* ---------- 1. Status ---------- */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <StatusIcon className={`mt-1 shrink-0 text-4xl ${tone.icon}`} />
            <div className="min-w-0 flex-1">
              {status !== "cancelled" && status !== "no_driver_found" && (
                <p className="text-sm font-semibold text-green-600">
                  Booking confirmed
                </p>
              )}
              <h1 className="text-2xl font-bold sm:text-3xl">{info.title}</h1>
              <p className="mt-1 text-sm text-gray-500">
                Booking ID #{booking.bookingId}
                {bookedAt && ` · ${bookedAt}`}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${tone.badge}`}
            >
              {info.badge}
            </span>
          </div>

          {error && (
            <p className="mt-4 rounded-lg bg-orange-50 px-3 py-2 text-sm text-orange-700">
              Could not refresh the latest status. Retrying...
            </p>
          )}
        </section>

        <div className="grid items-start gap-5 lg:grid-cols-[1fr_380px]">
          {/* ---------- Left ---------- */}
          <div className="space-y-5">
            {/* 2. Trip details */}
            <Card title="Trip details">
              <div className="flex gap-4">
                <div className="flex flex-col items-center py-1">
                  <span className="h-3 w-3 rounded-full bg-gray-900"></span>
                  <span className="my-1 w-px flex-1 bg-gray-300"></span>
                  <span className="h-3 w-3 bg-orange-500"></span>
                </div>

                <div className="min-w-0 flex-1 space-y-5">
                  <div>
                    <p className="text-xs text-gray-500">Pickup</p>
                    <p className="break-words font-semibold">
                      {booking.pickup?.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {Number(pLat).toFixed(4)}, {Number(pLng).toFixed(4)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Destination</p>
                    <p className="break-words font-semibold">
                      {booking.destination?.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {Number(dLat).toFixed(4)}, {Number(dLng).toFixed(4)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-4 text-sm text-gray-600">
                <FaRoute className="text-gray-400" />
                {Number(booking.distanceKm).toFixed(1)} km ·{" "}
                {booking.durationMin} min
              </div>
            </Card>

            {/* 3. Ride details */}
            <Card title="Ride details">
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-2xl text-orange-500">
                  {type.icon}
                </span>
                <div>
                  <p className="font-semibold">{type.name}</p>
                  {type.seats && (
                    <p className="flex items-center gap-1.5 text-sm text-gray-500">
                      <FaUser className="text-xs" />
                      {type.seats} {type.seats === 1 ? "seat" : "seats"}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-3 divide-y divide-gray-100 border-t border-gray-100">
                <Row
                  label="Distance"
                  value={`${Number(booking.distanceKm).toFixed(1)} km`}
                />
                <Row label="Duration" value={`${booking.durationMin} minutes`} />
                <Row label="Fare" value={`₹${booking.fare}`} />
                {driverAssigned &&
                  (vehicle.name || vehicle.model) && (
                    <Row
                      label="Vehicle"
                      value={[vehicle.name, vehicle.model]
                        .filter(Boolean)
                        .join(" ")}
                    />
                  )}
              </div>
            </Card>

            {/* 4. Driver */}
            {status !== "cancelled" && (
              <Card title="Your driver">
                {status === "searching" && (
                  <div className="flex items-center gap-4">
                    <span className="h-10 w-10 shrink-0 animate-spin rounded-full border-4 border-orange-100 border-t-orange-500"></span>
                    <div>
                      <p className="font-semibold">Finding nearby drivers...</p>
                      <p className="text-sm text-gray-500">
                        We will show your driver here as soon as one accepts.
                      </p>
                    </div>
                  </div>
                )}

                {status === "no_driver_found" && (
                  <p className="text-sm text-gray-500">
                    No driver accepted this ride. Please book again in a few
                    minutes.
                  </p>
                )}

                {driverAssigned && !driver && (
                  <p className="text-sm text-gray-500">
                    A driver has been assigned. Details will appear shortly.
                  </p>
                )}

                {driverAssigned && driver && (
                  <div>
                    <div className="flex items-center gap-4">
                      {driver.profilePhoto || driver.photo ? (
                        <img
                          src={driver.profilePhoto || driver.photo}
                          alt={driver.name}
                          className="h-14 w-14 shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-orange-500 text-lg font-bold text-white">
                          {driver.name?.[0]?.toUpperCase() || <FaUser />}
                        </span>
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">{driver.name}</p>
                        {driver.rating && (
                          <p className="flex items-center gap-1 text-sm text-gray-500">
                            <FaStar className="text-xs text-orange-500" />
                            {driver.rating}
                          </p>
                        )}
                      </div>

                      {driver.phone && (
                        <a
                          href={`tel:${driver.phone}`}
                          className="flex shrink-0 items-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold hover:bg-gray-200"
                        >
                          <FaPhone /> Call
                        </a>
                      )}
                    </div>

                    <div className="mt-3 divide-y divide-gray-100 border-t border-gray-100">
                      <Row label="Vehicle" value={vehicle.name} />
                      <Row label="Model" value={vehicle.model} />
                      <Row label="Color" value={vehicle.color} />
                      <Row
                        label="Vehicle number"
                        value={vehicle.number || vehicle.plate}
                      />
                    </div>

                    {otp && (status === "accepted" || status === "arriving") && (
                      <div className="mt-4 flex items-center justify-between rounded-xl bg-gray-900 px-4 py-3 text-white">
                        <span className="text-sm text-gray-300">
                          Share PIN with driver
                        </span>
                        <span className="text-xl font-bold tracking-widest">
                          {otp}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            )}
          </div>

          {/* ---------- Right ---------- */}
          <div className="space-y-5">
            {/* Map */}
            <section className="relative z-0 h-64 overflow-hidden rounded-2xl border border-gray-200 sm:h-72">
              <RouteMap
                pickup={booking.pickup}
                destination={booking.destination}
                route={route}
              />
            </section>

            {/* 5. Payment */}
            <Card title="Payment summary">
              <div className="divide-y divide-gray-100">
                <Row label="Ride fare" value={`₹${booking.fare}`} />

                <div className="flex items-center justify-between py-2 text-sm">
                  <span className="text-gray-500">Payment method</span>
                  <span className="flex items-center gap-2 font-semibold">
                    {payment.method === "online" ? (
                      <FaCreditCard />
                    ) : (
                      <FaMoneyBillWave />
                    )}
                    {payment.method === "online" ? "Online" : "Cash"}
                  </span>
                </div>

                {payment.status && (
                  <div className="flex items-center justify-between py-2 text-sm">
                    <span className="text-gray-500">Payment status</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                        paymentTone[payment.status] || "bg-gray-100"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </div>
                )}

                <Row label="Transaction ID" value={payment.transactionId} />
              </div>

              <div className="mt-3 flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                <span className="font-semibold">Total amount</span>
                <span className="text-2xl font-bold text-orange-500">
                  ₹{booking.fare}
                </span>
              </div>
            </Card>

            {/* 6. Actions */}
            <section className="space-y-3">
              {(status === "accepted" || status === "arriving") && (
                <TrackLink booking={booking} type={type} otp={otp}>
                  Track ride
                </TrackLink>
              )}

              {status === "started" && (
                <TrackLink booking={booking} type={type} otp={otp}>
                  Track live ride
                </TrackLink>
              )}

              {status === "completed" && (
                <Link
                  to="/passenger/rideHistory"
                  className="block rounded-xl bg-orange-500 py-3 text-center font-semibold text-white hover:bg-orange-600"
                >
                  View ride details
                </Link>
              )}

              {(status === "cancelled" || status === "no_driver_found") && (
                <Link
                  to="/passenger/bookRide"
                  className="block rounded-xl bg-orange-500 py-3 text-center font-semibold text-white hover:bg-orange-600"
                >
                  Book another ride
                </Link>
              )}

              {["searching", "accepted", "arriving"].includes(status) &&
                (showCancel ? (
                  <div className="rounded-xl border border-red-200 bg-white p-4">
                    <p className="text-center font-semibold">Cancel this ride?</p>
                    {cancelError && (
                      <p className="mt-2 text-center text-sm text-red-600">
                        {cancelError}
                      </p>
                    )}
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setShowCancel(false)}
                        className="rounded-lg bg-gray-100 py-2 font-semibold"
                      >
                        No
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={cancelling}
                        className="rounded-lg bg-red-600 py-2 font-semibold text-white disabled:opacity-60"
                      >
                        {cancelling ? "Cancelling..." : "Yes, cancel"}
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
                ))}

              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/"
                  className="rounded-xl border border-gray-300 bg-white py-3 text-center text-sm font-semibold hover:border-gray-900"
                >
                  Back to home
                </Link>
                <Link
                  to="/passenger/rideHistory"
                  className="rounded-xl border border-gray-300 bg-white py-3 text-center text-sm font-semibold hover:border-gray-900"
                >
                  My rides
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

// Tracking page ko abhi tak ride ka data state se chahiye
function TrackLink({ booking, type, otp, children }) {
  return (
    <Link
      to="/passenger/liveRideTrack"
      state={{
        rideId: booking._id,
        bookingId: booking.bookingId,
        pickup: booking.pickup?.name,
        destination: booking.destination?.name,
        ride: { name: type.name, price: booking.fare },
        payment: booking.payment?.method,
        otp,
      }}
      className="block rounded-xl bg-orange-500 py-3 text-center font-semibold text-white hover:bg-orange-600"
    >
      {children}
    </Link>
  );
}

// Error / missing ID wali full page screen
function Message({ title, text, buttonText, to, onClick }) {
  const className =
    "mt-6 inline-block rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-md px-4 py-16 text-center">
        <FaCircleExclamation className="mx-auto text-5xl text-red-500" />
        <h1 className="mt-4 text-2xl font-bold">{title}</h1>
        <p className="mt-2 text-gray-500">{text}</p>
        {to ? (
          <Link to={to} className={className}>
            {buttonText}
          </Link>
        ) : (
          <button onClick={onClick} className={className}>
            {buttonText}
          </button>
        )}
      </main>
    </div>
  );
}

export default BookingConfirmation;