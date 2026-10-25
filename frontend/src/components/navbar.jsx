
import { useState, useEffect } from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { FaCarRear, FaBars, FaXmark } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa";
import { FaRightFromBracket } from "react-icons/fa6";
import { GiReceiveMoney } from "react-icons/gi";

const links = [
  { to: "/trip", label: "Trip", icon: FaCarRear },
  { to: "/rent", label: "Rent", icon: GiReceiveMoney },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => Boolean(localStorage.getItem("token"))
  );
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Route change hone par mobile menu band
  useEffect(() => {
    setOpen(false);
    setShowLogoutConfirm(false);
  }, [pathname]);

  // Login/logout ke baad navbar update
  useEffect(() => {
    const updateAuth = () => {
      setIsLoggedIn(Boolean(localStorage.getItem("token")));
    };

    window.addEventListener("auth-change", updateAuth);
    window.addEventListener("storage", updateAuth);

    return () => {
      window.removeEventListener("auth-change", updateAuth);
      window.removeEventListener("storage", updateAuth);
    };
  }, []);

  // User confirmation ke baad hi logout
  const handleLogout = () => {
    localStorage.removeItem("token");

    window.dispatchEvent(new Event("auth-change"));

    setShowLogoutConfirm(false);
    setOpen(false);
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 rounded-full px-3 py-2 transition-colors hover:bg-orange-50 hover:text-orange-600 ${
      isActive
        ? "bg-orange-50 font-semibold text-orange-600"
        : "text-gray-700"
    }`;

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8 lg:px-12">
 
          <div className="flex items-center gap-6 sm:gap-10">
            <Link
              to="/"
              className="text-2xl font-extrabold tracking-tight text-orange-500 sm:text-3xl"
            >
              GoRivo<span className="text-gray-900">.</span>
            </Link>

            <div className="hidden items-center gap-2 md:flex">
              {links.map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to} className={navLinkClass}>
                  <Icon />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          </div>

   
          <div className="hidden items-center gap-3 md:flex">
            {isLoggedIn ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 rounded-full px-4 py-2 text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
                >
                  <FaRegUser />
                  <span>Profile</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(true)}
                  className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2 font-semibold text-white transition hover:bg-orange-600"
                >
                  <FaRightFromBracket />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 rounded-full px-4 py-2 text-gray-700 transition hover:bg-gray-100"
                >
                  <FaRegUser />
                  <span>Log in</span>
                </Link>

                <Link
                  to="/signup"
                  className="rounded-xl bg-orange-500 px-5 py-2 font-semibold text-white transition hover:bg-orange-600"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

    
          <div className="flex items-center gap-2 md:hidden">
            {!isLoggedIn && (
              <Link
                to="/signup"
                className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                Sign up
              </Link>
            )}

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid h-10 w-10 place-items-center rounded-full text-xl text-gray-800 transition hover:bg-gray-100"
            >
              {open ? <FaXmark /> : <FaBars />}
            </button>
          </div>
        </nav>

       
        <div
          id="mobile-menu"
          className={`grid transition-[grid-template-rows] duration-300 md:hidden ${
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-1 border-t border-gray-100 px-4 pb-4 pt-3 text-gray-800 sm:px-8">
              {links.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  tabIndex={open ? 0 : -1}
                  className={navLinkClass}
                >
                  <Icon />
                  <span>{label}</span>
                </NavLink>
              ))}

              {isLoggedIn ? (
                <>
                  <Link
                    to="/profile"
                    tabIndex={open ? 0 : -1}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-orange-50 hover:text-orange-600"
                  >
                    <FaRegUser />
                    <span>Profile</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setShowLogoutConfirm(true)}
                    tabIndex={open ? 0 : -1}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-orange-50 hover:text-orange-600"
                  >
                    <FaRightFromBracket />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  tabIndex={open ? 0 : -1}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-orange-50 hover:text-orange-600"
                >
                  <FaRegUser />
                  <span>Log in</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowLogoutConfirm(false);
            }
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

            <h2
              id="logout-title"
              className="text-xl font-bold text-gray-900"
            >
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
