import { useEffect, useState } from "react"
import {
  BadgeCheck,
  Building2,
  CheckCircle2,
  FileCheck2,
  Flag,
  Trash2,
  XCircle,
} from "lucide-react"

function EmployerVerificationPanel() {
  const [requests, setRequests] = useState([])

  useEffect(() => {
    const savedRequests = JSON.parse(
      localStorage.getItem("employerVerificationRequests") || "[]"
    )

    setRequests(savedRequests)
  }, [])

  function updateVerificationStatus(requestId, newStatus) {
    const updatedRequests = requests.map((request) =>
      request.id === requestId ? { ...request, status: newStatus } : request
    )

    setRequests(updatedRequests)

    localStorage.setItem(
      "employerVerificationRequests",
      JSON.stringify(updatedRequests)
    )

    localStorage.setItem("employerVerificationStatus", newStatus)
  }

  function clearRequests() {
    localStorage.removeItem("employerVerificationRequests")
    setRequests([])
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

    return "bg-yellow-400/10 text-yellow-300"
  }

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="flex items-center gap-3 text-3xl font-extrabold">
            <BadgeCheck className="text-teal-300" size={30} />
            Employer Verification Requests
          </h2>

          <p className="mt-2 text-sm text-zinc-400">
            Review employer identity details and approve, flag, or reject verification.
          </p>
        </div>

        {requests.length > 0 && (
          <button
            type="button"
            onClick={clearRequests}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-red-400/40 px-5 py-3 text-sm font-bold text-red-300 hover:bg-red-500 hover:text-white"
          >
            <Trash2 size={17} />
            Clear Requests
          </button>
        )}
      </div>

      {requests.length > 0 ? (
        <div className="mt-6 space-y-5">
          {requests.map((request) => (
            <div
              key={request.id}
              className="rounded-3xl border border-white/10 bg-zinc-950 p-6"
            >
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
                <div>
                  <p className="text-sm font-bold text-teal-300">
                    {request.businessType || "Business"}
                  </p>

                  <h3 className="mt-2 text-2xl font-extrabold">
                    {request.companyName}
                  </h3>

                  <div className="mt-3 space-y-2 text-sm text-zinc-400">
                    <p>Email: {request.email}</p>
                    <p>Phone: {request.phone}</p>
                    <p>Registration No: {request.companyRegistrationNumber}</p>
                    <p>TPIN: {request.tpin}</p>
                    <p>Contact Person: {request.contactPerson}</p>
                    <p>Address: {request.address}</p>
                    <p>Website: {request.website || "Not added"}</p>
                    <p>Submitted: {request.submittedAt || "Not available"}</p>
                  </div>
                </div>

                <span
                  className={`rounded-full px-4 py-2 text-center text-xs font-bold ${getStatusClass(
                    request.status
                  )}`}
                >
                  {request.status}
                </span>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <DocumentCard
                  label="Business Registration"
                  value={request.businessRegistrationFileName}
                />

                <DocumentCard
                  label="Tax / TPIN Document"
                  value={request.taxDocumentFileName}
                />

                <DocumentCard
                  label="Authorization Letter"
                  value={request.authorizationLetterFileName}
                />
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  onClick={() =>
                    updateVerificationStatus(request.id, "Verified")
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-400/40 px-5 py-3 text-sm font-bold text-emerald-300 hover:bg-emerald-500 hover:text-zinc-950"
                >
                  <CheckCircle2 size={17} />
                  Approve Employer
                </button>

                <button
                  type="button"
                  onClick={() => updateVerificationStatus(request.id, "Flagged")}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-orange-400/40 px-5 py-3 text-sm font-bold text-orange-300 hover:bg-orange-500 hover:text-white"
                >
                  <Flag size={17} />
                  Flag
                </button>

                <button
                  type="button"
                  onClick={() => updateVerificationStatus(request.id, "Rejected")}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-400/40 px-5 py-3 text-sm font-bold text-red-300 hover:bg-red-500 hover:text-white"
                >
                  <XCircle size={17} />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-3xl border border-white/10 bg-zinc-950 p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500 text-zinc-950">
            <Building2 size={28} />
          </div>

          <h3 className="mt-5 text-2xl font-extrabold">
            No verification requests yet
          </h3>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-400">
            Employer verification requests will appear here after employers submit them.
          </p>
        </div>
      )}
    </div>
  )
}

function DocumentCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <FileCheck2 size={20} className="text-yellow-300" />

      <p className="mt-3 text-sm font-bold text-white">{label}</p>

      <p className="mt-2 text-xs leading-5 text-zinc-400">
        {value || "No file added"}
      </p>
    </div>
  )
}

export default EmployerVerificationPanel