import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaRegUser,
  FaEnvelope,
  FaShieldHalved,
  FaRotateRight,
  FaWallet,
  FaClockRotateLeft,
  FaLocationDot,
  FaCreditCard,
  FaCircleQuestion,
  FaRightFromBracket,
  FaChevronRight,
} from "react-icons/fa6";
import Navbar from "../components/navbar";

const quickActions = [
  { label: "Trips", to: "/rides", icon: <FaClockRotateLeft /> },
  { label: "Wallet", to: "/payments", icon: <FaWallet /> },
  { label: "Help", to: "/help", icon: <FaCircleQuestion /> },
];

const settings = [
  { label: "Saved places", to: "/saved-places", icon: <FaLocationDot /> },
  { label: "Payment methods", to: "/payments", icon: <FaCreditCard /> },
  { label: "Safety & privacy", to: "/safety", icon: <FaShieldHalved /> },
];

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "G";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/me`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem("token");
            window.dispatchEvent(new Event("auth-change"));
            navigate("/login", { replace: true });
            return;
          }

          throw new Error(result.message || "Profile load nahi ho paya.");
        }

        setUser(result.user ?? result);
      } catch (err) {
        setError(
          err.message === "Failed to fetch"
            ? "Server se connection nahi ho pa raha. Dobara try karo."
            : err.message || "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("auth-change"));
    navigate("/login", { replace: true });
  };

  /* ---------- Loading ---------- */
  if (loading) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div className="h-8 w-48 animate-pulse rounded-lg bg-gray-200" />
              <div className="h-4 w-60 animate-pulse rounded-lg bg-gray-100" />
            </div>
            <div className="h-20 w-20 animate-pulse rounded-full bg-gray-200" />
          </div>
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
          <div className="mt-8 h-52 animate-pulse rounded-2xl bg-gray-100" />
        </main>
      </>
    );
  }

  /* ---------- Error ---------- */
  if (error) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-[70vh] items-center justify-center px-4">
          <div className="w-full max-w-md rounded-3xl border border-gray-200 p-8 text-center">
            <h1 className="text-xl font-bold text-gray-900">
              Profile load nahi hua
            </h1>
            <p className="mt-3 text-sm text-red-600">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-orange-500"
            >
              <FaRotateRight />
              Try again
            </button>
          </div>
        </main>
      </>
    );
  }

  const name = user?.name || "GoRivo User";
  const email = user?.email || "Email not available";
  const role = user?.role || "User";

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Top: name + avatar */}
        <section className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="truncate text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {name}
            </h1>
            <p className="mt-1 truncate text-base text-gray-500">{email}</p>
            <span className="mt-3 inline-block rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold capitalize text-orange-600">
              {role}
            </span>
          </div>

          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-orange-500 text-2xl font-bold text-white sm:h-24 sm:w-24 sm:text-3xl">
            {getInitials(name)}
          </div>
        </section>

        {/* Quick actions */}
        <section className="mt-8 grid grid-cols-3 gap-3">
          {quickActions.map((a) => (
            <Link
              key={a.label}
              to={a.to}
              className="flex flex-col items-center gap-2 rounded-2xl bg-gray-100 px-3 py-5 text-gray-900 transition hover:bg-gray-200 active:scale-[0.98]"
            >
              <span className="text-xl">{a.icon}</span>
              <span className="text-sm font-semibold">{a.label}</span>
            </Link>
          ))}
        </section>

        {/* Account info */}
        <section className="mt-10">
          <h2 className="text-lg font-bold text-gray-900">Account info</h2>

          <div className="mt-2 divide-y divide-gray-100 border-y border-gray-100">
            <InfoRow icon={<FaRegUser />} label="Full name" value={name} />
            <InfoRow icon={<FaEnvelope />} label="Email" value={email} />
            <InfoRow
              icon={<FaShieldHalved />}
              label="Account type"
              value={role}
              capitalize
            />
          </div>
        </section>

        {/* Settings */}
        <section className="mt-10">
          <h2 className="text-lg font-bold text-gray-900">Settings</h2>

          <div className="mt-2 divide-y divide-gray-100 border-y border-gray-100">
            {settings.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="flex items-center gap-4 py-4 transition hover:bg-gray-50"
              >
                <span className="text-lg text-gray-700">{item.icon}</span>
                <span className="flex-1 text-base font-medium text-gray-900">
                  {item.label}
                </span>
                <FaChevronRight className="text-sm text-gray-400" />
              </Link>
            ))}
          </div>
        </section>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="mt-10 flex w-full items-center justify-center gap-2 rounded-full bg-gray-100 py-4 text-base font-semibold text-red-600 transition hover:bg-red-50 active:scale-[0.99]"
        >
          <FaRightFromBracket />
          Log out
        </button>
      </main>
    </>
  );
}

function InfoRow({ icon, label, value, capitalize = false }) {
  return (
    <div className="flex items-center gap-4 py-4">
      <span className="text-lg text-gray-700">{icon}</span>
      <div className="min-w-0">
        <p className="text-sm text-gray-500">{label}</p>
        <p
          className={`mt-0.5 break-words text-base font-semibold text-gray-900 ${
            capitalize ? "capitalize" : ""
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

export default ProfilePage;