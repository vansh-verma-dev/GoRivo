import { Link, NavLink } from "react-router-dom";
import { FaCarRear } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi";

const links = [
    { to: "/trip", label: "Trip", icon: FaCarRear },
    { to: "/rent", label: "Rent", icon: GiReceiveMoney },
];

function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white shadow-sm">
            <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8 lg:px-20">

                {/* Left: logo + links */}
                <div className="flex items-center gap-6 sm:gap-10">
                    <Link to="/" className="text-2xl font-medium text-gray-700 sm:text-3xl">
                        GoRivo
                    </Link>

                    <div className="flex items-center gap-2 text-base text-gray-800">
                        {links.map(({ to, label, icon: Icon }) => (
                            <NavLink
                                key={to}
                                to={to}
                                className={({ isActive }) =>
                                    `flex items-center gap-2 rounded-full px-3 py-1.5 transition-colors hover:bg-gray-100 ${
                                        isActive ? "bg-gray-100 font-medium" : ""
                                    }`
                                }
                            >
                                <Icon />
                                <span>{label}</span>
                            </NavLink>
                        ))}
                    </div>
                </div>

                {/* Right: auth */}
                <div className="flex items-center gap-3 sm:gap-6">
                    <Link
                        to="/login"
                        className="flex items-center gap-2 rounded-full px-3 py-1.5 text-gray-800 transition-colors hover:bg-gray-100"
                    >
                        <FaRegUser />
                        <span>Log in</span>
                    </Link>

                    <Link
                        to="/signup"
                        className="rounded-2xl bg-black px-5 py-1.5 text-white transition-colors hover:bg-gray-800"
                    >
                        Sign up
                    </Link>
                </div>
            </nav>
        </header>
    );
}

export default Navbar;