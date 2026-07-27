import { Link } from "react-router-dom"
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CreditCard,
  FileCheck2,
  Scale,
  ShieldCheck,
} from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

function Terms() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <section className="relative overflow-hidden px-6 py-20">
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl"></div>
        <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-yellow-400/10 blur-3xl"></div>

        <div className="relative mx-auto max-w-5xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-sm font-bold text-yellow-300">
            <Scale size={16} />
            Terms of Use
          </p>

          <h1 className="mt-6 text-5xl font-extrabold tracking-tight md:text-6xl">
            Rules for using TrueHire Global.
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-400">
            These terms explain expected behaviour for job seekers, employers, and
            platform administrators.
          </p>

          <div className="mt-10 rounded-[2rem] border border-yellow-400/20 bg-yellow-400/10 p-6">
            <h2 className="text-xl font-extrabold text-yellow-300">
              Development draft
            </h2>

            <p className="mt-3 text-sm leading-7 text-zinc-300">
              These terms are a draft for platform development. Before public launch,
              they should be reviewed and adjusted for your business model, country of
              operation, payment systems, data protection obligations, and employment law
              requirements.
            </p>
          </div>

          <div className="mt-10 space-y-6">
            <TermBlock
              icon={BriefcaseBusiness}
              title="1. Platform purpose"
              text="TrueHire Global is designed to connect job seekers with job opportunities and help employers publish safer, reviewed job adverts."
            />

            <TermBlock
              icon={BadgeCheck}
              title="2. Employer responsibilities"
              text="Employers must provide accurate company information, real contact details, clear job descriptions, honest requirements, and must not mislead applicants."
            />

            <TermBlock
              icon={AlertTriangle}
              title="3. No job seeker payment demands"
              text="Employers and recruiters must not ask applicants for registration fees, application fees, interview fees, medical fees, transport fees, recruitment fees, or any payment in exchange for employment."
            />

            <TermBlock
              icon={FileCheck2}
              title="4. Job advert review"
              text="Employer-submitted job adverts may be reviewed, approved, flagged, or rejected by administrators before appearing publicly on the platform."
            />

            <TermBlock
              icon={ShieldCheck}
              title="5. Safety reports"
              text="Users may report suspicious jobs or employers. TrueHire Global may review reports and take action such as flagging, rejecting, or removing suspicious content."
            />

            <TermBlock
              icon={CreditCard}
              title="6. Future employer payments"
              text="The planned employer posting fee is $3 per job advert. Payments are currently disabled and should only be activated after secure backend payment handling is implemented."
            />

            <TermBlock
              icon={Scale}
              title="7. Account misuse"
              text="Accounts may be restricted or removed if they are used for fake job adverts, fraudulent hiring, misleading applications, abuse, spam, or attempts to bypass safety controls."
            />
          </div>

          <div className="mt-10 rounded-[2rem] border border-red-400/20 bg-red-400/10 p-8">
            <h2 className="text-3xl font-extrabold text-red-300">
              Safety rule
            </h2>

            <p className="mt-3 text-sm leading-7 text-zinc-300">
              Job seekers should never pay money to get a job. Any advert asking for
              payment should be treated as suspicious and reported.
            </p>

            <Link
              to="/contact?type=report"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-7 py-3 text-sm font-extrabold text-zinc-950 hover:bg-yellow-300"
            >
              Report Fake Job
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

function TermBlock({ icon: Icon, title, text }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
      <div className="flex gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-zinc-950">
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

export default Terms