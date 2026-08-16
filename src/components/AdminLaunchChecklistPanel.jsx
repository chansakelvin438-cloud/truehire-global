import { useEffect, useMemo, useState } from "react"
import {
  AlertTriangle,
  CheckCircle,
  ClipboardCheck,
  RefreshCw,
  Rocket,
  Save,
} from "lucide-react"
import {
  getAdminLaunchChecklist,
  updateAdminLaunchChecklistItem,
} from "../services/api"

const statusOptions = [
  { value: "PENDING", label: "Pending" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "DONE", label: "Done" },
  { value: "BLOCKED", label: "Blocked" },
]

function statusClass(status) {
  if (status === "DONE") {
    return "border-teal-400/30 bg-teal-400/10 text-teal-300"
  }

  if (status === "IN_PROGRESS") {
    return "border-yellow-400/30 bg-yellow-400/10 text-yellow-300"
  }

  if (status === "BLOCKED") {
    return "border-red-400/30 bg-red-400/10 text-red-300"
  }

  return "border-white/10 bg-white/5 text-zinc-300"
}

function groupByCategory(items) {
  return items.reduce((groups, item) => {
    if (!groups[item.category]) {
      groups[item.category] = []
    }

    groups[item.category].push(item)
    return groups
  }, {})
}

export default function AdminLaunchChecklistPanel() {
  const [items, setItems] = useState([])
  const [summary, setSummary] = useState(null)
  const [drafts, setDrafts] = useState({})
  const [loading, setLoading] = useState(true)
  const [savingKey, setSavingKey] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  async function loadChecklist() {
    try {
      setLoading(true)
      setError("")
      setSuccess("")

      const data = await getAdminLaunchChecklist()

      setItems(data.items || [])
      setSummary(data.summary || null)

      const nextDrafts = {}

      ;(data.items || []).forEach((item) => {
        nextDrafts[item.key] = {
          status: item.status,
          adminNote: item.adminNote || "",
        }
      })

      setDrafts(nextDrafts)
    } catch (err) {
      setError(err.message || "Could not load launch checklist.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadChecklist()
  }, [])

  const groupedItems = useMemo(() => groupByCategory(items), [items])

  function updateDraft(key, field, value) {
    setDrafts((current) => ({
      ...current,
      [key]: {
        ...(current[key] || {}),
        [field]: value,
      },
    }))
  }

  async function saveItem(item) {
    try {
      setSavingKey(item.key)
      setError("")
      setSuccess("")

      const draft = drafts[item.key] || {}

      await updateAdminLaunchChecklistItem(item.key, {
        status: draft.status || item.status,
        adminNote: draft.adminNote || "",
      })

      setSuccess("Checklist item updated.")
      await loadChecklist()
    } catch (err) {
      setError(err.message || "Could not update checklist item.")
    } finally {
      setSavingKey("")
    }
  }

  if (loading) {
    return (
      <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <p className="text-sm text-zinc-400">Loading launch checklist...</p>
      </section>
    )
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-sm font-bold text-yellow-300">
            <Rocket size={16} />
            Public Launch Checklist
          </p>

          <h2 className="text-2xl font-black text-white">
            Launch readiness tracker
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-300">
            Track the final operational, security, payment, SEO, testing, and
            marketing items before TrueHire Global is opened publicly.
          </p>
        </div>

        <button
          type="button"
          onClick={loadChecklist}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white hover:bg-white/10"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {summary && (
        <div className="mt-6 grid gap-4 md:grid-cols-5">
          <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
              Completion
            </p>
            <p className="mt-2 text-3xl font-black text-white">
              {summary.completionRate}%
            </p>
          </div>

          <div className="rounded-2xl border border-teal-400/20 bg-teal-400/10 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-teal-300">
              Done
            </p>
            <p className="mt-2 text-3xl font-black text-white">
              {summary.done}
            </p>
          </div>

          <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-yellow-300">
              In Progress
            </p>
            <p className="mt-2 text-3xl font-black text-white">
              {summary.inProgress}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">
              Pending
            </p>
            <p className="mt-2 text-3xl font-black text-white">
              {summary.pending}
            </p>
          </div>

          <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-red-300">
              Blocked
            </p>
            <p className="mt-2 text-3xl font-black text-white">
              {summary.blocked}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-5 flex gap-3 rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-300">
          <AlertTriangle className="shrink-0" size={18} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mt-5 flex gap-3 rounded-2xl border border-teal-400/30 bg-teal-400/10 p-4 text-sm text-teal-300">
          <CheckCircle className="shrink-0" size={18} />
          <span>{success}</span>
        </div>
      )}

      <div className="mt-8 grid gap-6">
        {Object.entries(groupedItems).map(([category, categoryItems]) => (
          <div
            key={category}
            className="rounded-3xl border border-white/10 bg-zinc-950/70 p-5"
          >
            <div className="flex items-center gap-3">
              <ClipboardCheck className="text-teal-300" size={22} />
              <h3 className="text-xl font-black text-white">{category}</h3>
            </div>

            <div className="mt-5 grid gap-4">
              {categoryItems.map((item) => {
                const draft = drafts[item.key] || {
                  status: item.status,
                  adminNote: item.adminNote || "",
                }

                return (
                  <div
                    key={item.key}
                    className="rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                      <div className="min-w-0">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${statusClass(
                            draft.status
                          )}`}
                        >
                          {draft.status.replaceAll("_", " ")}
                        </span>

                        <h4 className="mt-3 text-lg font-black text-white">
                          {item.title}
                        </h4>

                        <p className="mt-2 text-sm leading-7 text-zinc-400">
                          {item.description}
                        </p>
                      </div>

                      <div className="w-full xl:max-w-sm">
                        <select
                          value={draft.status}
                          onChange={(event) =>
                            updateDraft(item.key, "status", event.target.value)
                          }
                          className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm font-bold text-white outline-none focus:border-teal-400"
                        >
                          {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>

                        <textarea
                          value={draft.adminNote}
                          onChange={(event) =>
                            updateDraft(
                              item.key,
                              "adminNote",
                              event.target.value
                            )
                          }
                          placeholder="Optional admin note"
                          className="mt-3 min-h-24 w-full rounded-2xl border border-white/10 bg-zinc-950 p-4 text-sm text-white outline-none focus:border-teal-400"
                        />

                        <button
                          type="button"
                          onClick={() => saveItem(item)}
                          disabled={savingKey === item.key}
                          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-4 py-3 text-sm font-black text-zinc-950 hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Save size={16} />
                          {savingKey === item.key ? "Saving..." : "Save"}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}