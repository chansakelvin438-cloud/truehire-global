import { Link } from "react-router-dom"
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  MapPin,
  ShieldCheck,
} from "lucide-react"

function JobCard({ job }) {
  const isHighlyVerified = job.trustBadge === "Highly Verified Employer"

  return (
    <div className="group rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-teal-400/40 hover:bg-white/10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="inline-flex rounded-full bg-teal-400/10 px-3 py-1 text-xs font-bold text-teal-300">
            {job.category}
          </span>

          <h3 className="mt-5 text-2xl font-extrabold text-white">
            {job.title}
          </h3>

          <p className="mt-2 text-sm font-semibold text-zinc-300">
            {job.company}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
            isHighlyVerified
              ? "bg-yellow-400 text-zinc-950"
              : "bg-teal-500 text-zinc-950"
          }`}
        >
          <ShieldCheck size={25} />
        </div>
      </div>

      <p className="mt-5 line-clamp-3 text-sm leading-6 text-zinc-400">
        {job.description}
      </p>

      <div className="mt-6 space-y-3 text-sm text-zinc-400">
        <div className="flex items-center gap-3">
          <MapPin size={17} className="text-teal-300" />
          <span>{job.location}</span>
        </div>

        <div className="flex items-center gap-3">
          <BriefcaseBusiness size={17} className="text-yellow-300" />
          <span>
            {job.type} • {job.experience}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <CalendarDays size={17} className="text-red-300" />
          <span>Deadline: {job.deadline}</span>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            isHighlyVerified
              ? "bg-yellow-400/10 text-yellow-300"
              : "bg-emerald-400/10 text-emerald-300"
          }`}
        >
          {job.trustBadge || "Verified Employer"}
        </span>

        <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-bold text-zinc-300">
          {job.salary || "Negotiable"}
        </span>
      </div>

      <Link
        to={`/jobs/${job.id}`}
        className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-5 py-3 text-sm font-extrabold text-zinc-950 transition hover:bg-yellow-300"
      >
        View Job
        <ArrowRight size={17} />
      </Link>
    </div>
  )
}

export default JobCard