import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Mail,
  Phone,
  ShieldCheck,
} from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { requestPasswordReset } from "../services/api"

function ForgotPassword() {
  const navigate = useNavigate()

  const [identifier, setIdentifier] = useState("")
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [error, setError] = useState("")
  const [devOtp, setDevOtp] = useState("")

  async function handleSubmit(event) {
    event.preventDefault()

    if (!identifier.trim()) {
      setError("Please enter your email address or phone number.")
      return
    }

    try {
      setLoading(true)
      setError("")
      setSuccessMessage("")
      setDevOtp("")

      const response = await requestPasswordReset(identifier.trim())

      setSuccessMessage(response.message || "Password reset OTP prepared.")
      setDevOtp(response.devOtp || "")

      setTimeout(() => {
        navigate(`/reset-password?identifier=${encodeURIComponent(identifier.trim())}`)
      }, 1200)
    } catch (error) {
      setError(error.message || "Failed to request password reset OTP.")
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

        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_430px] lg:items-start">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-2 text-sm font-bold text-teal-300">
              <KeyRound size={16} />
              Password Recovery
            </p>

            <h1 className="mt-6 text-5xl font-extrabold tracking-tight md:text-6xl">
              Forgot your password?
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-400">
              Enter your registered email address or phone number. TrueHire Global will
              prepare a one-time password so you can reset your account password.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <InfoCard
                icon={Mail}
                title="Email OTP"
                text="Use the email address registered on your TrueHire account."
              />

              <InfoCard
                icon={Phone}
                title="Phone OTP"
                text="Phone reset support is prepared. SMS delivery will be connected later."
              />
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-teal-500/10">
            <div className="rounded-[1.5rem] border border-teal-400/20 bg-teal-400/10 p-6">
              <ShieldCheck size={36} className="text-teal-300" />

              <h2 className="mt-5 text-2xl font-extrabold">
                Secure account recovery
              </h2>

              <p className="mt-3 text-sm leading-7 text-zinc-300">
                The OTP expires after 10 minutes and can only be used once.
              </p>
            </div>

            {successMessage && (
              <div className="mt-6 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5">
                <h3 className="flex items-center gap-2 font-extrabold text-emerald-300">
                  <CheckCircle2 size={20} />
                  OTP prepared
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  {successMessage}
                </p>

                {devOtp && (
                  <p className="mt-3 rounded-2xl bg-zinc-950 px-4 py-3 text-sm font-extrabold text-yellow-300">
                    Local testing OTP: {devOtp}
                  </p>
                )}
              </div>
            )}

            {error && (
              <div className="mt-6 rounded-3xl border border-red-400/20 bg-red-400/10 p-5">
                <h3 className="flex items-center gap-2 font-extrabold text-red-300">
                  <AlertTriangle size={20} />
                  Request failed
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-300">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8">
              <label className="text-sm font-bold text-zinc-300">
                Email Address or Phone Number
              </label>

              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-zinc-950 px-4 py-4">
                <Mail size={19} className="text-teal-300" />

                <input
                  type="text"
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  placeholder="e.g. user@email.com or +260..."
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-extrabold ${
                  loading
                    ? "cursor-not-allowed bg-zinc-700 text-zinc-400"
                    : "bg-yellow-400 text-zinc-950 hover:bg-yellow-300"
                }`}
              >
                {loading ? "Preparing OTP..." : "Send Reset OTP"}
                {!loading && <ArrowRight size={17} />}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-zinc-400">
              Remembered your password?{" "}
              <Link to="/signin" className="font-bold text-teal-300 hover:text-teal-200">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

function InfoCard({ icon: Icon, title, text }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <Icon size={26} className="text-yellow-300" />

      <h3 className="mt-4 text-xl font-extrabold">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-zinc-400">{text}</p>
    </div>
  )
}

export default ForgotPassword