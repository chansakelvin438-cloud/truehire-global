import { Link } from "react-router-dom"
import {
  ArrowRight,
  BadgeCheck,
  CreditCard,
  FileCheck2,
  ShieldCheck,
} from "lucide-react"

function EmployerSection() {
  return (
    <section className="relative overflow-hidden bg-zinc-950 px-6 py-20 text-white">
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-yellow-400/10 blur-3xl"></div>

      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="inline-flex rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-sm font-bold uppercase tracking-wide text-yellow-300">
            For Employers
          </p>

          <h2 className="mt-6 text-4xl font-extrabold tracking-tight md:text-5xl">
            Post verified job adverts and attract serious talent.
          </h2>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
            TrueHire Global helps employers reach job seekers across Zambia, Africa,
            and global markets through a trust-focused hiring platform. Every employer
            account can go through verification before gaining stronger trust status.
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
              to="/employers"
              className="inline-flex items-center justify-center rounded-full border border-teal-400/40 px-7 py-3 text-sm font-bold text-teal-300 hover:bg-teal-500 hover:text-zinc-950"
            >
              Learn More
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-3xl font-extrabold text-yellow-300">$3</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Future posting fee per advert
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-3xl font-extrabold text-teal-300">Safe</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Admin-reviewed job adverts
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-3xl font-extrabold text-emerald-300">Trust</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Employer verification workflow
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-teal-500/10">
          <div className="rounded-[1.5rem] border border-white/10 bg-zinc-950 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-wide text-teal-300">
                  EMPLOYER POSTING PLAN
                </p>

                <div className="mt-5 flex items-end gap-3">
                  <span className="text-6xl font-black text-white">K50</span>
                  <span className="pb-2 text-lg font-bold text-zinc-400">
                    launch fee per job advert
                  </span>
                </div>

                <p className="mt-6 text-sm leading-7 text-zinc-300">
                  Manual payment confirmation is active. Employers submit a mobile money or bank
                  transaction reference, and TrueHire admin confirms payment before the job moves
                  to review.
                </p>
              </div>

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-zinc-950">
                <CreditCard size={28} />
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="rounded-2xl border border-teal-400/20 bg-teal-400/10 p-5">
                <div className="flex gap-4">
                  <BadgeCheck className="mt-1 text-teal-300" size={22} />

                  <div>
                    <h4 className="font-bold">Employer identity review</h4>
                    <p className="mt-1 text-sm leading-6 text-zinc-400">
                      Employers can submit company details for verification before
                      building public trust.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-5">
                <div className="flex gap-4">
                  <FileCheck2 className="mt-1 text-yellow-300" size={22} />

                  <div>
                    <h4 className="font-bold">Admin approval before publishing</h4>
                    <p className="mt-1 text-sm leading-6 text-zinc-400">
                      Job adverts are reviewed before appearing publicly to job seekers.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-5">
                <div className="flex gap-4">
                  <ShieldCheck className="mt-1 text-red-300" size={22} />

                  <div>
                    <h4 className="font-bold">Scam prevention controls</h4>
                    <p className="mt-1 text-sm leading-6 text-zinc-400">
                      Suspicious adverts asking applicants for money are flagged for
                      safety review.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Link
              to="/employers"
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-500 px-5 py-3 text-sm font-extrabold text-zinc-950 hover:bg-teal-400"
            >
              View Employer Benefits
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EmployerSection