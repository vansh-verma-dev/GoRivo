import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaXmark,
  FaHouse,
  FaLocationDot,
  FaGauge,
  FaInbox,
  FaRoute,
  FaClockRotateLeft,
  FaUser,
  FaRightFromBracket,
  FaRightToBracket,
  FaUserPlus,
} from "react-icons/fa6";

const NAV_CONFIG = {
  guest: {
    home: "/",
    links: [{ to: "/", label: "Home", icon: FaHouse, end: true }],
  },
  passenger: {
    home: "/passenger/dashboard",
    links: [
      { to: "/passenger/dashboard", label: "Book Ride", icon: FaLocationDot },
      { to: "/passenger/myride", label: "My Rides", icon: FaClockRotateLeft },
      { to: "/passenger/profile", label: "Profile", icon: FaUser },
    ],
  },
  driver: {
    home: "/driver/dashboard",
    links: [
      { to: "/driver/dashboard", label: "Dashboard", icon: FaGauge },
      { to: "/driver/rideRequest", label: "Requests", icon: FaInbox },
      { to: "/driver/trip", label: "Active trip", icon: FaRoute },
      { to: "/driver/history", label: "History", icon: FaClockRotateLeft },
      { to: "/driver/profile", label: "Profile", icon: FaUser },
    ],
  },
};

const getUserType = () => {
  if (!localStorage.getItem("token")) return "guest";
  return localStorage.getItem("role") === "driver" ? "driver" : "passenger";
};

function Navbar() {
  const [userType, setUserType] = useState(getUserType);
  const [open, setOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { home, links } = NAV_CONFIG[userType];
  const isGuest = userType === "guest";

  useEffect(() => {
    setOpen(false);
    setShowLogoutConfirm(false);
  }, [pathname]);

  useEffect(() => {
    const syncAuth = () => setUserType(getUserType());
    window.addEventListener("auth-change", syncAuth);
    window.addEventListener("storage", syncAuth);
    return () => {
      window.removeEventListener("auth-change", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  useEffect(() => {
    if (!showLogoutConfirm) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setShowLogoutConfirm(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showLogoutConfirm]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.dispatchEvent(new Event("auth-change"));
    setShowLogoutConfirm(false);
    setOpen(false);
    navigate("/login", { replace: true });
  };

  const desktopLink = ({ isActive }) =>
    `flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? "bg-orange-50 text-orange-600"
        : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
    }`;

  const mobileLink = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-3 py-3 font-medium transition-colors ${
      isActive
        ? "bg-orange-50 text-orange-600"
        : "text-gray-700 hover:bg-gray-50"
    }`;

  return (
    <>
      <header className="sticky top-0 z-[1100] w-full border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8 lg:px-12">
          <div className="flex items-center gap-6">
            <Link
              to={home}
              className="flex items-baseline text-2xl font-extrabold tracking-tight text-orange-500 sm:text-3xl"
            >
              GoRivo<span className="text-gray-900">.</span>
              {userType === "driver" && (
                <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold tracking-normal text-gray-500">
                  Driver
                </span>
              )}
            </Link>

            <div className="hidden items-center gap-1 lg:flex">
              {links.map(({ to, label, icon: Icon, end }) => (
                <NavLink key={to} to={to} end={end} className={desktopLink}>
                  <Icon />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            {isGuest ? (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 rounded-full px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  <FaRightToBracket />
                  <span>Log in</span>
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2 font-semibold text-white transition hover:bg-orange-600"
                >
                  <FaUserPlus />
                  <span>Sign up</span>
                </Link>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2 font-semibold text-white transition hover:bg-orange-600"
              >
                <FaRightFromBracket />
                <span>Logout</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid h-10 w-10 place-items-center rounded-full text-xl text-gray-800 transition hover:bg-gray-100 lg:hidden"
          >
            {open ? <FaXmark /> : <FaBars />}
          </button>
        </nav>

        <div
          id="mobile-menu"
          className={`grid transition-[grid-template-rows] duration-300 lg:hidden ${
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-1 border-t border-gray-100 px-4 py-3">
              {links.map(({ to, label, icon: Icon, end }) => (
                <NavLink key={to} to={to} end={end} className={mobileLink}>
                  <Icon />
                  <span>{label}</span>
                </NavLink>
              ))}

              {isGuest ? (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 py-3 font-medium text-gray-700"
                  >
                    <FaRightToBracket />
                    <span>Log in</span>
                  </Link>
                  <Link
                    to="/signup"
                    className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 font-semibold text-white"
                  >
                    <FaUserPlus />
                    <span>Sign up</span>
                  </Link>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(true)}
                  className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 font-semibold text-white"
                >
                  <FaRightFromBracket />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowLogoutConfirm(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-xl text-orange-600">
              <FaRightFromBracket />
            </div>

            <h2 id="logout-title" className="text-xl font-bold text-gray-900">
              Confirm Logout
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Are you sure you want to log out of your GoRivo account?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                autoFocus
                onClick={() => setShowLogoutConfirm(false)}
                className="rounded-xl border border-gray-300 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-100"
              >
                No, Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl bg-orange-500 px-4 py-2 font-semibold text-white transition hover:bg-orange-600"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;