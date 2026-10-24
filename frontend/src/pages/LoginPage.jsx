import { useState } from "react";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    console.log(data);
  };

  return (
    <div className="flex w-full min-h-screen bg-white">
      {/* --Left brand side--- */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-br from-orange-500 to-orange-400 p-14 text-white">
        <h1 className="text-4xl font-extrabold tracking-tight">GoRivo</h1>

        <div>
          <p className="text-5xl font-bold leading-tight">
            Welcome
            <br />
            back.
          </p>
          <p className="mt-5 max-w-md text-lg text-orange-50 leading-relaxed">
            Log in to book your next ride or pick up where you left off as a
            driver.
          </p>
        </div>

        <p className="text-sm text-orange-100">
          © {new Date().getFullYear()} GoRivo. All rights reserved.
        </p>
      </div>

      {/* --Right form sided-- */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-10 sm:px-12">
        <div className="w-full max-w-lg">
          <h1 className="text-3xl font-extrabold tracking-tight text-orange-500 lg:hidden">
            GoRivo
          </h1>

          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900 lg:mt-0">
            Log in to your account
          </h2>
          <p className="mt-2 text-base text-gray-500">
            Enter your email and password to continue.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3 transition focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-200">
                <span className="text-lg text-gray-400">
                  <MdEmail />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="w-full bg-transparent text-base text-gray-900 placeholder:text-gray-400 outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <a
                  href="/forgot-password"
                  className="text-sm font-medium text-orange-500 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3 transition focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-200">
                <span className="text-lg text-gray-400">
                  <FaLock />
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  className="w-full bg-transparent text-base text-gray-900 placeholder:text-gray-400 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="text-lg text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                name="remember"
                className="h-4 w-4 rounded border-gray-300 accent-orange-500"
              />
              Keep me logged in
            </label>

            <button
              type="submit"
              className="w-full rounded-xl bg-orange-500 py-3.5 text-base font-semibold text-white transition hover:bg-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
            >
              Log in
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            New to GoRivo?{" "}
            <a
              href="/signup"
              className="font-semibold text-orange-500 hover:underline"
            >
              Create an account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;