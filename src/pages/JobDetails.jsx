import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  Star,
} from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { getPublicJobs } from "../data/jobs"

function JobDetails() {
  const { id } = useParams()
  const publicJobs = getPublicJobs()
  const job = publicJobs.find((item) => String(item.id) === String(id))

  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    if (!job) return

    const savedJobs = JSON.parse(localStorage.getItem("savedJobs") || "[]")

    const jobIsSaved = savedJobs.some(
      (savedJobId) => String(savedJobId) === String(job.id)
    )

    setIsSaved(jobIsSaved)
  }, [job])

  function toggleSaveJob() {
    if (!job) return

    const savedJobs = JSON.parse(localStorage.getItem("savedJobs") || "[]")

    const jobIsSaved = savedJobs.some(
      (savedJobId) => String(savedJobId) === String(job.id)
    )

    let updatedSavedJobs

    if (jobIsSaved) {
      updatedSavedJobs = savedJobs.filter(
        (savedJobId) => String(savedJobId) !== String(job.id)
      )
      setIsSaved(false)
    } else {
      updatedSavedJobs = [...savedJobs, job.id]
      setIsSaved(true)
    }

    localStorage.setItem("savedJobs", JSON.stringify(updatedSavedJobs))
  }

  if (!job) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <Navbar />

        <section className="px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-400 text-zinc-950">
                <AlertTriangle size={32} />
              </div>

              <h1 className="mt-6 text-4xl font-extrabold">Job not found</h1>

              <p className="mx-auto mt-4 max-w-xl text-zinc-400">
                The job you are looking for does not exist or may have been removed.
              </p>

              <Link
                to="/jobs"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-7 py-3 text-sm font-extrabold text-zinc-950 hover:bg-yellow-300"
              >
                Back to Jobs
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    )
  }

  const responsibilities = Array.isArray(job.responsibilities)
    ? job.responsibilities
    : ["Responsibilities will be confirmed by the employer."]

  const requirements = Array.isArray(job.requirements)
    ? job.requirements
    : typeof job.requirements === "string"
    ? job.requirements
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean)
    : ["Requirements will be confirmed by the employer."]

  const isHighlyVerified = job.trustBadge === "Highly Verified Employer"

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <section className="relative overflow-hidden px-6 py-20">
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl"></div>
        <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-yellow-400/10 blur-3xl"></div>

        <div className="relative mx-auto max-w-7xl">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 text-sm font-bold text-teal-300 hover:text-teal-200"
          >
            ← Back to Jobs
          </Link>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
            <div>
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-teal-500/10 md:p-10">
                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
                  <div>
                    <div className="flex flex-wrap gap-3">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${
                          isHighlyVerified
                            ? "border border-yellow-400/30 bg-yellow-400/10 text-yellow-300"
                            : "border border-teal-400/30 bg-teal-400/10 text-teal-300"
                        }`}
                      >
                        <ShieldCheck size={16} />
                        {job.trustBadge || "Verified Employer"}
                      </span>

                      {job.source === "employer-submitted" && (
                        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-bold text-emerald-300">
                          <BadgeCheck size={16} />
                          Admin Approved
                        </span>
                      )}
                    </div>

                    <h1 className="mt-6 text-5xl font-extrabold tracking-tight md:text-6xl">
                      {job.title}
                    </h1>

                    <p className="mt-5 text-xl font-semibold text-zinc-300">
                      {job.company}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-4 text-sm text-zinc-400">
                      <span className="inline-flex items-center gap-2">
                        <MapPin size={17} className="text-teal-300" />
                        {job.location}
                      </span>

                      <span className="inline-flex items-center gap-2">
                        <BriefcaseBusiness size={17} className="text-yellow-300" />
                        {job.type}
                      </span>

                      <span className="inline-flex items-center gap-2">
                        <Clock size={17} className="text-emerald-300" />
                        {job.experience}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl ${
                      isHighlyVerified
                        ? "bg-yellow-400 text-zinc-950"
                        : "bg-teal-500 text-zinc-950"
                    }`}
                  >
                    <ShieldCheck size={42} />
                  </div>
                </div>

                <div className="mt-10 grid gap-4 md:grid-cols-4">
                  <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
                    <p className="text-sm text-zinc-500">Category</p>
                    <p className="mt-2 font-bold text-white">{job.category}</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
                    <p className="text-sm text-zinc-500">Salary</p>
                    <p className="mt-2 font-bold text-white">
                      {job.salary || "Negotiable"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
                    <p className="text-sm text-zinc-500">Deadline</p>
                    <p className="mt-2 font-bold text-white">
                      {job.deadline || "Not specified"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
                    <p className="text-sm text-zinc-500">Access</p>
                    <p className="mt-2 font-bold text-teal-300">Free to apply</p>
                  </div>
                </div>
              </div>

              {job.source === "employer-submitted" && (
                <div className="mt-8 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-6">
                  <h2 className="flex items-center gap-2 text-2xl font-extrabold text-emerald-300">
                    <BadgeCheck size={24} />
                    Admin-approved job advert
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-zinc-300">
                    This job was submitted by an employer and approved by TrueHire Global
                    admin before appearing publicly.
                  </p>
                </div>
              )}

              <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8">
                <h2 className="text-3xl font-extrabold">Job Description</h2>

                <p className="mt-5 text-base leading-8 text-zinc-300">
                  {job.description}
                </p>
              </div>

              <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8">
                <h2 className="text-3xl font-extrabold">Responsibilities</h2>

                <div className="mt-6 space-y-4">
                  {responsibilities.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <CheckCircle2
                        size={22}
                        className="mt-1 shrink-0 text-teal-300"
                      />
                      <p className="leading-7 text-zinc-300">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8">
                <h2 className="text-3xl font-extrabold">Requirements</h2>

                <div className="mt-6 space-y-4">
                  {requirements.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <CheckCircle2
                        size={22}
                        className="mt-1 shrink-0 text-yellow-300"
                      />
                      <p className="leading-7 text-zinc-300">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 rounded-3xl border border-red-400/20 bg-red-400/10 p-8">
                <h2 className="flex items-center gap-2 text-2xl font-extrabold text-red-300">
                  <AlertTriangle size={24} />
                  Safety reminder
                </h2>

                <p className="mt-3 text-sm leading-7 text-zinc-300">
                  Never pay money to get a job. TrueHire Global flags job adverts that
                  request application fees, registration fees, interview fees, medical
                  fees, or recruitment payments.
                </p>

                <Link
                  to={`/contact?type=report&job=${encodeURIComponent(job.title)}`}
                  className="mt-6 inline-flex items-center gap-2 rounded-full border border-red-400/40 px-6 py-3 text-sm font-bold text-red-300 hover:bg-red-500 hover:text-white"
                >
                  Report Suspicious Job
                  <ArrowRight size={17} />
                </Link>
              </div>
            </div>

            <aside className="lg:sticky lg:top-28 lg:h-fit">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-teal-500/10">
                <div className="rounded-[1.5rem] border border-white/10 bg-zinc-950 p-6">
                  <h2 className="text-2xl font-extrabold">Apply for this job</h2>

                  <p className="mt-3 text-sm leading-6 text-zinc-400">
                    Apply safely through TrueHire Global. Your application will be saved
                    under your job seeker dashboard.
                  </p>

                  <Link
                    to={`/jobs/${job.id}/apply`}
                    className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-5 py-4 text-sm font-extrabold text-zinc-950 hover:bg-yellow-300"
                  >
                    Apply Now
                    <ArrowRight size={17} />
                  </Link>

                  <button
                    type="button"
                    onClick={toggleSaveJob}
                    className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border px-5 py-4 text-sm font-bold ${
                      isSaved
                        ? "border-teal-400/40 bg-teal-400/10 text-teal-300"
                        : "border-white/20 text-white hover:border-teal-400 hover:text-teal-300"
                    }`}
                  >
                    <Star size={17} />
                    {isSaved ? "Saved Job" : "Save Job"}
                  </button>

                  <div className="mt-8 space-y-4">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm text-zinc-500">Trust Level</p>
                      <p
                        className={`mt-1 font-bold ${
                          isHighlyVerified ? "text-yellow-300" : "text-teal-300"
                        }`}
                      >
                        {job.trustBadge || "Verified Employer"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm text-zinc-500">Work Type</p>
                      <p className="mt-1 font-bold text-white">{job.type}</p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm text-zinc-500">Deadline</p>
                      <p className="mt-1 font-bold text-white">{job.deadline}</p>
                    </div>
                  </div>

                  <div className="mt-8 rounded-2xl border border-teal-400/20 bg-teal-400/10 p-5">
                    <h3 className="font-bold text-teal-300">
                      TrueHire safety check
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-zinc-300">
                      Apply only through safe channels. Do not send money to any employer
                      or recruiter.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default JobDetails