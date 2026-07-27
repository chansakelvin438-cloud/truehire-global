import { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { BriefcaseBusiness, Check, Menu, ShieldCheck, X } from "lucide-react"

function Navbar() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"))

  function getDashboardLink() {
    if (userRole === "jobseeker") return "/dashboard"
    if (userRole === "employer") return "/employer-dashboard"
    if (userRole === "admin") return "/admin-dashboard"
    return "/signin"
  }

  function getDashboardLabel() {
    if (userRole === "jobseeker") return "My Dashboard"
    if (userRole === "employer") return "Employer Dashboard"
    if (userRole === "admin") return "Admin Dashboard"
    return "Dashboard"
  }

  function handleSignOut() {
    localStorage.removeItem("userRole")
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("currentUser")
    setUserRole(null)
    setIsOpen(false)
    navigate("/")
  }

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-teal-300"
      : "text-zinc-300 hover:text-teal-300"

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500 text-zinc-950 shadow-lg shadow-teal-500/20">
            <ShieldCheck size={30} />

            <div className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400 text-zinc-950 ring-4 ring-zinc-950">
              <Check size={14} strokeWidth={4} />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold leading-tight text-white">
                TrueHire Global
              </h1>

              <BriefcaseBusiness size={16} className="text-yellow-400" />
            </div>

            <p className="text-xs font-medium text-zinc-400">
              Verified Jobs. Real Careers.
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-6 text-sm font-semibold md:flex">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/jobs" className={navLinkClass}>
            Jobs
          </NavLink>

          <NavLink to="/employers" className={navLinkClass}>
            Employers
          </NavLink>

          <NavLink to="/safety" className={navLinkClass}>
            Safety
          </NavLink>

          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>

          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {userRole ? (
            <>
              <Link
                to={getDashboardLink()}
                className="rounded-full border border-teal-400/40 px-5 py-2 text-sm font-semibold text-teal-300 hover:bg-teal-500 hover:text-zinc-950"
              >
                {getDashboardLabel()}
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-full border border-red-400/40 px-5 py-2 text-sm font-semibold text-red-300 hover:bg-red-500 hover:text-white"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white hover:border-teal-400 hover:text-teal-300"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className="rounded-full bg-yellow-400 px-5 py-2 text-sm font-bold text-zinc-950 hover:bg-yellow-300"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-xl border border-white/10 p-2 text-white md:hidden"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {isOpen && (
        <div className="border-t border-white/10 bg-zinc-950 px-6 py-5 md:hidden">
          <div className="flex flex-col gap-4 text-sm font-semibold">
            <NavLink
              to="/"
              onClick={() => setIsOpen(false)}
              className={navLinkClass}
            >
              Home
            </NavLink>

            <NavLink
              to="/jobs"
              onClick={() => setIsOpen(false)}
              className={navLinkClass}
            >
              Jobs
            </NavLink>

            <NavLink
              to="/employers"
              onClick={() => setIsOpen(false)}
              className={navLinkClass}
            >
              Employers
            </NavLink>

            <NavLink
              to="/safety"
              onClick={() => setIsOpen(false)}
              className={navLinkClass}
            >
              Safety
            </NavLink>

            <NavLink
              to="/about"
              onClick={() => setIsOpen(false)}
              className={navLinkClass}
            >
              About
            </NavLink>

            <NavLink
              to="/contact"
              onClick={() => setIsOpen(false)}
              className={navLinkClass}
            >
              Contact
            </NavLink>

            <div className="mt-4 border-t border-white/10 pt-4">
              {userRole ? (
                <div className="flex flex-col gap-3">
                  <Link
                    to={getDashboardLink()}
                    onClick={() => setIsOpen(false)}
                    className="rounded-xl border border-teal-400/40 px-4 py-3 text-center text-sm font-semibold text-teal-300 hover:bg-teal-500 hover:text-zinc-950"
                  >
                    {getDashboardLabel()}
                  </Link>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="rounded-xl border border-red-400/40 px-4 py-3 text-sm font-semibold text-red-300 hover:bg-red-500 hover:text-white"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    to="/signin"
                    onClick={() => setIsOpen(false)}
                    className="rounded-xl border border-white/20 px-4 py-3 text-center text-sm font-semibold text-white hover:border-teal-400 hover:text-teal-300"
                  >
                    Sign In
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="rounded-xl bg-yellow-400 px-4 py-3 text-center text-sm font-bold text-zinc-950 hover:bg-yellow-300"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar