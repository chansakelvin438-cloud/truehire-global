import { Link } from "react-router-dom"
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  CreditCard,
  FileCheck2,
  ShieldCheck,
  Users,
} from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

function Employers() {
  const benefits = [
    "Post job adverts for admin review",
    "Build employer trust through verification",
    "Receive applications from job seekers",
    "Update application statuses",
    "Protect your brand from fake job abuse",
  ]

  const steps = [
    {
      title: "Create employer account",
      description:
        "Register your company profile and access the employer dashboard.",
      icon: Building2,
    },
    {
      title: "Submit verification",
      description:
        "Add company details, registration number, TPIN, and supporting documents.",
      icon: BadgeCheck,
    },
    {
      title: "Post job advert",
      description:
        "Submit job details for admin review before public publishing.",
      icon: BriefcaseBusiness,
    },
    {
      title: "Review applications",
      description:
        "Track applicants, shortlist candidates, schedule interviews, or reject applications.",
      icon: Users,
    },
  ]

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <section className="relative overflow-hidden px-6 py-20">
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl"></div>
        <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-yellow-400/10 blur-3xl"></div>

        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-2 text-sm font-bold text-teal-300">
                <Building2 size={16} />
                For Employers
              </p>

              <h1 className="mt-6 text-5xl font-extrabold tracking-tight md:text-6xl">
                Hire with trust on TrueHire Global.
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
                TrueHire Global helps employers post safer job adverts, build trust with
                job seekers, and manage applications through a verification-first hiring
                workflow.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/employers/post-job"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-yellow-400 px-7 py-3 text-sm font-extrabold text-zinc-950 hover:bg-yellow-300"
                >
                  Post a Job
                  <ArrowRight size={17} />
                </Link>

                <Link
                  to="/employer-verification"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-teal-400/40 px-7 py-3 text-sm font-bold text-teal-300 hover:bg-teal-500 hover:text-zinc-950"
                >
                  Verify Employer
                  <ShieldCheck size={17} />
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-teal-500/10">
              <div className="rounded-[1.5rem] border border-white/10 bg-zinc-950 p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-teal-300">
                      Employer Pricing
                    </p>

                    <h2 className="mt-3 text-5xl font-extrabold">
                      K50{" "}
                      <span className="text-base font-semibold text-zinc-400">
                        per advert
                      </span>
                    </h2>

                  </div>

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-zinc-950">
                    <CreditCard size={28} />
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  {benefits.map((benefit, index) => (
                    <p key={index} className="flex items-center gap-3 text-sm text-zinc-300">
                      <CheckCircle2 size={18} className="text-teal-300" />
                      {benefit}
                    </p>
                  ))}
                </div>

                <div className="mt-8 rounded-3xl border border-yellow-400/30 bg-yellow-400/10 p-6">
                  <h3 className="text-xl font-black text-yellow-300">
                    Manual payment active
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-zinc-300">
                    Employers can currently post job adverts and submit payment references
                    manually. TrueHire admin confirms or rejects each payment before the job
                    moves to review.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <div className="max-w-3xl">
              <p className="inline-flex rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-sm font-bold text-yellow-300">
                How it works
              </p>

              <h2 className="mt-6 text-4xl font-extrabold tracking-tight md:text-5xl">
                A safer employer journey from posting to hiring.
              </h2>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => {
                const Icon = step.icon

                return (
                  <div
                    key={index}
                    className="rounded-3xl border border-white/10 bg-white/5 p-6"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500 text-zinc-950">
                      <Icon size={28} />
                    </div>

                    <p className="mt-6 text-sm font-bold text-yellow-300">
                      Step {index + 1}
                    </p>

                    <h3 className="mt-2 text-2xl font-extrabold">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-zinc-400">
                      {step.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-16 rounded-[2rem] border border-teal-400/20 bg-teal-400/10 p-8 md:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="text-4xl font-extrabold">
                  Ready to post a verified job advert?
                </h2>

                <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-300">
                  Create an employer account, submit verification details, and post your
                  first job advert for admin review.
                </p>
              </div>

              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-yellow-400 px-7 py-3 text-sm font-extrabold text-zinc-950 hover:bg-yellow-300"
              >
                Create Employer Account
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

export default Employers