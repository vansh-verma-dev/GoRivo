import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FaCarRear, FaBars, FaXmark } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi";

const links = [
    { to: "/trip", label: "Trip", icon: FaCarRear },
    { to: "/rent", label: "Rent", icon: GiReceiveMoney },
];

function Navbar() {
    const [open, setOpen] = useState(false);
    const { pathname } = useLocation();

    // page change hone pe mobile menu band ho jaye
    useEffect(() => setOpen(false), [pathname]);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white shadow-sm">
            <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8 lg:px-20">

                {/* Left: logo + links (desktop) */}
                <div className="flex items-center gap-6 sm:gap-10">
                    <Link to="/" className="text-2xl font-medium text-gray-700 sm:text-3xl">
                        GoRivo
                    </Link>

                    <div className="hidden items-center gap-2 text-base text-gray-800 md:flex">
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

                {/* Right: auth (desktop) */}
                <div className="hidden items-center gap-6 md:flex">
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

                {/* Mobile: Sign up + hamburger */}
                <div className="flex items-center gap-2 md:hidden">
                    <Link
                        to="/startUi"
                        className="rounded-2xl bg-black px-4 py-1.5 text-sm text-white transition-colors hover:bg-gray-800"
                    >
                        Sign up
                    </Link>
                    <button
                        type="button"
                        onClick={() => setOpen((v) => !v)}
                        aria-expanded={open}
                        aria-controls="mobile-menu"
                        aria-label={open ? "Close menu" : "Open menu"}
                        className="grid h-10 w-10 place-items-center rounded-full text-xl text-gray-800 transition-colors hover:bg-gray-100"
                    >
                        {open ? <FaXmark /> : <FaBars />}
                    </button>
                </div>
            </nav>

            {/* Mobile menu */}
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
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-gray-100 ${
                                        isActive ? "bg-gray-100 font-medium" : ""
                                    }`
                                }
                            >
                                <Icon />
                                <span>{label}</span>
                            </NavLink>
                        ))}

                        <Link
                            to="/login"
                            tabIndex={open ? 0 : -1}
                            className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-gray-100"
                        >
                            <FaRegUser />
                            <span>Log in</span>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Navbar;