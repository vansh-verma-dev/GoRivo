import { useEffect, useState } from "react";
import DriverHeader from "../driver/Driverheader";

const API = import.meta.env.VITE_API_URL;

function Row({ label, value, capitalize }) {
  return (
    <div className="flex justify-between gap-4 py-3 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className={`break-all text-right font-semibold ${capitalize ? "capitalize" : ""}`}>
        {value}
      </span>
    </div>
  );
}

function DriverProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch(`${API}/api/auth/me`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const result = await res.json();
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

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <DriverHeader />

      <main className="mx-auto max-w-md space-y-5 px-4 py-8">
        {loading && <p className="py-10 text-center text-gray-500">Loading...</p>}
        {error && <p className="py-10 text-center text-red-600">{error}</p>}

        {user && (
          <>
            <div className="text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-orange-500 text-4xl font-bold text-white">
                {user.name?.[0]?.toUpperCase()}
              </div>
              <h1 className="mt-4 text-2xl font-bold capitalize">{user.name}</h1>
              <span className="mt-2 inline-block rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold capitalize text-orange-600">
                {user.role}
              </span>
            </div>

            <section className="divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white px-5">
              <Row label="Email" value={user.email} />
              <Row label="Account type" value={user.role} capitalize />
              <Row
                label="Member since"
                value={new Date(user.createdAt).toLocaleDateString("en-IN", {
                  month: "long",
                  year: "numeric",
                })}
              />
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default DriverProfile;