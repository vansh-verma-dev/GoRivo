import { Link, useNavigate } from "react-router-dom";
import {
  FaHouse,
  FaArrowLeft,
  FaLocationDot,
  FaClockRotateLeft,
  FaCircleQuestion,
} from "react-icons/fa6";
import Navbar from "../components/navbar";

const quickLinks = [
  { label: "Book a ride", to: "/", icon: <FaLocationDot /> },
  { label: "My trips", to: "/rides", icon: <FaClockRotateLeft /> },
  { label: "Help", to: "/help", icon: <FaCircleQuestion /> },
];

function NotFound() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <main className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-white px-5 py-16">
        {/* Soft background glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-orange-100 blur-3xl" />

        <div className="relative z-10 mx-auto w-full max-w-xl text-center">
          <span className="inline-block rounded-full bg-orange-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-orange-600">
            Error 404
          </span>

          {/* 404 */}
          <h1 className="mt-4 bg-gradient-to-b from-orange-500 to-orange-400 bg-clip-text text-[7rem] font-black leading-none tracking-tighter text-transparent sm:text-[10rem]">
            404
          </h1>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Oops! Wrong turn.
          </h2>

          <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-gray-500">
            This page doesn&apos;t exist or may have been moved. Let&apos;s get
            you back on the right road.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600 active:scale-[0.98]"
            >
              <FaHouse />
              Back to Home
            </Link>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-7 py-3.5 text-base font-semibold text-gray-800 transition hover:border-gray-900 active:scale-[0.98]"
            >
              <FaArrowLeft />
              Go Back
            </button>
          </div>

          {/* Quick links */}
          <div className="mt-12 border-t border-gray-100 pt-6">
            <p className="text-sm font-medium text-gray-500">
              Or jump to something useful
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {quickLinks.map((l) => (
                <Link
                  key={l.label}
                  to={l.to}
                  className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-800 transition hover:bg-orange-50 hover:text-orange-600"
                >
                  {l.icon}
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <p className="mt-10 text-sm text-gray-400">
            Lost on the road?{" "}
            <span className="font-semibold text-orange-500">GoRivo</span> has
            your back.
          </p>
        </div>
      </main>
    </>
  );
}

export default NotFound;