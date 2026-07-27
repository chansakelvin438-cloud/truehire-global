import { Link } from "react-router-dom"
import { ArrowRight, BriefcaseBusiness, Home, Search, ShieldAlert } from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

function NotFound() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <section className="relative overflow-hidden px-6 py-24">
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl"></div>
        <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-yellow-400/10 blur-3xl"></div>

        <div className="relative mx-auto max-w-5xl">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center shadow-2xl shadow-teal-500/10 md:p-14">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-red-400 text-zinc-950">
              <ShieldAlert size={42} />
            </div>

            <p className="mt-8 text-sm font-bold uppercase tracking-widest text-red-300">
              Page not found
            </p>

            <h1 className="mt-4 text-6xl font-extrabold tracking-tight md:text-7xl">
              404
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
              The page you are looking for does not exist, may have moved, or the link may
              be incorrect.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-yellow-400 px-7 py-3 text-sm font-extrabold text-zinc-950 hover:bg-yellow-300"
              >
                <Home size={17} />
                Go Home
              </Link>

              <Link
                to="/jobs"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-teal-400/40 px-7 py-3 text-sm font-bold text-teal-300 hover:bg-teal-500 hover:text-zinc-950"
              >
                <Search size={17} />
                Browse Jobs
              </Link>

              <Link
                to="/employers"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-7 py-3 text-sm font-bold text-white hover:border-yellow-400 hover:text-yellow-300"
              >
                <BriefcaseBusiness size={17} />
                Employers
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default NotFound