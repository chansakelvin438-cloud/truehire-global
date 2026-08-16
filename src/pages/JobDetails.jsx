import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock,
  Heart,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  XCircle,
} from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { getPublicBackendJob } from "../services/api"
import Seo from "../components/Seo"

function stripHtml(value) {
  return String(value || "").replace(/<[^>]*>/g, "").trim()
}

function toIsoDate(value) {
  if (!value) return undefined

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return undefined
  }

  return date.toISOString()
}

function buildJobPostingJsonLd(job) {
  if (!job) return null

  const description = `
    <p>${stripHtml(job.description || "Job opportunity listed on TrueHire Global.")}</p>
    <p><strong>Requirements:</strong> ${stripHtml(job.requirements || "See job advert for requirements.")}</p>
    <p><strong>Experience:</strong> ${stripHtml(job.experience || "Not specified.")}</p>
  `

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description,
    datePosted: toIsoDate(job.createdAt),
    validThrough: toIsoDate(job.deadline),
    employmentType: String(job.type || "FULL_TIME").toUpperCase().replaceAll(" ", "_"),
    hiringOrganization: {
      "@type": "Organization",
      name: job.company || "Verified Employer",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location || "Zambia",
        addressCountry: "ZM",
      },
    },
    identifier: {
      "@type": "PropertyValue",
      name: "TrueHire Global",
      value: job.id,
    },
  }

  if (job.companyLogo) {
    jsonLd.hiringOrganization.logo = job.companyLogo
  }

  if (String(job.type || "").toLowerCase().includes("remote")) {
    jsonLd.jobLocationType = "TELECOMMUTE"
    jsonLd.applicantLocationRequirements = {
      "@type": "Country",
      name: "Zambia",
    }
  }

  return jsonLd
}

function JobDetails() {
  const { id } = useParams()

  const [job, setJob] = useState(null)
  const [loadingJob, setLoadingJob] = useState(true)
  const [jobError, setJobError] = useState("")
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function loadJobDetails() {
      try {
        setLoadingJob(true)
        setJobError("")

        const response = await getPublicBackendJob(id)
        setJob(response.job)

        const savedJobs = JSON.parse(localStorage.getItem("savedJobs") || "[]")
        const isAlreadySaved = savedJobs.some((savedJob) => {
          if (typeof savedJob === "string") return savedJob === id
          return savedJob.id === id
        })

        setSaved(isAlreadySaved)
      } catch (error) {
        setJobError(error.message || "Failed to load job details")
      } finally {
        setLoadingJob(false)
      }
    }

    loadJobDetails()
  }, [id])

  function handleSaveJob() {
    if (!job) return

    const savedJobs = JSON.parse(localStorage.getItem("savedJobs") || "[]")

    const isAlreadySaved = savedJobs.some((savedJob) => {
      if (typeof savedJob === "string") return savedJob === job.id
      return savedJob.id === job.id
    })

    if (isAlreadySaved) {
      setSaved(true)
      return
    }

    const updatedSavedJobs = [
      ...savedJobs,
      {
        id: job.id,
        title: job.title,
        company: job.company,
        companyLogo: job.companyLogo,
        location: job.location,
        category: job.category,
        type: job.type,
        salary: job.salary,
        savedAt: new Date().toISOString(),
      },
    ]

    localStorage.setItem("savedJobs", JSON.stringify(updatedSavedJobs))
    setSaved(true)
  }

  const isClosed =
    job && (!job.canApply || job.isDeadlineReached || !job.isDeadlineValid)

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Seo
        title={job ? `${job.title} at ${job.company}` : "Job Details"}
        description={
          job
            ? `${job.title} at ${job.company} in ${job.location}. Apply through TrueHire Global.`
            : "View verified job details on TrueHire Global."
        }
        path={job ? `/jobs/${job.id}` : "/jobs"}
        jsonLd={buildJobPostingJsonLd(job)}
      />
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

          {loadingJob && (
            <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center">
              <p className="text-sm font-bold text-teal-300">
                Loading job details...
              </p>
            </div>
          )}

          {jobError && (
            <div className="mt-10 rounded-[2rem] border border-red-400/20 bg-red-400/10 p-10 text-center">
              <AlertTriangle size={40} className="mx-auto text-red-300" />

              <h1 className="mt-5 text-3xl font-extrabold text-red-300">
                Job not available
              </h1>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-zinc-300">
                {jobError}
              </p>

              <Link
                to="/jobs"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-7 py-3 text-sm font-extrabold text-zinc-950 hover:bg-yellow-300"
              >
                Browse Jobs
                <ArrowRight size={17} />
              </Link>
            </div>
          )}

          {!loadingJob && !jobError && job && (
            <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_390px] lg:items-start">
              <div>
                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-teal-500/10 md:p-10">
                  <div className="flex flex-col gap-6 md:flex-row md:items-start">
                    <CompanyLogo logo={job.companyLogo} company={job.company} />

                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-2 text-sm font-bold text-teal-300">
                          <ShieldCheck size={16} />
                          Approved Listing
                        </span>

                        <span className="rounded-full bg-yellow-400/10 px-4 py-2 text-sm font-bold text-yellow-300">
                          {job.type || "Job"}
                        </span>

                        <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-zinc-300">
                          {job.category || "General"}
                        </span>

                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${
                            isClosed
                              ? "bg-red-400/10 text-red-300"
                              : "bg-emerald-400/10 text-emerald-300"
                          }`}
                        >
                          {isClosed ? (
                            <XCircle size={16} />
                          ) : (
                            <CheckCircle2 size={16} />
                          )}
                          {isClosed ? job.deadlineStatus || "Closed" : "Open"}
                        </span>
                      </div>

                      <h1 className="mt-6 text-5xl font-extrabold tracking-tight md:text-6xl">
                        {job.title || "Untitled Job"}
                      </h1>

                      <div className="mt-5 flex flex-wrap gap-4 text-sm text-zinc-400">
                        <span className="inline-flex items-center gap-2">
                          <Building2 size={17} className="text-teal-300" />
                          {job.company || "Verified Employer"}
                        </span>

                        <span className="inline-flex items-center gap-2">
                          <MapPin size={17} className="text-teal-300" />
                          {job.location || "Location not specified"}
                        </span>

                        <span className="inline-flex items-center gap-2">
                          <CalendarDays size={17} className="text-teal-300" />
                          Deadline: {job.deadline || "Not specified"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {isClosed && (
                    <div className="mt-8 rounded-2xl border border-red-400/20 bg-red-400/10 p-5">
                      <h2 className="flex items-center gap-2 font-extrabold text-red-300">
                        <XCircle size={22} />
                        Applications Closed
                      </h2>

                      <p className="mt-2 text-sm leading-7 text-zinc-300">
                        This job is no longer accepting applications because the deadline
                        has been reached or the deadline date is invalid.
                      </p>
                    </div>
                  )}

                  <div className="mt-8 grid gap-4 md:grid-cols-3">
                    <InfoCard
                      icon={BriefcaseBusiness}
                      label="Job Type"
                      value={job.type || "Not specified"}
                    />

                    <InfoCard
                      icon={Clock}
                      label="Experience"
                      value={job.experience || "Not specified"}
                    />

                    <InfoCard
                      icon={BadgeCheck}
                      label="Salary"
                      value={job.salary || "Negotiable"}
                    />
                  </div>
                </div>

                <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-8">
                  <h2 className="text-3xl font-extrabold">Job Description</h2>

                  <p className="mt-5 whitespace-pre-line text-sm leading-8 text-zinc-300">
                    {job.description || "No job description added."}
                  </p>
                </section>

                <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-8">
                  <h2 className="text-3xl font-extrabold">Requirements</h2>

                  <p className="mt-5 whitespace-pre-line text-sm leading-8 text-zinc-300">
                    {job.requirements || "No requirements added."}
                  </p>
                </section>

                <section className="mt-8 rounded-[2rem] border border-teal-400/20 bg-teal-400/10 p-8">
                  <h2 className="flex items-center gap-2 text-3xl font-extrabold text-teal-300">
                    <ShieldCheck size={28} />
                    TrueHire Safety Notice
                  </h2>

                  <p className="mt-5 text-sm leading-8 text-zinc-300">
                    Never pay registration fees, application fees, interview fees,
                    medical fees, transport fees, or recruitment payments to get a job.
                    Report any employer who asks for money.
                  </p>
                </section>
              </div>

              <aside className="lg:sticky lg:top-28 lg:h-fit">
                <div className="space-y-6">
                  <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-teal-500/10">
                    <div
                      className={`rounded-[1.5rem] border p-6 ${
                        isClosed
                          ? "border-red-400/20 bg-red-400/10"
                          : "border-yellow-400/20 bg-yellow-400/10"
                      }`}
                    >
                      <h2
                        className={`text-2xl font-extrabold ${
                          isClosed ? "text-red-300" : "text-yellow-300"
                        }`}
                      >
                        {isClosed ? "Applications Closed" : "Apply for this job"}
                      </h2>

                      <p className="mt-3 text-sm leading-7 text-zinc-300">
                        {isClosed
                          ? "The application deadline has been reached, so job seekers cannot apply for this advert."
                          : "Submit your application through TrueHire Global. You may need to sign in as a job seeker first."}
                      </p>

                      {isClosed ? (
                        <button
                          type="button"
                          disabled
                          className="mt-6 inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-2xl bg-zinc-700 px-5 py-4 text-sm font-extrabold text-zinc-400"
                        >
                          Applications Closed
                          <XCircle size={17} />
                        </button>
                      ) : (
                        <Link
                          to={`/jobs/${job.id}/apply`}
                          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-5 py-4 text-sm font-extrabold text-zinc-950 hover:bg-yellow-300"
                        >
                          Apply Now
                          <ArrowRight size={17} />
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={handleSaveJob}
                        disabled={saved}
                        className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-bold ${
                          saved
                            ? "cursor-not-allowed bg-emerald-400/10 text-emerald-300"
                            : "border border-teal-400/40 text-teal-300 hover:bg-teal-500 hover:text-zinc-950"
                        }`}
                      >
                        <Heart size={17} />
                        {saved ? "Job Saved" : "Save Job"}
                      </button>
                    </div>
                  </div>

                  <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                    <h2 className="text-2xl font-extrabold">Employer Contact</h2>

                    <div className="mt-5 space-y-4 text-sm text-zinc-300">
                      <p className="flex items-center gap-3">
                        <Mail size={18} className="text-teal-300" />
                        {job.email || "No email added"}
                      </p>

                      <p className="flex items-center gap-3">
                        <Phone size={18} className="text-teal-300" />
                        {job.phone || "No phone added"}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[2rem] border border-emerald-400/20 bg-emerald-400/10 p-6">
                    <h2 className="flex items-center gap-2 text-2xl font-extrabold text-emerald-300">
                      <CheckCircle2 size={24} />
                      Reviewed Advert
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-zinc-300">
                      This job advert has passed review and is visible to job seekers.
                    </p>
                  </div>

                  <div className="rounded-[2rem] border border-red-400/20 bg-red-400/10 p-6">
                    <h2 className="flex items-center gap-2 text-2xl font-extrabold text-red-300">
                      <AlertTriangle size={24} />
                      Report Suspicious Job
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-zinc-300">
                      If this employer asks you for money or suspicious documents, report
                      it immediately.
                    </p>

                    <Link
                      to={`/contact?type=report&job=${job.id}`}
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-red-400/40 px-5 py-3 text-sm font-bold text-red-300 hover:bg-red-500 hover:text-white"
                    >
                      Report Job
                      <ArrowRight size={17} />
                    </Link>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}

function CompanyLogo({ logo, company }) {
  const [hasError, setHasError] = useState(false)

  const initials = (company || "TH")
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase()

  if (logo && !hasError) {
    return (
      <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-white">
        <img
          src={logo}
          alt={`${company || "Company"} logo`}
          className="h-full w-full object-contain p-3"
          onError={() => setHasError(true)}
        />
      </div>
    )
  }

  return (
    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border border-teal-400/20 bg-teal-400/10 text-2xl font-extrabold text-teal-300">
      {initials}
    </div>
  )
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
      <Icon size={22} className="text-teal-300" />

      <p className="mt-4 text-xs font-bold uppercase tracking-wide text-zinc-500">
        {label}
      </p>

      <p className="mt-2 text-sm font-extrabold text-white">{value}</p>
    </div>
  )
}

export default JobDetails