import { Link, NavLink } from "react-router";

function Navbar() {
  const linkClass = ({ isActive }) =>
    `transition ${
      isActive
        ? "text-indigo-400"
        : "text-slate-300 hover:text-white"
    }`;

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        <Link
          to="/"
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 font-bold text-white">
            EC
          </div>

          <div>
            <h1 className="text-lg font-bold text-white">
              Easy Com
            </h1>

            <p className="text-xs text-slate-400">
              Programming Language
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-8 md:flex">

          <NavLink
            to="/"
            className={linkClass}
          >
            Home
          </NavLink>

          <NavLink
            to="/translator"
            className={linkClass}
          >
            Translator
          </NavLink>

          <NavLink
            to="/speech-to-sign"
            className={linkClass}
          >
            Speech to Sign
          </NavLink>

          <NavLink
            to="/learn"
            className={linkClass}
          >
            Learn
          </NavLink>

        </div>

        <div className="flex items-center gap-3">

          <Link
            to="/login"
            className="hidden rounded-lg px-4 py-2 text-sm text-slate-300 transition hover:text-white sm:block"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600"
          >
            Get Started
          </Link>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;