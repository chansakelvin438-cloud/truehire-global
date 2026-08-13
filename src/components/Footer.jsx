import { Link } from "react-router-dom"
import { BriefcaseBusiness, Check, ShieldCheck } from "lucide-react"

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-zinc-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500 text-zinc-950">
                <ShieldCheck size={30} />

                <div className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400 text-zinc-950 ring-4 ring-zinc-950">
                  <Check size={14} strokeWidth={4} />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold">
                    TrueHire <span className="text-teal-300">Global</span>
                  </h2>

                  <BriefcaseBusiness size={16} className="text-yellow-400" />
                </div>

                <p className="text-sm text-zinc-400">
                  A Chansa Enterprises Platform
                </p>
              </div>
            </Link>

            <p className="mt-6 max-w-lg text-sm leading-7 text-zinc-400">
              TrueHire Global connects job seekers with verified employers across
              Zambia, Africa, and global markets while promoting safer and more
              trusted online hiring.
            </p>

            <p className="mt-5 inline-flex rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-2 text-xs font-bold text-teal-300">
              Verified Jobs. Trusted Employers. Real Careers.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-black text-white">Support</h3>

            <nav className="mt-5 flex flex-col gap-4 text-sm font-bold">
              <Link
                to="/contact"
                className="text-zinc-400 transition-colors duration-200 hover:text-yellow-300"
              >
                Contact Support
              </Link>

              <Link
                to="/safety"
                className="text-zinc-400 transition-colors duration-200 hover:text-yellow-300"
              >
                Report a Fake Job
              </Link>

              <Link
                to="/about"
                className="text-zinc-400 transition-colors duration-200 hover:text-yellow-300"
              >
                About TrueHire
              </Link>

              <Link
                to="/privacy"
                className="text-zinc-400 transition-colors duration-200 hover:text-yellow-300"
              >
                Privacy Policy
              </Link>

              <Link
                to="/terms"
                className="text-zinc-400 transition-colors duration-200 hover:text-yellow-300"
              >
                Terms of Use
              </Link>

              <Link
                to="/pricing"
                className="text-zinc-400 transition-colors duration-200 hover:text-yellow-300"
              >
                Pricing
              </Link>

              <Link
                to="/payment-policy"
                className="text-zinc-400 transition-colors duration-200 hover:text-yellow-300"
              >
                Payment Policy
              </Link>

              <Link
                to="/job-posting-policy"
                className="text-zinc-400 transition-colors duration-200 hover:text-yellow-300"
              >
                Job Posting Policy
              </Link>

              <Link
                to="/employer-verification-policy"
                className="text-zinc-400 transition-colors duration-200 hover:text-yellow-300"
              >
                Employer Verification Policy
              </Link>

              <Link
                to="/applicant-safety-policy"
                className="text-zinc-400 transition-colors duration-200 hover:text-yellow-300"
              >
                Applicant Safety Policy
              </Link>

              <Link
                to="/register"
                className="text-zinc-400 transition-colors duration-200 hover:text-yellow-300"
              >
                Create Account
              </Link>
            </nav>
          </div>

        </div>

        <div className="mt-10 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 text-sm text-zinc-500 md:flex-row">
          <p>© 2026 TrueHire Global. All rights reserved.</p>

          <p>Owned and operated by Chansa Enterprises.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer