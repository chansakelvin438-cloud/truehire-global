import { useEffect, useState } from "react"
import { AlertTriangle, CheckCircle2, ShieldAlert, Trash2 } from "lucide-react"

function SafetyReportsPanel() {
  const [reports, setReports] = useState([])

  useEffect(() => {
    const savedReports = JSON.parse(localStorage.getItem("safetyReports") || "[]")
    setReports(savedReports)
  }, [])

  function updateReportStatus(reportId, newStatus) {
    const updatedReports = reports.map((report) =>
      report.id === reportId ? { ...report, status: newStatus } : report
    )

    setReports(updatedReports)
    localStorage.setItem("safetyReports", JSON.stringify(updatedReports))
  }

  function clearReports() {
    localStorage.removeItem("safetyReports")
    setReports([])
  }

  function getStatusClass(status) {
    if (status === "Resolved") {
      return "bg-emerald-400/10 text-emerald-300"
    }

    if (status === "Investigating") {
      return "bg-yellow-400/10 text-yellow-300"
    }

    return "bg-red-400/10 text-red-300"
  }

  return (
    <div className="rounded-[2rem] border border-red-400/20 bg-red-400/10 p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-3 text-2xl font-extrabold text-red-300">
            <ShieldAlert size={26} />
            Safety Reports
          </h2>

          <p className="mt-2 text-sm text-zinc-300">
            Fake job reports submitted by users.
          </p>
        </div>

        {reports.length > 0 && (
          <button
            type="button"
            onClick={clearReports}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-red-400/40 px-4 py-2 text-sm font-bold text-red-300 hover:bg-red-500 hover:text-white"
          >
            <Trash2 size={16} />
            Clear
          </button>
        )}
      </div>

      {reports.length > 0 ? (
        <div className="mt-6 space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="rounded-3xl border border-white/10 bg-zinc-950 p-5"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <p className="text-sm font-bold text-red-300">
                    {report.jobTitle || "Suspicious job report"}
                  </p>

                  <p className="mt-2 text-sm text-zinc-400">
                    Reporter: {report.name || "Unknown"} • {report.email || "No email"}
                  </p>

                  <p className="mt-2 text-xs text-zinc-500">
                    Submitted: {report.submittedAt || "Not available"}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                    report.status
                  )}`}
                >
                  {report.status || "Submitted"}
                </span>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm leading-7 text-zinc-300">
                  {report.message || "No report message added."}
                </p>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => updateReportStatus(report.id, "Investigating")}
                  className="rounded-2xl border border-yellow-400/40 px-4 py-2 text-sm font-bold text-yellow-300 hover:bg-yellow-400 hover:text-zinc-950"
                >
                  Investigating
                </button>

                <button
                  type="button"
                  onClick={() => updateReportStatus(report.id, "Resolved")}
                  className="rounded-2xl border border-emerald-400/40 px-4 py-2 text-sm font-bold text-emerald-300 hover:bg-emerald-500 hover:text-zinc-950"
                >
                  Resolved
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-3xl border border-white/10 bg-zinc-950 p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-400 text-zinc-950">
            <AlertTriangle size={24} />
          </div>

          <h3 className="mt-4 text-xl font-extrabold">No safety reports</h3>

          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Fake job reports will appear here after users submit them.
          </p>
        </div>
      )}
    </div>
  )
}

export default SafetyReportsPanel