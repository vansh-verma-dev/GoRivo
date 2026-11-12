import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRightFromBracket, FaClockRotateLeft } from "react-icons/fa6";
import Navbar from "../components/navbar";

const API = import.meta.env.VITE_API_URL;

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.dispatchEvent(new Event("auth-change"));
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch(`${API}/api/auth/me`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const result = await res.json();

        // token galat ya expire
        if (res.status === 401 || res.status === 403) return logout();
        if (!res.ok) throw new Error(result.message || "Could not load profile");

        setUser(result.user ?? result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <p className="py-20 text-center text-gray-500">Loading...</p>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <p className="py-20 text-center text-red-600">{error}</p>
      </>
    );
  }

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const historyLink =
    user.role === "driver" ? "/driver/rideHistory" : "/passenger/rideHistory";

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-md px-4 py-10">
        {/* Avatar + naam */}
        <div className="text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-orange-500 text-4xl font-bold text-white">
            {user.name[0].toUpperCase()}
          </div>
          <h1 className="mt-4 text-2xl font-bold capitalize">{user.name}</h1>
          <span className="mt-2 inline-block rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold capitalize text-orange-600">
            {user.role}
          </span>
        </div>

        {/* Account details */}
        <div className="mt-8 divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white px-5">
          <Row label="Email" value={user.email} />
          <Row label="Account type" value={user.role} capitalize />
          <Row label="Member since" value={memberSince} />
        </div>

        {/* Actions */}
        <Link
          to={historyLink}
          className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-gray-100 py-3 font-semibold hover:bg-gray-200"
        >
          <FaClockRotateLeft /> My rides
        </Link>

        <button
          onClick={logout}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 font-semibold text-white hover:bg-orange-600"
        >
          <FaRightFromBracket /> Log out
        </button>
      </main>
    </>
  );
}

function Row({ label, value, capitalize }) {
  return (
    <div className="flex justify-between gap-4 py-4 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className={`break-all text-right font-semibold ${capitalize ? "capitalize" : ""}`}>
        {value}
      </span>
    </div>
  );
}

export default ProfilePage;