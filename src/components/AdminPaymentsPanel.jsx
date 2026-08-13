import { useEffect, useState } from "react"
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  CreditCard,
  RefreshCw,
  XCircle,
} from "lucide-react"
import { getAdminPayments, updateAdminPaymentStatus } from "../services/api"

function formatDate(value) {
  if (!value) return "Not available"

  return new Date(value).toLocaleString("en-ZM", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function paymentMethodLabel(method) {
  const labels = {
    MTN_MOBILE_MONEY: "MTN Mobile Money",
    AIRTEL_MONEY: "Airtel Money",
    ZAMTEL_KWACHA: "Zamtel Kwacha",
    BANK_TRANSFER: "Bank Transfer",
  }

  return labels[method] || method
}

function statusClass(status) {
  if (status === "CONFIRMED") {
    return "border-teal-400/30 bg-teal-400/10 text-teal-300"
  }

  if (status === "REJECTED") {
    return "border-red-400/30 bg-red-400/10 text-red-300"
  }

  return "border-yellow-400/30 bg-yellow-400/10 text-yellow-300"
}

export default function AdminPaymentsPanel() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState("")
  const [adminNotes, setAdminNotes] = useState({})
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  async function loadPayments() {
    try {
      setLoading(true)
      setError("")
      const data = await getAdminPayments()
      setPayments(data.payments || [])
    } catch (err) {
      setError(err.message || "Could not load payment submissions.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPayments()
  }, [])

  async function handleUpdate(paymentId, status) {
    try {
      setUpdatingId(paymentId)
      setMessage("")
      setError("")

      await updateAdminPaymentStatus(paymentId, {
        status,
        adminNote: adminNotes[paymentId] || "",
      })

      setMessage(
        status === "CONFIRMED"
          ? "Payment confirmed. Job moved to pending review."
          : "Payment rejected. Employer can resubmit payment confirmation."
      )

      await loadPayments()
    } catch (err) {
      setError(err.message || "Could not update payment status.")
    } finally {
      setUpdatingId("")
    }
  }

  const submittedPayments = payments.filter(
    (payment) => payment.status === "SUBMITTED"
  )

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-sm font-bold text-yellow-300">
            <CreditCard size={16} />
            Admin Payment Confirmation
          </p>

          <h2 className="text-2xl font-black text-white">
            Review employer payment references
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-300">
            Confirm manual mobile money or bank payments before job adverts move
            to admin review. Only confirm payments you have verified in the
            payment account.
          </p>
        </div>

        <button
          type="button"
          onClick={loadPayments}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white hover:bg-white/10"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-4">
          <p className="text-sm font-bold text-yellow-300">Awaiting review</p>
          <p className="mt-2 text-3xl font-black text-white">
            {submittedPayments.length}
          </p>
        </div>

        <div className="rounded-2xl border border-teal-400/20 bg-teal-400/10 p-4">
          <p className="text-sm font-bold text-teal-300">Confirmed</p>
          <p className="mt-2 text-3xl font-black text-white">
            {payments.filter((payment) => payment.status === "CONFIRMED").length}
          </p>
        </div>

        <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-4">
          <p className="text-sm font-bold text-red-300">Rejected</p>
          <p className="mt-2 text-3xl font-black text-white">
            {payments.filter((payment) => payment.status === "REJECTED").length}
          </p>
        </div>
      </div>

      {message && (
        <div className="mt-5 flex gap-3 rounded-2xl border border-teal-400/30 bg-teal-400/10 p-4 text-sm text-teal-300">
          <CheckCircle className="shrink-0" size={18} />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="mt-5 flex gap-3 rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-300">
          <AlertTriangle className="shrink-0" size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <p className="mt-6 text-sm text-zinc-400">
          Loading payment submissions...
        </p>
      ) : payments.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-white/10 bg-zinc-950/60 p-5 text-sm text-zinc-400">
          No payment confirmations have been submitted yet.
        </div>
      ) : (
        <div className="mt-6 grid gap-5">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="rounded-3xl border border-white/10 bg-zinc-950/70 p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-black text-white">
                      {payment.job?.title || "Job advert"}
                    </h3>

                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-black ${statusClass(
                        payment.status
                      )}`}
                    >
                      <Clock size={14} />
                      {payment.status}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 text-sm text-zinc-300 md:grid-cols-2">
                    <p>
                      <span className="font-bold text-white">Employer:</span>{" "}
                      {payment.employer?.companyName || "Not available"}
                    </p>

                    <p>
                      <span className="font-bold text-white">Employer email:</span>{" "}
                      {payment.employer?.user?.email || "Not available"}
                    </p>

                    <p>
                      <span className="font-bold text-white">Amount:</span>{" "}
                      {payment.currency} {payment.amount}
                    </p>

                    <p>
                      <span className="font-bold text-white">Method:</span>{" "}
                      {paymentMethodLabel(payment.paymentMethod)}
                    </p>

                    <p>
                      <span className="font-bold text-white">Reference:</span>{" "}
                      {payment.transactionReference}
                    </p>

                    <p>
                      <span className="font-bold text-white">Payer phone:</span>{" "}
                      {payment.payerPhone || "Not provided"}
                    </p>

                    <p>
                      <span className="font-bold text-white">Submitted:</span>{" "}
                      {formatDate(payment.createdAt)}
                    </p>

                    <p>
                      <span className="font-bold text-white">Job payment:</span>{" "}
                      {payment.job?.paymentStatus || "Not available"}
                    </p>
                  </div>

                  {payment.note && (
                    <p className="mt-4 rounded-2xl bg-white/5 p-4 text-sm text-zinc-300">
                      Employer note: {payment.note}
                    </p>
                  )}

                  {payment.adminNote && (
                    <p className="mt-4 rounded-2xl bg-white/5 p-4 text-sm text-zinc-300">
                      Admin note: {payment.adminNote}
                    </p>
                  )}
                </div>

                {payment.status === "SUBMITTED" && (
                  <div className="w-full lg:max-w-sm">
                    <label className="mb-2 block text-sm font-bold text-zinc-200">
                      Admin note
                    </label>

                    <textarea
                      rows="3"
                      value={adminNotes[payment.id] || ""}
                      onChange={(event) =>
                        setAdminNotes((current) => ({
                          ...current,
                          [payment.id]: event.target.value,
                        }))
                      }
                      placeholder="Optional note for employer or audit trail"
                      className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-teal-400"
                    />

                    <div className="mt-4 grid gap-3">
                      <button
                        type="button"
                        onClick={() => handleUpdate(payment.id, "CONFIRMED")}
                        disabled={updatingId === payment.id}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-400 px-4 py-3 text-sm font-black text-zinc-950 hover:bg-teal-300 disabled:opacity-60"
                      >
                        <CheckCircle size={17} />
                        {updatingId === payment.id
                          ? "Updating..."
                          : "Confirm Payment"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUpdate(payment.id, "REJECTED")}
                        disabled={updatingId === payment.id}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm font-black text-red-300 hover:bg-red-400/20 disabled:opacity-60"
                      >
                        <XCircle size={17} />
                        Reject Payment
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}