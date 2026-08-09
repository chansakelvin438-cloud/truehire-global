import { useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { confirmPasswordReset } from "../services/api"

function ResetPassword() {
  const [searchParams] = useSearchParams()

  const [identifier, setIdentifier] = useState(searchParams.get("identifier") || "")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [error, setError] = useState("")

  async function handleSubmit(event) {
    event.preventDefault()

    if (!identifier.trim() || !otp.trim() || !newPassword.trim()) {
      setError("Please enter your identifier, OTP, and new password.")
      return
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    try {
      setLoading(true)
      setError("")
      setSuccessMessage("")

      const response = await confirmPasswordReset({
        identifier: identifier.trim(),
        otp: otp.trim(),
        newPassword,
      })

      setSuccessMessage(response.message || "Password reset successfully.")
      setOtp("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      setError(error.message || "Failed to reset password.")
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
              Reset Password
            </p>

            <h1 className="mt-6 text-5xl font-extrabold tracking-tight md:text-6xl">
              Enter your OTP and new password.
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-400">
              Use the OTP prepared for your account. The OTP expires after 10 minutes
              and cannot be reused after a successful reset.
            </p>

            <div className="mt-8 rounded-[2rem] border border-yellow-400/20 bg-yellow-400/10 p-6">
              <ShieldCheck size={34} className="text-yellow-300" />

              <h2 className="mt-5 text-2xl font-extrabold text-yellow-300">
                Password safety
              </h2>

              <p className="mt-3 text-sm leading-7 text-zinc-300">
                Choose a strong password with at least 8 characters. Avoid using your
                name, phone number, company name, or simple passwords such as
                Password123.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-teal-500/10">
            {successMessage && (
              <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5">
                <h3 className="flex items-center gap-2 font-extrabold text-emerald-300">
                  <CheckCircle2 size={20} />
                  Password reset complete
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  {successMessage}
                </p>

                <Link
                  to="/signin"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-5 py-4 text-sm font-extrabold text-zinc-950 hover:bg-yellow-300"
                >
                  Go to Sign In
                  <ArrowRight size={17} />
                </Link>
              </div>
            )}

            {error && (
              <div className="mb-6 rounded-3xl border border-red-400/20 bg-red-400/10 p-5">
                <h3 className="flex items-center gap-2 font-extrabold text-red-300">
                  <AlertTriangle size={20} />
                  Reset failed
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-300">{error}</p>
              </div>
            )}

            {!successMessage && (
              <form onSubmit={handleSubmit}>
                <div>
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
                </div>

                <div className="mt-5">
                  <label className="text-sm font-bold text-zinc-300">
                    OTP Code
                  </label>

                  <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-zinc-950 px-4 py-4">
                    <KeyRound size={19} className="text-teal-300" />

                    <input
                      type="text"
                      value={otp}
                      onChange={(event) => setOtp(event.target.value)}
                      placeholder="Enter 6-digit OTP"
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <label className="text-sm font-bold text-zinc-300">
                    New Password
                  </label>

                  <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-zinc-950 px-4 py-4">
                    <Lock size={19} className="text-teal-300" />

                    <input
                      type="password"
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      placeholder="Enter new password"
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <label className="text-sm font-bold text-zinc-300">
                    Confirm New Password
                  </label>

                  <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-zinc-950 px-4 py-4">
                    <Lock size={19} className="text-teal-300" />

                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      placeholder="Confirm new password"
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                    />
                  </div>
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
                  {loading ? "Resetting Password..." : "Reset Password"}
                  {!loading && <ArrowRight size={17} />}
                </button>
              </form>
            )}

            <div className="mt-6 text-center text-sm text-zinc-400">
              Need a new OTP?{" "}
              <Link
                to="/forgot-password"
                className="font-bold text-teal-300 hover:text-teal-200"
              >
                Request again
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default ResetPassword