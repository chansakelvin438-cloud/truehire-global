import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  FileCheck2,
  Globe2,
  Hash,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Upload,
  User,
} from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

function EmployerVerification() {
  const navigate = useNavigate()
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
  const savedStatus =
    localStorage.getItem("employerVerificationStatus") || "Verification Pending"

  const [submitted, setSubmitted] = useState(false)

  function handleSubmitVerification(event) {
    event.preventDefault()

    const formData = new FormData(event.target)

    const businessRegistrationFile = formData.get("businessRegistrationFile")
    const taxDocumentFile = formData.get("taxDocumentFile")
    const authorizationLetterFile = formData.get("authorizationLetterFile")

    const verificationRequest = {
      id: Date.now(),
      companyName:
        formData.get("companyName") ||
        currentUser.companyName ||
        currentUser.displayName ||
        "Employer Company",
      email: formData.get("email") || currentUser.email || "",
      phone: formData.get("phone") || currentUser.phone || "",
      companyRegistrationNumber: formData.get("companyRegistrationNumber"),
      tpin: formData.get("tpin"),
      businessType: formData.get("businessType"),
      address: formData.get("address"),
      contactPerson: formData.get("contactPerson"),
      website: formData.get("website"),
      businessRegistrationFileName:
        businessRegistrationFile?.name || "No business registration uploaded",
      taxDocumentFileName: taxDocumentFile?.name || "No tax document uploaded",
      authorizationLetterFileName:
        authorizationLetterFile?.name || "No authorization letter uploaded",
      status: "Submitted for Review",
      submittedAt: new Date().toLocaleDateString("en-GB"),
    }

    const savedRequests = JSON.parse(
      localStorage.getItem("employerVerificationRequests") || "[]"
    )

    localStorage.setItem(
      "employerVerificationRequests",
      JSON.stringify([verificationRequest, ...savedRequests])
    )

    localStorage.setItem("employerVerificationStatus", "Submitted for Review")

    setSubmitted(true)

    setTimeout(() => {
      navigate("/employer-dashboard")
    }, 1400)
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

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_390px]">
            <div>
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-teal-500/10 md:p-10">
                <p className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-2 text-sm font-bold text-teal-300">
                  <ShieldCheck size={16} />
                  Employer verification
                </p>

                <h1 className="mt-6 text-5xl font-extrabold tracking-tight md:text-6xl">
                  Build employer trust before hiring.
                </h1>

                <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-400">
                  Submit company details for admin review. Verified employers receive
                  stronger trust status across TrueHire Global.
                </p>
              </div>

              {submitted && (
                <div className="mt-8 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-6">
                  <h2 className="flex items-center gap-2 text-2xl font-extrabold text-emerald-300">
                    <CheckCircle2 size={24} />
                    Verification request submitted.
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-zinc-300">
                    Your company verification details have been sent for admin review.
                    Your employer dashboard will show the updated verification status.
                  </p>
                </div>
              )}

              <form
                onSubmit={handleSubmitVerification}
                className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-8"
              >
                <h2 className="text-3xl font-extrabold">Company Details</h2>

                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  Use accurate company information. Admin will review these details before
                  approving stronger employer trust status.
                </p>

                <div className="mt-8 grid gap-5 md:grid-cols-2">
                  <InputField
                    icon={Building2}
                    label="Company Name"
                    name="companyName"
                    defaultValue={
                      currentUser.companyName || currentUser.displayName || ""
                    }
                    placeholder="Enter registered company name"
                    required
                  />

                  <InputField
                    icon={Hash}
                    label="Company Registration Number"
                    name="companyRegistrationNumber"
                    placeholder="Enter PACRA/company registration number"
                    required
                  />

                  <InputField
                    icon={Hash}
                    label="TPIN"
                    name="tpin"
                    placeholder="Enter company TPIN"
                    required
                  />

                  <SelectField label="Business Type" name="businessType">
                    <option>Limited Company</option>
                    <option>Sole Proprietor</option>
                    <option>Partnership</option>
                    <option>NGO</option>
                    <option>Government Institution</option>
                    <option>Other</option>
                  </SelectField>

                  <div className="md:col-span-2">
                    <InputField
                      icon={MapPin}
                      label="Business Address"
                      name="address"
                      placeholder="Enter physical business address"
                      required
                    />
                  </div>
                </div>

                <h2 className="mt-10 text-3xl font-extrabold">
                  Contact Information
                </h2>

                <div className="mt-8 grid gap-5 md:grid-cols-2">
                  <InputField
                    icon={User}
                    label="Contact Person"
                    name="contactPerson"
                    placeholder="Full name of authorised contact person"
                    required
                  />

                  <InputField
                    icon={Mail}
                    label="Business Email"
                    name="email"
                    type="email"
                    defaultValue={currentUser.email || ""}
                    placeholder="company@example.com"
                    required
                  />

                  <InputField
                    icon={Phone}
                    label="Phone Number"
                    name="phone"
                    defaultValue={currentUser.phone || ""}
                    placeholder="e.g. +260..."
                    required
                  />

                  <InputField
                    icon={Globe2}
                    label="Website"
                    name="website"
                    placeholder="https://example.com"
                  />
                </div>

                <h2 className="mt-10 text-3xl font-extrabold">
                  Verification Documents
                </h2>

                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  For now, the front-end stores file names only. Real document upload and
                  secure storage will be handled later by the backend.
                </p>

                <div className="mt-8 grid gap-5">
                  <FileUploadField
                    label="Business Registration Document"
                    name="businessRegistrationFile"
                    required
                  />

                  <FileUploadField
                    label="Tax / TPIN Document"
                    name="taxDocumentFile"
                    required
                  />

                  <FileUploadField
                    label="Authorization Letter"
                    name="authorizationLetterFile"
                  />
                </div>

                <div className="mt-8 rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-5">
                  <h3 className="flex items-center gap-2 font-bold text-yellow-300">
                    <AlertTriangle size={20} />
                    Review notice
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    Submitting verification does not automatically approve the employer.
                    Admin must review and approve the request from the Admin Dashboard.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitted}
                  className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-extrabold ${
                    submitted
                      ? "cursor-not-allowed bg-zinc-700 text-zinc-400"
                      : "bg-yellow-400 text-zinc-950 hover:bg-yellow-300"
                  }`}
                >
                  {submitted ? "Submitted for Review" : "Submit Verification"}
                  {!submitted && <ArrowRight size={17} />}
                </button>
              </form>
            </div>

            <aside className="lg:sticky lg:top-28 lg:h-fit">
              <div className="space-y-6">
                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-teal-500/10">
                  <div
                    className={`rounded-[1.5rem] border p-6 ${getStatusClass(
                      savedStatus
                    )}`}
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-950">
                      <BadgeCheck size={30} />
                    </div>

                    <h2 className="mt-5 text-2xl font-extrabold">
                      Current Status
                    </h2>

                    <p className="mt-2 text-3xl font-extrabold">{savedStatus}</p>

                    <p className="mt-3 text-sm leading-7 text-zinc-300">
                      This status will change after admin reviews the employer
                      verification request.
                    </p>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-teal-400/20 bg-teal-400/10 p-6">
                  <h2 className="text-2xl font-extrabold text-teal-300">
                    Verification Benefits
                  </h2>

                  <div className="mt-5 space-y-3 text-sm text-zinc-300">
                    <ChecklistItem text="Build trust with job seekers" />
                    <ChecklistItem text="Strengthen employer profile credibility" />
                    <ChecklistItem text="Support safer hiring on the platform" />
                    <ChecklistItem text="Prepare for future paid job posting" />
                  </div>
                </div>

                <div className="rounded-[2rem] border border-red-400/20 bg-red-400/10 p-6">
                  <h2 className="text-2xl font-extrabold text-red-300">
                    Safety Rule
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-zinc-300">
                    Verified employers must not ask applicants to pay registration,
                    application, interview, medical, or recruitment fees.
                  </p>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                  <h2 className="text-2xl font-extrabold">Admin Review</h2>

                  <p className="mt-3 text-sm leading-7 text-zinc-400">
                    Verification requests appear in the Admin Dashboard where admin can
                    approve, flag, or reject the employer.
                  </p>

                  <Link
                    to="/employer-dashboard"
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-teal-400/40 px-5 py-3 text-sm font-bold text-teal-300 hover:bg-teal-500 hover:text-zinc-950"
                  >
                    Employer Dashboard
                    <ArrowRight size={17} />
                  </Link>
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

function SelectField({ label, name, children }) {
  return (
    <div>
      <label className="text-sm font-bold text-zinc-300">{label}</label>

      <select
        name={name}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-4 text-sm text-white outline-none focus:border-teal-400"
      >
        {children}
      </select>
    </div>
  )
}

function FileUploadField({ label, name, required = false }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/20 bg-zinc-950 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-500 text-zinc-950">
            <Upload size={25} />
          </div>

          <div>
            <p className="font-bold text-white">{label}</p>
            <p className="mt-1 text-xs text-zinc-500">
              Accepted formats: PDF, DOC, DOCX, JPG, PNG
            </p>
          </div>
        </div>

        <input
          name={name}
          type="file"
          required={required}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300 outline-none focus:border-teal-400 md:max-w-xs"
        />
      </div>
    </div>
  )
}

function ChecklistItem({ text }) {
  return (
    <p className="flex items-center gap-2">
      <FileCheck2 size={17} className="text-teal-300" />
      <span>{text}</span>
    </p>
  )
}

export default EmployerVerification