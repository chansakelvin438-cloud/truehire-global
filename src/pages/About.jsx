import { Link } from "react-router-dom"
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  Globe2,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

function About() {
  const values = [
    {
      icon: ShieldCheck,
      title: "Safety first",
      description:
        "TrueHire Global is being built to reduce fake jobs and protect job seekers from recruitment scams.",
    },
    {
      icon: BadgeCheck,
      title: "Verified trust",
      description:
        "Employers can go through verification to build confidence with applicants.",
    },
    {
      icon: Users,
      title: "Real opportunity",
      description:
        "Job seekers get free access to jobs, applications, alerts, and career tracking tools.",
    },
    {
      icon: Globe2,
      title: "Global direction",
      description:
        "The platform starts with Zambia, expands across Africa, and is structured for global hiring.",
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
                <BriefcaseBusiness size={16} />
                About TrueHire Global
              </p>

              <h1 className="mt-6 text-5xl font-extrabold tracking-tight md:text-6xl">
                Verified Jobs. Trusted Employers. Real Careers.
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
                TrueHire Global is a Chansa Enterprises platform designed to connect job
                seekers with safer opportunities and help employers build trust through
                verification and admin-reviewed hiring.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/jobs"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-yellow-400 px-7 py-3 text-sm font-extrabold text-zinc-950 hover:bg-yellow-300"
                >
                  Find Jobs
                  <ArrowRight size={17} />
                </Link>

                <Link
                  to="/employers"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-teal-400/40 px-7 py-3 text-sm font-bold text-teal-300 hover:bg-teal-500 hover:text-zinc-950"
                >
                  Employer Solutions
                  <Building2 size={17} />
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-teal-500/10">
              <div className="grid gap-5 sm:grid-cols-2">
                <Stat title="Zambia first" text="Local market focus" colour="text-teal-300" />
                <Stat title="Africa next" text="Regional expansion" colour="text-yellow-300" />
                <Stat title="Global-ready" text="International direction" colour="text-emerald-300" />
                <Stat title="Free access" text="For job seekers" colour="text-white" />
              </div>
            </div>
          </div>

          <div className="mt-16 rounded-[2rem] border border-teal-400/20 bg-teal-400/10 p-8 md:p-10">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-teal-300">
                  Mission
                </p>

                <h2 className="mt-4 text-4xl font-extrabold">
                  Make online hiring safer and more trusted.
                </h2>
              </div>

              <p className="text-base leading-8 text-zinc-300">
                The platform is focused on solving one major problem: job seekers are
                exposed to fake adverts, unverified employers, and payment-based scams.
                TrueHire Global responds with employer verification, admin approval, scam
                risk detection, application tracking, and job seeker safety education.
              </p>
            </div>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => {
              const Icon = value.icon

              return (
                <div
                  key={index}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500 text-zinc-950">
                    <Icon size={28} />
                  </div>

                  <h3 className="mt-6 text-2xl font-extrabold">{value.title}</h3>

                  <p className="mt-3 text-sm leading-7 text-zinc-400">
                    {value.description}
                  </p>
                </div>
              )
            })}
          </div>

          <div className="mt-16 rounded-[2rem] border border-yellow-400/20 bg-yellow-400/10 p-8 md:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="flex items-center gap-3 text-4xl font-extrabold">
                  <Target className="text-yellow-300" size={34} />
                  Built under Chansa Enterprises
                </h2>

                <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-300">
                  TrueHire Global is part of the wider Chansa Enterprises digital
                  direction, focused on practical technology products that solve real
                  business and career problems.
                </p>
              </div>

              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-yellow-400 px-7 py-3 text-sm font-extrabold text-zinc-950 hover:bg-yellow-300"
              >
                Contact Us
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

function Stat({ title, text, colour }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
      <p className={`text-3xl font-extrabold ${colour}`}>{title}</p>
      <p className="mt-2 text-sm text-zinc-400">{text}</p>
    </div>
  )
}

export default About