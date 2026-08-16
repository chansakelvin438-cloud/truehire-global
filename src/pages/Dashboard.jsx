import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowRight,
  BellRing,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  MapPin,
  ShieldCheck,
  Star,
  Target,
  User,
} from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import ApplicationHistory from "../components/ApplicationHistory"
import NotificationsPanel from "../components/NotificationsPanel"
import { getPublicJobs } from "../data/jobs"
import Seo from "../components/Seo"

function Dashboard() {
  const [savedJobIds, setSavedJobIds] = useState([])
  const [applicationCount, setApplicationCount] = useState(0)
  const [profile, setProfile] = useState({})
  const [jobAlertPreferences, setJobAlertPreferences] = useState({})

  const publicJobs = getPublicJobs()

  useEffect(() => {
    const savedJobs = JSON.parse(localStorage.getItem("savedJobs") || "[]")
    const applications = JSON.parse(localStorage.getItem("applications") || "[]")
    const savedProfile = JSON.parse(localStorage.getItem("jobSeekerProfile") || "{}")
    const savedAlerts = JSON.parse(
      localStorage.getItem("jobAlertPreferences") || "{}"
    )

    setSavedJobIds(savedJobs)
    setApplicationCount(applications.length)
    setProfile(savedProfile)
    setJobAlertPreferences(savedAlerts)
  }, [])

  const savedJobs = publicJobs.filter((job) =>
    savedJobIds.some((savedId) => String(savedId) === String(job.id))
  )

  function removeSavedJob(jobId) {
    const updatedSavedJobs = savedJobIds.filter(
      (id) => String(id) !== String(jobId)
    )

    setSavedJobIds(updatedSavedJobs)
    localStorage.setItem("savedJobs", JSON.stringify(updatedSavedJobs))
  }

  function calculateProfileCompletion() {
    const fields = [
      profile.fullName,
      profile.email,
      profile.phone,
      profile.educationLevel,
      profile.experienceLevel,
      profile.preferredCategory,
      profile.preferredLocation,
      profile.skills,
      profile.careerSummary,
      profile.cvFileName && profile.cvFileName !== "No CV uploaded",
    ]

    const completedFields = fields.filter(Boolean).length

    return Math.round((completedFields / fields.length) * 100)
  }

  function normaliseJobText(job) {
    const requirements = Array.isArray(job.requirements)
      ? job.requirements.join(" ")
      : job.requirements || ""

    const responsibilities = Array.isArray(job.responsibilities)
      ? job.responsibilities.join(" ")
      : job.responsibilities || ""

    return `
      ${job.title}
      ${job.company}
      ${job.location}
      ${job.type}
      ${job.category}
      ${job.experience}
      ${job.description}
      ${requirements}
      ${responsibilities}
    `.toLowerCase()
  }

  function getMatchScore(job) {
    let score = 0

    const preferredCategory = profile.preferredCategory || ""
    const preferredLocation = profile.preferredLocation || ""
    const experienceLevel = profile.experienceLevel || ""
    const skills = profile.skills || ""

    const jobText = normaliseJobText(job)

    if (preferredCategory && job.category === preferredCategory) {
      score += 40
    }

    if (
      preferredLocation &&
      job.location.toLowerCase().includes(preferredLocation.toLowerCase())
    ) {
      score += 25
    }

    if (experienceLevel && job.experience === experienceLevel) {
      score += 15
    }

    const skillList = skills
      .split(",")
      .map((skill) => skill.trim().toLowerCase())
      .filter(Boolean)

    skillList.forEach((skill) => {
      if (jobText.includes(skill)) {
        score += 10
      }
    })

    return Math.min(score, 100)
  }

  function getAlertMatchScore(job) {
    let score = 0

    const keywords = jobAlertPreferences.keywords || ""
    const category = jobAlertPreferences.category || "All"
    const location = jobAlertPreferences.location || ""
    const jobType = jobAlertPreferences.jobType || "All"

    const jobText = normaliseJobText(job)

    const keywordList = keywords
      .split(",")
      .map((keyword) => keyword.trim().toLowerCase())
      .filter(Boolean)

    keywordList.forEach((keyword) => {
      if (jobText.includes(keyword)) {
        score += 30
      }
    })

    if (category !== "All" && job.category === category) {
      score += 30
    }

    if (jobType !== "All" && job.type === jobType) {
      score += 20
    }

    if (location && job.location.toLowerCase().includes(location.toLowerCase())) {
      score += 20
    }

    return Math.min(score, 100)
  }

  const matchingJobs = publicJobs
    .map((job) => ({
      ...job,
      matchScore: getMatchScore(job),
    }))
    .filter((job) => job.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)

  const alertMatchingJobs = publicJobs
    .map((job) => ({
      ...job,
      alertMatchScore: getAlertMatchScore(job),
    }))
    .filter((job) => job.alertMatchScore > 0)
    .sort((a, b) => b.alertMatchScore - a.alertMatchScore)

  const profileCompletion = calculateProfileCompletion()

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Seo title="Job Seeker Dashboard" path="/dashboard" noIndex />
      <Navbar />

      <section className="relative overflow-hidden px-6 py-20">
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl"></div>
        <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-yellow-400/10 blur-3xl"></div>

        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-start">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-2 text-sm font-bold text-teal-300">
                <User size={16} />
                Job Seeker Dashboard
              </p>

              <h1 className="mt-6 text-5xl font-extrabold tracking-tight md:text-6xl">
                Manage your career journey.
              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-400">
                Track applications, review employer updates, manage saved jobs, and find
                opportunities that match your profile and job alert preferences.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-teal-500/10">
              <div className="rounded-[1.5rem] border border-teal-400/20 bg-teal-400/10 p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500 text-zinc-950">
                    <ShieldCheck size={30} />
                  </div>

                  <div>
                    <p className="text-sm text-zinc-400">Profile Completion</p>
                    <h2 className="text-3xl font-extrabold text-white">
                      {profileCompletion}%
                    </h2>
                  </div>
                </div>

                <div className="mt-5 h-3 overflow-hidden rounded-full bg-zinc-900">
                  <div
                    className="h-full rounded-full bg-yellow-400"
                    style={{ width: `${profileCompletion}%` }}
                  ></div>
                </div>

                <Link
                  to="/profile"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-5 py-3 text-sm font-extrabold text-zinc-950 hover:bg-yellow-300"
                >
                  Improve Profile
                  <ArrowRight size={17} />
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <FileText className="text-teal-300" size={26} />
              <p className="mt-4 text-sm text-zinc-400">Applications</p>
              <h2 className="mt-2 text-3xl font-extrabold text-white">
                {applicationCount}
              </h2>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <Star className="text-yellow-300" size={26} />
              <p className="mt-4 text-sm text-zinc-400">Saved Jobs</p>
              <h2 className="mt-2 text-3xl font-extrabold text-white">
                {savedJobs.length}
              </h2>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <Target className="text-emerald-300" size={26} />
              <p className="mt-4 text-sm text-zinc-400">Profile Matches</p>
              <h2 className="mt-2 text-3xl font-extrabold text-white">
                {matchingJobs.length}
              </h2>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <BellRing className="text-red-300" size={26} />
              <p className="mt-4 text-sm text-zinc-400">Alert Matches</p>
              <h2 className="mt-2 text-3xl font-extrabold text-white">
                {alertMatchingJobs.length}
              </h2>
            </div>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
              <NotificationsPanel />

              <ApplicationHistory />

              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div>
                    <h2 className="text-3xl font-extrabold">Best Matching Jobs</h2>
                    <p className="mt-2 text-sm text-zinc-400">
                      Jobs ranked using your saved profile preferences.
                    </p>
                  </div>

                  <Link
                    to="/profile"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-teal-400/40 px-5 py-3 text-sm font-bold text-teal-300 hover:bg-teal-500 hover:text-zinc-950"
                  >
                    Edit Profile
                    <ArrowRight size={17} />
                  </Link>
                </div>

                {matchingJobs.length > 0 ? (
                  <div className="mt-6 space-y-4">
                    {matchingJobs.slice(0, 5).map((job) => (
                      <div
                        key={job.id}
                        className="rounded-3xl border border-white/10 bg-zinc-950 p-6"
                      >
                        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                          <div>
                            <div className="flex flex-wrap gap-2">
                              <span className="rounded-full bg-teal-400/10 px-3 py-1 text-xs font-bold text-teal-300">
                                {job.matchScore}% Match
                              </span>

                              <span className="rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-bold text-yellow-300">
                                {job.trustBadge || "Verified Employer"}
                              </span>
                            </div>

                            <p className="mt-4 text-sm font-bold text-teal-300">
                              {job.category}
                            </p>

                            <h3 className="mt-1 text-2xl font-extrabold">
                              {job.title}
                            </h3>

                            <p className="mt-2 text-sm text-zinc-400">
                              {job.company} • {job.location}
                            </p>

                            <p className="mt-2 text-sm text-zinc-500">
                              Deadline: {job.deadline}
                            </p>
                          </div>

                          <Link
                            to={`/jobs/${job.id}`}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-5 py-3 text-sm font-extrabold text-zinc-950 hover:bg-yellow-300"
                          >
                            View Job
                            <ArrowRight size={17} />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="No matching jobs yet"
                    message="Complete your profile to receive better job matches."
                    link="/profile"
                    linkText="Complete Profile"
                  />
                )}
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div>
                    <h2 className="text-3xl font-extrabold">Job Alert Matches</h2>
                    <p className="mt-2 text-sm text-zinc-400">
                      Jobs matching your saved alert preferences.
                    </p>
                  </div>

                  <Link
                    to="/job-alerts"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-yellow-400/40 px-5 py-3 text-sm font-bold text-yellow-300 hover:bg-yellow-400 hover:text-zinc-950"
                  >
                    Manage Alerts
                    <ArrowRight size={17} />
                  </Link>
                </div>

                {alertMatchingJobs.length > 0 ? (
                  <div className="mt-6 space-y-4">
                    {alertMatchingJobs.slice(0, 5).map((job) => (
                      <div
                        key={job.id}
                        className="rounded-3xl border border-white/10 bg-zinc-950 p-6"
                      >
                        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                          <div>
                            <span className="rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-bold text-yellow-300">
                              {job.alertMatchScore}% Alert Match
                            </span>

                            <p className="mt-4 text-sm font-bold text-teal-300">
                              {job.category}
                            </p>

                            <h3 className="mt-1 text-2xl font-extrabold">
                              {job.title}
                            </h3>

                            <p className="mt-2 text-sm text-zinc-400">
                              {job.company} • {job.location}
                            </p>
                          </div>

                          <Link
                            to={`/jobs/${job.id}`}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-5 py-3 text-sm font-extrabold text-zinc-950 hover:bg-yellow-300"
                          >
                            View Job
                            <ArrowRight size={17} />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="No alert matches yet"
                    message="Set job alert preferences to see matching verified jobs here."
                    link="/job-alerts"
                    linkText="Set Job Alerts"
                  />
                )}
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div>
                    <h2 className="text-3xl font-extrabold">Saved Jobs</h2>
                    <p className="mt-2 text-sm text-zinc-400">
                      Jobs you saved from the job details page.
                    </p>
                  </div>

                  <Link
                    to="/jobs"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-teal-400/40 px-5 py-3 text-sm font-bold text-teal-300 hover:bg-teal-500 hover:text-zinc-950"
                  >
                    Browse Jobs
                    <ArrowRight size={17} />
                  </Link>
                </div>

                {savedJobs.length > 0 ? (
                  <div className="mt-6 space-y-4">
                    {savedJobs.map((job) => (
                      <div
                        key={job.id}
                        className="rounded-3xl border border-white/10 bg-zinc-950 p-6"
                      >
                        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                          <div>
                            <p className="text-sm font-bold text-teal-300">
                              {job.category}
                            </p>

                            <h3 className="mt-1 text-2xl font-extrabold">
                              {job.title}
                            </h3>

                            <p className="mt-2 text-sm text-zinc-400">
                              {job.company} • {job.location}
                            </p>

                            <p className="mt-2 text-sm text-zinc-500">
                              Deadline: {job.deadline}
                            </p>
                          </div>

                          <div className="flex flex-col gap-3 sm:flex-row">
                            <Link
                              to={`/jobs/${job.id}`}
                              className="rounded-2xl bg-yellow-400 px-5 py-3 text-center text-sm font-extrabold text-zinc-950 hover:bg-yellow-300"
                            >
                              View Job
                            </Link>

                            <button
                              type="button"
                              onClick={() => removeSavedJob(job.id)}
                              className="rounded-2xl border border-red-400/40 px-5 py-3 text-sm font-bold text-red-300 hover:bg-red-500 hover:text-white"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="No saved jobs yet"
                    message="Open a job advert and click Save Job to keep it here."
                    link="/jobs"
                    linkText="Browse Jobs"
                  />
                )}
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                <h2 className="text-2xl font-extrabold">Profile Summary</h2>

                <div className="mt-5 space-y-4">
                  <SummaryRow
                    icon={BriefcaseBusiness}
                    label="Category"
                    value={profile.preferredCategory || "Not added"}
                  />

                  <SummaryRow
                    icon={MapPin}
                    label="Location"
                    value={profile.preferredLocation || "Not added"}
                  />

                  <SummaryRow
                    icon={Target}
                    label="Experience"
                    value={profile.experienceLevel || "Not added"}
                  />

                  <SummaryRow
                    icon={FileText}
                    label="CV"
                    value={profile.cvFileName || "No CV uploaded"}
                  />
                </div>

                <Link
                  to="/profile"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-5 py-3 text-sm font-extrabold text-zinc-950 hover:bg-yellow-300"
                >
                  Edit Profile
                  <ArrowRight size={17} />
                </Link>
              </div>

              <div className="rounded-[2rem] border border-red-400/20 bg-red-400/10 p-6">
                <h2 className="text-2xl font-extrabold text-red-300">
                  Safety Reminder
                </h2>

                <p className="mt-3 text-sm leading-7 text-zinc-300">
                  Never pay money to get a job. Report employers asking for application,
                  interview, medical, registration, or recruitment fees.
                </p>

                <Link
                  to="/safety"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-red-300 hover:text-red-200"
                >
                  Visit Safety Centre
                  <ArrowRight size={17} />
                </Link>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                <h2 className="text-2xl font-extrabold">Profile Checklist</h2>

                <div className="mt-5 space-y-3 text-sm text-zinc-400">
                  <ChecklistItem done={profile.fullName} text="Add full name" />
                  <ChecklistItem done={profile.phone} text="Add phone number" />
                  <ChecklistItem done={profile.cvFileName} text="Upload CV" />
                  <ChecklistItem done={profile.skills} text="Add skills" />
                  <ChecklistItem
                    done={profile.preferredCategory}
                    text="Add preferred category"
                  />
                  <ChecklistItem
                    done={profile.preferredLocation}
                    text="Add preferred location"
                  />
                </div>

                <Link
                  to="/profile"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-teal-400/40 px-5 py-3 text-sm font-bold text-teal-300 hover:bg-teal-500 hover:text-zinc-950"
                >
                  Complete Profile
                  <ArrowRight size={17} />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

function EmptyState({ title, message, link, linkText }) {
  return (
    <div className="mt-6 rounded-3xl border border-white/10 bg-zinc-950 p-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500 text-zinc-950">
        <BriefcaseBusiness size={28} />
      </div>

      <h3 className="mt-5 text-2xl font-extrabold">{title}</h3>

      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-400">
        {message}
      </p>

      <Link
        to={link}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-6 py-3 text-sm font-extrabold text-zinc-950 hover:bg-yellow-300"
      >
        {linkText}
        <ArrowRight size={17} />
      </Link>
    </div>
  )
}

function SummaryRow({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
      <div className="flex items-center gap-3">
        <Icon size={19} className="text-teal-300" />

        <div>
          <p className="text-xs text-zinc-500">{label}</p>
          <p className="mt-1 text-sm font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  )
}

function ChecklistItem({ done, text }) {
  return (
    <p className="flex items-center gap-2">
      {done ? (
        <CheckCircle2 size={17} className="text-teal-300" />
      ) : (
        <span className="h-4 w-4 rounded-full border border-zinc-600"></span>
      )}
      <span>{text}</span>
    </p>
  )
}

export default Dashboard