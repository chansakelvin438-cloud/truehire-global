import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  AlertTriangle,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  CreditCard,
  FileText,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { analyseJobRisk } from "../utils/scamRisk"

function PostJob() {
  const navigate = useNavigate()
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
  const verificationStatus =
    localStorage.getItem("employerVerificationStatus") || "Verification Pending"

  const [submitted, setSubmitted] = useState(false)
  const [riskPreview, setRiskPreview] = useState(null)

  function handlePostJob(event) {
    event.preventDefault()

    const formData = new FormData(event.target)

    const newJob = {
      id: Date.now(),
      title: formData.get("title"),
      company:
        formData.get("company") ||
        currentUser.companyName ||
        currentUser.displayName ||
        "Employer Company",
      email: formData.get("email") || currentUser.email || "",
      phone: formData.get("phone") || currentUser.phone || "",
      location: formData.get("location"),
      type: formData.get("type"),
      category: formData.get("category"),
      salary: formData.get("salary"),
      deadline: formData.get("deadline"),
      experience: formData.get("experience"),
      description: formData.get("description"),
      requirements: formData.get("requirements"),
      status: "Pending Review",
      paymentStatus: "Payment Disabled",
      verificationStatus,
      submittedAt: new Date().toLocaleDateString("en-GB"),
    }

    const risk = analyseJobRisk(newJob)

    const finalJob = {
      ...newJob,
      scamRiskLevel: risk.level,
      scamRiskScore: risk.score,
      scamRiskReasons: risk.reasons,
    }

    const employerJobs = JSON.parse(localStorage.getItem("employerJobs") || "[]")

    localStorage.setItem("employerJobs", JSON.stringify([finalJob, ...employerJobs]))

    setRiskPreview(risk)
    setSubmitted(true)

    setTimeout(() => {
      navigate("/employer-dashboard")
    }, 1400)
  }

  function getRiskClass(level) {
    if (level === "High Risk") {
      return "border-red-400/20 bg-red-400/10 text-red-300"
    }

    if (level === "Medium Risk") {
      return "border-orange-400/20 bg-orange-400/10 text-orange-300"
    }

    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <section className="relative overflow-hidden px-6 py-20">
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl"></div>
        <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-yellow-400/10 blur-3xl"></div>

        <div className="relative mx-auto max-w-7xl">
          <Link
            to="/employer-dashboard"
            className="inline-flex items-center gap-2 text-sm font-bold text-teal-300 hover:text-teal-200"
          >
            ← Back to Employer Dashboard
          </Link>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_390px]">
            <div>
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-teal-500/10 md:p-10">
                <p className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-2 text-sm font-bold text-teal-300">
                  <BriefcaseBusiness size={16} />
                  Employer job posting
                </p>

                <h1 className="mt-6 text-5xl font-extrabold tracking-tight md:text-6xl">
                  Submit a verified job advert.
                </h1>

                <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-400">
                  Post a job advert for admin review. The advert will only appear publicly
                  after approval. Payments remain disabled until backend security is ready.
                </p>
              </div>

              {submitted && (
                <div className="mt-8 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-6">
                  <h2 className="flex items-center gap-2 text-2xl font-extrabold text-emerald-300">
                    <CheckCircle2 size={24} />
                    Job submitted for admin review.
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-zinc-300">
                    Your advert has been saved with payment disabled and will appear in
                    the Admin Dashboard for review.
                  </p>

                  {riskPreview && (
                    <div
                      className={`mt-5 rounded-2xl border p-5 ${getRiskClass(
                        riskPreview.level
                      )}`}
                    >
                      <h3 className="font-bold">Scam Risk Preview</h3>

                      <p className="mt-2 text-sm text-zinc-300">
                        Risk Level:{" "}
                        <span className="font-bold text-white">
                          {riskPreview.level}
                        </span>
                      </p>

                      <p className="mt-1 text-sm text-zinc-300">
                        Risk Score:{" "}
                        <span className="font-bold text-white">
                          {riskPreview.score}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              )}

              <form
                onSubmit={handlePostJob}
                className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-8"
              >
                <h2 className="text-3xl font-extrabold">Job Details</h2>

                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  Provide clear information. Avoid payment-related wording because scam
                  detection will flag suspicious adverts.
                </p>

                <div className="mt-8 grid gap-5 md:grid-cols-2">
                  <InputField
                    icon={BriefcaseBusiness}
                    label="Job Title"
                    name="title"
                    placeholder="e.g. Data Analyst"
                    required
                  />

                  <SelectField label="Job Category" name="category">
                    <option>Sales & Customer Service</option>
                    <option>Procurement & Logistics</option>
                    <option>Data & Technology</option>
                    <option>Finance & Accounting</option>
                    <option>NGO & Development</option>
                    <option>Remote Jobs</option>
                  </SelectField>

                  <SelectField label="Job Type" name="type">
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                    <option>Remote</option>
                    <option>Hybrid</option>
                  </SelectField>

                  <InputField
                    icon={MapPin}
                    label="Location"
                    name="location"
                    placeholder="e.g. Lusaka, Kitwe, Remote"
                    required
                  />

                  <InputField
                    icon={CreditCard}
                    label="Salary"
                    name="salary"
                    placeholder="e.g. K5,000 – K8,000 or Negotiable"
                  />

                  <InputField
                    icon={FileText}
                    label="Application Deadline"
                    name="deadline"
                    placeholder="e.g. 30 August 2026"
                    required
                  />

                  <SelectField label="Experience Level" name="experience">
                    <option>Entry level</option>
                    <option>1–2 years</option>
                    <option>3–5 years</option>
                    <option>5+ years</option>
                    <option>Management</option>
                  </SelectField>
                </div>

                <h2 className="mt-10 text-3xl font-extrabold">Employer Details</h2>

                <div className="mt-8 grid gap-5 md:grid-cols-2">
                  <InputField
                    icon={Building2}
                    label="Company Name"
                    name="company"
                    defaultValue={
                      currentUser.companyName || currentUser.displayName || ""
                    }
                    placeholder="Enter company name"
                    required
                  />

                  <InputField
                    icon={Mail}
                    label="Employer Email"
                    name="email"
                    type="email"
                    defaultValue={currentUser.email || ""}
                    placeholder="company@example.com"
                    required
                  />

                  <div className="md:col-span-2">
                    <InputField
                      icon={Phone}
                      label="Phone Number"
                      name="phone"
                      defaultValue={currentUser.phone || ""}
                      placeholder="e.g. +260..."
                      required
                    />
                  </div>
                </div>

                <h2 className="mt-10 text-3xl font-extrabold">
                  Description and Requirements
                </h2>

                <div className="mt-8">
                  <label className="text-sm font-bold text-zinc-300">
                    Job Description
                  </label>

                  <textarea
                    name="description"
                    rows="6"
                    required
                    placeholder="Describe the role, duties, department, and expectations."
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-4 text-sm leading-7 text-white outline-none placeholder:text-zinc-500 focus:border-teal-400"
                  ></textarea>
                </div>

                <div className="mt-6">
                  <label className="text-sm font-bold text-zinc-300">
                    Requirements
                  </label>

                  <textarea
                    name="requirements"
                    rows="6"
                    required
                    placeholder="List qualifications, skills, experience, and required documents."
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-4 text-sm leading-7 text-white outline-none placeholder:text-zinc-500 focus:border-teal-400"
                  ></textarea>
                </div>

                <div className="mt-8 rounded-2xl border border-red-400/20 bg-red-400/10 p-5">
                  <h3 className="flex items-center gap-2 font-bold text-red-300">
                    <AlertTriangle size={20} />
                    Posting safety rule
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    Do not ask applicants for registration fees, application fees,
                    interview fees, medical fees, transport fees, or recruitment payments.
                    Such adverts will be flagged or rejected.
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
                  {submitted ? "Job Submitted" : "Submit Job for Review"}
                  {!submitted && <ArrowRight size={17} />}
                </button>
              </form>
            </div>

            <aside className="lg:sticky lg:top-28 lg:h-fit">
              <div className="space-y-6">
                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-teal-500/10">
                  <div className="rounded-[1.5rem] border border-teal-400/20 bg-teal-400/10 p-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500 text-zinc-950">
                      <ShieldCheck size={30} />
                    </div>

                    <h2 className="mt-5 text-2xl font-extrabold">
                      Review before publishing
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-zinc-300">
                      Your advert will not go public immediately. Admin must approve it
                      first to protect job seekers.
                    </p>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-yellow-400/20 bg-yellow-400/10 p-6">
                  <h2 className="text-2xl font-extrabold text-yellow-300">
                    Payment Status
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-zinc-300">
                    The future employer posting fee is $3 per advert, but payments are
                    currently disabled.
                  </p>

                  <p className="mt-5 rounded-full bg-zinc-950 px-4 py-2 text-center text-sm font-bold text-yellow-300">
                    Payment Disabled
                  </p>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                  <h2 className="text-2xl font-extrabold">Posting Checklist</h2>

                  <div className="mt-5 space-y-3 text-sm text-zinc-400">
                    <p>✓ Use a real company name</p>
                    <p>✓ Add clear job duties</p>
                    <p>✓ Add honest requirements</p>
                    <p>✓ Avoid suspicious payment wording</p>
                    <p>✓ Wait for admin approval</p>
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

function SelectField({ label, name, children }) {
  return (
    <div>
      <label className="text-sm font-bold text-zinc-300">{label}</label>

      <select
        name={name}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-4 text-sm text-white outline-none focus:border-teal-400"
      >
        {children}
      </select>
    </div>
  )
}

export default PostJob