import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import {
  AlertTriangle,
  CheckCircle,
  FileWarning,
  LockKeyhole,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react"

const safetyRules = [
  "Job seekers should never pay application fees, interview fees, medical fees, training fees, transport fees, or placement fees to employers or recruiters.",
  "Job seekers should verify employer details before sharing sensitive personal information.",
  "Job seekers should be cautious of employers who use pressure, urgency, secrecy, or suspicious communication methods.",
  "Job seekers should report any suspicious job advert, fake employer, payment request, or unsafe hiring behaviour.",
  "Job seekers should use TrueHire Global’s official platform channels where possible when checking job advert details.",
]

const warningSigns = [
  "The employer asks you to pay money before getting a job.",
  "The advert promises unrealistic salary or guaranteed employment.",
  "The employer refuses to provide proper company details.",
  "The contact person uses suspicious emails, unknown numbers, or inconsistent company names.",
  "The employer requests sensitive documents without a clear and legitimate hiring reason.",
  "The job advert has poor details, unclear duties, or suspicious application instructions.",
]

const platformActions = [
  "TrueHire Global may review and remove suspicious job adverts.",
  "Reported job adverts may be investigated by admin.",
  "Employers who request illegal or suspicious payments from job seekers may be rejected, flagged, or restricted.",
  "TrueHire Global may use verification checks, scam-risk screening, and user reports to improve platform safety.",
]

export default function ApplicantSafetyPolicy() {
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
              Applicant Safety Policy
            </h1>

            <p className="mt-6 text-lg leading-8 text-zinc-300">
              This policy explains how job seekers can stay safe when using
              TrueHire Global. Our goal is to promote trusted hiring, reduce
              fake job adverts, and protect applicants from recruitment scams.
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-teal-400/20 bg-teal-400/10 p-5">
                <ShieldCheck className="text-teal-300" size={28} />
                <h2 className="mt-3 font-black text-white">
                  No applicant fees
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  Job seekers should not pay employers or recruiters to apply
                  for jobs.
                </p>
              </div>

              <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-5">
                <ShieldAlert className="text-yellow-300" size={28} />
                <h2 className="mt-3 font-black text-white">
                  Report suspicious jobs
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  Fake jobs, payment requests, and unsafe adverts should be
                  reported immediately.
                </p>
              </div>

              <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-5">
                <LockKeyhole className="text-red-300" size={28} />
                <h2 className="mt-3 font-black text-white">
                  Protect your data
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  Applicants should be careful when sharing personal documents
                  or sensitive information.
                </p>
              </div>
            </div>

            <section className="mt-10 rounded-3xl border border-white/10 bg-zinc-950/70 p-6">
              <h2 className="text-2xl font-black text-white">
                Applicant safety rules
              </h2>

              <ul className="mt-5 space-y-4">
                {safetyRules.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm leading-7 text-zinc-300"
                  >
                    <CheckCircle
                      className="mt-1 shrink-0 text-teal-300"
                      size={18}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-6 rounded-3xl border border-red-400/20 bg-red-400/10 p-6">
              <h2 className="text-2xl font-black text-white">
                Warning signs of a fake job
              </h2>

              <ul className="mt-5 space-y-4">
                {warningSigns.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm leading-7 text-zinc-300"
                  >
                    <AlertTriangle
                      className="mt-1 shrink-0 text-red-300"
                      size={18}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-6 rounded-3xl border border-white/10 bg-zinc-950/70 p-6">
              <h2 className="text-2xl font-black text-white">
                What TrueHire Global may do
              </h2>

              <ul className="mt-5 space-y-4">
                {platformActions.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm leading-7 text-zinc-300"
                  >
                    <FileWarning
                      className="mt-1 shrink-0 text-yellow-300"
                      size={18}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <div className="mt-10 rounded-3xl border border-yellow-400/30 bg-yellow-400/10 p-6">
              <h2 className="text-xl font-black text-yellow-300">
                Important notice
              </h2>

              <p className="mt-3 text-sm leading-7 text-zinc-300">
                TrueHire Global works to reduce unsafe and suspicious job
                adverts, but job seekers should still use caution and personal
                judgement. If a job advert or employer asks you to pay money,
                report it immediately.
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