import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import {
  ArrowRight,
  BriefcaseBusiness,
  Filter,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import JobCard from "../components/JobCard"
import { getPublicJobs } from "../data/jobs"

function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [keyword, setKeyword] = useState(searchParams.get("q") || "")
  const [location, setLocation] = useState(searchParams.get("location") || "")
  const [category, setCategory] = useState(searchParams.get("category") || "All")
  const [type, setType] = useState(searchParams.get("type") || "All")

  const publicJobs = getPublicJobs()

  const categories = [
    "All",
    "Sales & Customer Service",
    "Procurement & Logistics",
    "Data & Technology",
    "Finance & Accounting",
    "NGO & Development",
    "Remote Jobs",
  ]

  const jobTypes = [
    "All",
    "Full-time",
    "Part-time",
    "Contract",
    "Internship",
    "Remote",
    "Hybrid",
  ]

  useEffect(() => {
    setKeyword(searchParams.get("q") || "")
    setLocation(searchParams.get("location") || "")
    setCategory(searchParams.get("category") || "All")
    setType(searchParams.get("type") || "All")
  }, [searchParams])

  function handleSearch(event) {
    event.preventDefault()

    const params = new URLSearchParams()

    if (keyword.trim()) params.set("q", keyword.trim())
    if (location.trim()) params.set("location", location.trim())
    if (category !== "All") params.set("category", category)
    if (type !== "All") params.set("type", type)

    setSearchParams(params)
  }

  function clearFilters() {
    setKeyword("")
    setLocation("")
    setCategory("All")
    setType("All")
    setSearchParams({})
  }

  function jobMatchesSearch(job) {
    const searchText = `
      ${job.title}
      ${job.company}
      ${job.location}
      ${job.type}
      ${job.category}
      ${job.salary}
      ${job.experience}
      ${job.description}
      ${
        Array.isArray(job.requirements)
          ? job.requirements.join(" ")
          : job.requirements || ""
      }
      ${
        Array.isArray(job.responsibilities)
          ? job.responsibilities.join(" ")
          : job.responsibilities || ""
      }
    `.toLowerCase()

    const keywordMatch =
      !keyword.trim() || searchText.includes(keyword.trim().toLowerCase())

    const locationMatch =
      !location.trim() ||
      job.location.toLowerCase().includes(location.trim().toLowerCase())

    const categoryMatch = category === "All" || job.category === category

    const typeMatch = type === "All" || job.type === type

    return keywordMatch && locationMatch && categoryMatch && typeMatch
  }

  const filteredJobs = publicJobs.filter(jobMatchesSearch)

  const activeFilterCount = [
    keyword.trim(),
    location.trim(),
    category !== "All",
    type !== "All",
  ].filter(Boolean).length

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <section className="relative overflow-hidden px-6 py-20">
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl"></div>
        <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-yellow-400/10 blur-3xl"></div>

        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-2 text-sm font-bold text-teal-300">
                <ShieldCheck size={16} />
                Verified job opportunities
              </p>

              <h1 className="mt-6 text-5xl font-extrabold tracking-tight md:text-6xl">
                Find safer jobs from trusted employers.
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
                Search approved job adverts, filter by category, location, and work type,
                then apply through your TrueHire Global job seeker account.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/safety"
                  className="inline-flex items-center gap-2 rounded-full border border-red-400/30 bg-red-400/10 px-5 py-3 text-sm font-bold text-red-300 hover:bg-red-500 hover:text-white"
                >
                  Avoid fake jobs
                  <ArrowRight size={16} />
                </Link>

                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-5 py-3 text-sm font-extrabold text-zinc-950 hover:bg-yellow-300"
                >
                  Create free account
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-teal-500/10">
              <div className="rounded-[1.5rem] border border-white/10 bg-zinc-950 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-teal-300">
                      Job Search
                    </p>

                    <h2 className="mt-2 text-3xl font-extrabold">
                      Search verified adverts
                    </h2>
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500 text-zinc-950">
                    <SlidersHorizontal size={28} />
                  </div>
                </div>

                <form onSubmit={handleSearch} className="mt-8 space-y-4">
                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                    <Search size={20} className="text-teal-300" />

                    <input
                      value={keyword}
                      onChange={(event) => setKeyword(event.target.value)}
                      type="text"
                      placeholder="Search job title, skill, or company"
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                    />
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                    <MapPin size={20} className="text-yellow-300" />

                    <input
                      value={location}
                      onChange={(event) => setLocation(event.target.value)}
                      type="text"
                      placeholder="Location e.g. Lusaka, Kitwe, Remote"
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <select
                      value={category}
                      onChange={(event) => setCategory(event.target.value)}
                      className="rounded-2xl border border-white/10 bg-zinc-900 px-4 py-4 text-sm text-white outline-none focus:border-teal-400"
                    >
                      {categories.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>

                    <select
                      value={type}
                      onChange={(event) => setType(event.target.value)}
                      className="rounded-2xl border border-white/10 bg-zinc-900 px-4 py-4 text-sm text-white outline-none focus:border-teal-400"
                    >
                      {jobTypes.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="submit"
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-5 py-4 text-sm font-extrabold text-zinc-950 hover:bg-yellow-300"
                    >
                      Search Jobs
                      <ArrowRight size={17} />
                    </button>

                    <button
                      type="button"
                      onClick={clearFilters}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 px-5 py-4 text-sm font-bold text-white hover:border-red-400 hover:text-red-300"
                    >
                      <X size={17} />
                      Clear
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-zinc-400">Available Jobs</p>
              <h2 className="mt-2 text-3xl font-extrabold text-teal-300">
                {publicJobs.length}
              </h2>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-zinc-400">Search Results</p>
              <h2 className="mt-2 text-3xl font-extrabold text-yellow-300">
                {filteredJobs.length}
              </h2>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-zinc-400">Active Filters</p>
              <h2 className="mt-2 text-3xl font-extrabold text-emerald-300">
                {activeFilterCount}
              </h2>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-zinc-400">Job Seeker Access</p>
              <h2 className="mt-2 text-3xl font-extrabold text-white">Free</h2>
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-6 pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-2 text-sm font-bold text-teal-300">
                <Filter size={16} />
                Results
              </p>

              <h2 className="mt-4 text-4xl font-extrabold tracking-tight">
                {filteredJobs.length > 0
                  ? "Verified job results"
                  : "No matching jobs found"}
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
                {filteredJobs.length > 0
                  ? "Review the opportunities below and open any advert to see full details."
                  : "Try clearing filters or searching a broader keyword or location."}
              </p>
            </div>

            <Link
              to="/job-alerts"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-yellow-400/40 px-6 py-3 text-sm font-bold text-yellow-300 hover:bg-yellow-400 hover:text-zinc-950"
            >
              Set Job Alerts
              <ArrowRight size={17} />
            </Link>
          </div>

          {filteredJobs.length > 0 ? (
            <div className="grid gap-6 lg:grid-cols-3">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-500 text-zinc-950">
                <BriefcaseBusiness size={32} />
              </div>

              <h3 className="mt-6 text-2xl font-extrabold">
                No jobs matched your search.
              </h3>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-400">
                Clear your filters, use fewer keywords, or set job alerts so TrueHire
                Global can show matches when new verified jobs are available.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-8 rounded-full bg-yellow-400 px-7 py-3 text-sm font-extrabold text-zinc-950 hover:bg-yellow-300"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default Jobs