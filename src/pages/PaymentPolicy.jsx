import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import {
  AlertTriangle,
  CheckCircle,
  CreditCard,
  FileText,
  RefreshCw,
  ShieldCheck,
} from "lucide-react"

const sections = [
  {
    title: "1. Employer Payment Requirement",
    text: "Employers are required to pay the applicable job advert fee before a submitted job advert can move to admin review. During the launch period, the standard launch advert fee is K50 per verified job advert unless otherwise stated by TrueHire Global.",
  },
  {
    title: "2. Manual Payment Confirmation",
    text: "Payments are currently confirmed manually. After making payment through the accepted payment channel, the employer must submit the transaction reference, payment method, payer phone number where applicable, and any relevant note through the employer dashboard.",
  },
  {
    title: "3. Payment Does Not Guarantee Approval",
    text: "Payment of a job advert fee does not automatically guarantee job approval or publication. Every job advert remains subject to TrueHire Global’s review, verification, safety checks, and platform rules.",
  },
  {
    title: "4. Rejected Job Adverts",
    text: "TrueHire Global may reject job adverts that appear fake, misleading, discriminatory, unsafe, unlawful, incomplete, or inconsistent with the platform’s purpose. Job adverts requesting job seekers to pay recruitment fees, interview fees, medical fees, training fees, or processing fees may be rejected.",
  },
  {
    title: "5. Refund Consideration",
    text: "Refunds may be considered only where a genuine payment error occurred, duplicate payment was made, or payment was received but the job advert was not reviewed due to an internal platform issue. Refunds are not automatic and are assessed case by case.",
  },
  {
    title: "6. No Job Seeker Fees",
    text: "Job seekers must not pay employers, recruiters, agents, or third parties for job applications through TrueHire Global. Any request for payment from a job seeker should be reported immediately through the platform’s safety reporting channels.",
  },
  {
    title: "7. Payment Records",
    text: "Employers should keep their transaction confirmation messages and payment references. TrueHire Global may request payment evidence when verifying a manual payment submission.",
  },
  {
    title: "8. Future Online Payments",
    text: "Automatic online checkout may be introduced in the future when approved payment gateway access becomes available. Until then, manual payment confirmation remains the official payment process.",
  },
]

export default function PaymentPolicy() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <main className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-black/20 md:p-10">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-sm font-bold text-yellow-300">
              <CreditCard size={16} />
              TrueHire Global Policy
            </p>

            <h1 className="text-4xl font-black tracking-tight md:text-6xl">
              Payment & Refund Policy
            </h1>

            <p className="mt-6 text-lg leading-8 text-zinc-300">
              This policy explains how employer job advert payments, manual
              payment confirmations, job review, and refund considerations work
              on TrueHire Global.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-teal-400/20 bg-teal-400/10 p-5">
                <ShieldCheck className="text-teal-300" size={26} />
                <h2 className="mt-3 font-black text-white">
                  Payment before review
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  Employer job adverts move to admin review after payment is
                  confirmed.
                </p>
              </div>

              <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-5">
                <RefreshCw className="text-yellow-300" size={26} />
                <h2 className="mt-3 font-black text-white">
                  Manual confirmation
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  Employers submit transaction references for admin
                  confirmation.
                </p>
              </div>

              <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-5">
                <AlertTriangle className="text-red-300" size={26} />
                <h2 className="mt-3 font-black text-white">
                  Safety first
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  Payment does not guarantee approval of unsafe or suspicious
                  job adverts.
                </p>
              </div>
            </div>

            <div className="mt-10 space-y-5">
              {sections.map((section) => (
                <section
                  key={section.title}
                  className="rounded-2xl border border-white/10 bg-zinc-950/70 p-5"
                >
                  <div className="flex gap-3">
                    <CheckCircle
                      className="mt-1 shrink-0 text-teal-300"
                      size={20}
                    />
                    <div>
                      <h2 className="text-lg font-black text-white">
                        {section.title}
                      </h2>
                      <p className="mt-2 text-sm leading-7 text-zinc-300">
                        {section.text}
                      </p>
                    </div>
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-10 rounded-3xl border border-yellow-400/30 bg-yellow-400/10 p-6">
              <div className="flex gap-3">
                <FileText className="mt-1 shrink-0 text-yellow-300" size={24} />
                <div>
                  <h2 className="text-xl font-black text-yellow-300">
                    Important notice
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-zinc-300">
                    This policy is part of TrueHire Global’s operational rules
                    for employer payments and job advert review. It may be
                    updated as the platform grows, payment methods change, or
                    additional verification processes are introduced.
                  </p>
                </div>
              </div>
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