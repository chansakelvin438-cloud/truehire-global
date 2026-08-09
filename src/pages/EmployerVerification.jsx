import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Download,
  FileText,
  Globe,
  Hash,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import {
  getMyEmployerVerification,
  submitEmployerVerification,
  uploadAuthorizationLetter,
  uploadBusinessRegistrationDocument,
  uploadTaxDocument,
} from "../services/api"
import ProtectedFileButton from "../components/ProtectedFileButton"

function EmployerVerification() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
  const employerProfile = currentUser.employerProfile || {}

  const [loadingStatus, setLoadingStatus] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState(
    localStorage.getItem("employerVerificationStatus") || "Verification Pending"
  )
  const [verification, setVerification] = useState(null)
  const [selectedDocuments, setSelectedDocuments] = useState({
    businessRegistrationFile: "",
    taxDocumentFile: "",
    authorizationLetterFile: "",
  })

  useEffect(() => {
    async function loadVerification() {
      try {
        setLoadingStatus(true)
        setError("")

        const response = await getMyEmployerVerification()

        setVerificationStatus(
          response.verificationStatus || "Verification Pending"
        )
        setVerification(response.verification || null)

        localStorage.setItem(
          "employerVerificationStatus",
          response.verificationStatus || "Verification Pending"
        )
      } catch (error) {
        setError(error.message || "Failed to load verification status")
      } finally {
        setLoadingStatus(false)
      }
    }

    loadVerification()
  }, [])

  function handleDocumentChange(event) {
    const { name, files } = event.target
    const file = files?.[0]

    setSelectedDocuments((current) => ({
      ...current,
      [name]: file ? file.name : "",
    }))
  }

  async function handleVerificationSubmit(event) {
    event.preventDefault()

    const formData = new FormData(event.target)

    const businessRegistrationFile = formData.get("businessRegistrationFile")
    const taxDocumentFile = formData.get("taxDocumentFile")
    const authorizationLetterFile = formData.get("authorizationLetterFile")

    try {
      setSubmitting(true)
      setError("")
      setSuccess(false)

      let businessRegistrationFileName = ""
      let businessRegistrationFileUrl = ""
      let taxDocumentFileName = ""
      let taxDocumentFileUrl = ""
      let authorizationLetterFileName = ""
      let authorizationLetterFileUrl = ""

      if (businessRegistrationFile && businessRegistrationFile.size > 0) {
        const uploadResponse = await uploadBusinessRegistrationDocument(
          businessRegistrationFile
        )

        businessRegistrationFileName =
          uploadResponse.fileName || businessRegistrationFile.name
        businessRegistrationFileUrl = uploadResponse.fileUrl || ""
      }

      if (taxDocumentFile && taxDocumentFile.size > 0) {
        const uploadResponse = await uploadTaxDocument(taxDocumentFile)

        taxDocumentFileName = uploadResponse.fileName || taxDocumentFile.name
        taxDocumentFileUrl = uploadResponse.fileUrl || ""
      }

      if (authorizationLetterFile && authorizationLetterFile.size > 0) {
        const uploadResponse = await uploadAuthorizationLetter(
          authorizationLetterFile
        )

        authorizationLetterFileName =
          uploadResponse.fileName || authorizationLetterFile.name
        authorizationLetterFileUrl = uploadResponse.fileUrl || ""
      }

      const verificationData = {
        companyName: formData.get("companyName"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        companyRegistrationNumber: formData.get("companyRegistrationNumber"),
        tpin: formData.get("tpin"),
        businessType: formData.get("businessType"),
        address: formData.get("address"),
        contactPerson: formData.get("contactPerson"),
        website: formData.get("website"),

        businessRegistrationFileName,
        businessRegistrationFileUrl,

        taxDocumentFileName,
        taxDocumentFileUrl,

        authorizationLetterFileName,
        authorizationLetterFileUrl,
      }

      const response = await submitEmployerVerification(verificationData)

      setVerificationStatus(response.verification?.status || "Submitted for Review")
      setVerification(response.verification || null)
      setSuccess(true)

      localStorage.setItem(
        "employerVerificationStatus",
        response.verification?.status || "Submitted for Review"
      )

      event.target.reset()
      setSelectedDocuments({
        businessRegistrationFile: "",
        taxDocumentFile: "",
        authorizationLetterFile: "",
      })
    } catch (error) {
      setError(error.message || "Failed to submit employer verification")
    } finally {
      setSubmitting(false)
    }
  }

  function getStatusClass(status) {
    if (status === "Verified") {
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
    }

    if (status === "Rejected") {
      return "border-red-400/20 bg-red-400/10 text-red-300"
    }

    if (status === "Flagged") {
      return "border-orange-400/20 bg-orange-400/10 text-orange-300"
    }

    if (status === "Submitted for Review") {
      return "border-yellow-400/20 bg-yellow-400/10 text-yellow-300"
    }

    return "border-white/10 bg-white/5 text-zinc-300"
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

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_390px] lg:items-start">
            <div>
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-teal-500/10 md:p-10">
                <p className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-2 text-sm font-bold text-teal-300">
                  <ShieldCheck size={16} />
                  Employer Verification
                </p>

                <h1 className="mt-6 text-5xl font-extrabold tracking-tight md:text-6xl">
                  Verify your employer account.
                </h1>

                <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-400">
                  Submit your company details and supporting documents for review.
                </p>
              </div>

              {loadingStatus && (
                <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
                  <p className="text-sm font-bold text-teal-300">
                    Loading verification status...
                  </p>
                </div>
              )}

              {success && (
                <div className="mt-8 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-6">
                  <h2 className="flex items-center gap-2 text-2xl font-extrabold text-emerald-300">
                    <CheckCircle2 size={24} />
                    Verification submitted successfully.
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-zinc-300">
                    Your employer verification request and documents have been submitted
                    for review.
                  </p>
                </div>
              )}

              {error && (
                <div className="mt-8 rounded-3xl border border-red-400/20 bg-red-400/10 p-6">
                  <h2 className="flex items-center gap-2 font-extrabold text-red-300">
                    <AlertTriangle size={22} />
                    Verification issue
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-zinc-300">{error}</p>
                </div>
              )}

              <form
                onSubmit={handleVerificationSubmit}
                className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-8"
              >
                <h2 className="text-3xl font-extrabold">Company Details</h2>

                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  Use the correct registered company details. False or misleading
                  information may lead to rejection.
                </p>

                <div className="mt-8 grid gap-5 md:grid-cols-2">
                  <InputField
                    icon={Building2}
                    label="Company Name"
                    name="companyName"
                    defaultValue={
                      verification?.companyName ||
                      employerProfile.companyName ||
                      currentUser.companyName ||
                      currentUser.displayName ||
                      ""
                    }
                    placeholder="Enter registered company name"
                    required
                  />

                  <InputField
                    icon={Mail}
                    label="Company Email"
                    name="email"
                    type="email"
                    defaultValue={verification?.email || currentUser.email || ""}
                    placeholder="company@example.com"
                    required
                  />

                  <InputField
                    icon={Phone}
                    label="Company Phone"
                    name="phone"
                    defaultValue={
                      verification?.phone ||
                      employerProfile.phone ||
                      currentUser.phone ||
                      ""
                    }
                    placeholder="e.g. +260..."
                  />

                  <InputField
                    icon={Hash}
                    label="Company Registration Number"
                    name="companyRegistrationNumber"
                    defaultValue={verification?.companyRegistrationNumber || ""}
                    placeholder="Enter registration number"
                    required
                  />

                  <InputField
                    icon={Hash}
                    label="TPIN"
                    name="tpin"
                    defaultValue={verification?.tpin || ""}
                    placeholder="Enter company TPIN"
                    required
                  />

                  <SelectField
                    label="Business Type"
                    name="businessType"
                    defaultValue={verification?.businessType || ""}
                  >
                    <option value="">Select business type</option>
                    <option value="Private Limited Company">
                      Private Limited Company
                    </option>
                    <option value="Sole Proprietorship">
                      Sole Proprietorship
                    </option>
                    <option value="Partnership">Partnership</option>
                    <option value="NGO">NGO</option>
                    <option value="Government Institution">
                      Government Institution
                    </option>
                    <option value="Other">Other</option>
                  </SelectField>

                  <InputField
                    icon={User}
                    label="Contact Person"
                    name="contactPerson"
                    defaultValue={
                      verification?.contactPerson || currentUser.displayName || ""
                    }
                    placeholder="Name of authorised contact person"
                    required
                  />

                  <InputField
                    icon={Globe}
                    label="Website"
                    name="website"
                    defaultValue={verification?.website || employerProfile.website || ""}
                    placeholder="https://company.com"
                  />

                  <div className="md:col-span-2">
                    <InputField
                      icon={MapPin}
                      label="Physical Address"
                      name="address"
                      defaultValue={verification?.address || employerProfile.address || ""}
                      placeholder="Enter company physical address"
                      required
                    />
                  </div>
                </div>

                <h2 className="mt-10 text-3xl font-extrabold">
                  Supporting Documents
                </h2>

                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  Upload PDF, DOC, DOCX, JPG, PNG, or WEBP files. Maximum size is 5MB per
                  document.
                </p>

                <div className="mt-8 grid gap-5 md:grid-cols-3">
                  <FileInputField
                    label="Business Registration"
                    name="businessRegistrationFile"
                    selectedFileName={selectedDocuments.businessRegistrationFile}
                    onChange={handleDocumentChange}
                  />

                  <FileInputField
                    label="Tax / TPIN Document"
                    name="taxDocumentFile"
                    selectedFileName={selectedDocuments.taxDocumentFile}
                    onChange={handleDocumentChange}
                  />

                  <FileInputField
                    label="Authorisation Letter"
                    name="authorizationLetterFile"
                    selectedFileName={selectedDocuments.authorizationLetterFile}
                    onChange={handleDocumentChange}
                  />
                </div>

                <div className="mt-8 rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-5">
                  <h3 className="flex items-center gap-2 font-bold text-yellow-300">
                    <AlertTriangle size={20} />
                    Review Notice
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    Submitting verification does not automatically approve the employer
                    account. Admin review is required.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-extrabold ${
                    submitting
                      ? "cursor-not-allowed bg-zinc-700 text-zinc-400"
                      : "bg-yellow-400 text-zinc-950 hover:bg-yellow-300"
                  }`}
                >
                  {submitting ? "Uploading and Submitting..." : "Submit Verification"}
                  {!submitting && <ArrowRight size={17} />}
                </button>
              </form>
            </div>

            <aside className="lg:sticky lg:top-28 lg:h-fit">
              <div className="space-y-6">
                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-teal-500/10">
                  <div
                    className={`rounded-[1.5rem] border p-6 ${getStatusClass(
                      verificationStatus
                    )}`}
                  >
                    <BadgeCheck size={34} />

                    <h2 className="mt-5 text-2xl font-extrabold">
                      {verificationStatus}
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-zinc-300">
                      This status shows the latest review stage for your employer
                      account.
                    </p>
                  </div>
                </div>

                {verification && (
                  <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                    <h2 className="text-2xl font-extrabold">Latest Request</h2>

                    <div className="mt-5 space-y-4 text-sm text-zinc-300">
                      <SummaryItem label="Company" value={verification.companyName} />
                      <SummaryItem label="TPIN" value={verification.tpin} />
                      <SummaryItem
                        label="Registration"
                        value={verification.companyRegistrationNumber}
                      />
                      <SummaryItem
                        label="Submitted"
                        value={verification.submittedAt}
                      />

                      <DocumentLink
                        label="Business Registration"
                        fileName={verification.businessRegistrationFileName}
                        fileUrl={verification.businessRegistrationFileUrl}
                      />

                      <DocumentLink
                        label="Tax / TPIN Document"
                        fileName={verification.taxDocumentFileName}
                        fileUrl={verification.taxDocumentFileUrl}
                      />

                      <DocumentLink
                        label="Authorisation Letter"
                        fileName={verification.authorizationLetterFileName}
                        fileUrl={verification.authorizationLetterFileUrl}
                      />
                    </div>
                  </div>
                )}

                <div className="rounded-[2rem] border border-teal-400/20 bg-teal-400/10 p-6">
                  <h2 className="text-2xl font-extrabold text-teal-300">
                    Why verification matters
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-zinc-300">
                    Verified employers improve applicant trust and help TrueHire reduce
                    fake job adverts.
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

function SelectField({ label, name, children, defaultValue = "" }) {
  return (
    <div>
      <label className="text-sm font-bold text-zinc-300">{label}</label>

      <select
        name={name}
        required
        defaultValue={defaultValue}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-4 text-sm text-white outline-none focus:border-teal-400"
      >
        {children}
      </select>
    </div>
  )
}

function FileInputField({ label, name, selectedFileName, onChange }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/20 bg-zinc-950 p-5">
      <FileText size={24} className="text-teal-300" />

      <label className="mt-4 block text-sm font-bold text-zinc-300">
        {label}
      </label>

      <input
        type="file"
        name={name}
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
        onChange={onChange}
        className="mt-4 w-full text-xs text-zinc-300 file:mr-4 file:rounded-full file:border-0 file:bg-yellow-400 file:px-4 file:py-2 file:text-xs file:font-bold file:text-zinc-950 hover:file:bg-yellow-300"
      />

      <p className="mt-3 text-xs leading-5 text-zinc-500">
        {selectedFileName || "No document selected yet"}
      </p>
    </div>
  )
}

function SummaryItem({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-bold text-white">
        {value || "Not provided"}
      </p>
    </div>
  )
}

function DocumentLink({ label, fileName, fileUrl }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
        {label}
      </p>

      {fileUrl ? (
        <ProtectedFileButton
            fileUrl={fileUrl}
            label="Open Document"
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-4 py-2 text-xs font-extrabold text-zinc-950 hover:bg-yellow-300"
        />
      ) : (
        <p className="mt-2 break-words text-sm font-bold text-zinc-300">
          {fileName || "No document attached"}
        </p>
      )}
    </div>
  )
}

export default EmployerVerification