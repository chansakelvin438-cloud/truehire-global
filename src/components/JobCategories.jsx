import { Link } from "react-router-dom"
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Code2,
  Headphones,
  HeartHandshake,
  PackageCheck,
} from "lucide-react"

function JobCategories() {
  const categories = [
    {
      title: "Sales & Customer Service",
      description:
        "Customer support, sales agents, service consultants, call centre roles, and frontline positions.",
      icon: Headphones,
      jobs: "Customer-facing roles",
      link: "/jobs?category=Sales%20%26%20Customer%20Service",
    },
    {
      title: "Procurement & Logistics",
      description:
        "Procurement assistants, supply chain, inventory, stores, logistics, and purchasing opportunities.",
      icon: PackageCheck,
      jobs: "Supply chain roles",
      link: "/jobs?category=Procurement%20%26%20Logistics",
    },
    {
      title: "Data & Technology",
      description:
        "Data analysis, IT support, software, cybersecurity, systems, and digital technology roles.",
      icon: Code2,
      jobs: "Digital careers",
      link: "/jobs?category=Data%20%26%20Technology",
    },
    {
      title: "Finance & Accounting",
      description:
        "Finance officers, accounts assistants, audit, banking, economics, and reporting opportunities.",
      icon: BarChart3,
      jobs: "Finance roles",
      link: "/jobs?category=Finance%20%26%20Accounting",
    },
    {
      title: "NGO & Development",
      description:
        "Programme support, field work, monitoring and evaluation, social impact, and development roles.",
      icon: HeartHandshake,
      jobs: "Impact careers",
      link: "/jobs?category=NGO%20%26%20Development",
    },
    {
      title: "Remote Jobs",
      description:
        "Remote-friendly opportunities for professionals who can work online across locations and borders.",
      icon: BriefcaseBusiness,
      jobs: "Work from anywhere",
      link: "/jobs?type=Remote",
    },
  ]

  return (
    <section className="relative overflow-hidden bg-zinc-950 px-6 py-20 text-white">
      <div className="absolute left-20 top-0 h-72 w-72 rounded-full bg-yellow-400/10 blur-3xl"></div>
      <div className="absolute bottom-0 right-20 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl"></div>

      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="inline-flex rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-2 text-sm font-bold text-teal-300">
              Explore career categories
            </p>

            <h2 className="mt-6 max-w-3xl text-4xl font-extrabold tracking-tight md:text-5xl">
              Find opportunities by profession, skill, and career direction.
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
              TrueHire Global organises verified jobs into clear categories so job seekers
              can move faster from searching to applying.
            </p>
          </div>

          <Link
            to="/jobs"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-yellow-400/40 px-6 py-3 text-sm font-bold text-yellow-300 hover:bg-yellow-400 hover:text-zinc-950"
          >
            View all categories
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => {
            const Icon = category.icon

            return (
              <Link
                key={index}
                to={category.link}
                className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-teal-400/40 hover:bg-white/10"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500 text-zinc-950 shadow-lg shadow-teal-500/20">
                    <Icon size={28} />
                  </div>

                  <span className="rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-bold text-yellow-300">
                    {category.jobs}
                  </span>
                </div>

                <h3 className="mt-6 text-2xl font-extrabold text-white">
                  {category.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-zinc-400">
                  {category.description}
                </p>

                <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-teal-300">
                  Browse jobs
                  <ArrowRight
                    size={17}
                    className="transition group-hover:translate-x-1"
                  />
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-12 rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <p className="text-3xl font-extrabold text-teal-300">Smart</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Categories help job seekers narrow searches quickly.
              </p>
            </div>

            <div>
              <p className="text-3xl font-extrabold text-yellow-300">Focused</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Jobs are grouped by career direction and professional area.
              </p>
            </div>

            <div>
              <p className="text-3xl font-extrabold text-emerald-300">Scalable</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                More sectors can be added as TrueHire Global grows.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default JobCategories