import { useState } from "react";
import { FaUser, FaCarAlt, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { Link } from "react-router-dom";



const roles = [
    {
        id: "rider",
        name: "Rider",
        icon: <FaUser />,
        description: "Book rides and travel with ease",
    },
    {
        id: "driver",
        name: "Driver (Captain)",
        icon: <FaCarAlt />,
        description: "Drive and earn on your own time",
    },
];

const formItems = [
    {
        name: "name",
        label: "Full name",
        type: "text",
        icon: <FaUser />,
        placeholder: "Enter your full name",
    },
    {
        name: "email",
        label: "Email address",
        type: "email",
        icon: <MdEmail />,
        placeholder: "you@example.com",
    },
    {
        name: "password",
        label: "Password",
        type: "password",
        icon: <FaLock />,
        placeholder: "Create a password",
    },
];


function SignupPage() {

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [selectedRole, setSelectedRole] = useState("rider");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage();
        setLoading();

        const data = Object.fromEntries(new FormData(e.currentTarget));

        const roleMap = {
            rider: "passenger",
            driver: "captain",
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
                method: "POST",
                headers: {
                    "content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...data,
                    role: roleMap[selectedRole]
                }),
            }
            );
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Signup failed");
            }

            setMessage(result.message || "Account created successfully!");
            setMessageType("success");
            e.target.reset();
            setSelectedRole("rider");
        } catch (error) {
            setMessage(
                error.message === "failed to fetch"
                    ? "Server se connection nahi ho pa raha. Please try again."
                    : error.message
            )
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex w-full min-h-screen bg-white">

            {/* --left-side-- */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-br from-orange-500 to-orange-400 p-14 text-white">
                <Link to={"/"}>
                    <h1 className="text-4xl font-extrabold tracking-tight">GoRivo</h1>
                </Link>

                <div>
                    <p className="text-5xl font-bold leading-tight">
                        Your ride,
                        <br />
                        your way.
                    </p>
                    <p className="mt-5 max-w-md text-lg text-orange-50 leading-relaxed">
                        Join thousands of riders and drivers who use GoRivo to get where
                        they need to go.
                    </p>
                </div>

                <p className="text-sm text-orange-100">
                    © {new Date().getFullYear()} GoRivo. All rights reserved.
                </p>
            </div>


            {/* right-form-side-- */}
            <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-10 sm:px-12">
                <div className="w-full max-w-lg">
                    <h1 className="text-3xl font-extrabold tracking-tight text-orange-500 lg:hidden">
                        GoRivo
                    </h1>

                    <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900 lg:mt-0">
                        Create your account
                    </h2>
                    <p className="mt-2 text-base text-gray-500">
                        Get started with your email in less than a minute.
                    </p>


                    <h3 className="mt-8 text-sm font-semibold text-gray-700">
                        Choose your role
                    </h3>
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {roles.map((role) => {
                            const active = selectedRole === role.id;
                            return (
                                <button
                                    type="button"
                                    key={role.id}
                                    onClick={() => setSelectedRole(role.id)}
                                    aria-pressed={active}
                                    className={`flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 ${active
                                        ? "border-orange-500 bg-orange-50"
                                        : "border-gray-200 bg-white hover:border-gray-300"
                                        }`}
                                >
                                    <span
                                        className={`mt-0.5 text-xl ${active ? "text-orange-500" : "text-gray-500"
                                            }`}
                                    >
                                        {role.icon}
                                    </span>
                                    <span>
                                        <span className="block text-base font-semibold text-gray-900">
                                            {role.name}
                                        </span>
                                        <span className="mt-0.5 block text-sm text-gray-500">
                                            {role.description}
                                        </span>
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Form */}
                    {message && (
                        <p
                            role="alert"
                            className={`rounded-lg p-3 text-sm ${messageType === "success"
                                ? "bg-green-50 text-green-700"
                                : "bg-red-50 text-red-700"
                                }`}
                        >
                            {message}
                        </p>
                    )}
                    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
                        {formItems.map((item) => {
                            const isPassword = item.name === "password";
                            return (
                                <div key={item.name}>
                                    <label
                                        htmlFor={item.name}
                                        className="mb-1.5 block text-sm font-medium text-gray-700"
                                    >
                                        {item.label}
                                    </label>
                                    <div className="flex items-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3 transition focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-200">
                                        <span className="text-lg text-gray-400">{item.icon}</span>
                                        <input
                                            id={item.name}
                                            name={item.name}
                                            type={isPassword && showPassword ? "text" : item.type}
                                            placeholder={item.placeholder}
                                            required
                                            className="w-full bg-transparent text-base text-gray-900 placeholder:text-gray-400 outline-none"
                                        />
                                        {isPassword && (
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((s) => !s)}
                                                aria-label={
                                                    showPassword ? "Hide password" : "Show password"
                                                }
                                                className="text-lg text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 w-full rounded-xl bg-orange-500 py-3.5 text-base font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Creating account..." : "Create account"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-500">
                        Already have an account?{" "}
                        <a href="/login" className="font-semibold text-orange-500 hover:underline">
                            Log in
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignupPage;