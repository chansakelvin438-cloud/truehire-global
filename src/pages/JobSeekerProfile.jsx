import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Target,
  Upload,
  User,
} from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

function JobSeekerProfile() {
  const navigate = useNavigate()

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
  const savedProfile = JSON.parse(localStorage.getItem("jobSeekerProfile") || "{}")

  const [submitted, setSubmitted] = useState(false)

  function handleSaveProfile(event) {
    event.preventDefault()

    const formData = new FormData(event.target)
    const cvFile = formData.get("cvFile")

    const profile = {
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      educationLevel: formData.get("educationLevel"),
      experienceLevel: formData.get("experienceLevel"),
      preferredCategory: formData.get("preferredCategory"),
      preferredLocation: formData.get("preferredLocation"),
      skills: formData.get("skills"),
      careerSummary: formData.get("careerSummary"),
      cvFileName: cvFile?.name || savedProfile.cvFileName || "No CV uploaded",
      updatedAt: new Date().toLocaleDateString("en-GB"),
    }

    localStorage.setItem("jobSeekerProfile", JSON.stringify(profile))
    localStorage.setItem("profileCompletion", "100")

    setSubmitted(true)

    setTimeout(() => {
      navigate("/dashboard")
    }, 1200)
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <section className="relative overflow-hidden px-6 py-20">
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl"></div>
        <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-yellow-400/10 blur-3xl"></div>

        <div className="relative mx-auto max-w-7xl">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-bold text-teal-300 hover:text-teal-200"
          >
            ← Back to Dashboard
          </Link>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_390px]">
            <div>
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-teal-500/10 md:p-10">
                <p className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-2 text-sm font-bold text-teal-300">
                  <User size={16} />
                  Job Seeker Profile
                </p>

                <h1 className="mt-6 text-5xl font-extrabold tracking-tight md:text-6xl">
                  Build a stronger career profile.
                </h1>

                <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-400">
                  Add your skills, education, experience, preferred location, and CV.
                  TrueHire Global uses this information for job matching and dashboard
                  recommendations.
                </p>
              </div>

              {submitted && (
                <div className="mt-8 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-6">
                  <h2 className="flex items-center gap-2 text-2xl font-extrabold text-emerald-300">
                    <CheckCircle2 size={24} />
                    Profile saved successfully.
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-zinc-300">
                    Your profile has been updated. Redirecting to your dashboard...
                  </p>
                </div>
              )}

              <form
                onSubmit={handleSaveProfile}
                className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-8"
              >
                <h2 className="text-3xl font-extrabold">Personal Details</h2>

                <div className="mt-8 grid gap-5 md:grid-cols-2">
                  <InputField
                    icon={User}
                    label="Full Name"
                    name="fullName"
                    defaultValue={
                      savedProfile.fullName ||
                      currentUser.displayName ||
                      `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim()
                    }
                    placeholder="Enter full name"
                    required
                  />

                  <InputField
                    icon={Mail}
                    label="Email Address"
                    name="email"
                    type="email"
                    defaultValue={savedProfile.email || currentUser.email || ""}
                    placeholder="you@example.com"
                    required
                  />

                  <div className="md:col-span-2">
                    <InputField
                      icon={Phone}
                      label="Phone Number"
                      name="phone"
                      defaultValue={savedProfile.phone || currentUser.phone || ""}
                      placeholder="e.g. +260..."
                      required
                    />
                  </div>
                </div>

                <h2 className="mt-10 text-3xl font-extrabold">
                  Career Preferences
                </h2>

                <div className="mt-8 grid gap-5 md:grid-cols-2">
                  <SelectField
                    icon={GraduationCap}
                    label="Education Level"
                    name="educationLevel"
                    defaultValue={savedProfile.educationLevel || "Degree"}
                  >
                    <option>Grade 12 Certificate</option>
                    <option>Certificate</option>
                    <option>Diploma</option>
                    <option>Degree</option>
                    <option>Postgraduate</option>
                    <option>Other</option>
                  </SelectField>

                  <SelectField
                    icon={Target}
                    label="Experience Level"
                    name="experienceLevel"
                    defaultValue={savedProfile.experienceLevel || "Entry level"}
                  >
                    <option>Entry level</option>
                    <option>1–2 years</option>
                    <option>3–5 years</option>
                    <option>5+ years</option>
                    <option>Management</option>
                  </SelectField>

                  <SelectField
                    icon={BriefcaseBusiness}
                    label="Preferred Job Category"
                    name="preferredCategory"
                    defaultValue={savedProfile.preferredCategory || "Data & Technology"}
                  >
                    <option>Sales & Customer Service</option>
                    <option>Procurement & Logistics</option>
                    <option>Data & Technology</option>
                    <option>Finance & Accounting</option>
                    <option>NGO & Development</option>
                    <option>Remote Jobs</option>
                  </SelectField>

                  <InputField
                    icon={MapPin}
                    label="Preferred Location"
                    name="preferredLocation"
                    defaultValue={savedProfile.preferredLocation || ""}
                    placeholder="e.g. Kitwe, Lusaka, Ndola, Remote"
                    required
                  />
                </div>

                <h2 className="mt-10 text-3xl font-extrabold">Skills and CV</h2>

                <div className="mt-8">
                  <label className="text-sm font-bold text-zinc-300">Skills</label>

                  <textarea
                    name="skills"
                    rows="4"
                    required
                    defaultValue={savedProfile.skills || ""}
                    placeholder="Example: Excel, customer service, data analysis, procurement"
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-4 text-sm leading-7 text-white outline-none placeholder:text-zinc-500 focus:border-teal-400"
                  ></textarea>
                </div>

                <div className="mt-6">
                  <label className="text-sm font-bold text-zinc-300">
                    Career Summary
                  </label>

                  <textarea
                    name="careerSummary"
                    rows="5"
                    defaultValue={savedProfile.careerSummary || ""}
                    placeholder="Briefly describe your background, strengths, and career interests."
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-4 text-sm leading-7 text-white outline-none placeholder:text-zinc-500 focus:border-teal-400"
                  ></textarea>
                </div>

                <div className="mt-6 rounded-2xl border border-dashed border-white/20 bg-zinc-950 p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-500 text-zinc-950">
                        <Upload size={25} />
                      </div>

                      <div>
                        <p className="font-bold text-white">Upload CV</p>
                        <p className="mt-1 text-xs text-zinc-500">
                          Current CV: {savedProfile.cvFileName || "No CV uploaded yet"}
                        </p>
                      </div>
                    </div>

                    <input
                      name="cvFile"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300 outline-none focus:border-teal-400 md:max-w-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-5 py-4 text-sm font-extrabold text-zinc-950 hover:bg-yellow-300"
                >
                  Save Profile
                  <ArrowRight size={17} />
                </button>
              </form>
            </div>

            <aside className="lg:sticky lg:top-28 lg:h-fit">
              <div className="space-y-6">
                <div className="rounded-[2rem] border border-teal-400/20 bg-teal-400/10 p-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500 text-zinc-950">
                    <ShieldCheck size={30} />
                  </div>

                  <h2 className="mt-5 text-2xl font-extrabold">
                    Better matching
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-zinc-300">
                    Your profile helps TrueHire Global recommend jobs based on skills,
                    preferred category, location, and experience.
                  </p>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                  <h2 className="text-2xl font-extrabold">Profile Tips</h2>

                  <div className="mt-5 space-y-3 text-sm text-zinc-400">
                    <p>✓ Add real skills separated by commas</p>
                    <p>✓ Choose your strongest job category</p>
                    <p>✓ Add your preferred location</p>
                    <p>✓ Upload your latest CV</p>
                    <p>✓ Keep your phone number updated</p>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-yellow-400/20 bg-yellow-400/10 p-6">
                  <h2 className="text-2xl font-extrabold text-yellow-300">
                    CV storage note
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-zinc-300">
                    For now, the front-end stores only the CV file name. Real uploads will
                    be handled later by the backend.
                  </p>
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

function SelectField({ icon: Icon, label, name, defaultValue, children }) {
  return (
    <div>
      <label className="text-sm font-bold text-zinc-300">{label}</label>

      <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-zinc-950 px-4 py-4">
        <Icon size={19} className="text-teal-300" />

        <select
          name={name}
          defaultValue={defaultValue}
          className="w-full bg-transparent text-sm text-white outline-none"
        >
          {children}
        </select>
      </div>
    </div>
  )
}

export default JobSeekerProfile