import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import {
  AlertTriangle,
  Building2,
  CheckCircle,
  FileCheck,
  ShieldCheck,
} from "lucide-react"

const requirements = [
  "Employers may be asked to submit company registration details, TPIN/tax details, business address, contact person information, and supporting documents.",
  "The submitted company information must match the employer’s real business identity.",
  "Employers must use a valid email address and phone number that TrueHire Global can use for communication.",
  "Employers may be required to provide authorisation where a person is posting jobs on behalf of a company or organisation.",
]

const reviewRules = [
  "Verification is reviewed manually by TrueHire Global admin.",
  "Submitting verification documents does not automatically guarantee approval.",
  "TrueHire Global may approve, reject, or flag an employer account depending on the quality and authenticity of the information submitted.",
  "Employers with suspicious, incomplete, false, or misleading details may be rejected or restricted.",
]

const employerDuties = [
  "Post only genuine job opportunities.",
  "Do not charge job seekers application, interview, medical, training, or placement fees.",
  "Keep company details accurate and up to date.",
  "Respond professionally to applicants.",
  "Report any suspected misuse of the platform.",
]

export default function EmployerVerificationPolicy() {
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
              Employer Verification Policy
            </h1>

            <p className="mt-6 text-lg leading-8 text-zinc-300">
              This policy explains how TrueHire Global reviews employer accounts
              before allowing trusted hiring activity on the platform. Employer
              verification helps reduce fake job adverts, impersonation, and
              unsafe recruitment practices.
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-teal-400/20 bg-teal-400/10 p-5">
                <Building2 className="text-teal-300" size={28} />
                <h2 className="mt-3 font-black text-white">
                  Business identity
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  Employers must provide accurate company or organisation
                  details.
                </p>
              </div>

              <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-5">
                <FileCheck className="text-yellow-300" size={28} />
                <h2 className="mt-3 font-black text-white">
                  Document review
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  Verification documents may be reviewed before an employer is
                  approved.
                </p>
              </div>

              <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-5">
                <AlertTriangle className="text-red-300" size={28} />
                <h2 className="mt-3 font-black text-white">
                  Scam prevention
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  Suspicious, fake, or misleading employer accounts may be
                  rejected.
                </p>
              </div>
            </div>

            <section className="mt-10 rounded-3xl border border-white/10 bg-zinc-950/70 p-6">
              <h2 className="text-2xl font-black text-white">
                Verification requirements
              </h2>

              <ul className="mt-5 space-y-4">
                {requirements.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-7 text-zinc-300">
                    <CheckCircle className="mt-1 shrink-0 text-teal-300" size={18} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-6 rounded-3xl border border-white/10 bg-zinc-950/70 p-6">
              <h2 className="text-2xl font-black text-white">
                Review and approval
              </h2>

              <ul className="mt-5 space-y-4">
                {reviewRules.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-7 text-zinc-300">
                    <CheckCircle className="mt-1 shrink-0 text-yellow-300" size={18} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-6 rounded-3xl border border-white/10 bg-zinc-950/70 p-6">
              <h2 className="text-2xl font-black text-white">
                Employer responsibilities
              </h2>

              <ul className="mt-5 space-y-4">
                {employerDuties.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-7 text-zinc-300">
                    <ShieldCheck className="mt-1 shrink-0 text-teal-300" size={18} />
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
                TrueHire Global may update employer verification requirements as
                the platform grows. Verification helps improve trust, but it
                does not replace an applicant’s own due diligence. Job seekers
                should report suspicious job adverts or payment requests
                immediately.
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