import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  AlertTriangle,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Upload,
  User,
} from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { getPublicJobs } from "../data/jobs"

function Apply() {
  const { id } = useParams()
  const navigate = useNavigate()

  const job = getPublicJobs().find((item) => String(item.id) === String(id))
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
  const savedProfile = JSON.parse(localStorage.getItem("jobSeekerProfile") || "{}")

  const [submitted, setSubmitted] = useState(false)
  const [alreadyApplied, setAlreadyApplied] = useState(false)

  useEffect(() => {
    if (!job) return

    const applications = JSON.parse(localStorage.getItem("applications") || "[]")

    const existingApplication = applications.some(
      (application) =>
        String(application.jobId) === String(job.id) &&
        application.email === currentUser.email
    )

    setAlreadyApplied(existingApplication)
    setSubmitted(existingApplication)
  }, [job, currentUser.email])

  function handleSubmitApplication(event) {
    event.preventDefault()

    if (!job) return

    const applications = JSON.parse(localStorage.getItem("applications") || "[]")

    const existingApplication = applications.some(
      (application) =>
        String(application.jobId) === String(job.id) &&
        application.email === currentUser.email
    )

    if (existingApplication) {
      setAlreadyApplied(true)
      setSubmitted(true)
      return
    }

    const formData = new FormData(event.target)
    const cvFile = formData.get("cvFile")

    const newApplication = {
      id: Date.now(),
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      location: job.location,
      category: job.category,
      applicantName: formData.get("applicantName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      coverNote: formData.get("coverNote"),
      cvFileName: cvFile?.name || savedProfile.cvFileName || "No CV uploaded",
      status: "Submitted",
      submittedAt: new Date().toLocaleDateString("en-GB"),
    }

    localStorage.setItem(
      "applications",
      JSON.stringify([newApplication, ...applications])
    )

    setSubmitted(true)

    setTimeout(() => {
      navigate("/dashboard")
    }, 1200)
  }

  if (!job) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <Navbar />

        <section className="px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-400 text-zinc-950">
                <AlertTriangle size={32} />
              </div>

              <h1 className="mt-6 text-4xl font-extrabold">Job not found</h1>

              <p className="mt-4 text-zinc-400">
                The job you are trying to apply for does not exist.
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

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <section className="relative overflow-hidden px-6 py-20">
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl"></div>
        <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-yellow-400/10 blur-3xl"></div>

        <div className="relative mx-auto max-w-7xl">
          <Link
            to={`/jobs/${job.id}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-teal-300 hover:text-teal-200"
          >
            ← Back to Job Details
          </Link>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
            <div>
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-teal-500/10 md:p-10">
                <p className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-2 text-sm font-bold text-teal-300">
                  <ShieldCheck size={16} />
                  Secure application
                </p>

                <h1 className="mt-6 text-5xl font-extrabold tracking-tight md:text-6xl">
                  Apply for {job.title}
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
                    <FileText size={17} className="text-emerald-300" />
                    {job.category}
                  </span>
                </div>
              </div>

              {submitted && (
                <div className="mt-8 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-6">
                  <h2 className="flex items-center gap-2 text-2xl font-extrabold text-emerald-300">
                    <CheckCircle2 size={24} />
                    {alreadyApplied
                      ? "You have already applied for this job."
                      : "Application submitted successfully."}
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-zinc-300">
                    Your application is saved under your Job Seeker Dashboard. Employers
                    can review it and update the status.
                  </p>
                </div>
              )}

              <form
                onSubmit={handleSubmitApplication}
                className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-8"
              >
                <h2 className="text-3xl font-extrabold">Applicant Details</h2>

                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  Confirm your details before submitting. This information will be shared
                  with the employer for this application.
                </p>

                <div className="mt-8 grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-bold text-zinc-300">
                      Full Name
                    </label>

                    <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-zinc-950 px-4 py-4">
                      <User size={19} className="text-teal-300" />

                      <input
                        name="applicantName"
                        type="text"
                        required
                        defaultValue={
                          savedProfile.fullName ||
                          currentUser.displayName ||
                          `${currentUser.firstName || ""} ${
                            currentUser.lastName || ""
                          }`.trim()
                        }
                        placeholder="Enter full name"
                        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-zinc-300">
                      Email Address
                    </label>

                    <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-zinc-950 px-4 py-4">
                      <Mail size={19} className="text-yellow-300" />

                      <input
                        name="email"
                        type="email"
                        required
                        defaultValue={savedProfile.email || currentUser.email || ""}
                        placeholder="you@example.com"
                        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-bold text-zinc-300">
                      Phone Number
                    </label>

                    <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-zinc-950 px-4 py-4">
                      <Phone size={19} className="text-emerald-300" />

                      <input
                        name="phone"
                        type="tel"
                        required
                        defaultValue={savedProfile.phone || currentUser.phone || ""}
                        placeholder="e.g. +260..."
                        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="text-sm font-bold text-zinc-300">
                    Cover Note
                  </label>

                  <textarea
                    name="coverNote"
                    rows="6"
                    defaultValue={savedProfile.careerSummary || ""}
                    placeholder="Briefly explain why you are suitable for this job."
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-4 text-sm leading-7 text-white outline-none placeholder:text-zinc-500 focus:border-teal-400"
                  ></textarea>
                </div>

                <div className="mt-6">
                  <label className="text-sm font-bold text-zinc-300">
                    Upload CV
                  </label>

                  <div className="mt-2 rounded-2xl border border-dashed border-white/20 bg-zinc-950 p-6">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500 text-zinc-950">
                        <Upload size={28} />
                      </div>

                      <p className="mt-4 text-sm font-bold text-white">
                        Upload your CV
                      </p>

                      <p className="mt-2 text-xs leading-5 text-zinc-500">
                        Front-end stores the CV file name only for now. Backend will handle
                        real uploads later.
                      </p>

                      <input
                        name="cvFile"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="mt-5 w-full max-w-sm rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300 outline-none focus:border-teal-400"
                      />

                      <p className="mt-3 text-xs text-zinc-500">
                        Saved CV: {savedProfile.cvFileName || "No CV uploaded yet"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 rounded-2xl border border-red-400/20 bg-red-400/10 p-5">
                  <h3 className="font-bold text-red-300">Safety reminder</h3>

                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    Do not pay any registration, application, interview, medical, or
                    recruitment fee. TrueHire Global applications are free for job seekers.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitted}
                  className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-extrabold ${
                    submitted
                      ? "cursor-not-allowed bg-zinc-700 text-zinc-400"
                      : "bg-yellow-400 text-zinc-950 hover:bg-yellow-300"
                  }`}
                >
                  {submitted ? "Application Submitted" : "Submit Application"}
                  {!submitted && <ArrowRight size={17} />}
                </button>
              </form>
            </div>

            <aside className="lg:sticky lg:top-28 lg:h-fit">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-teal-500/10">
                <div className="rounded-[1.5rem] border border-white/10 bg-zinc-950 p-6">
                  <h2 className="text-2xl font-extrabold">Application Summary</h2>

                  <div className="mt-6 space-y-4">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm text-zinc-500">Job Title</p>
                      <p className="mt-1 font-bold text-white">{job.title}</p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm text-zinc-500">Company</p>
                      <p className="mt-1 font-bold text-white">{job.company}</p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm text-zinc-500">Location</p>
                      <p className="mt-1 font-bold text-white">{job.location}</p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm text-zinc-500">Deadline</p>
                      <p className="mt-1 font-bold text-yellow-300">
                        {job.deadline || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 rounded-2xl border border-teal-400/20 bg-teal-400/10 p-5">
                    <h3 className="font-bold text-teal-300">
                      What happens next?
                    </h3>

                    <div className="mt-4 space-y-3 text-sm leading-6 text-zinc-300">
                      <p>✓ Your application is saved.</p>
                      <p>✓ The employer can review it.</p>
                      <p>✓ Your dashboard shows status updates.</p>
                      <p>✓ You may receive notifications.</p>
                    </div>
                  </div>

                  <Link
                    to="/dashboard"
                    className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-teal-400/40 px-5 py-4 text-sm font-bold text-teal-300 hover:bg-teal-500 hover:text-zinc-950"
                  >
                    View Dashboard
                    <ArrowRight size={17} />
                  </Link>
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

export default Apply