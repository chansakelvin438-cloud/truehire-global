import { Link } from "react-router-dom"
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react"

function SafetyCentre() {
  const safetyItems = [
    {
      icon: AlertTriangle,
      title: "Never pay to get a job",
      description:
        "True employers should not ask job seekers to pay application, interview, medical, registration, or recruitment fees before employment.",
      colour: "border-red-400/20 bg-red-400/10 text-red-300",
    },
    {
      icon: BadgeCheck,
      title: "Check the verified badge",
      description:
        "Verified employers will be marked clearly so job seekers can quickly identify more trusted opportunities.",
      colour: "border-teal-400/20 bg-teal-400/10 text-teal-300",
    },
    {
      icon: ShieldAlert,
      title: "Report suspicious jobs",
      description:
        "Users can report fake jobs, suspicious employers, or adverts that request money from applicants.",
      colour: "border-yellow-400/20 bg-yellow-400/10 text-yellow-300",
    },
  ]

  return (
    <section className="relative overflow-hidden bg-zinc-950 px-6 py-20 text-white">
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-red-500/10 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl"></div>

      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
        <div className="rounded-[2rem] border border-teal-400/20 bg-teal-400/10 p-8 shadow-2xl shadow-teal-500/10 md:p-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-500 text-zinc-950">
            <ShieldCheck size={34} />
          </div>

          <p className="mt-8 text-sm font-bold uppercase tracking-widest text-teal-300">
            Safety Centre
          </p>

          <h2 className="mt-4 text-4xl font-extrabold tracking-tight md:text-5xl">
            We are building TrueHire Global to fight fake job adverts.
          </h2>

          <p className="mt-5 text-lg leading-8 text-zinc-300">
            Job seekers should never be forced to pay money just to get a job.
            TrueHire Global helps users identify trusted employers, report suspicious
            posts, and avoid recruitment scams.
          </p>

          <Link
            to="/safety"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-7 py-3 text-sm font-extrabold text-zinc-950 hover:bg-yellow-300"
          >
            Visit Safety Centre
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="space-y-5">
          {safetyItems.map((item, index) => {
            const Icon = item.icon

            return (
              <div
                key={index}
                className={`rounded-3xl border p-6 ${item.colour}`}
              >
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                    <Icon size={25} />
                  </div>

                  <div>
                    <h3 className="text-2xl font-extrabold text-white">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-zinc-300">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default SafetyCentre