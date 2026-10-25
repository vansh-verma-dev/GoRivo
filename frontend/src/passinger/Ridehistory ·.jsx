import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCarSide,
  FaChevronDown,
  FaCircleQuestion,
  FaClock,
  FaCreditCard,
  FaMagnifyingGlass,
  FaMoneyBillWave,
  FaRoad,
  FaRotateRight,
  FaStar,
} from "react-icons/fa6";
import Navbar from "../components/navbar";

/*
  Sample data — real app mein ye backend se aayega, e.g.
  GET /api/rides  →  setRides(result.rides)
*/
const sampleRides = [
  {
    id: "GR482911",
    date: "2026-10-26T09:30:00",
    pickup: "Sector 12 Market",
    destination: "City Railway Station",
    ride: "Go Comfort",
    fare: 219,
    payment: "online",
    status: "upcoming",
    driver: "Assigned before pickup",
  },
  {
    id: "GR482640",
    date: "2026-10-22T18:45:00",
    pickup: "City Mall",
    destination: "Green Park Residency",
    ride: "Go Mini",
    fare: 149,
    payment: "cash",
    status: "completed",
    driver: "Rahul Sharma",
    rating: 5,
    distance: "6.2 km",
    duration: "19 min",
  },
  {
    id: "GR482377",
    date: "2026-10-19T08:10:00",
    pickup: "Green Park Residency",
    destination: "Tech Park, Phase 2",
    ride: "Go Comfort",
    fare: 289,
    payment: "online",
    status: "completed",
    driver: "Amit Verma",
    rating: 4,
    distance: "11.8 km",
    duration: "32 min",
  },
  {
    id: "GR482105",
    date: "2026-10-15T21:20:00",
    pickup: "Airport Road",
    destination: "Old Town Square",
    ride: "Go XL",
    fare: 459,
    payment: "online",
    status: "cancelled",
    driver: "—",
  },
  {
    id: "GR481822",
    date: "2026-10-09T13:05:00",
    pickup: "University Gate 2",
    destination: "Central Library",
    ride: "Go Mini",
    fare: 99,
    payment: "cash",
    status: "completed",
    driver: "Sunil Kumar",
    rating: 5,
    distance: "3.1 km",
    duration: "11 min",
  },
  {
    id: "GR481390",
    date: "2026-09-27T19:40:00",
    pickup: "Old Town Square",
    destination: "Lakeview Cafe",
    ride: "Go Comfort",
    fare: 179,
    payment: "cash",
    status: "completed",
    driver: "Rahul Sharma",
    rating: 4,
    distance: "5.4 km",
    duration: "17 min",
  },
  {
    id: "GR480954",
    date: "2026-09-18T07:55:00",
    pickup: "Lakeview Cafe",
    destination: "City Railway Station",
    ride: "Go Mini",
    fare: 129,
    payment: "online",
    status: "cancelled",
    driver: "—",
  },
];

const tabs = [
  { id: "all", label: "All" },
  { id: "upcoming", label: "Upcoming" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

const statusStyle = {
  completed: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-600",
  upcoming: "bg-orange-50 text-orange-600",
};

const dateFmt = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
});
const monthFmt = new Intl.DateTimeFormat("en-IN", {
  month: "long",
  year: "numeric",
});

function RideHistory() {
  const [rides] = useState(sampleRides);
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState(null);

  const counts = useMemo(() => {
    const c = { all: rides.length, upcoming: 0, completed: 0, cancelled: 0 };
    rides.forEach((r) => (c[r.status] += 1));
    return c;
  }, [rides]);

  const totalSpent = useMemo(
    () =>
      rides
        .filter((r) => r.status === "completed")
        .reduce((sum, r) => sum + r.fare, 0),
    [rides]
  );

  // Filter + month ke hisaab se group
  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = rides
      .filter((r) => tab === "all" || r.status === tab)
      .filter(
        (r) =>
          !q ||
          [r.pickup, r.destination, r.ride, r.id].some((v) =>
            v.toLowerCase().includes(q)
          )
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    const map = new Map();
    filtered.forEach((r) => {
      const key = monthFmt.format(new Date(r.date));
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(r);
    });
    return [...map.entries()];
  }, [rides, tab, query]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Heading */}
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          My <span className="text-orange-500">rides</span>
        </h1>
        <p className="mt-2 text-base text-gray-500">
          Your past and upcoming trips in one place.
        </p>

        {/* Stats */}
        <section className="mt-6 grid grid-cols-3 divide-x divide-gray-100 rounded-3xl border border-gray-200 bg-white py-5">
          {[
            { label: "Completed", value: counts.completed },
            { label: "Total spent", value: `₹${totalSpent}` },
            { label: "Cancelled", value: counts.cancelled },
          ].map((s) => (
            <div key={s.label} className="px-3 text-center">
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="mt-0.5 text-xs font-medium text-gray-500">
                {s.label}
              </p>
            </div>
          ))}
        </section>

        {/* Search */}
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 transition focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100">
          <FaMagnifyingGlass className="text-gray-400" />
          <label htmlFor="ride-search" className="sr-only">
            Search rides
          </label>
          <input
            id="ride-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by place, ride type or booking ID"
            className="w-full bg-transparent text-base outline-none placeholder:text-gray-400"
          />
        </div>

        {/* Tabs */}
        <div
          role="tablist"
          className="mt-4 flex gap-2 overflow-x-auto pb-1"
        >
          {tabs.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.id)}
                className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-gray-400"
                }`}
              >
                {t.label}
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    active ? "bg-white/20" : "bg-gray-100"
                  }`}
                >
                  {counts[t.id]}
                </span>
              </button>
            );
          })}
        </div>

        {/* List */}
        <div className="mt-6 space-y-8">
          {groups.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl text-gray-500">
                <FaCarSide />
              </span>
              <h2 className="mt-4 text-lg font-bold">No rides found</h2>
              <p className="mt-1 text-sm text-gray-500">
                Try a different filter or search, or book a new ride.
              </p>
              <Link
                to="/trip"
                className="mt-6 inline-block rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                Book a ride
              </Link>
            </div>
          ) : (
            groups.map(([month, items]) => (
              <section key={month}>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
                  {month}
                </h2>

                <div className="space-y-3">
                  {items.map((r) => {
                    const open = openId === r.id;
                    const cancelled = r.status === "cancelled";

                    return (
                      <article
                        key={r.id}
                        className="overflow-hidden rounded-3xl border border-gray-200 bg-white"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenId(open ? null : r.id)}
                          aria-expanded={open}
                          className="flex w-full items-start gap-4 p-5 text-left transition hover:bg-gray-50"
                        >
                          {/* Route */}
                          <div className="flex flex-col items-center py-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-gray-900" />
                            <span className="my-1 h-6 w-px bg-gray-300" />
                            <span className="h-2.5 w-2.5 bg-orange-500" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-base font-semibold">
                              {r.pickup}
                            </p>
                            <p className="mt-3 truncate text-base font-semibold">
                              {r.destination}
                            </p>
                            <p className="mt-2 text-xs text-gray-500">
                              {dateFmt.format(new Date(r.date))} · {r.ride}
                            </p>
                          </div>

                          <div className="shrink-0 text-right">
                            <p
                              className={`text-lg font-bold ${
                                cancelled ? "text-gray-400 line-through" : ""
                              }`}
                            >
                              ₹{r.fare}
                            </p>
                            <span
                              className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${
                                statusStyle[r.status]
                              }`}
                            >
                              {r.status}
                            </span>
                            <FaChevronDown
                              className={`ml-auto mt-3 text-xs text-gray-400 transition ${
                                open ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                        </button>

                        {/* Details */}
                        {open && (
                          <div className="border-t border-gray-100 bg-gray-50/60 px-5 py-5">
                            <dl className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
                              <Detail label="Booking ID" value={`#${r.id}`} />
                              <Detail label="Driver" value={r.driver} />
                              <Detail
                                label="Payment"
                                value={
                                  <span className="inline-flex items-center gap-1.5">
                                    {r.payment === "online" ? (
                                      <FaCreditCard className="text-gray-500" />
                                    ) : (
                                      <FaMoneyBillWave className="text-gray-500" />
                                    )}
                                    {r.payment === "online" ? "Online" : "Cash"}
                                  </span>
                                }
                              />
                              {r.distance && (
                                <Detail
                                  label="Distance"
                                  value={
                                    <span className="inline-flex items-center gap-1.5">
                                      <FaRoad className="text-gray-500" />
                                      {r.distance}
                                    </span>
                                  }
                                />
                              )}
                              {r.duration && (
                                <Detail
                                  label="Duration"
                                  value={
                                    <span className="inline-flex items-center gap-1.5">
                                      <FaClock className="text-gray-500" />
                                      {r.duration}
                                    </span>
                                  }
                                />
                              )}
                              {r.rating && (
                                <Detail
                                  label="Your rating"
                                  value={
                                    <span className="inline-flex gap-0.5">
                                      {[1, 2, 3, 4, 5].map((n) => (
                                        <FaStar
                                          key={n}
                                          className={
                                            n <= r.rating
                                              ? "text-orange-500"
                                              : "text-gray-300"
                                          }
                                        />
                                      ))}
                                    </span>
                                  }
                                />
                              )}
                            </dl>

                            <div className="mt-5 grid grid-cols-2 gap-3">
                              <Link
                                to="/trip"
                                className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                              >
                                <FaRotateRight />
                                {r.status === "upcoming" ? "View booking" : "Book again"}
                              </Link>
                              <Link
                                to="/help"
                                className="flex items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-semibold ring-1 ring-gray-200 transition hover:ring-gray-900"
                              >
                                <FaCircleQuestion />
                                Get help
                              </Link>
                            </div>
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              </section>
            ))
          )}
        </div>

        <p className="mt-10 text-center text-xs text-gray-400">
          Demo screen — rides shown here are sample data.
        </p>
      </main>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium text-gray-500">{label}</dt>
      <dd className="mt-0.5 break-words font-semibold text-gray-900">{value}</dd>
    </div>
  );
}

export default RideHistory;