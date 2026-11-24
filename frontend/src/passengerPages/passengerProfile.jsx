import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiAlertCircle,
  FiArrowRight,
  FiCheck,
  FiClock,
  FiEdit2,
  FiLogOut,
  FiMail,
  FiShield,
  FiUser,
  FiX,
} from "react-icons/fi";
import { MdVerified } from "react-icons/md";
import Navbar from "../components/navbar";
import {
  getProfileApi,
  updateProfileApi,
  logoutApi,
} from "../services/authService";
import { getMyRidesApi } from "../services/rideService";

const statusBadge = (status) => {
  if (status === "completed") return "bg-green-50 text-green-600";
  if (status === "cancelled" || status === "no_driver_found")
    return "bg-red-50 text-red-600";
  return "bg-orange-50 text-orange-600";
};

const PassengerProfile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoadError("");

        // Profile aur rides ek saath
        const [profileRes, ridesRes] = await Promise.all([
          getProfileApi(),
          getMyRidesApi().catch(() => ({ data: [] })), // rides fail ho to bhi profile dikhe
        ]);

        const u = profileRes.data || profileRes.user || profileRes;
        setUser(u);
        setName(u.name || "");
        setRides(ridesRes.data || []);
      } catch (err) {
        console.error("Load profile error:", err);
        if (err.status === 401) {
          setLoadError("Session expired. Please login again.");
        } else {
          setLoadError(err.message || "Could not load profile.");
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const stats = useMemo(() => {
    const completed = rides.filter((r) => r.status === "completed");
    return {
      total: rides.length,
      completed: completed.length,
      cancelled: rides.filter((r) => r.status === "cancelled").length,
      spent: completed.reduce((t, r) => t + (Number(r.fare) || 0), 0),
    };
  }, [rides]);

  const initials = (user?.name || "U")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      })
    : "-";

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setSaveError("Name must be at least 2 characters.");
      return;
    }

    try {
      setSaving(true);
      setSaveError("");
      setSaveMessage("");

      const res = await updateProfileApi({ name: trimmed });
      const updated = res.data || res.user || { ...user, name: trimmed };

      setUser((prev) => ({ ...prev, ...updated }));
      setIsEditing(false);
      setSaveMessage("Profile updated successfully.");
    } catch (err) {
      console.error("Update profile error:", err);
      setSaveError(err.message || "Could not update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setName(user?.name || "");
    setSaveError("");
    setIsEditing(false);
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logoutApi(); // token + role clear aur auth-change event yahi bhej deta hai
    } catch (err) {
      console.error("Logout error:", err); // server fail ho tab bhi logoutApi clear kar chuka hai
    } finally {
      setLoggingOut(false);
      navigate("/login", { replace: true });
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-[70vh] items-center justify-center text-sm font-semibold text-gray-500">
          Loading your profile...
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center">
          <p className="flex items-center gap-2 text-sm font-semibold text-red-500">
            <FiAlertCircle /> {loadError || "Profile not found."}
          </p>
          <Link
            to="/login"
            className="rounded-xl bg-orange-500 px-5 py-2.5 text-xs font-bold text-white hover:bg-orange-600"
          >
            Go to Login
          </Link>
        </div>
      </>
    );
  }

  const recentRides = rides.slice(0, 3);

  return (
    <>
      <Navbar />

      <section className="min-h-screen bg-gray-50/70 py-8 lg:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              My <span className="text-orange-500">Profile</span>
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your account details and see your GoRivo activity.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left column */}
            <div className="space-y-6 lg:col-span-4">
              <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
                <div className="relative mx-auto mb-4 h-24 w-24">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-orange-100 text-3xl font-extrabold text-orange-600 ring-4 ring-orange-50">
                    {initials}
                  </div>
                  <span
                    title="Verified Rider"
                    className="absolute bottom-0 right-0 rounded-full bg-white p-0.5 text-orange-500 shadow"
                  >
                    <MdVerified className="text-2xl" />
                  </span>
                </div>

                <h2 className="break-words text-xl font-bold text-gray-900">
                  {user.name}
                </h2>
                <p className="break-all text-sm text-gray-500">{user.email}</p>

                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold capitalize text-orange-600">
                  <FiShield />
                  <span>
                    GoRivo {user.role || "passenger"} • Since {memberSince}
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3 border-t border-gray-100 pt-5">
                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-lg font-extrabold text-gray-900">
                      {stats.total}
                    </p>
                    <p className="text-xs text-gray-500">Total Rides</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-lg font-extrabold text-gray-900">
                      {stats.completed}
                    </p>
                    <p className="text-xs text-gray-500">Completed</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-lg font-extrabold text-orange-600">
                      ₹{stats.spent}
                    </p>
                    <p className="text-xs text-gray-500">Total Spent</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-lg font-extrabold text-gray-900">
                      {stats.cancelled}
                    </p>
                    <p className="text-xs text-gray-500">Cancelled</p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-red-200 bg-white py-3 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FiLogOut />
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>

            {/* Right column */}
            <div className="space-y-6 lg:col-span-8">
              {/* Personal information */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">
                    Personal Information
                  </h3>

                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSaveMessage("");
                        setIsEditing(true);
                      }}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-orange-50 px-3.5 py-2 text-xs font-semibold text-orange-600 transition hover:bg-orange-100"
                    >
                      <FiEdit2 />
                      <span>Edit Profile</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={saving}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
                    >
                      <FiX />
                      <span>Cancel</span>
                    </button>
                  )}
                </div>

                {saveMessage && (
                  <div className="mb-4 rounded-xl bg-green-50 px-4 py-2.5 text-xs font-semibold text-green-700">
                    {saveMessage}
                  </div>
                )}
                {saveError && (
                  <div className="mb-4 rounded-xl bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-600">
                    {saveError}
                  </div>
                )}

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
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setSaveError("");
                      }}
                      className={`w-full rounded-xl border px-4 py-2.5 text-sm transition focus:outline-none ${
                        isEditing
                          ? "border-orange-300 bg-white text-gray-900 focus:border-orange-500"
                          : "cursor-default border-gray-100 bg-gray-50 text-gray-700"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                      <FiMail className="text-orange-500" /> Email Address
                    </label>
                    <input
                      type="email"
                      readOnly
                      value={user.email || ""}
                      className="w-full cursor-not-allowed rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5 text-sm text-gray-500 focus:outline-none"
                    />
                    <p className="mt-1 text-[11px] text-gray-400">
                      Email cannot be changed.
                    </p>
                  </div>

                  {isEditing && (
                    <div className="sm:col-span-2">
                      <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-orange-500 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <FiCheck />
                        <span>{saving ? "Saving..." : "Save Changes"}</span>
                      </button>
                    </div>
                  )}
                </form>
              </div>

              {/* Recent rides */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">
                    Recent Rides
                  </h3>
                  <Link
                    to="/passenger/myride"
                    className="inline-flex items-center gap-1 text-xs font-bold text-orange-500 hover:underline"
                  >
                    View all <FiArrowRight />
                  </Link>
                </div>

                {recentRides.length === 0 ? (
                  <div className="space-y-3 py-6 text-center">
                    <p className="text-sm text-gray-500">
                      You haven't booked any rides yet.
                    </p>
                    <Link
                      to="/passenger/bookRide"
                      className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-xs font-bold text-white hover:bg-orange-600"
                    >
                      Book a Ride <FiArrowRight />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentRides.map((ride) => (
                      <Link
                        key={ride._id}
                        to={`/passenger/activeride/${ride._id}`}
                        className="flex flex-col justify-between gap-3 rounded-xl border border-gray-100 p-4 transition hover:border-orange-200 sm:flex-row sm:items-center"
                      >
                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                            <span className="font-semibold text-gray-600">
                              {ride.bookingId ||
                                ride._id.slice(-6).toUpperCase()}
                            </span>
                            <span>•</span>
                            <span className="inline-flex items-center gap-1">
                              <FiClock className="text-orange-500" />
                              {ride.createdAt
                                ? new Date(ride.createdAt).toLocaleString(
                                    "en-IN",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )
                                : "-"}
                            </span>
                          </div>

                          <p className="break-words text-sm font-bold text-gray-900">
                            {ride.pickup?.name}{" "}
                            <span className="mx-1 text-orange-500">→</span>{" "}
                            {ride.destination?.name}
                          </p>
                          <p className="text-xs uppercase text-gray-500">
                            {ride.rideType}
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:gap-1">
                          <span className="text-base font-extrabold text-gray-900">
                            ₹{ride.fare}
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusBadge(
                              ride.status
                            )}`}
                          >
                            {ride.status.replaceAll("_", " ")}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PassengerProfile;