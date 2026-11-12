// src/components/DriverHeader.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { FaCar, FaRightFromBracket } from "react-icons/fa6";

const links = [
  { to: "/driver/dashboard", label: "Dashboard" },
  { to: "/driver/rideRequest", label: "Requests" },
  { to: "/driver/trip", label: "Active trip" },
  { to: "/driver/rideHistory", label: "History" },
];

function DriverHeader() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-[1100] border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <NavLink
          to="/driver/dashboard"
          className="flex items-center gap-2 text-lg font-bold"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-sm text-white">
            <FaCar />
          </span>
          GoRivo
          <span className="text-sm font-medium text-gray-400">Driver</span>
        </NavLink>

        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-red-600"
        >
          <FaRightFromBracket /> Logout
        </button>
      </div>

      <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 pb-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold ${
                isActive
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

export default DriverHeader;