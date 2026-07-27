import { useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Mail,
  MessageSquare,
  Phone,
  ShieldAlert,
  User,
} from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

function Contact() {
  const [searchParams] = useSearchParams()

  const queryType = searchParams.get("type")
  const queryJob = searchParams.get("job")

  const initialType = queryType === "report" ? "Report Fake Job" : "General Enquiry"

  const [selectedType, setSelectedType] = useState(initialType)
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()

    const formData = new FormData(event.target)

    const messageData = {
      id: Date.now(),
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      type: selectedType,
      jobTitle: formData.get("jobTitle"),
      message: formData.get("message"),
      status: "Submitted",
      submittedAt: new Date().toLocaleDateString("en-GB"),
    }

    if (selectedType === "Report Fake Job") {
      const safetyReports = JSON.parse(localStorage.getItem("safetyReports") || "[]")

      localStorage.setItem(
        "safetyReports",
        JSON.stringify([messageData, ...safetyReports])
      )
    } else {
      const contactMessages = JSON.parse(
        localStorage.getItem("contactMessages") || "[]"
      )

      localStorage.setItem(
        "contactMessages",
        JSON.stringify([messageData, ...contactMessages])
      )
    }

    setSubmitted(true)
    event.target.reset()
    setSelectedType(initialType)
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <section className="relative overflow-hidden px-6 py-20">
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl"></div>
        <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-yellow-400/10 blur-3xl"></div>

        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-2 text-sm font-bold text-teal-300">
              <MessageSquare size={16} />
              Contact TrueHire Global
            </p>

            <h1 className="mt-6 text-5xl font-extrabold tracking-tight md:text-6xl">
              Talk to us or report a suspicious job.
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
              Use this page to contact support, ask questions, or report fake job adverts
              for admin safety review.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <Mail className="text-teal-300" size={26} />
                <p className="mt-4 font-bold">Email support</p>
                <p className="mt-2 text-sm text-zinc-400">
                  Support messages are stored for follow-up.
                </p>
              </div>

              <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-5">
                <ShieldAlert className="text-red-300" size={26} />
                <p className="mt-4 font-bold text-red-300">Fake job reports</p>
                <p className="mt-2 text-sm text-zinc-300">
                  Reports are sent to the Admin Dashboard.
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-3xl border border-yellow-400/20 bg-yellow-400/10 p-6">
              <h2 className="flex items-center gap-2 text-xl font-extrabold text-yellow-300">
                <AlertTriangle size={22} />
                Safety notice
              </h2>

              <p className="mt-3 text-sm leading-7 text-zinc-300">
                Report any job asking for registration fees, application fees, interview
                fees, medical fees, transport fees, or recruitment payments.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-teal-500/10">
            <div className="rounded-[1.5rem] border border-white/10 bg-zinc-950 p-8">
              <h2 className="text-3xl font-extrabold">Send a message</h2>

              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Choose the correct enquiry type so your message is saved in the right
                place.
              </p>

              {submitted && (
                <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                  <p className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
                    <CheckCircle2 size={18} />
                    Message submitted successfully.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <InputField
                  icon={User}
                  label="Full Name"
                  name="name"
                  placeholder="Enter your full name"
                  required
                />

                <InputField
                  icon={Mail}
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />

                <InputField
                  icon={Phone}
                  label="Phone Number"
                  name="phone"
                  placeholder="e.g. +260..."
                />

                <div>
                  <label className="text-sm font-bold text-zinc-300">
                    Enquiry Type
                  </label>

                  <select
                    value={selectedType}
                    onChange={(event) => setSelectedType(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-4 text-sm text-white outline-none focus:border-teal-400"
                  >
                    <option>General Enquiry</option>
                    <option>Employer Support</option>
                    <option>Job Seeker Support</option>
                    <option>Report Fake Job</option>
                  </select>
                </div>

                {selectedType === "Report Fake Job" && (
                  <InputField
                    icon={AlertTriangle}
                    label="Job Title / Employer Being Reported"
                    name="jobTitle"
                    defaultValue={queryJob || ""}
                    placeholder="Enter the suspicious job or employer name"
                    required
                  />
                )}

                <div>
                  <label className="text-sm font-bold text-zinc-300">
                    Message
                  </label>

                  <textarea
                    name="message"
                    rows="6"
                    required
                    placeholder={
                      selectedType === "Report Fake Job"
                        ? "Explain why this job looks suspicious."
                        : "Write your message here."
                    }
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm leading-7 text-white outline-none placeholder:text-zinc-500 focus:border-teal-400"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-5 py-4 text-sm font-extrabold text-zinc-950 hover:bg-yellow-300"
                >
                  Submit Message
                  <ArrowRight size={17} />
                </button>
              </form>

              <div className="mt-6 rounded-2xl border border-teal-400/20 bg-teal-400/10 p-5">
                <h3 className="font-bold text-teal-300">Need jobs instead?</h3>

                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  Visit the jobs page to search approved opportunities.
                </p>

                <Link
                  to="/jobs"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-yellow-300 hover:text-yellow-200"
                >
                  Browse Jobs
                  <ArrowRight size={17} />
                </Link>
              </div>
            </div>
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

      <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
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