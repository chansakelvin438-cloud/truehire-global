import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User,
  UserPlus,
} from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { registerUser } from "../services/api"

function Register() {
  const navigate = useNavigate()

  const [accountType, setAccountType] = useState("jobseeker")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  function getDefaultRedirect(role) {
    if (role === "jobseeker") return "/dashboard"
    if (role === "employer") return "/employer-dashboard"
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

async function handleRegister(event) {
  event.preventDefault()

  const formData = new FormData(event.target)

  const password = formData.get("password")
  const confirmPassword = formData.get("confirmPassword")
  const email = formData.get("email")
  const firstName = formData.get("firstName") || ""
  const lastName = formData.get("lastName") || ""
  const companyName = formData.get("companyName") || ""

  if (password !== confirmPassword) {
    setError("Passwords do not match. Please confirm your password.")
    return
  }

  try {
    setLoading(true)
    setError("")

    const response = await registerUser({
      role: accountType,
      firstName,
      lastName,
      companyName,
      name:
        accountType === "employer"
          ? companyName
          : `${firstName} ${lastName}`.trim(),
      email,
      phone: formData.get("phone"),
      password,
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

    setSuccess(true)

    setTimeout(() => {
      navigate(getDefaultRedirect(currentUser.role))
    }, 1200)
  } catch (error) {
    setError(error.message)
  } finally {
    setLoading(false)
  }
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
              <UserPlus size={16} />
              Create your account
            </p>

            <h1 className="mt-6 text-5xl font-extrabold tracking-tight md:text-6xl">
              Join TrueHire Global safely.
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
              Create a job seeker account to apply for verified jobs, or register as an
              employer to post job adverts after review and verification.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-3xl font-extrabold text-teal-300">Free</p>
                <p className="mt-2 text-sm text-zinc-400">
                  Job seeker registration
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-3xl font-extrabold text-yellow-300">$3</p>
                <p className="mt-2 text-sm text-zinc-400">
                  Future job advert fee
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-3xl font-extrabold text-emerald-300">
                  Safe
                </p>
                <p className="mt-2 text-sm text-zinc-400">
                  Admin-reviewed adverts
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-3xl border border-red-400/20 bg-red-400/10 p-6">
              <h2 className="font-extrabold text-red-300">
                Safety reminder
              </h2>

              <p className="mt-3 text-sm leading-7 text-zinc-300">
                Job seekers should never pay money to get a job. TrueHire Global is
                being built to reduce fake adverts, suspicious employers, and recruitment
                scams.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-teal-500/10">
            <div className="rounded-[1.5rem] border border-white/10 bg-zinc-950 p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-teal-300">
                    Register
                  </p>

                  <h2 className="mt-2 text-3xl font-extrabold">
                    Create your TrueHire account
                  </h2>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 text-zinc-950">
                  <ShieldCheck size={28} />
                </div>
              </div>

              {success && (
                <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                  <p className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
                    <CheckCircle2 size={18} />
                    Account created successfully. Redirecting...
                  </p>
                </div>
              )}

              {error && (
                <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/10 p-4">
                  <p className="text-sm font-semibold text-red-300">{error}</p>
                </div>
              )}

              <form onSubmit={handleRegister} className="mt-8 space-y-5">
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
                  </select>
                </div>

                {accountType === "employer" ? (
                  <div>
                    <label className="text-sm font-bold text-zinc-300">
                      Company Name
                    </label>

                    <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                      <Building2 size={19} className="text-teal-300" />

                      <input
                        name="companyName"
                        type="text"
                        required
                        placeholder="Enter company name"
                        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-bold text-zinc-300">
                        First Name
                      </label>

                      <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                        <User size={19} className="text-teal-300" />

                        <input
                          name="firstName"
                          type="text"
                          required
                          placeholder="First name"
                          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-bold text-zinc-300">
                        Last Name
                      </label>

                      <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                        <User size={19} className="text-yellow-300" />

                        <input
                          name="lastName"
                          type="text"
                          required
                          placeholder="Last name"
                          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

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
                    Phone Number
                  </label>

                  <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                    <Phone size={19} className="text-emerald-300" />

                    <input
                      name="phone"
                      type="tel"
                      required
                      placeholder="e.g. +260..."
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                    />
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
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
                        placeholder="Password"
                        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-zinc-300">
                      Confirm Password
                    </label>

                    <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                      <Lock size={19} className="text-red-300" />

                      <input
                        name="confirmPassword"
                        type="password"
                        required
                        placeholder="Confirm password"
                        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                      />
                    </div>
                  </div>
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
                  {loading ? "Creating Account..." : "Create Account"}
                  {!loading && <ArrowRight size={17} />}
                </button>
              </form>

              <div className="mt-6 rounded-2xl border border-teal-400/20 bg-teal-400/10 p-5">
                <h3 className="font-bold text-teal-300">
                  Already have an account?
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  Sign in to continue to your dashboard, applications, job alerts, or
                  employer tools.
                </p>

                <Link
                  to="/signin"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-yellow-300 hover:text-yellow-200"
                >
                  Sign In
                  <BriefcaseBusiness size={17} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default Register