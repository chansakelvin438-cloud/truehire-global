import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import {
  AlertTriangle,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  ShieldAlert,
  User,
} from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { getPublicBackendJob, submitSafetyReport } from "../services/api"

function Contact() {
  const [searchParams] = useSearchParams()

  const reportType = searchParams.get("type")
  const jobId = searchParams.get("job")

  const isReportMode = reportType === "report"

  const [reportedJob, setReportedJob] = useState(null)
  const [loadingJob, setLoadingJob] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadReportedJob() {
      if (!isReportMode || !jobId) return

      try {
        setLoadingJob(true)

        const response = await getPublicBackendJob(jobId)
        setReportedJob(response.job || null)
      } catch {
        setReportedJob(null)
      } finally {
        setLoadingJob(false)
      }
    }

    loadReportedJob()
  }, [isReportMode, jobId])

  async function handleContactSubmit(event) {
    event.preventDefault()

    const formData = new FormData(event.target)

    const message = formData.get("message")
    const name = formData.get("name")
    const email = formData.get("email")
    const phone = formData.get("phone")

    if (!name || !email || !message) {
      setError("Please provide your name, email, and message.")
      return
    }

    try {
      setSubmitting(true)
      setError("")
      setSuccess(false)

      if (isReportMode) {
        await submitSafetyReport({
          name,
          email,
          phone,
          jobTitle:
            formData.get("jobTitle") ||
            reportedJob?.title ||
            "Suspicious job advert",
          message,
        })
      } else {
        const existingMessages = JSON.parse(
          localStorage.getItem("contactMessages") || "[]"
        )

        const newMessage = {
          id: Date.now(),
          name,
          email,
          phone,
          subject: formData.get("subject"),
          message,
          submittedAt: new Date().toISOString(),
        }

        localStorage.setItem(
          "contactMessages",
          JSON.stringify([newMessage, ...existingMessages])
        )
      }

      setSuccess(true)
      event.target.reset()
    } catch (error) {
      setError(error.message || "Failed to submit message.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <section className="relative overflow-hidden px-6 py-20">
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl"></div>
        <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-yellow-400/10 blur-3xl"></div>

        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_390px] lg:items-start">
            <div>
              <p
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold ${
                  isReportMode
                    ? "border-red-400/30 bg-red-400/10 text-red-300"
                    : "border-teal-400/30 bg-teal-400/10 text-teal-300"
                }`}
              >
                {isReportMode ? <ShieldAlert size={16} /> : <MessageSquare size={16} />}
                {isReportMode ? "Report Suspicious Job" : "Contact TrueHire Global"}
              </p>

              <h1 className="mt-6 text-5xl font-extrabold tracking-tight md:text-6xl">
                {isReportMode
                  ? "Help us protect job seekers."
                  : "Get in touch with TrueHire Global."}
              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-400">
                {isReportMode
                  ? "Use this form to report suspicious job adverts, payment requests, fake employers, or unsafe recruitment activity."
                  : "Send us enquiries about job posting, employer verification, partnerships, or platform support."}
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-teal-500/10">
              <div
                className={`rounded-[1.5rem] border p-6 ${
                  isReportMode
                    ? "border-red-400/20 bg-red-400/10"
                    : "border-teal-400/20 bg-teal-400/10"
                }`}
              >
                {isReportMode ? (
                  <ShieldAlert size={36} className="text-red-300" />
                ) : (
                  <Mail size={36} className="text-teal-300" />
                )}

                <h2
                  className={`mt-5 text-2xl font-extrabold ${
                    isReportMode ? "text-red-300" : "text-white"
                  }`}
                >
                  {isReportMode ? "Safety first" : "We are building trust"}
                </h2>

                <p className="mt-3 text-sm leading-7 text-zinc-300">
                  {isReportMode
                    ? "Do not pay any money to get a job. Report any employer asking for application, interview, medical, registration, or recruitment fees."
                    : "TrueHire Global is designed to support safer hiring through verified employers and reviewed job adverts."}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_390px] lg:items-start">
            <div>
              {loadingJob && (
                <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
                  <p className="text-sm font-bold text-teal-300">
                    Loading reported job...
                  </p>
                </div>
              )}

              {reportedJob && (
                <div className="mb-8 rounded-3xl border border-red-400/20 bg-red-400/10 p-6">
                  <h2 className="flex items-center gap-2 text-2xl font-extrabold text-red-300">
                    <BriefcaseBusiness size={24} />
                    Reporting: {reportedJob.title}
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-zinc-300">
                    {reportedJob.company} • {reportedJob.location}
                  </p>
                </div>
              )}

              {success && (
                <div className="mb-8 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-6">
                  <h2 className="flex items-center gap-2 text-2xl font-extrabold text-emerald-300">
                    <CheckCircle2 size={24} />
                    {isReportMode
                      ? "Safety report submitted."
                      : "Message submitted."}
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-zinc-300">
                    {isReportMode
                      ? "Thank you. The report has been sent for review."
                      : "Thank you. Your message has been received."}
                  </p>
                </div>
              )}

              {error && (
                <div className="mb-8 rounded-3xl border border-red-400/20 bg-red-400/10 p-6">
                  <h2 className="flex items-center gap-2 font-extrabold text-red-300">
                    <AlertTriangle size={22} />
                    Submission issue
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-zinc-300">{error}</p>
                </div>
              )}

              <form
                onSubmit={handleContactSubmit}
                className="rounded-[2rem] border border-white/10 bg-white/5 p-8"
              >
                <h2 className="text-3xl font-extrabold">
                  {isReportMode ? "Report Details" : "Message Details"}
                </h2>

                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  {isReportMode
                    ? "Provide enough detail for the team to investigate the suspicious advert."
                    : "Fill in the form below and we will review your message."}
                </p>

                <div className="mt-8 grid gap-5 md:grid-cols-2">
                  <InputField
                    icon={User}
                    label="Full Name"
                    name="name"
                    placeholder="Enter your name"
                    required
                  />

                  <InputField
                    icon={Mail}
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                  />

                  <InputField
                    icon={Phone}
                    label="Phone Number"
                    name="phone"
                    placeholder="e.g. +260..."
                  />

                  {isReportMode ? (
                    <InputField
                      icon={BriefcaseBusiness}
                      label="Job or Employer Being Reported"
                      name="jobTitle"
                      defaultValue={
                        reportedJob
                          ? `${reportedJob.title} - ${reportedJob.company}`
                          : ""
                      }
                      placeholder="Enter job title or employer name"
                    />
                  ) : (
                    <InputField
                      icon={MessageSquare}
                      label="Subject"
                      name="subject"
                      placeholder="e.g. Employer verification enquiry"
                    />
                  )}
                </div>

                <div className="mt-8">
                  <label className="text-sm font-bold text-zinc-300">
                    {isReportMode ? "Report Message" : "Message"}
                  </label>

                  <textarea
                    name="message"
                    rows="7"
                    required
                    placeholder={
                      isReportMode
                        ? "Explain what looked suspicious. Mention any payment request, WhatsApp-only instruction, fake company details, or unsafe behaviour."
                        : "Write your message here."
                    }
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-4 text-sm leading-7 text-white outline-none placeholder:text-zinc-500 focus:border-teal-400"
                  ></textarea>
                </div>

                {isReportMode && (
                  <div className="mt-8 rounded-2xl border border-red-400/20 bg-red-400/10 p-5">
                    <h3 className="flex items-center gap-2 font-bold text-red-300">
                      <AlertTriangle size={20} />
                      Safety Reminder
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-zinc-300">
                      TrueHire Global does not support job adverts that ask applicants
                      to pay application fees, registration fees, interview fees,
                      medical fees, or recruitment payments.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-extrabold ${
                    submitting
                      ? "cursor-not-allowed bg-zinc-700 text-zinc-400"
                      : "bg-yellow-400 text-zinc-950 hover:bg-yellow-300"
                  }`}
                >
                  {submitting
                    ? isReportMode
                      ? "Submitting Report..."
                      : "Submitting Message..."
                    : isReportMode
                    ? "Submit Safety Report"
                    : "Submit Message"}

                  {!submitting && <ArrowRight size={17} />}
                </button>
              </form>
            </div>

            <aside className="lg:sticky lg:top-28 lg:h-fit">
              <div className="space-y-6">
                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                  <h2 className="text-2xl font-extrabold">Contact Details</h2>

                  <div className="mt-5 space-y-4 text-sm text-zinc-300">
                    <p className="flex items-center gap-3">
                      <Mail size={18} className="text-teal-300" />
                      support@truehireglobal.com
                    </p>

                    <p className="flex items-center gap-3">
                      <MapPin size={18} className="text-teal-300" />
                      Zambia
                    </p>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-teal-400/20 bg-teal-400/10 p-6">
                  <h2 className="text-2xl font-extrabold text-teal-300">
                    Employer Support
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-zinc-300">
                    Employers can contact TrueHire Global for verification support,
                    job posting guidance, and platform enquiries.
                  </p>

                  <Link
                    to="/employers"
                    className="mt-5 inline-flex items-center gap-2 rounded-full border border-teal-400/40 px-5 py-3 text-sm font-bold text-teal-300 hover:bg-teal-500 hover:text-zinc-950"
                  >
                    Employer Page
                    <ArrowRight size={17} />
                  </Link>
                </div>

                <div className="rounded-[2rem] border border-red-400/20 bg-red-400/10 p-6">
                  <h2 className="text-2xl font-extrabold text-red-300">
                    Report Job Scams
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-zinc-300">
                    Report suspicious employers, fake job adverts, and payment requests
                    immediately.
                  </p>

                  {!isReportMode && (
                    <Link
                      to="/contact?type=report"
                      className="mt-5 inline-flex items-center gap-2 rounded-full border border-red-400/40 px-5 py-3 text-sm font-bold text-red-300 hover:bg-red-500 hover:text-white"
                    >
                      Report Suspicious Job
                      <ArrowRight size={17} />
                    </Link>
                  )}
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

function InputField({
  icon: Icon,
  label,
  name,
  type = "text",
  placeholder,
  defaultValue = "",
  required = false,
}) {
  return (
    <div>
      <label className="text-sm font-bold text-zinc-300">{label}</label>

      <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-zinc-950 px-4 py-4">
        <Icon size={19} className="text-teal-300" />

        <input
          name={name}
          type={type}
          required={required}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
        />
      </div>
    </div>
  )
}

export default Contact