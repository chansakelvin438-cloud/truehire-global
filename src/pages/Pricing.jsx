import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { CheckCircle, ShieldCheck, Star, Zap, Building2 } from "lucide-react"

const pricingPlans = [
  {
    name: "Launch Offer",
    price: "K50",
    subtitle: "Approx. $3 per advert",
    badge: "Introductory",
    icon: ShieldCheck,
    features: [
      "One verified job advert",
      "Employer review before approval",
      "Visible on public Jobs page",
      "Basic scam-risk screening",
      "Suitable for small businesses and startups",
    ],
  },
  {
    name: "Standard Verified Job",
    price: "K150",
    subtitle: "Per job advert",
    badge: "Recommended",
    icon: CheckCircle,
    features: [
      "One standard verified job advert",
      "Admin review and approval",
      "Employer dashboard access",
      "Applicant management",
      "Safer hiring visibility",
    ],
  },
  {
    name: "Featured Job",
    price: "K300",
    subtitle: "Higher visibility",
    badge: "Popular",
    icon: Star,
    features: [
      "Featured job placement",
      "More visibility to job seekers",
      "Verified employer badge",
      "Applicant tracking support",
      "Better for competitive roles",
    ],
  },
  {
    name: "Priority Hiring",
    price: "K500",
    subtitle: "Urgent recruitment",
    badge: "Priority",
    icon: Zap,
    features: [
      "Priority job visibility",
      "Urgent hiring label",
      "Faster admin review",
      "Better placement on Jobs page",
      "Suitable for time-sensitive roles",
    ],
  },
  {
    name: "Monthly Employer Plan",
    price: "K800",
    subtitle: "For regular hiring",
    badge: "Monthly",
    icon: Building2,
    features: [
      "Multiple job adverts per month",
      "Employer verification support",
      "Applicant dashboard access",
      "Priority support",
      "Best for active recruiters",
    ],
  },
]

export default function Pricing() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-2 text-sm font-semibold text-teal-300">
              Employer Pricing
            </p>

            <h1 className="text-4xl font-black tracking-tight md:text-6xl">
              Simple pricing for verified hiring.
            </h1>

            <p className="mt-6 text-lg leading-8 text-zinc-300">
              TrueHire Global helps employers post safer, verified job adverts
              while keeping job seekers free. Our launch pricing is designed to
              support startups, SMEs, schools, shops, organisations, and growing
              businesses.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {pricingPlans.map((plan) => {
              const Icon = plan.icon

              return (
                <div
                  key={plan.name}
                  className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20 transition hover:border-teal-400/40 hover:bg-white/[0.07]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-400/10 text-teal-300">
                      <Icon size={26} />
                    </div>

                    <span className="rounded-full bg-yellow-400 px-3 py-1 text-xs font-black text-zinc-950">
                      {plan.badge}
                    </span>
                  </div>

                  <h2 className="mt-6 text-2xl font-black">{plan.name}</h2>

                  <div className="mt-4">
                    <span className="text-4xl font-black text-yellow-300">
                      {plan.price}
                    </span>
                    <p className="mt-1 text-sm text-zinc-400">
                      {plan.subtitle}
                    </p>
                  </div>

                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex gap-3 text-sm leading-6 text-zinc-300"
                      >
                        <CheckCircle className="mt-0.5 shrink-0 text-teal-300" size={18} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>

          <div className="mt-12 rounded-3xl border border-yellow-400/20 bg-yellow-400/10 p-6">
            <p className="mt-3 text-zinc-300">
              Employers can view the pricing structure now and submit manual payment
              confirmations after posting a job. Please review our{" "}
              <Link
                to="/payment-policy"
                className="font-bold text-yellow-300 hover:text-yellow-200"
              >
                Payment & Refund Policy
              </Link>{" "}
              before submitting payment.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}