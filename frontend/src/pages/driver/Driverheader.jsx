import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaXmark, FaRightFromBracket } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa";

const links = [
  { to: "/driver/dashboard", label: "Dashboard" },
  { to: "/driver/rideRequest", label: "Requests" },
  { to: "/driver/trip", label: "Active trip" },
  { to: "/driver/rideHistory", label: "History" },
];

function DriverHeader() {
  const [open, setOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Page badalne par menu aur popup band
  useEffect(() => {
    setOpen(false);
    setShowLogoutConfirm(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.dispatchEvent(new Event("auth-change"));
    navigate("/login", { replace: true });
  };

  const navLinkClass = ({ isActive }) =>
    `rounded-full px-3 py-2 text-sm transition-colors hover:bg-orange-50 hover:text-orange-600 ${
      isActive ? "bg-orange-50 font-semibold text-orange-600" : "text-gray-700"
    }`;

  return (
    <>
      <header className="sticky top-0 z-[1100] w-full border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8 lg:px-12">
          {/* Logo + desktop links */}
          <div className="flex items-center gap-6">
            <Link
              to="/driver/dashboard"
              className="text-2xl font-extrabold tracking-tight text-orange-500 sm:text-3xl"
            >
              GoRivo<span className="text-gray-900">.</span>
              <span className="ml-2 text-sm font-medium text-gray-400">
                Driver
              </span>
            </Link>

            <div className="hidden items-center gap-1 md:flex">
              {links.map((link) => (
                <NavLink key={link.to} to={link.to} className={navLinkClass}>
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Desktop: Profile + Logout */}
          <div className="hidden items-center gap-3 md:flex">
            <NavLink
              to="/driver/profile"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-full px-4 py-2 transition hover:bg-orange-50 hover:text-orange-600 ${
                  isActive ? "bg-orange-50 text-orange-600" : "text-gray-700"
                }`
              }
            >
              <FaRegUser />
              <span>Profile</span>
            </NavLink>

            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2 font-semibold text-white transition hover:bg-orange-600"
            >
              <FaRightFromBracket />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile: hamburger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="driver-mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid h-10 w-10 place-items-center rounded-full text-xl text-gray-800 transition hover:bg-gray-100 md:hidden"
          >
            {open ? <FaXmark /> : <FaBars />}
          </button>
        </nav>

        {/* Mobile menu */}
        <div
          id="driver-mobile-menu"
          className={`grid transition-[grid-template-rows] duration-300 md:hidden ${
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-1 border-t border-gray-100 px-4 py-3">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `rounded-xl px-3 py-3 font-medium ${
                      isActive
                        ? "bg-orange-50 text-orange-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              <NavLink
                to="/driver/profile"
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-3 py-3 font-medium ${
                    isActive
                      ? "bg-orange-50 text-orange-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                <FaRegUser /> Profile
              </NavLink>

              <button
                type="button"
                onClick={() => setShowLogoutConfirm(true)}
                className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 font-semibold text-white"
              >
                <FaRightFromBracket /> Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Logout confirm popup */}
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
            aria-labelledby="driver-logout-title"
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-xl text-orange-600">
              <FaRightFromBracket />
            </div>

            <h2 id="driver-logout-title" className="text-xl font-bold text-gray-900">
              Confirm Logout
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Are you sure you want to log out of your GoRivo driver account?
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

export default DriverHeader;