import { useMemo, useRef, useState } from "react";
import {
  FaCarSide,
  FaChevronDown,
  FaCircleCheck,
  FaCreditCard,
  FaEnvelope,
  FaHeadset,
  FaMagnifyingGlass,
  FaPaperPlane,
  FaPhone,
  FaShieldHalved,
  FaTriangleExclamation,
  FaUser,
} from "react-icons/fa6";
import Navbar from "../components/navbar";

/*
  Sample content — apni asli policies ke hisaab se badal lena.
  Contact details bhi placeholder hain.
*/
const SUPPORT_PHONE = "+91 00000 00000";
const SUPPORT_EMAIL = "support@gorivo.com";

const categories = [
  { id: "rides", label: "Rides", icon: <FaCarSide /> },
  { id: "payments", label: "Payments", icon: <FaCreditCard /> },
  { id: "account", label: "Account", icon: <FaUser /> },
  { id: "safety", label: "Safety", icon: <FaShieldHalved /> },
];

const faqs = [
  {
    id: 1,
    category: "rides",
    q: "How do I book a ride?",
    a: "Open Book a Ride, enter your pickup and destination, choose a ride type and tap Confirm booking. You'll see your driver's details once one is assigned.",
  },
  {
    id: 2,
    category: "rides",
    q: "Can I cancel a ride after booking?",
    a: "Yes. You can cancel from the tracking screen until the trip starts. Once you're on the trip, cancellation is no longer available.",
  },
  {
    id: 3,
    category: "rides",
    q: "My driver is taking too long. What should I do?",
    a: "Use the Call or Message buttons on the tracking screen to contact your driver. If you still can't reach them, cancel the ride and book again, or raise a complaint below.",
  },
  {
    id: 4,
    category: "payments",
    q: "Which payment methods are available?",
    a: "You can pay by cash directly to the driver or pay online. Choose your preferred method before confirming your booking.",
  },
  {
    id: 5,
    category: "payments",
    q: "I was charged more than the estimate. Why?",
    a: "The estimate is based on distance and time. Route changes, waiting time or traffic can change the final fare. If something looks wrong, raise a complaint with your Booking ID.",
  },
  {
    id: 6,
    category: "account",
    q: "How do I update my profile details?",
    a: "Go to My Account from the menu to see your profile. If your name or email is incorrect, contact support and we'll help you update it.",
  },
  {
    id: 7,
    category: "account",
    q: "I forgot my password. What now?",
    a: "Tap Forgot password on the login screen and follow the steps. If you don't receive the email, check your spam folder or contact support.",
  },
  {
    id: 8,
    category: "safety",
    q: "How do I stay safe during a ride?",
    a: "Check the number plate and driver's name before getting in, share the Ride PIN only after verifying, and use Share trip so someone you trust can follow your journey.",
  },
  {
    id: 9,
    category: "safety",
    q: "What should I do in an emergency?",
    a: "Call 112 immediately using the Emergency button on the tracking screen. After you're safe, contact support so we can look into what happened.",
  },
  {
    id: 10,
    category: "safety",
    q: "I left an item in the car. Can you help?",
    a: "Raise a complaint with your Booking ID and select Lost item. We'll help you get in touch with the driver.",
  },
];

const complaintTypes = [
  "Driver behaviour",
  "Overcharged / payment issue",
  "Ride cancelled by driver",
  "Safety concern",
  "Lost item",
  "App problem",
  "Other",
];

const MIN_DESC = 20;

function HelpSupport() {
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState(null);

  const [form, setForm] = useState({
    type: "",
    bookingId: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [ticket, setTicket] = useState(null);

  const faqRef = useRef(null);
  const formRef = useRef(null);

  const filteredFaqs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return faqs.filter(
      (f) =>
        (category === "all" || f.category === category) &&
        (!q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q))
    );
  }, [category, query]);

  const scrollTo = (ref) =>
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const pickCategory = (id) => {
    setCategory(id);
    setQuery("");
    setOpenId(null);
    scrollTo(faqRef);
  };

  const setField = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};
    if (!form.type) next.type = "Please select what went wrong.";
    if (form.description.trim().length < MIN_DESC)
      next.description = `Please describe the issue in at least ${MIN_DESC} characters.`;

    setErrors(next);
    if (Object.keys(next).length) return;

    // TODO: yahan API call lagao, e.g. POST /api/complaints
    setTicket({
      id: `TKT${Math.floor(100000 + Math.random() * 900000)}`,
      type: form.type,
    });
  };

  const resetForm = () => {
    setForm({ type: "", bookingId: "", description: "" });
    setErrors({});
    setTicket(null);
  };

  const inputBase =
    "w-full rounded-xl bg-gray-100 px-4 py-3.5 text-base text-gray-900 outline-none ring-2 ring-transparent transition placeholder:text-gray-500 focus:bg-white focus:ring-orange-400";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Hero */}
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          How can we <span className="text-orange-500">help?</span>
        </h1>
        <p className="mt-2 text-base text-gray-500">
          Find quick answers or raise a complaint — we&apos;re here for you.
        </p>

        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3.5 transition focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100">
          <FaMagnifyingGlass className="text-gray-400" />
          <label htmlFor="faq-search" className="sr-only">
            Search help articles
          </label>
          <input
            id="faq-search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpenId(null);
            }}
            placeholder="Search for answers…"
            className="w-full bg-transparent text-base outline-none placeholder:text-gray-400"
          />
        </div>

        {/* Topic cards */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => pickCategory(c.id)}
              className="flex flex-col items-center gap-2 rounded-2xl bg-white px-3 py-5 text-gray-900 ring-1 ring-gray-200 transition hover:ring-orange-400 active:scale-[0.98]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-lg text-orange-500">
                {c.icon}
              </span>
              <span className="text-sm font-semibold">{c.label}</span>
            </button>
          ))}
        </div>

        {/* Emergency banner */}
        <a
          href="tel:112"
          className="mt-5 flex items-center gap-3 rounded-2xl bg-red-50 p-4 text-red-700 transition hover:bg-red-100"
        >
          <FaTriangleExclamation className="shrink-0 text-xl" />
          <span className="text-sm">
            <span className="font-semibold">In an emergency?</span> Tap to call
            112 right now.
          </span>
        </a>

        {/* ---------- FAQs ---------- */}
        <section ref={faqRef} className="mt-12 scroll-mt-24">
          <h2 className="text-xl font-bold">Frequently asked questions</h2>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {[{ id: "all", label: "All" }, ...categories].map((c) => {
              const active = category === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setCategory(c.id);
                    setOpenId(null);
                  }}
                  aria-pressed={active}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-gray-900 text-white"
                      : "bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-gray-400"
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>

          <div className="mt-4 divide-y divide-gray-100 overflow-hidden rounded-3xl border border-gray-200 bg-white">
            {filteredFaqs.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-base font-semibold">No answers found</p>
                <p className="mt-1 text-sm text-gray-500">
                  Try different words, or raise a complaint below.
                </p>
                <button
                  type="button"
                  onClick={() => scrollTo(formRef)}
                  className="mt-4 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
                >
                  Raise a complaint
                </button>
              </div>
            ) : (
              filteredFaqs.map((f) => {
                const open = openId === f.id;
                return (
                  <div key={f.id}>
                    <button
                      type="button"
                      onClick={() => setOpenId(open ? null : f.id)}
                      aria-expanded={open}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-gray-50"
                    >
                      <span className="text-base font-semibold">{f.q}</span>
                      <FaChevronDown
                        className={`shrink-0 text-sm text-gray-400 transition ${
                          open ? "rotate-180 text-orange-500" : ""
                        }`}
                      />
                    </button>
                    {open && (
                      <p className="px-5 pb-5 text-sm leading-relaxed text-gray-600">
                        {f.a}
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* ---------- Complaint form ---------- */}
        <section ref={formRef} className="mt-12 scroll-mt-24">
          <h2 className="text-xl font-bold">Raise a complaint</h2>
          <p className="mt-1 text-sm text-gray-500">
            Tell us what happened and we&apos;ll look into it.
          </p>

          <div className="mt-4 rounded-3xl border border-gray-200 bg-white p-5 sm:p-6">
            {ticket ? (
              <div role="status" className="py-4 text-center">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-4xl text-green-500">
                  <FaCircleCheck />
                </span>
                <h3 className="mt-4 text-xl font-bold">Complaint submitted</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Your ticket ID is{" "}
                  <span className="font-semibold text-gray-900">
                    #{ticket.id}
                  </span>
                  . Our team will get back to you soon.
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Demo only — no complaint was actually sent.
                </p>
                <button
                  type="button"
                  onClick={resetForm}
                  className="mt-6 rounded-full bg-gray-100 px-6 py-3 text-sm font-semibold transition hover:bg-gray-200"
                >
                  Submit another complaint
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div>
                  <label
                    htmlFor="type"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    What went wrong?
                  </label>
                  <select
                    id="type"
                    value={form.type}
                    onChange={(e) => setField("type", e.target.value)}
                    className={`${inputBase} ${
                      form.type ? "" : "text-gray-500"
                    }`}
                  >
                    <option value="">Select an issue</option>
                    {complaintTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  {errors.type && (
                    <p role="alert" className="mt-1.5 text-sm text-red-600">
                      {errors.type}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="bookingId"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Booking ID{" "}
                    <span className="font-normal text-gray-400">(optional)</span>
                  </label>
                  <input
                    id="bookingId"
                    value={form.bookingId}
                    onChange={(e) => setField("bookingId", e.target.value)}
                    placeholder="e.g. GR482640"
                    className={inputBase}
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Describe the issue
                  </label>
                  <textarea
                    id="description"
                    rows={5}
                    value={form.description}
                    onChange={(e) => setField("description", e.target.value)}
                    placeholder="Tell us what happened…"
                    className={`${inputBase} resize-none`}
                  />
                  <div className="mt-1.5 flex items-start justify-between gap-3">
                    {errors.description ? (
                      <p role="alert" className="text-sm text-red-600">
                        {errors.description}
                      </p>
                    ) : (
                      <span />
                    )}
                    <span className="shrink-0 text-xs text-gray-400">
                      {form.description.trim().length}/{MIN_DESC}+
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 py-4 text-base font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600 active:scale-[0.99]"
                >
                  <FaPaperPlane />
                  Submit complaint
                </button>
              </form>
            )}
          </div>
        </section>

        {/* ---------- Contact ---------- */}
        <section className="mt-12">
          <h2 className="text-xl font-bold">Still need help?</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <a
              href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`}
              className="flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-gray-200 transition hover:ring-orange-400"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                <FaPhone />
              </span>
              <span>
                <span className="block text-sm font-semibold">Call us</span>
                <span className="text-sm text-gray-500">{SUPPORT_PHONE}</span>
              </span>
            </a>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-gray-200 transition hover:ring-orange-400"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                <FaEnvelope />
              </span>
              <span>
                <span className="block text-sm font-semibold">Email us</span>
                <span className="text-sm text-gray-500">{SUPPORT_EMAIL}</span>
              </span>
            </a>
          </div>

          <p className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
            <FaHeadset />
            Sample FAQs and contact details — replace with your own.
          </p>
        </section>
      </main>
    </div>
  );
}

export default HelpSupport;