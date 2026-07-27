import { Link } from "react-router-dom"
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react"
import JobCard from "./JobCard"
import { getPublicJobs } from "../data/jobs"

function FeaturedJobs() {
  const jobs = getPublicJobs().slice(0, 3)

  return (
    <section className="relative overflow-hidden bg-zinc-950 px-6 py-20 text-white">
      <div className="absolute left-10 top-10 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl"></div>
      <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-yellow-400/10 blur-3xl"></div>

      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-sm font-bold text-yellow-300">
              <Sparkles size={16} />
              Featured verified opportunities
            </div>

            <h2 className="mt-6 max-w-3xl text-4xl font-extrabold tracking-tight md:text-5xl">
              Start with trusted jobs reviewed for safer applications.
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
              Every public job on TrueHire Global is designed to pass through admin
              review, employer checks, and scam-risk screening before job seekers apply.
            </p>
          </div>

          <Link
            to="/jobs"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-teal-400/40 px-6 py-3 text-sm font-bold text-teal-300 hover:bg-teal-500 hover:text-zinc-950"
          >
            Browse all jobs
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        <div className="mt-12 rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-500 text-zinc-950">
                <ShieldCheck size={24} />
              </div>

              <div>
                <h3 className="font-bold">Employer verification</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Employers can submit company details for stronger trust status.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-zinc-950">
                <ShieldCheck size={24} />
              </div>

              <div>
                <h3 className="font-bold">Admin approval</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Job adverts are reviewed before becoming visible to job seekers.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-400 text-zinc-950">
                <ShieldCheck size={24} />
              </div>

              <div>
                <h3 className="font-bold">Scam-risk checks</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Payment-related job scam wording is detected and flagged.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturedJobs