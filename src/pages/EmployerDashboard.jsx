import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Clock,
  CreditCard,
  FileCheck2,
  ShieldCheck,
} from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import EmployerApplicationsPanel from "../components/EmployerApplicationsPanel"
import { getMyEmployerJobs } from "../services/api"
import EmployerPaymentsPanel from "../components/EmployerPaymentsPanel"

function EmployerDashboard() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
  const verificationStatus =
    localStorage.getItem("employerVerificationStatus") || "Verification Pending"

  const [myJobs, setMyJobs] = useState([])
  const [loadingJobs, setLoadingJobs] = useState(true)
  const [jobsError, setJobsError] = useState("")

  const employerName =
    currentUser.companyName ||
    currentUser.employerProfile?.companyName ||
    currentUser.displayName ||
    currentUser.email ||
    "Employer Account"

  useEffect(() => {
    async function loadEmployerJobs() {
      try {
        setLoadingJobs(true)
        setJobsError("")

        const response = await getMyEmployerJobs()
        setMyJobs(response.jobs || [])
      } catch (error) {
        setJobsError(error.message)
      } finally {
        setLoadingJobs(false)
      }
    }

    loadEmployerJobs()
  }, [])

  const pendingJobs = myJobs.filter((job) => job.status === "Pending Review")
  const approvedJobs = myJobs.filter((job) => job.status === "Approved")
  const flaggedJobs = myJobs.filter((job) => job.status === "Flagged")
  const rejectedJobs = myJobs.filter((job) => job.status === "Rejected")

  function getVerificationClass() {
    if (verificationStatus === "Verified") {
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
    }

    if (verificationStatus === "Rejected") {
      return "border-red-400/20 bg-red-400/10 text-red-300"
    }

    if (verificationStatus === "Flagged") {
      return "border-orange-400/20 bg-orange-400/10 text-orange-300"
    }

    if (verificationStatus === "Submitted for Review") {
      return "border-yellow-400/20 bg-yellow-400/10 text-yellow-300"
    }

    return "border-white/10 bg-white/5 text-zinc-300"
  }

  function getStatusClass(status) {
    if (status === "Approved") {
      return "bg-emerald-400/10 text-emerald-300"
    }

    if (status === "Rejected") {
      return "bg-red-400/10 text-red-300"
    }

    if (status === "Flagged") {
      return "bg-orange-400/10 text-orange-300"
    }

    return "bg-yellow-400/10 text-yellow-300"
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
              <p className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-2 text-sm font-bold text-teal-300">
                <Building2 size={16} />
                Employer Dashboard
              </p>

              <h1 className="mt-6 text-5xl font-extrabold tracking-tight md:text-6xl">
                Manage your hiring pipeline.
              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-400">
                Post job adverts, track approval status, review applications, and build
                employer trust through verification.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/employers/post-job"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-yellow-400 px-7 py-3 text-sm font-extrabold text-zinc-950 hover:bg-yellow-300"
                >
                  Post a Job
                  <ArrowRight size={17} />
                </Link>

                <Link
                  to="/employer-verification"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-teal-400/40 px-7 py-3 text-sm font-bold text-teal-300 hover:bg-teal-500 hover:text-zinc-950"
                >
                  Verify Employer
                  <ShieldCheck size={17} />
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-teal-500/10">
              <div className="rounded-[1.5rem] border border-white/10 bg-zinc-950 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-teal-300">
                      Employer Profile
                    </p>

                    <h2 className="mt-2 text-3xl font-extrabold">
                      {employerName}
                    </h2>

                    <p className="mt-2 text-sm text-zinc-400">
                      {currentUser.email || "No email added"}
                    </p>
                  </div>

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-500 text-zinc-950">
                    <Building2 size={28} />
                  </div>
                </div>

                <div
                  className={`mt-6 rounded-2xl border p-5 ${getVerificationClass()}`}
                >
                  <div className="flex items-center gap-3">
                    <BadgeCheck size={22} />

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide">
                        Verification Status
                      </p>

                      <p className="mt-1 text-lg font-extrabold">
                        {verificationStatus}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-5">
                  <div className="flex gap-3">
                    <CreditCard
                      size={22}
                      className="mt-1 shrink-0 text-yellow-300"
                    />

                    <div>
                     <h3 className="font-bold text-yellow-300">
                        Manual Payment Active
                     </h3>

                     <p className="mt-2 text-sm leading-6 text-zinc-300">
                        Employers can now submit mobile money or bank transaction references for admin confirmation. Automatic online checkout will be added after Flutterwave API access is approved.
                     </p>
                    </div>
                  </div>
                </div>

                <Link
                  to="/employer-verification"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-teal-400/40 px-5 py-3 text-sm font-bold text-teal-300 hover:bg-teal-500 hover:text-zinc-950"
                >
                  Start Verification
                  <ArrowRight size={17} />
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-4">
            <StatCard
              icon={Clock}
              label="Pending Jobs"
              value={pendingJobs.length}
              colour="text-yellow-300"
            />

            <StatCard
              icon={CheckCircle2}
              label="Approved Jobs"
              value={approvedJobs.length}
              colour="text-emerald-300"
            />

            <StatCard
              icon={AlertTriangle}
              label="Flagged Jobs"
              value={flaggedJobs.length}
              colour="text-orange-300"
            />

            <StatCard
              icon={FileCheck2}
              label="Rejected Jobs"
              value={rejectedJobs.length}
              colour="text-red-300"
            />
          </div>

          <div className="mt-12">
            <EmployerPaymentsPanel />
            <EmployerApplicationsPanel />
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 lg:col-span-2">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <h2 className="text-3xl font-extrabold">My Job Adverts</h2>

                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    Track the status of jobs you have submitted for admin review.
                  </p>
                </div>

                <Link
                  to="/employers/post-job"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-yellow-400 px-6 py-3 text-sm font-extrabold text-zinc-950 hover:bg-yellow-300"
                >
                  Post New Job
                  <ArrowRight size={17} />
                </Link>
              </div>

              {loadingJobs && (
                <div className="mt-6 rounded-3xl border border-white/10 bg-zinc-950 p-8 text-center">
                  <p className="text-sm font-bold text-teal-300">
                    Loading employer jobs...
                  </p>
                </div>
              )}

              {jobsError && (
                <div className="mt-6 rounded-3xl border border-red-400/20 bg-red-400/10 p-8 text-center">
                  <p className="text-sm font-bold text-red-300">{jobsError}</p>
                </div>
              )}

              {!loadingJobs && !jobsError && myJobs.length > 0 ? (
                <div className="mt-6 space-y-5">
                  {myJobs.map((job) => (
                    <div
                      key={job.id}
                      className="rounded-3xl border border-white/10 bg-zinc-950 p-6"
                    >
                      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
                        <div>
                          <p className="text-sm font-bold text-teal-300">
                            {job.category || "General"}
                          </p>

                          <h3 className="mt-2 text-2xl font-extrabold">
                            {job.title || "Untitled Job"}
                          </h3>

                          <p className="mt-2 text-sm text-zinc-400">
                            {job.company || employerName} •{" "}
                            {job.location || "Location not specified"}
                          </p>

                          <p className="mt-2 text-sm text-zinc-500">
                            Deadline: {job.deadline || "Not specified"}
                          </p>

                          <p className="mt-1 text-sm text-zinc-500">
                            Submitted: {job.submittedAt || "Not available"}
                          </p>

                          {job.scamRiskLevel && (
                            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                              <h4 className="font-bold text-yellow-300">
                                Scam Risk Preview
                              </h4>

                              <p className="mt-2 text-sm leading-6 text-zinc-300">
                                Risk Level:{" "}
                                <span className="font-bold text-white">
                                  {job.scamRiskLevel}
                                </span>
                              </p>

                              <p className="mt-1 text-sm leading-6 text-zinc-300">
                                Risk Score:{" "}
                                <span className="font-bold text-white">
                                  {job.scamRiskScore ?? 0}
                                </span>
                              </p>
                            </div>
                          )}

                          {job.adminNote && (
                            <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/10 p-4">
                              <h4 className="font-bold text-red-300">
                                Admin Safety Note
                              </h4>

                              <p className="mt-2 text-sm leading-6 text-zinc-300">
                                {job.adminNote}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-3">
                          <span
                            className={`rounded-full px-4 py-2 text-center text-xs font-bold ${getStatusClass(
                              job.status
                            )}`}
                          >
                            {job.status || "Pending Review"}
                          </span>

                          <span className="rounded-full bg-zinc-800 px-4 py-2 text-center text-xs font-bold text-zinc-300">
                            {job.paymentStatus || "Payment Disabled"}
                          </span>

                          {job.status === "Approved" && (
                            <Link
                              to={`/jobs/${job.id}`}
                              className="rounded-full border border-teal-400/40 px-4 py-2 text-center text-xs font-bold text-teal-300 hover:bg-teal-500 hover:text-zinc-950"
                            >
                              View Public Job
                            </Link>
                          )}
                        </div>
                      </div>

                      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                        <h4 className="font-bold">Job Description</h4>

                        <p className="mt-2 text-sm leading-6 text-zinc-300">
                          {job.description || "No description added."}
                        </p>
                      </div>

                      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                        <h4 className="font-bold">Requirements</h4>

                        <p className="mt-2 text-sm leading-6 text-zinc-300">
                          {job.requirements || "No requirements added."}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {!loadingJobs && !jobsError && myJobs.length === 0 && (
                <div className="mt-6 rounded-3xl border border-white/10 bg-zinc-950 p-10 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-500 text-zinc-950">
                    <BriefcaseBusiness size={32} />
                  </div>

                  <h3 className="mt-6 text-2xl font-extrabold">
                    No job adverts submitted yet
                  </h3>

                  <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-400">
                    Post your first job advert. It will appear here while waiting for
                    admin approval.
                  </p>

                  <Link
                    to="/employers/post-job"
                    className="mt-8 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-7 py-3 text-sm font-extrabold text-zinc-950 hover:bg-yellow-300"
                  >
                    Post a Job
                    <ArrowRight size={17} />
                  </Link>
                </div>
              )}
            </div>

            <aside className="space-y-6">
              <div className="rounded-[2rem] border border-teal-400/20 bg-teal-400/10 p-6">
                <h2 className="text-2xl font-extrabold text-teal-300">
                  Employer Checklist
                </h2>

                <div className="mt-5 space-y-3 text-sm text-zinc-300">
                  <ChecklistItem
                    done={verificationStatus === "Verified"}
                    text="Complete employer verification"
                  />
                  <ChecklistItem done={myJobs.length > 0} text="Post first job advert" />
                  <ChecklistItem
                    done={approvedJobs.length > 0}
                    text="Get a job approved"
                  />
                  <ChecklistItem
                    done={true}
                    text="Keep payment disabled until backend is secure"
                  />
                </div>
              </div>

              <div className="rounded-[2rem] border border-red-400/20 bg-red-400/10 p-6">
                <h2 className="text-2xl font-extrabold text-red-300">
                  Posting Rules
                </h2>

                <p className="mt-3 text-sm leading-7 text-zinc-300">
                  Do not ask applicants for registration fees, application fees,
                  interview fees, medical fees, transport fees, or recruitment payments.
                  Such adverts will be flagged or rejected.
                </p>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                <h2 className="text-2xl font-extrabold">Manual Payment Plan</h2>

                <p className="mt-3 text-sm leading-7 text-zinc-400">
                  Employers currently pay the K50 launch advert fee manually and submit the transaction reference for admin confirmation. Automatic online checkout will be added later.
                </p>

                <p className="mt-5 rounded-full bg-yellow-400/10 px-4 py-2 text-center text-sm font-bold text-yellow-300">
                  Manual Payment Active
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

function StatCard({ icon: Icon, label, value, colour }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <Icon size={26} className={colour} />

      <p className="mt-4 text-sm text-zinc-400">{label}</p>

      <h2 className={`mt-2 text-3xl font-extrabold ${colour}`}>{value}</h2>
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

export default EmployerDashboard