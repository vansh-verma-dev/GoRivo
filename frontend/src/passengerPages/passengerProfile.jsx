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
  FiPlus,
  FiCreditCard,
} from "react-icons/fi";
import { MdVerified } from "react-icons/md";

const PassengerProfile = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [user, setUser] = useState({
    name: "Vansh Verma",
    email: "vansh.verma@gmail.com",
    phone: "+91 98765 43210",
    city: "Meerut, Uttar Pradesh",
    rating: "4.9",
    totalRides: 42,
    walletBalance: 350,
    memberSince: "Sep 2026",
  });

  const recentRides = [
    {
      id: "GR-8921",
      date: "22 Nov, 05:30 PM",
      from: "Shastri Nagar, Meerut",
      to: "Begum Bridge Market",
      vehicle: "GoRivo Mini",
      fare: "₹115",
      status: "Completed",
    },
    {
      id: "GR-8874",
      date: "19 Nov, 09:15 AM",
      from: "Partapur Bypass",
      to: "Meerut Cantt Railway Station",
      vehicle: "GoRivo Auto",
      fare: "₹85",
      status: "Completed",
    },
    {
      id: "GR-8810",
      date: "15 Nov, 07:45 PM",
      from: "PVR Mall, Garh Road",
      to: "Shastri Nagar, Meerut",
      vehicle: "GoRivo Moto",
      fare: "₹45",
      status: "Completed",
    },
  ];

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsEditing(false);
    // Yahan backend API (PUT /api/user/profile) call kar sakte hain
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
        {/* Page Header */}
        <div className="mb-8">
          <h1
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl"
          >
            My <span className="text-orange-500">Profile</span>
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your personal details, wallet, and GoRivo rides.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Profile Summary Card & Wallet */}
          <div className="space-y-6 lg:col-span-4">
            {/* Avatar & Quick Stats Card */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
              <div className="relative mx-auto mb-4 h-24 w-24">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-orange-100 text-3xl font-extrabold text-orange-600 ring-4 ring-orange-50">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>
                <span
                  title="Verified Rider"
                  className="absolute bottom-0 right-0 rounded-full bg-white p-0.5 text-orange-500 shadow"
                >
                  <MdVerified className="text-2xl" />
                </span>
              </div>

              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.phone}</p>

              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                <FiShield />
                <span>Verified GoRivo Rider • Since {user.memberSince}</span>
              </div>

              {/* Stats Row */}
              <div className="mt-6 grid grid-cols-2 gap-3 border-t border-gray-100 pt-5">
                <div className="rounded-xl bg-gray-50 p-3">
                  <div className="flex items-center justify-center gap-1 text-lg font-extrabold text-gray-900">
                    <span>{user.rating}</span>
                    <FiStar className="fill-orange-500 text-base text-orange-500" />
                  </div>
                  <p className="text-xs text-gray-500">Rider Rating</p>
                </div>

                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-lg font-extrabold text-gray-900">
                    {user.totalRides}
                  </p>
                  <p className="text-xs text-gray-500">Total Rides</p>
                </div>
              </div>
            </div>

            {/* GoRivo Wallet Card */}
            <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-white shadow-md shadow-orange-500/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-100">
                  GoRivo Wallet
                </span>
                <FiCreditCard className="text-xl text-orange-100" />
              </div>

              <div className="mt-3 flex items-baseline justify-between">
                <div>
                  <p className="text-3xl font-extrabold">₹{user.walletBalance}</p>
                  <p className="mt-0.5 text-xs text-orange-100">
                    Available for instant ride payments
                  </p>
                </div>

                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-orange-600 transition hover:bg-orange-50 cursor-pointer"
                >
                  <FiPlus />
                  <span>Add Money</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Personal Info & Recent Rides */}
          <div className="space-y-6 lg:col-span-8">
            {/* Personal Information Form */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  Personal Information
                </h3>

                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-orange-50 px-3.5 py-2 text-xs font-semibold text-orange-600 transition hover:bg-orange-100 cursor-pointer"
                  >
                    <FiEdit2 />
                    <span>Edit Profile</span>
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
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
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
                    value={user.phone}
                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
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
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    className={inputClass(isEditing)}
                  />
                </div>

                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                    <FiMapPin className="text-orange-500" /> City
                  </label>
                  <input
                    type="text"
                    readOnly={!isEditing}
                    value={user.city}
                    onChange={(e) => setUser({ ...user, city: e.target.value })}
                    className={inputClass(isEditing)}
                  />
                </div>
              </form>
            </div>

            {/* Recent Rides */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Recent Rides</h3>
                <span className="text-xs font-semibold text-orange-500">
                  Last 3 Trips
                </span>
              </div>

              <div className="space-y-3">
                {recentRides.map((ride) => (
                  <div
                    key={ride.id}
                    className="flex flex-col justify-between gap-3 rounded-xl border border-gray-100 p-4 transition hover:border-orange-200 sm:flex-row sm:items-center"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="font-semibold text-gray-600">
                          {ride.id}
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1">
                          <FiClock className="text-orange-500" />
                          {ride.date}
                        </span>
                      </div>

                      <p className="text-sm font-bold text-gray-900">
                        {ride.from}{" "}
                        <span className="mx-1 text-orange-500">→</span>{" "}
                        {ride.to}
                      </p>
                      <p className="text-xs text-gray-500">{ride.vehicle}</p>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:gap-1">
                      <span className="text-base font-extrabold text-gray-900">
                        {ride.fare}
                      </span>
                      <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-600">
                        {ride.status}
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

export default PassengerProfile;