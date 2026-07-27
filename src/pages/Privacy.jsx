import { Link } from "react-router-dom"
import {
  ArrowRight,
  Database,
  FileText,
  Lock,
  ShieldCheck,
  UserCheck,
} from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

function Privacy() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <section className="relative overflow-hidden px-6 py-20">
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl"></div>
        <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-yellow-400/10 blur-3xl"></div>

        <div className="relative mx-auto max-w-5xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-2 text-sm font-bold text-teal-300">
            <ShieldCheck size={16} />
            Privacy Policy
          </p>

          <h1 className="mt-6 text-5xl font-extrabold tracking-tight md:text-6xl">
            How TrueHire Global handles user information.
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-400">
            This page explains how TrueHire Global intends to collect, use, and protect
            information from job seekers, employers, and administrators.
          </p>

          <div className="mt-10 rounded-[2rem] border border-yellow-400/20 bg-yellow-400/10 p-6">
            <h2 className="text-xl font-extrabold text-yellow-300">
              Important note
            </h2>

            <p className="mt-3 text-sm leading-7 text-zinc-300">
              This is a draft privacy policy for development purposes. Before public
              launch, it should be reviewed and adjusted for the applicable laws,
              operating countries, payment systems, and data protection requirements.
            </p>
          </div>

          <div className="mt-10 space-y-6">
            <PolicyBlock
              icon={UserCheck}
              title="1. Information we may collect"
              text="TrueHire Global may collect account details such as name, email address, phone number, employer company name, job seeker profile details, CV file names, application records, job alerts, and employer verification details."
            />

            <PolicyBlock
              icon={Database}
              title="2. How information is used"
              text="Information may be used to create accounts, show job matches, process applications, allow employers to review candidates, support employer verification, detect suspicious job adverts, and improve platform safety."
            />

            <PolicyBlock
              icon={Lock}
              title="3. Account and security"
              text="During development, this project uses front-end localStorage for testing only. In production, user accounts, passwords, CVs, documents, and payments must be handled through a secure backend with proper authentication and database protection."
            />

            <PolicyBlock
              icon={ShieldCheck}
              title="4. Job seeker safety"
              text="TrueHire Global is designed to reduce fake job risks by supporting employer verification, admin approval, scam-risk checks, safety reports, and warnings against payment-based job scams."
            />

            <PolicyBlock
              icon={FileText}
              title="5. Documents and CVs"
              text="In the current front-end version, uploaded CVs and employer documents are not truly uploaded. Only file names are stored for testing. Real file uploads must be added later using secure backend storage."
            />

            <PolicyBlock
              icon={Database}
              title="6. Future payments"
              text="Employer payments are currently disabled. When payments are introduced, payment processing should be handled through secure payment providers and should not expose sensitive card, wallet, or banking information in the front-end application."
            />
          </div>

          <div className="mt-10 rounded-[2rem] border border-teal-400/20 bg-teal-400/10 p-8">
            <h2 className="text-3xl font-extrabold">Need help?</h2>

            <p className="mt-3 text-sm leading-7 text-zinc-300">
              Contact TrueHire Global for questions about privacy, account information,
              fake job reports, or employer verification.
            </p>

            <Link
              to="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-7 py-3 text-sm font-extrabold text-zinc-950 hover:bg-yellow-300"
            >
              Contact Support
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

function PolicyBlock({ icon: Icon, title, text }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
      <div className="flex gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-500 text-zinc-950">
          <Icon size={25} />
        </div>

        <div>
          <h2 className="text-2xl font-extrabold">{title}</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-400">{text}</p>
        </div>
      </div>
    </div>
  )
}

export default Privacy