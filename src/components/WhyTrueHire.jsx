import {
  Building2,
  CheckCircle,
  FileSearch,
  ShieldCheck,
} from "lucide-react"

const trustPoints = [
  {
    icon: ShieldCheck,
    title: "Safer job discovery",
    text: "Public job adverts are reviewed to reduce fake, misleading, and unsafe opportunities.",
  },
  {
    icon: Building2,
    title: "Employer verification",
    text: "Employers can submit company details and supporting documents to build trust with applicants.",
  },
  {
    icon: FileSearch,
    title: "Admin review",
    text: "Payments, employer submissions, and job adverts can be reviewed before public visibility.",
  },
  {
    icon: CheckCircle,
    title: "Applicant protection",
    text: "TrueHire discourages application fees, interview fees, medical fees, and other suspicious recruitment payments.",
  },
]

export default function WhyTrueHire() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex rounded-full border border-teal-400/30 bg-teal-400/10 px-5 py-2 text-sm font-black uppercase tracking-wide text-teal-300">
            Why TrueHire Global
          </p>

          <h2 className="text-4xl font-black tracking-tight text-white md:text-6xl">
            Built for trusted hiring.
          </h2>

          <p className="mt-6 text-lg leading-8 text-zinc-400">
            TrueHire Global helps job seekers find safer opportunities and gives
            employers a structured way to build credibility before hiring.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {trustPoints.map((point) => {
            const Icon = point.icon

            return (
              <div
                key={point.title}
                className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-400/10 text-teal-300">
                  <Icon size={28} />
                </div>

                <h3 className="mt-6 text-xl font-black text-white">
                  {point.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-zinc-400">
                  {point.text}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}