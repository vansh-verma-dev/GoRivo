import { useState } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiEdit2,
  FiCheck,
  FiStar,
  FiShield,
  FiClock,
  FiTrendingUp,
  FiCheckCircle,
} from "react-icons/fi";
import { FaCarSide } from "react-icons/fa";
import { MdVerified } from "react-icons/md";

const DriverProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  const [driver, setDriver] = useState({
    name: "Rohit Sharma",
    email: "rohit.captain@gorivo.in",
    phone: "+91 98112 34567",
    city: "Meerut, Uttar Pradesh",
    rating: "4.92",
    totalTrips: 318,
    todayEarnings: 1240,
    totalBalance: 6850,
    memberSince: "Aug 2026",
    vehicleType: "GoRivo Mini (Swift Dzire)",
    vehicleNumber: "UP 15 DT 4821",
    licenseNumber: "UP15-20210048912",
  });

  const recentTrips = [
    {
      id: "TRP-4102",
      date: "Today, 06:15 PM",
      from: "Begum Bridge, Meerut",
      to: "Modipuram Bypass",
      earning: "+₹165",
      distance: "9.4 km",
    },
    {
      id: "TRP-4098",
      date: "Today, 04:10 PM",
      from: "Meerut Cantt Station",
      to: "Shastri Nagar Sector 3",
      earning: "+₹120",
      distance: "6.2 km",
    },
    {
      id: "TRP-4091",
      date: "Today, 01:45 PM",
      from: "PVR Mall, Garh Road",
      to: "Partapur Industrial Area",
      earning: "+₹210",
      distance: "12.8 km",
    },
  ];

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsEditing(false);
    // Yahan backend API (PUT /api/driver/profile) call kar sakte hain
  };

  const inputClass = (editable) =>
    `w-full rounded-xl border px-4 py-2.5 text-sm transition focus:outline-none ${
      editable
        ? "border-orange-300 bg-white text-gray-900 focus:border-orange-500"
        : "border-gray-100 bg-gray-50 text-gray-700 cursor-default"
    }`;

  return (
    <section className="min-h-screen bg-gray-50/70 py-8 lg:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Page Header + Online/Offline Switch */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl"
            >
              Captain <span className="text-orange-500">Profile</span>
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your captain details, vehicle info, and daily earnings.
            </p>
          </div>

          {/* Duty Status Toggle */}
          <button
            type="button"
            onClick={() => setIsOnline(!isOnline)}
            className={`inline-flex w-fit items-center gap-2.5 rounded-full border px-4 py-2 text-sm font-bold transition cursor-pointer ${
              isOnline
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-gray-200 bg-white text-gray-600"
            }`}
          >
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                isOnline ? "bg-green-500 animate-pulse" : "bg-gray-400"
              }`}
            />
            <span>{isOnline ? "Online • Accepting Rides" : "Offline"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Captain Card, Earnings & Vehicle Info */}
          <div className="space-y-6 lg:col-span-4">
            {/* Avatar & Stats Card */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
              <div className="relative mx-auto mb-4 h-24 w-24">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-orange-100 text-3xl font-extrabold text-orange-600 ring-4 ring-orange-50">
                  {driver.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>
                <span
                  title="Verified Captain"
                  className="absolute bottom-0 right-0 rounded-full bg-white p-0.5 text-orange-500 shadow"
                >
                  <MdVerified className="text-2xl" />
                </span>
              </div>

              <h2 className="text-xl font-bold text-gray-900">{driver.name}</h2>
              <p className="text-sm text-gray-500">{driver.phone}</p>

              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                <FiShield />
                <span>Verified Captain • Since {driver.memberSince}</span>
              </div>

              {/* Stats Row */}
              <div className="mt-6 grid grid-cols-2 gap-3 border-t border-gray-100 pt-5">
                <div className="rounded-xl bg-gray-50 p-3">
                  <div className="flex items-center justify-center gap-1 text-lg font-extrabold text-gray-900">
                    <span>{driver.rating}</span>
                    <FiStar className="fill-orange-500 text-base text-orange-500" />
                  </div>
                  <p className="text-xs text-gray-500">Captain Rating</p>
                </div>

                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-lg font-extrabold text-gray-900">
                    {driver.totalTrips}
                  </p>
                  <p className="text-xs text-gray-500">Trips Done</p>
                </div>
              </div>
            </div>

            {/* Captain Earnings Card */}
            <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-white shadow-md shadow-orange-500/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-100">
                  Captain Earnings
                </span>
                <FiTrendingUp className="text-xl text-orange-100" />
              </div>

              <div className="mt-3 flex items-end justify-between border-b border-white/15 pb-4">
                <div>
                  <p className="text-xs text-orange-100">Withdrawable Balance</p>
                  <p className="text-3xl font-extrabold">₹{driver.totalBalance}</p>
                </div>
                <button
                  type="button"
                  className="rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-orange-600 transition hover:bg-orange-50 cursor-pointer"
                >
                  Withdraw
                </button>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-orange-100">
                <span>Today&apos;s Earnings</span>
                <span className="text-sm font-bold text-white">
                  ₹{driver.todayEarnings}
                </span>
              </div>
            </div>

            {/* Vehicle & Document Badge Card */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-xl text-orange-500">
                  <FaCarSide />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {driver.vehicleType}
                  </p>
                  <p className="text-xs font-semibold text-orange-600">
                    {driver.vehicleNumber}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs">
                <span className="text-gray-500">DL & RC Verification</span>
                <span className="inline-flex items-center gap-1 font-semibold text-green-600">
                  <FiCheckCircle /> Approved
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Personal & Vehicle Info + Recent Completed Trips */}
          <div className="space-y-6 lg:col-span-8">
            {/* Personal & Vehicle Information Form */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  Personal & Vehicle Information
                </h3>

                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-orange-50 px-3.5 py-2 text-xs font-semibold text-orange-600 transition hover:bg-orange-100 cursor-pointer"
                  >
                    <FiEdit2 />
                    <span>Edit Details</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-orange-600 cursor-pointer"
                  >
                    <FiCheck />
                    <span>Save Changes</span>
                  </button>
                )}
              </div>

              <form
                onSubmit={handleSaveProfile}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2"
              >
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                    <FiUser className="text-orange-500" /> Full Name
                  </label>
                  <input
                    type="text"
                    readOnly={!isEditing}
                    value={driver.name}
                    onChange={(e) =>
                      setDriver({ ...driver, name: e.target.value })
                    }
                    className={inputClass(isEditing)}
                  />
                </div>

                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                    <FiPhone className="text-orange-500" /> Phone Number
                  </label>
                  <input
                    type="text"
                    readOnly={!isEditing}
                    value={driver.phone}
                    onChange={(e) =>
                      setDriver({ ...driver, phone: e.target.value })
                    }
                    className={inputClass(isEditing)}
                  />
                </div>

                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                    <FiMail className="text-orange-500" /> Email Address
                  </label>
                  <input
                    type="email"
                    readOnly={!isEditing}
                    value={driver.email}
                    onChange={(e) =>
                      setDriver({ ...driver, email: e.target.value })
                    }
                    className={inputClass(isEditing)}
                  />
                </div>

                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                    <FiMapPin className="text-orange-500" /> Operating City
                  </label>
                  <input
                    type="text"
                    readOnly={!isEditing}
                    value={driver.city}
                    onChange={(e) =>
                      setDriver({ ...driver, city: e.target.value })
                    }
                    className={inputClass(isEditing)}
                  />
                </div>

                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                    <FaCarSide className="text-orange-500" /> Vehicle Model
                  </label>
                  <input
                    type="text"
                    readOnly={!isEditing}
                    value={driver.vehicleType}
                    onChange={(e) =>
                      setDriver({ ...driver, vehicleType: e.target.value })
                    }
                    className={inputClass(isEditing)}
                  />
                </div>

                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                    <FiShield className="text-orange-500" /> Vehicle Plate Number
                  </label>
                  <input
                    type="text"
                    readOnly={!isEditing}
                    value={driver.vehicleNumber}
                    onChange={(e) =>
                      setDriver({ ...driver, vehicleNumber: e.target.value })
                    }
                    className={inputClass(isEditing)}
                  />
                </div>
              </form>
            </div>

            {/* Recent Completed Trips */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  Recent Completed Trips
                </h3>
                <span className="text-xs font-semibold text-orange-500">
                  Today&apos;s Log
                </span>
              </div>

              <div className="space-y-3">
                {recentTrips.map((trip) => (
                  <div
                    key={trip.id}
                    className="flex flex-col justify-between gap-3 rounded-xl border border-gray-100 p-4 transition hover:border-orange-200 sm:flex-row sm:items-center"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="font-semibold text-gray-600">
                          {trip.id}
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1">
                          <FiClock className="text-orange-500" />
                          {trip.date}
                        </span>
                      </div>

                      <p className="text-sm font-bold text-gray-900">
                        {trip.from}{" "}
                        <span className="mx-1 text-orange-500">→</span>{" "}
                        {trip.to}
                      </p>
                      <p className="text-xs text-gray-500">
                        Distance: {trip.distance}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:gap-1">
                      <span className="text-base font-extrabold text-green-600">
                        {trip.earning}
                      </span>
                      <span className="rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-semibold text-orange-600">
                        Paid
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DriverProfile;