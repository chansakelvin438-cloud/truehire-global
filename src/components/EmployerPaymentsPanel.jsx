import { useEffect, useMemo, useState } from "react"
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  CreditCard,
  RefreshCw,
  Send,
} from "lucide-react"
import {
  getMyEmployerJobs,
  getMyPayments,
  submitManualPayment,
} from "../services/api"

const paymentMethods = [
  { value: "MTN_MOBILE_MONEY", label: "MTN Mobile Money" },
  { value: "AIRTEL_MONEY", label: "Airtel Money" },
  { value: "ZAMTEL_KWACHA", label: "Zamtel Kwacha" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
]

function formatDate(value) {
  if (!value) return "Not available"

  return new Date(value).toLocaleDateString("en-ZM", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function statusBadge(status) {
  if (status === "CONFIRMED") {
    return "bg-teal-400/10 text-teal-300 border-teal-400/30"
  }

  if (status === "REJECTED") {
    return "bg-red-400/10 text-red-300 border-red-400/30"
  }

  return "bg-yellow-400/10 text-yellow-300 border-yellow-400/30"
}

export default function EmployerPaymentsPanel() {
  const [jobs, setJobs] = useState([])
  const [payments, setPayments] = useState([])
  const [selectedJobId, setSelectedJobId] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("MTN_MOBILE_MONEY")
  const [transactionReference, setTransactionReference] = useState("")
  const [payerPhone, setPayerPhone] = useState("")
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  async function loadPaymentsData() {
    try {
      setLoading(true)
      setError("")

      const [jobsData, paymentsData] = await Promise.all([
        getMyEmployerJobs(),
        getMyPayments(),
      ])

      setJobs(jobsData.jobs || [])
      setPayments(paymentsData.payments || [])
    } catch (err) {
      setError(err.message || "Could not load payment information.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPaymentsData()
  }, [])

  const unpaidJobs = useMemo(() => {
    return jobs.filter((job) => {
      return (
        job.paymentStatus !== "PAID" &&
        job.status !== "APPROVED" &&
        job.status !== "REJECTED"
      )
    })
  }, [jobs])

  const selectedJob = unpaidJobs.find((job) => job.id === selectedJobId)

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      setSubmitting(true)
      setMessage("")
      setError("")

      await submitManualPayment({
        jobId: selectedJobId,
        paymentMethod,
        transactionReference,
        payerPhone,
        note,
      })

      setMessage("Payment confirmation submitted successfully.")
      setTransactionReference("")
      setPayerPhone("")
      setNote("")
      setSelectedJobId("")

      await loadPaymentsData()
    } catch (err) {
      setError(err.message || "Could not submit payment confirmation.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-sm font-bold text-yellow-300">
            <CreditCard size={16} />
            Manual Payment Confirmation
          </p>

          <h2 className="text-2xl font-black text-white">
            Submit job advert payment
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-300">
            Pay the launch advert fee, then submit your mobile money or bank
            transaction reference. TrueHire admin will confirm your payment
            before your job moves to review.
          </p>
        </div>

        <button
          type="button"
          onClick={loadPaymentsData}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white hover:bg-white/10"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="mt-6 rounded-3xl border border-teal-400/20 bg-teal-400/10 p-5">
        <h3 className="font-black text-teal-300">Payment instructions</h3>
        <div className="mt-3 grid gap-3 text-sm text-zinc-200 md:grid-cols-3">
          <div className="rounded-2xl bg-zinc-950/60 p-4">
            <p className="font-bold text-white">Amount</p>
            <p className="mt-1 text-yellow-300">K50 launch offer</p>
          </div>
          <div className="rounded-2xl bg-zinc-950/60 p-4">
            <p className="font-bold text-white">Payment method</p>
            <p className="mt-1 text-zinc-300">
              MTN, Airtel, Zamtel, or bank transfer
            </p>
          </div>
          <div className="rounded-2xl bg-zinc-950/60 p-4">
            <p className="font-bold text-white">Status after submission</p>
            <p className="mt-1 text-zinc-300">Awaiting admin confirmation</p>
          </div>
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
        <p className="mt-6 text-sm text-zinc-400">Loading payment data...</p>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="mt-6 grid gap-5">
            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-200">
                Select unpaid job
              </label>
              <select
                value={selectedJobId}
                onChange={(event) => setSelectedJobId(event.target.value)}
                required
                className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-teal-400"
              >
                <option value="">Choose a job</option>
                {unpaidJobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title} — {job.currency || "ZMW"} {job.amountDue || 50}
                  </option>
                ))}
              </select>
            </div>

            {selectedJob && (
              <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-4 text-sm text-zinc-300">
                <p>
                  <span className="font-bold text-white">Selected job:</span>{" "}
                  {selectedJob.title}
                </p>
                <p className="mt-1">
                  <span className="font-bold text-white">Amount due:</span>{" "}
                  {selectedJob.currency || "ZMW"} {selectedJob.amountDue || 50}
                </p>
                <p className="mt-1">
                  <span className="font-bold text-white">Payment status:</span>{" "}
                  {selectedJob.paymentStatus || "PENDING_PAYMENT"}
                </p>
              </div>
            )}

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-zinc-200">
                  Payment method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(event) => setPaymentMethod(event.target.value)}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-teal-400"
                >
                  {paymentMethods.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-zinc-200">
                  Payer phone number
                </label>
                <input
                  value={payerPhone}
                  onChange={(event) => setPayerPhone(event.target.value)}
                  placeholder="Example: 0967xxxxxx"
                  className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-teal-400"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-200">
                Transaction reference
              </label>
              <input
                value={transactionReference}
                onChange={(event) =>
                  setTransactionReference(event.target.value)
                }
                required
                placeholder="Enter MoMo / Airtel / Zamtel / bank reference"
                className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-teal-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-200">
                Optional note
              </label>
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows="3"
                placeholder="Example: Paid from company number, payment made today."
                className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-teal-400"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !selectedJobId}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-5 py-3 font-black text-zinc-950 hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send size={18} />
              {submitting ? "Submitting..." : "Submit Payment Confirmation"}
            </button>
          </form>

          <div className="mt-8">
            <h3 className="mb-4 text-xl font-black text-white">
              My payment submissions
            </h3>

            {payments.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-5 text-sm text-zinc-400">
                No payment confirmations submitted yet.
              </div>
            ) : (
              <div className="grid gap-4">
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="rounded-2xl border border-white/10 bg-zinc-950/60 p-5"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="font-black text-white">
                          {payment.job?.title || "Job advert"}
                        </p>
                        <p className="mt-1 text-sm text-zinc-400">
                          Reference: {payment.transactionReference}
                        </p>
                        <p className="mt-1 text-sm text-zinc-400">
                          Submitted: {formatDate(payment.createdAt)}
                        </p>
                      </div>

                      <span
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-black ${statusBadge(
                          payment.status
                        )}`}
                      >
                        <Clock size={14} />
                        {payment.status}
                      </span>
                    </div>

                    {payment.adminNote && (
                      <p className="mt-3 rounded-xl bg-white/5 p-3 text-sm text-zinc-300">
                        Admin note: {payment.adminNote}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  )
}