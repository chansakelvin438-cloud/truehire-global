import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import {
  ArrowRight,
  BriefcaseBusiness,
  Lock,
  Mail,
  ShieldCheck,
  UserCheck,
} from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { loginUser } from "../services/api"

function SignIn() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const requiredRole = searchParams.get("requiredRole")
  const returnTo = searchParams.get("returnTo") || ""

  const [accountType, setAccountType] = useState(requiredRole || "jobseeker")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function getRoleLabel(role) {
    if (role === "jobseeker") return "Job Seeker"
    if (role === "employer") return "Employer"
    if (role === "admin") return "Admin"
    return "User"
  }

  function getDefaultRedirect(role) {
    if (role === "jobseeker") return "/dashboard"
    if (role === "employer") return "/employer-dashboard"
    if (role === "admin") return "/admin-dashboard"
    return "/"
  }

  function mapBackendRole(role) {
  if (role === "JOB_SEEKER") return "jobseeker"
  if (role === "EMPLOYER") return "employer"
  if (role === "ADMIN") return "admin"
  return role
}

function formatVerificationStatus(status) {
  if (status === "VERIFICATION_PENDING") return "Verification Pending"
  if (status === "SUBMITTED_FOR_REVIEW") return "Submitted for Review"
  if (status === "VERIFIED") return "Verified"
  if (status === "FLAGGED") return "Flagged"
  if (status === "REJECTED") return "Rejected"
  return "Verification Pending"
}

function normaliseCurrentUser(user) {
  const mappedRole = mapBackendRole(user.role)

  return {
    id: user.id,
    role: mappedRole,
    backendRole: user.role,
    displayName: user.name,
    email: user.email,
    phone: user.phone || "",
    companyName:
      mappedRole === "employer"
        ? user.employerProfile?.companyName || user.name
        : "",
    employerProfile: user.employerProfile,
    jobSeekerProfile: user.jobSeekerProfile,
  }
}

async function handleSignIn(event) {
  event.preventDefault()

  const formData = new FormData(event.target)
  const email = formData.get("email")
  const password = formData.get("password")

  if (requiredRole && accountType !== requiredRole) {
    setError(
      `This page requires a ${getRoleLabel(
        requiredRole
      )} account. Please choose the correct account type.`
    )
    return
  }

  try {
    setLoading(true)
    setError("")

    const response = await loginUser({
      email,
      password,
      role: accountType,
    })

    const currentUser = normaliseCurrentUser(response.user)

    localStorage.setItem("authToken", response.token)
    localStorage.setItem("currentUser", JSON.stringify(currentUser))
    localStorage.setItem("userRole", currentUser.role)
    localStorage.setItem("isLoggedIn", "true")

    if (currentUser.role === "employer") {
      localStorage.setItem(
        "employerVerificationStatus",
        formatVerificationStatus(response.user.employerProfile?.verificationStatus)
      )
    }

    navigate(returnTo || getDefaultRedirect(currentUser.role))
  } catch (error) {
    setError(error.message)
  } finally {
    setLoading(false)
  }
}

  function clearCurrentSession() {
    localStorage.removeItem("authToken")
    localStorage.removeItem("currentUser")
    localStorage.removeItem("userRole")
    localStorage.removeItem("isLoggedIn")
    setError("")
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <section className="relative overflow-hidden px-6 py-20">
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl"></div>
        <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-yellow-400/10 blur-3xl"></div>

        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-2 text-sm font-bold text-teal-300">
              <ShieldCheck size={16} />
              Secure account access
            </p>

            <h1 className="mt-6 text-5xl font-extrabold tracking-tight md:text-6xl">
              Access your TrueHire Global account.
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
              Sign in as a job seeker, employer, or admin to continue using protected
              TrueHire Global features.
            </p>

            {requiredRole && (
              <div className="mt-8 rounded-3xl border border-yellow-400/20 bg-yellow-400/10 p-6">
                <h2 className="text-xl font-extrabold text-yellow-300">
                  Correct account required
                </h2>

                <p className="mt-3 text-sm leading-7 text-zinc-300">
                  This page requires a{" "}
                  <span className="font-bold text-white">
                    {getRoleLabel(requiredRole)}
                  </span>{" "}
                  account. Please sign in with the correct account type to continue.
                </p>
              </div>
            )}

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-3xl font-extrabold text-teal-300">Jobs</p>
                <p className="mt-2 text-sm text-zinc-400">
                  Apply and track safely
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-3xl font-extrabold text-yellow-300">
                  Employers
                </p>
                <p className="mt-2 text-sm text-zinc-400">
                  Post verified adverts
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-3xl font-extrabold text-emerald-300">
                  Admin
                </p>
                <p className="mt-2 text-sm text-zinc-400">
                  Review and protect
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-teal-500/10">
            <div className="rounded-[1.5rem] border border-white/10 bg-zinc-950 p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-teal-300">
                    Sign In
                  </p>

                  <h2 className="mt-2 text-3xl font-extrabold">
                    Continue to your dashboard
                  </h2>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 text-zinc-950">
                  <UserCheck size={28} />
                </div>
              </div>

              {error && (
                <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/10 p-4">
                  <p className="text-sm font-semibold text-red-300">{error}</p>
                </div>
              )}

              <form onSubmit={handleSignIn} className="mt-8 space-y-5">
                <div>
                  <label className="text-sm font-bold text-zinc-300">
                    Account Type
                  </label>

                  <select
                    value={accountType}
                    onChange={(event) => setAccountType(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-4 text-sm text-white outline-none focus:border-teal-400"
                  >
                    <option value="jobseeker">Job Seeker</option>
                    <option value="employer">Employer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-zinc-300">
                    Email Address
                  </label>

                  <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                    <Mail size={19} className="text-teal-300" />

                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-zinc-300">
                    Password
                  </label>

                  <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                    <Lock size={19} className="text-yellow-300" />

                    <input
                      name="password"
                      type="password"
                      required
                      placeholder="Enter password"
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                    />
                  </div>
                </div>
                <div className="mt-3 text-right">
                  <Link
                    to="/forgot-password"
                    className="text-sm font-bold text-teal-300 hover:text-teal-200"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-extrabold ${
                      loading
                        ? "cursor-not-allowed bg-zinc-700 text-zinc-400"
                        : "bg-yellow-400 text-zinc-950 hover:bg-yellow-300"
                    }`}
                  >
                    {loading ? "Signing In..." : "Sign In"}
                    {!loading && <ArrowRight size={17} />}
                </button>
              </form>

              <div className="mt-6 rounded-2xl border border-teal-400/20 bg-teal-400/10 p-5">
                <h3 className="font-bold text-teal-300">
                  Testing note
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  This is still a front-end login simulation. Real secure authentication
                  will be added later with the backend.
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/register"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-teal-400/40 px-5 py-3 text-sm font-bold text-teal-300 hover:bg-teal-500 hover:text-zinc-950"
                >
                  Create Account
                  <BriefcaseBusiness size={17} />
                </Link>

                <button
                  type="button"
                  onClick={clearCurrentSession}
                  className="inline-flex flex-1 items-center justify-center rounded-2xl border border-red-400/40 px-5 py-3 text-sm font-bold text-red-300 hover:bg-red-500 hover:text-white"
                >
                  Clear Session
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default SignIn