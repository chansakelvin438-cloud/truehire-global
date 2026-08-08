import { useEffect, useState } from "react"
import {
  AlertTriangle,
  BadgeCheck,
  Building2,
  CheckCircle2,
  FileText,
  Globe,
  Hash,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
  XCircle,
} from "lucide-react"
import {
  getAdminEmployerVerifications,
  updateEmployerVerificationStatus,
} from "../services/api"

function EmployerVerificationPanel() {
  const [verifications, setVerifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [updatingId, setUpdatingId] = useState("")

  useEffect(() => {
    loadVerifications()
  }, [])

  async function loadVerifications() {
    try {
      setLoading(true)
      setError("")

      const response = await getAdminEmployerVerifications()
      setVerifications(response.verifications || [])
    } catch (error) {
      setError(error.message || "Failed to load employer verification requests")
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusUpdate(verificationId, status) {
    try {
      setUpdatingId(verificationId)

      const response = await updateEmployerVerificationStatus(
        verificationId,
        status
      )

      setVerifications((currentVerifications) =>
        currentVerifications.map((verification) =>
          verification.id === verificationId
            ? response.verification
            : verification
        )
      )
    } catch (error) {
      alert(error.message || "Failed to update verification status")
    } finally {
      setUpdatingId("")
    }
  }

  function getStatusClass(status) {
    if (status === "Verified") {
      return "bg-emerald-400/10 text-emerald-300"
    }

    if (status === "Rejected") {
      return "bg-red-400/10 text-red-300"
    }

    if (status === "Flagged") {
      return "bg-orange-400/10 text-orange-300"
    }

    if (status === "Submitted for Review") {
      return "bg-yellow-400/10 text-yellow-300"
    }

    return "bg-white/10 text-zinc-300"
  }

  const submittedCount = verifications.filter(
    (verification) => verification.status === "Submitted for Review"
  ).length

  const verifiedCount = verifications.filter(
    (verification) => verification.status === "Verified"
  ).length

  const flaggedCount = verifications.filter(
    (verification) => verification.status === "Flagged"
  ).length

  const rejectedCount = verifications.filter(
    (verification) => verification.status === "Rejected"
  ).length

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="flex items-center gap-3 text-3xl font-extrabold">
            <BadgeCheck size={28} className="text-teal-300" />
            Employer Verification
          </h2>

          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Review employer verification requests and update employer trust status.
          </p>
        </div>

        <div className="rounded-full bg-teal-400/10 px-4 py-2 text-sm font-bold text-teal-300">
          {verifications.length} Requests
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <StatCard label="Submitted" value={submittedCount} colour="text-yellow-300" />
        <StatCard label="Verified" value={verifiedCount} colour="text-emerald-300" />
        <StatCard label="Flagged" value={flaggedCount} colour="text-orange-300" />
        <StatCard label="Rejected" value={rejectedCount} colour="text-red-300" />
      </div>

      {loading && (
        <div className="mt-6 rounded-3xl border border-white/10 bg-zinc-950 p-8 text-center">
          <p className="text-sm font-bold text-teal-300">
            Loading employer verification requests...
          </p>
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-3xl border border-red-400/20 bg-red-400/10 p-8 text-center">
          <AlertTriangle size={36} className="mx-auto text-red-300" />

          <h3 className="mt-4 text-xl font-extrabold text-red-300">
            Could not load verification requests
          </h3>

          <p className="mt-3 text-sm leading-6 text-zinc-300">{error}</p>
        </div>
      )}

      {!loading && !error && verifications.length > 0 && (
        <div className="mt-6 space-y-5">
          {verifications.map((verification) => (
            <div
              key={verification.id}
              className="rounded-3xl border border-white/10 bg-zinc-950 p-6"
            >
              <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                        verification.status
                      )}`}
                    >
                      {verification.status || "Verification Pending"}
                    </span>

                    <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-bold text-zinc-300">
                      Submitted: {verification.submittedAt || "Not available"}
                    </span>
                  </div>

                  <h3 className="mt-4 text-2xl font-extrabold">
                    {verification.companyName || "Company unavailable"}
                  </h3>

                  <p className="mt-2 text-sm text-zinc-400">
                    Contact person:{" "}
                    <span className="font-bold text-white">
                      {verification.contactPerson || "Not provided"}
                    </span>
                  </p>

                  <div className="mt-5 grid gap-3 text-sm text-zinc-400 md:grid-cols-2">
                    <InfoLine
                      icon={Mail}
                      label="Email"
                      value={verification.email}
                    />

                    <InfoLine
                      icon={Phone}
                      label="Phone"
                      value={verification.phone || "No phone added"}
                    />

                    <InfoLine
                      icon={Hash}
                      label="Registration Number"
                      value={verification.companyRegistrationNumber}
                    />

                    <InfoLine
                      icon={Hash}
                      label="TPIN"
                      value={verification.tpin}
                    />

                    <InfoLine
                      icon={Building2}
                      label="Business Type"
                      value={verification.businessType}
                    />

                    <InfoLine
                      icon={User}
                      label="Contact Person"
                      value={verification.contactPerson}
                    />

                    <InfoLine
                      icon={Globe}
                      label="Website"
                      value={verification.website || "No website added"}
                    />

                    <InfoLine
                      icon={MapPin}
                      label="Address"
                      value={verification.address}
                    />
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-3">
                    <DocumentCard
                      label="Business Registration"
                      value={verification.businessRegistrationFileName}
                    />

                    <DocumentCard
                      label="Tax Document"
                      value={verification.taxDocumentFileName}
                    />

                    <DocumentCard
                      label="Authorization Letter"
                      value={verification.authorizationLetterFileName}
                    />
                  </div>
                </div>

                <div className="w-full shrink-0 space-y-3 lg:w-52">
                  <button
                    type="button"
                    disabled={updatingId === verification.id}
                    onClick={() =>
                      handleStatusUpdate(verification.id, "Verified")
                    }
                    className="w-full rounded-2xl bg-yellow-400 px-5 py-3 text-sm font-extrabold text-zinc-950 hover:bg-yellow-300 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
                  >
                    {updatingId === verification.id ? "Updating..." : "Verify"}
                  </button>

                  <button
                    type="button"
                    disabled={updatingId === verification.id}
                    onClick={() =>
                      handleStatusUpdate(verification.id, "Flagged")
                    }
                    className="w-full rounded-2xl border border-orange-400/40 px-5 py-3 text-sm font-bold text-orange-300 hover:bg-orange-500 hover:text-white disabled:cursor-not-allowed disabled:border-zinc-700 disabled:text-zinc-500"
                  >
                    Flag
                  </button>

                  <button
                    type="button"
                    disabled={updatingId === verification.id}
                    onClick={() =>
                      handleStatusUpdate(verification.id, "Rejected")
                    }
                    className="w-full rounded-2xl border border-red-400/40 px-5 py-3 text-sm font-bold text-red-300 hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:border-zinc-700 disabled:text-zinc-500"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && verifications.length === 0 && (
        <div className="mt-6 rounded-3xl border border-white/10 bg-zinc-950 p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-500 text-zinc-950">
            <ShieldCheck size={32} />
          </div>

          <h3 className="mt-6 text-2xl font-extrabold">
            No employer verification requests yet
          </h3>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-400">
            Employer verification submissions will appear here for review.
          </p>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, colour }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
        {label}
      </p>

      <p className={`mt-2 text-3xl font-extrabold ${colour}`}>{value}</p>
    </div>
  )
}

function InfoLine({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-zinc-500">
        <Icon size={15} className="text-teal-300" />
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-bold text-white">
        {value || "Not provided"}
      </p>
    </div>
  )
}

function DocumentCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <FileText size={20} className="text-yellow-300" />

      <p className="mt-3 text-xs font-bold uppercase tracking-wide text-zinc-500">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-bold text-white">
        {value || "No file name recorded"}
      </p>
    </div>
  )
}

export default EmployerVerificationPanel