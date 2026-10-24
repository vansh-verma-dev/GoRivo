function GetStartUi() {
  const BG_IMG =
    "https://i.pinimg.com/736x/f4/90/24/f4902492317ad20e40965045f5c12884.jpg";

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col bg-gray-900">
      <div
        className="relative flex min-h-[100dvh] flex-1 flex-col justify-between bg-cover bg-center px-6 pt-[max(2.5rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))]"
        style={{ backgroundImage: `url(${BG_IMG})` }}
      >
        {/* Dark overlay so text is readable on any image */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/10 to-black/80" />

        {/* Top: brand */}
        <header className="relative z-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow">
            Go<span className="text-orange-400">Rivo</span>
          </h1>
          <p className="mt-1 text-sm font-medium text-white/80">
            Ride book karo, aaram se.
          </p>
        </header>

        {/* Bottom: heading + button */}
        <main className="relative z-10">
          <h2 className="text-3xl font-bold leading-tight text-white">
            Get started
          </h2>
          <p className="mt-2 text-base leading-relaxed text-white/80">
            Book rides in seconds and travel safe, anytime, anywhere.
          </p>

          <a
            href="/login"
            className="mt-6 block w-full rounded-2xl bg-orange-500 py-4 text-center text-lg font-semibold text-white shadow-lg transition active:scale-[0.98] active:bg-orange-600"
          >
            Continue
          </a>

          <p className="mt-4 text-center text-sm text-white/70">
           Already account?{" "}
            <a href="/signup" className="font-semibold text-orange-400">
              Create account
            </a>
          </p>
        </main>
      </div>
    </div>
  );
}

export default GetStartUi;