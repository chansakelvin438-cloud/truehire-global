import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Globe2,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react"

function Hero() {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState("")
  const [location, setLocation] = useState("")

  function handleSearch(event) {
    event.preventDefault()

    const params = new URLSearchParams()

    if (keyword.trim()) {
      params.set("q", keyword.trim())
    }

    if (location.trim()) {
      params.set("location", location.trim())
    }

    navigate(`/jobs${params.toString() ? `?${params.toString()}` : ""}`)
  }

  return (
    <section className="relative overflow-hidden bg-zinc-950 px-6 py-20 text-white md:py-28">
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-teal-500/20 blur-3xl"></div>
      <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-yellow-400/10 blur-3xl"></div>
      <div className="absolute bottom-0 left-1/2 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl"></div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-2 text-sm font-semibold text-teal-300">
            <Sparkles size={16} />
            Zambia first. Africa next. Global-ready.
          </div>

          <h1 className="mt-8 max-w-4xl text-5xl font-extrabold leading-tight tracking-tight md:text-7xl">
            Find verified jobs from trusted employers.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            TrueHire Global helps job seekers discover safer opportunities while
            giving verified employers a trusted platform to attract real talent.
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-10 rounded-3xl border border-white/10 bg-white/10 p-4 shadow-2xl shadow-teal-500/10 backdrop-blur"
          >
            <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-zinc-950/80 px-4 py-4">
                <Search size={20} className="text-teal-300" />

                <input
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  type="text"
                  placeholder="Job title, skill, or company"
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                />
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-zinc-950/80 px-4 py-4">
                <MapPin size={20} className="text-yellow-300" />

                <input
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  type="text"
                  placeholder="Location e.g. Lusaka, Kitwe, Remote"
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                />
              </div>

              <button
                type="submit"
                className="rounded-2xl bg-yellow-400 px-7 py-4 text-sm font-extrabold text-zinc-950 hover:bg-yellow-300"
              >
                Search Jobs
              </button>
            </div>
          </form>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/jobs?category=Data%20%26%20Technology"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-300 hover:border-teal-400 hover:text-teal-300"
            >
              Data & Technology
            </Link>

            <Link
              to="/jobs?category=Sales%20%26%20Customer%20Service"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-300 hover:border-teal-400 hover:text-teal-300"
            >
              Sales & Customer Service
            </Link>

            <Link
              to="/jobs?category=Procurement%20%26%20Logistics"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-300 hover:border-teal-400 hover:text-teal-300"
            >
              Procurement & Logistics
            </Link>

            <Link
              to="/jobs?type=Remote"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-300 hover:border-teal-400 hover:text-teal-300"
            >
              Remote Jobs
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-3xl font-extrabold text-white">100%</p>
              <p className="mt-2 text-sm text-zinc-400">Admin-reviewed adverts</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-3xl font-extrabold text-white">$3</p>
              <p className="mt-2 text-sm text-zinc-400">Future employer posting fee</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-3xl font-extrabold text-white">Free</p>
              <p className="mt-2 text-sm text-zinc-400">Job seeker access</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-6 -top-6 hidden rounded-3xl border border-yellow-400/20 bg-yellow-400/10 p-5 backdrop-blur md:block">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-yellow-400 text-zinc-950">
                <Globe2 size={23} />
              </div>

              <div>
                <p className="font-bold">International-ready</p>
                <p className="text-sm text-zinc-400">Built for scalable hiring</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-5 shadow-2xl shadow-teal-500/10 backdrop-blur">
            <div className="rounded-[1.5rem] border border-white/10 bg-zinc-950 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-teal-300">
                    TrueHire Trust Console
                  </p>
                  <h2 className="mt-2 text-2xl font-extrabold">
                    Safer hiring pipeline
                  </h2>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500 text-zinc-950">
                  <ShieldCheck size={30} />
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="mt-1 text-emerald-300" size={22} />

                    <div>
                      <p className="font-bold">Verified employer workflow</p>
                      <p className="mt-1 text-sm leading-6 text-zinc-400">
                        Employers submit company details before gaining stronger trust
                        status on the platform.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-5">
                  <div className="flex items-start gap-4">
                    <BriefcaseBusiness
                      className="mt-1 text-yellow-300"
                      size={22}
                    />

                    <div>
                      <p className="font-bold">Admin-approved job adverts</p>
                      <p className="mt-1 text-sm leading-6 text-zinc-400">
                        Job posts are reviewed before appearing publicly to reduce fake
                        adverts.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-5">
                  <div className="flex items-start gap-4">
                    <ShieldCheck className="mt-1 text-red-300" size={22} />

                    <div>
                      <p className="font-bold">Scam risk detection</p>
                      <p className="mt-1 text-sm leading-6 text-zinc-400">
                        Jobs asking for registration, interview, or application fees are
                        flagged for safety review.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-zinc-400">Platform direction</p>
                    <p className="mt-1 font-bold">Verified Jobs. Real Careers.</p>
                  </div>

                  <Link
                    to="/jobs"
                    className="inline-flex items-center gap-2 rounded-full bg-teal-500 px-5 py-3 text-sm font-bold text-zinc-950 hover:bg-teal-400"
                  >
                    Explore
                    <ArrowRight size={17} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-6 -right-6 hidden rounded-3xl border border-teal-400/20 bg-teal-400/10 p-5 backdrop-blur md:block">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-500 text-zinc-950">
                <Users size={23} />
              </div>

              <div>
                <p className="font-bold">Talent focused</p>
                <p className="text-sm text-zinc-400">Built for job seekers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero