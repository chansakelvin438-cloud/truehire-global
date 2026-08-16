import { Link } from "react-router-dom"
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  FileWarning,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Seo from "../components/Seo"

function Safety() {
  const redFlags = [
    "Employer asks for a registration fee",
    "Employer asks for an application or interview fee",
    "Employer asks for medical fees before employment",
    "Employer uses WhatsApp-only communication without company details",
    "Advert promises guaranteed employment",
    "Employer refuses to provide clear company identity",
  ]

  const safeActions = [
    "Apply only through trusted channels",
    "Check whether the employer is verified",
    "Research the company before sharing documents",
    "Report suspicious job adverts immediately",
    "Never send money to recruiters or employers",
  ]

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Seo
        title="Applicant Safety Centre"
        description="Learn how TrueHire Global reviews job adverts, discourages recruitment fees, and helps users report suspicious job posts."
        path="/safety"
      />
      <Navbar />

      <section className="relative overflow-hidden px-6 py-20">
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-red-500/10 blur-3xl"></div>
        <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl"></div>

        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-red-400/30 bg-red-400/10 px-4 py-2 text-sm font-bold text-red-300">
                <ShieldAlert size={16} />
                Safety Centre
              </p>

              <h1 className="mt-6 text-5xl font-extrabold tracking-tight md:text-6xl">
                Protect yourself from fake job adverts.
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
                TrueHire Global is designed around safer hiring. Job seekers should never
                pay money to get a job, attend an interview, or secure employment.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/contact?type=report"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-yellow-400 px-7 py-3 text-sm font-extrabold text-zinc-950 hover:bg-yellow-300"
                >
                  Report Fake Job
                  <ArrowRight size={17} />
                </Link>

                <Link
                  to="/jobs"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-teal-400/40 px-7 py-3 text-sm font-bold text-teal-300 hover:bg-teal-500 hover:text-zinc-950"
                >
                  Browse Verified Jobs
                  <BadgeCheck size={17} />
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-red-400/20 bg-red-400/10 p-8 shadow-2xl shadow-red-500/10">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-400 text-zinc-950">
                <AlertTriangle size={34} />
              </div>

              <h2 className="mt-6 text-4xl font-extrabold">
                The golden rule
              </h2>

              <p className="mt-4 text-lg leading-8 text-zinc-300">
                If someone asks you to pay money before getting a job, treat it as
                suspicious and report it.
              </p>

              <div className="mt-8 rounded-2xl border border-white/10 bg-zinc-950 p-5">
                <p className="text-sm font-bold text-red-300">
                  Do not pay registration, application, interview, medical, transport, or
                  recruitment fees.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-red-400/20 bg-red-400/10 p-8">
              <h2 className="flex items-center gap-3 text-3xl font-extrabold text-red-300">
                <FileWarning size={30} />
                Scam red flags
              </h2>

              <div className="mt-6 space-y-4">
                {redFlags.map((item, index) => (
                  <p key={index} className="flex gap-3 text-sm leading-6 text-zinc-300">
                    <AlertTriangle size={18} className="mt-1 shrink-0 text-red-300" />
                    {item}
                  </p>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-teal-400/20 bg-teal-400/10 p-8">
              <h2 className="flex items-center gap-3 text-3xl font-extrabold text-teal-300">
                <ShieldCheck size={30} />
                Safer actions
              </h2>

              <div className="mt-6 space-y-4">
                {safeActions.map((item, index) => (
                  <p key={index} className="flex gap-3 text-sm leading-6 text-zinc-300">
                    <CheckCircle2 size={18} className="mt-1 shrink-0 text-teal-300" />
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-16 rounded-[2rem] border border-white/10 bg-white/5 p-8 md:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="text-4xl font-extrabold">
                  Seen a suspicious job?
                </h2>

                <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-400">
                  Report it to TrueHire Global. Reports appear in the Admin Dashboard for
                  safety review.
                </p>
              </div>

              <Link
                to="/contact?type=report"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-yellow-400 px-7 py-3 text-sm font-extrabold text-zinc-950 hover:bg-yellow-300"
              >
                Report Now
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default Safety