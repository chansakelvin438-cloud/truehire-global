import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import {
  AlertTriangle,
  CheckCircle,
  FileWarning,
  ShieldCheck,
} from "lucide-react"

const allowedRules = [
  "Jobs must be genuine, lawful, and clearly described.",
  "Employers must provide a real company name, location, contact details, and role information.",
  "Job descriptions must explain the duties, requirements, deadline, and application process.",
  "Employers must only post opportunities they are authorised to advertise.",
  "Employers must cooperate with TrueHire Global verification checks where required.",
]

const prohibitedRules = [
  "Fake, misleading, or scam job adverts are not allowed.",
  "Employers must not ask job seekers to pay application, interview, processing, medical, training, or placement fees.",
  "Jobs involving fraud, illegal activity, exploitation, harassment, or unsafe work may be rejected.",
  "Adverts with false salary claims, fake company names, or suspicious contact details may be rejected.",
  "Duplicate, incomplete, offensive, discriminatory, or spam adverts may be removed.",
]

export default function JobPostingPolicy() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <main className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-black/20 md:p-10">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-2 text-sm font-bold text-teal-300">
              <ShieldCheck size={16} />
              TrueHire Global Policy
            </p>

            <h1 className="text-4xl font-black tracking-tight md:text-6xl">
              Job Posting Policy
            </h1>

            <p className="mt-6 text-lg leading-8 text-zinc-300">
              This policy explains the standards employers must follow when
              posting job adverts on TrueHire Global. Our aim is to protect job
              seekers, reduce scam adverts, and promote trusted hiring.
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <section className="rounded-3xl border border-teal-400/20 bg-teal-400/10 p-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-teal-300" size={26} />
                  <h2 className="text-2xl font-black text-white">
                    Allowed job adverts
                  </h2>
                </div>

                <ul className="mt-5 space-y-4">
                  {allowedRules.map((rule) => (
                    <li key={rule} className="flex gap-3 text-sm leading-6 text-zinc-300">
                      <CheckCircle className="mt-0.5 shrink-0 text-teal-300" size={18} />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-3xl border border-red-400/20 bg-red-400/10 p-6">
                <div className="flex items-center gap-3">
                  <FileWarning className="text-red-300" size={26} />
                  <h2 className="text-2xl font-black text-white">
                    Prohibited job adverts
                  </h2>
                </div>

                <ul className="mt-5 space-y-4">
                  {prohibitedRules.map((rule) => (
                    <li key={rule} className="flex gap-3 text-sm leading-6 text-zinc-300">
                      <AlertTriangle className="mt-0.5 shrink-0 text-red-300" size={18} />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <div className="mt-10 rounded-3xl border border-yellow-400/30 bg-yellow-400/10 p-6">
              <h2 className="text-xl font-black text-yellow-300">
                Review and removal
              </h2>

              <p className="mt-3 text-sm leading-7 text-zinc-300">
                TrueHire Global may review, reject, flag, suspend, or remove any
                job advert that appears unsafe, misleading, incomplete, unlawful,
                or inconsistent with the platform’s purpose. Payment of a job
                advert fee does not guarantee publication.
              </p>
            </div>

            <p className="mt-8 text-sm text-zinc-500">
              Last updated: August 2026
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}