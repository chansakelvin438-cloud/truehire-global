import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  ArrowRight,
  BellRing,
  BriefcaseBusiness,
  CheckCircle2,
  Clock,
  FileSearch,
  MapPin,
  Search,
  ShieldCheck,
  Target,
} from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

function JobAlerts() {
  const navigate = useNavigate()

  const savedAlert = JSON.parse(localStorage.getItem("jobAlertPreferences") || "{}")
  const [submitted, setSubmitted] = useState(false)

  function handleSaveAlert(event) {
    event.preventDefault()

    const formData = new FormData(event.target)

    const alertPreferences = {
      keywords: formData.get("keywords"),
      category: formData.get("category"),
      location: formData.get("location"),
      jobType: formData.get("jobType"),
      frequency: formData.get("frequency"),
      savedAt: new Date().toLocaleDateString("en-GB"),
    }

    localStorage.setItem("jobAlertPreferences", JSON.stringify(alertPreferences))

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
                  <BellRing size={16} />
                  Job Alerts
                </p>

                <h1 className="mt-6 text-5xl font-extrabold tracking-tight md:text-6xl">
                  Save your job search preferences.
                </h1>

                <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-400">
                  Choose the type of jobs you want TrueHire Global to watch for. Your
                  dashboard will show jobs matching these alert preferences.
                </p>
              </div>

              {submitted && (
                <div className="mt-8 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-6">
                  <h2 className="flex items-center gap-2 text-2xl font-extrabold text-emerald-300">
                    <CheckCircle2 size={24} />
                    Job alert saved successfully.
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-zinc-300">
                    Your alert preferences have been saved. Redirecting to dashboard...
                  </p>
                </div>
              )}

              <form
                onSubmit={handleSaveAlert}
                className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-8"
              >
                <h2 className="text-3xl font-extrabold">Alert Preferences</h2>

                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  Use keywords, category, location, and job type to improve your alert
                  matches.
                </p>

                <div className="mt-8">
                  <InputField
                    icon={Search}
                    label="Keywords"
                    name="keywords"
                    defaultValue={savedAlert.keywords || ""}
                    placeholder="Example: data, finance, sales, procurement"
                  />
                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <SelectField
                    icon={BriefcaseBusiness}
                    label="Preferred Category"
                    name="category"
                    defaultValue={savedAlert.category || "All"}
                  >
                    <option>All</option>
                    <option>Sales & Customer Service</option>
                    <option>Procurement & Logistics</option>
                    <option>Data & Technology</option>
                    <option>Finance & Accounting</option>
                    <option>NGO & Development</option>
                    <option>Remote Jobs</option>
                  </SelectField>

                  <SelectField
                    icon={Target}
                    label="Preferred Job Type"
                    name="jobType"
                    defaultValue={savedAlert.jobType || "All"}
                  >
                    <option>All</option>
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                    <option>Remote</option>
                    <option>Hybrid</option>
                  </SelectField>

                  <InputField
                    icon={MapPin}
                    label="Preferred Location"
                    name="location"
                    defaultValue={savedAlert.location || ""}
                    placeholder="Example: Kitwe, Lusaka, Ndola, Remote"
                  />

                  <SelectField
                    icon={Clock}
                    label="Alert Frequency"
                    name="frequency"
                    defaultValue={savedAlert.frequency || "Daily"}
                  >
                    <option>Instant</option>
                    <option>Daily</option>
                    <option>Weekly</option>
                  </SelectField>
                </div>

                <div className="mt-8 rounded-2xl border border-teal-400/20 bg-teal-400/10 p-5">
                  <h3 className="font-bold text-teal-300">Dashboard matching</h3>

                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    Your saved preferences are used to show Job Alert Matches inside your
                    dashboard.
                  </p>
                </div>

                <button
                  type="submit"
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-5 py-4 text-sm font-extrabold text-zinc-950 hover:bg-yellow-300"
                >
                  Save Job Alert
                  <ArrowRight size={17} />
                </button>
              </form>
            </div>

            <aside className="lg:sticky lg:top-28 lg:h-fit">
              <div className="space-y-6">
                <div className="rounded-[2rem] border border-teal-400/20 bg-teal-400/10 p-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500 text-zinc-950">
                    <FileSearch size={30} />
                  </div>

                  <h2 className="mt-5 text-2xl font-extrabold">
                    Smarter job discovery
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-zinc-300">
                    Alerts help you monitor relevant opportunities without searching from
                    scratch every time.
                  </p>
                </div>

                <div className="rounded-[2rem] border border-yellow-400/20 bg-yellow-400/10 p-6">
                  <h2 className="text-2xl font-extrabold text-yellow-300">
                    Future alert system
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-zinc-300">
                    Later, TrueHire Global can send alerts through email, SMS, or in-app
                    notifications after backend services are added.
                  </p>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                  <h2 className="text-2xl font-extrabold">Alert Tips</h2>

                  <div className="mt-5 space-y-3 text-sm text-zinc-400">
                    <p>✓ Use short keywords</p>
                    <p>✓ Choose a clear category</p>
                    <p>✓ Add your preferred location</p>
                    <p>✓ Select remote or hybrid if needed</p>
                    <p>✓ Review matches in your dashboard</p>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-teal-400/20 bg-teal-400/10 p-6">
                  <ShieldCheck size={28} className="text-teal-300" />

                  <p className="mt-4 text-sm leading-7 text-zinc-300">
                    Job alerts only recommend public jobs that have passed the approval
                    flow.
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
}) {
  return (
    <div>
      <label className="text-sm font-bold text-zinc-300">{label}</label>

      <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-zinc-950 px-4 py-4">
        <Icon size={19} className="text-teal-300" />

        <input
          name={name}
          type={type}
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

export default JobAlerts