import { useEffect, useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Filter,
  MapPin,
  Search,
  ShieldCheck,
} from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { getPublicBackendJobs } from "../services/api"

function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [jobs, setJobs] = useState([])
  const [loadingJobs, setLoadingJobs] = useState(true)
  const [jobsError, setJobsError] = useState("")

  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "")
  const [location, setLocation] = useState(searchParams.get("location") || "")
  const [category, setCategory] = useState(searchParams.get("category") || "")
  const [type, setType] = useState(searchParams.get("type") || "")

  useEffect(() => {
    async function loadJobs() {
      try {
        setLoadingJobs(true)
        setJobsError("")

        const response = await getPublicBackendJobs()
        setJobs(response.jobs || [])
      } catch (error) {
        setJobsError(error.message || "Failed to load jobs")
      } finally {
        setLoadingJobs(false)
      }
    }

    loadJobs()
  }, [])

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const searchText = `${job.title || ""} ${job.company || ""} ${
        job.description || ""
      } ${job.requirements || ""}`.toLowerCase()

      const matchesSearch =
        !searchTerm || searchText.includes(searchTerm.toLowerCase())

      const matchesLocation =
        !location ||
        (job.location || "").toLowerCase().includes(location.toLowerCase())

      const matchesCategory =
        !category || (job.category || "").toLowerCase() === category.toLowerCase()

      const matchesType =
        !type || (job.type || "").toLowerCase() === type.toLowerCase()

      return matchesSearch && matchesLocation && matchesCategory && matchesType
    })
  }, [jobs, searchTerm, location, category, type])

  function handleSearch(event) {
    event.preventDefault()

    const params = {}

    if (searchTerm) params.q = searchTerm
    if (location) params.location = location
    if (category) params.category = category
    if (type) params.type = type

    setSearchParams(params)
  }

  function clearFilters() {
    setSearchTerm("")
    setLocation("")
    setCategory("")
    setType("")
    setSearchParams({})
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <section className="relative overflow-hidden px-6 py-20">
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl"></div>
        <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-yellow-400/10 blur-3xl"></div>

        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-2 text-sm font-bold text-teal-300">
                <ShieldCheck size={16} />
                Verified Public Jobs
              </p>

              <h1 className="mt-6 text-5xl font-extrabold tracking-tight md:text-6xl">
                Find safer, verified opportunities.
              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-400">
                Browse approved jobs from the backend database. Only admin-approved
                jobs appear publicly on TrueHire Global.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <div className="rounded-[1.5rem] border border-teal-400/20 bg-teal-400/10 p-6">
                <CheckCircle2 size={34} className="text-teal-300" />

                <h2 className="mt-5 text-2xl font-extrabold">
                  Backend jobs active
                </h2>

                <p className="mt-3 text-sm leading-7 text-zinc-300">
                  This page now reads approved job adverts from Prisma, not
                  localStorage.
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSearch}
            className="mt-12 rounded-[2rem] border border-white/10 bg-white/5 p-6"
          >
            <div className="grid gap-4 md:grid-cols-4">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-zinc-950 px-4 py-4 md:col-span-2">
                <Search size={19} className="text-teal-300" />

                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search job title, company, or keyword"
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                />
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-zinc-950 px-4 py-4">
                <MapPin size={19} className="text-teal-300" />

                <input
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="Location"
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-5 py-4 text-sm font-extrabold text-zinc-950 hover:bg-yellow-300"
              >
                Search Jobs
                <ArrowRight size={17} />
              </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="rounded-2xl border border-white/10 bg-zinc-900 px-4 py-4 text-sm text-white outline-none focus:border-teal-400"
              >
                <option value="">All Categories</option>
                <option value="Sales & Customer Service">
                  Sales & Customer Service
                </option>
                <option value="Procurement & Logistics">
                  Procurement & Logistics
                </option>
                <option value="Data & Technology">Data & Technology</option>
                <option value="Finance & Accounting">Finance & Accounting</option>
                <option value="NGO & Development">NGO & Development</option>
                <option value="Remote Jobs">Remote Jobs</option>
              </select>

              <select
                value={type}
                onChange={(event) => setType(event.target.value)}
                className="rounded-2xl border border-white/10 bg-zinc-900 px-4 py-4 text-sm text-white outline-none focus:border-teal-400"
              >
                <option value="">All Job Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>

              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-5 py-4 text-sm font-bold text-zinc-300 hover:border-teal-400/40 hover:text-teal-300"
              >
                <Filter size={17} />
                Clear Filters
              </button>
            </div>
          </form>

          <div className="mt-10">
            {loadingJobs && (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
                <p className="text-sm font-bold text-teal-300">
                  Loading approved jobs...
                </p>
              </div>
            )}

            {jobsError && (
              <div className="rounded-3xl border border-red-400/20 bg-red-400/10 p-10 text-center">
                <p className="text-sm font-bold text-red-300">{jobsError}</p>
              </div>
            )}

            {!loadingJobs && !jobsError && filteredJobs.length > 0 && (
              <div className="grid gap-6">
                {filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}

            {!loadingJobs && !jobsError && filteredJobs.length === 0 && (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-500 text-zinc-950">
                  <BriefcaseBusiness size={32} />
                </div>

                <h2 className="mt-6 text-2xl font-extrabold">
                  No approved jobs found
                </h2>

                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-400">
                  Approve a job from the Admin Dashboard, then refresh this page.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

function JobCard({ job }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 transition hover:border-teal-400/40 hover:bg-white/[0.07]">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-teal-400/10 px-3 py-1 text-xs font-bold text-teal-300">
              {job.category || "General"}
            </span>

            <span className="rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-bold text-yellow-300">
              {job.type || "Job"}
            </span>

            <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
              Admin Approved
            </span>
          </div>

          <h2 className="mt-4 text-2xl font-extrabold">
            {job.title || "Untitled Job"}
          </h2>

          <p className="mt-2 text-sm font-bold text-zinc-300">
            {job.company || "Verified Employer"}
          </p>

          <p className="mt-2 text-sm text-zinc-400">
            {job.location || "Location not specified"} •{" "}
            {job.salary || "Salary not specified"}
          </p>

          <p className="mt-4 line-clamp-2 max-w-4xl text-sm leading-7 text-zinc-400">
            {job.description || "No description added."}
          </p>
        </div>

        <Link
          to={`/jobs/${job.id}`}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-yellow-400 px-6 py-3 text-sm font-extrabold text-zinc-950 hover:bg-yellow-300"
        >
          View Job
          <ArrowRight size={17} />
        </Link>
      </div>
    </div>
  )
}

export default Jobs