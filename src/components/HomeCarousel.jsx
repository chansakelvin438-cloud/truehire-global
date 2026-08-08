import { useEffect, useState } from "react"
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react"
import { Link } from "react-router-dom"

const slides = [
  {
    title: "Verified Jobs. Real Careers.",
    subtitle:
      "Find safer job opportunities from employers reviewed through TrueHire Global.",
    buttonText: "Browse Jobs",
    buttonLink: "/jobs",
    badge: "For Job Seekers",
    icon: BriefcaseBusiness,
    image:
      "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    title: "Hire with trust and visibility.",
    subtitle:
      "Employers can post job adverts, track applications, and build trust through verification.",
    buttonText: "Post a Job",
    buttonLink: "/employers/post-job",
    badge: "For Employers",
    icon: Building2,
    image:
      "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    title: "Built to fight fake jobs.",
    subtitle:
      "TrueHire checks job adverts for scam indicators before they appear publicly.",
    buttonText: "Visit Safety Centre",
    buttonLink: "/safety",
    badge: "Safety First",
    icon: ShieldCheck,
    image:
      "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
]

function HomeCarousel() {
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((currentSlide) =>
        currentSlide === slides.length - 1 ? 0 : currentSlide + 1
      )
    }, 4500)

    return () => clearInterval(interval)
  }, [])

  function goToPreviousSlide() {
    setActiveSlide((currentSlide) =>
      currentSlide === 0 ? slides.length - 1 : currentSlide - 1
    )
  }

  function goToNextSlide() {
    setActiveSlide((currentSlide) =>
      currentSlide === slides.length - 1 ? 0 : currentSlide + 1
    )
  }

  const slide = slides[activeSlide]
  const SlideIcon = slide.icon

  return (
    <section className="px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-zinc-950 shadow-2xl shadow-teal-500/10">
          <div
            className="relative min-h-[520px] bg-cover bg-center transition-all duration-700"
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(9,9,11,0.96), rgba(9,9,11,0.72), rgba(9,9,11,0.28)), url(${slide.image})`,
            }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.24),transparent_28rem)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(250,204,21,0.20),transparent_28rem)]"></div>

            <div className="relative flex min-h-[520px] items-center px-6 py-12 md:px-12 lg:px-16">
              <div className="max-w-3xl">
                <p className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-2 text-sm font-bold text-teal-300">
                  <SlideIcon size={17} />
                  {slide.badge}
                </p>

                <h2 className="mt-6 text-5xl font-extrabold tracking-tight text-white md:text-7xl">
                  {slide.title}
                </h2>

                <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-300 md:text-xl">
                  {slide.subtitle}
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Link
                    to={slide.buttonLink}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-yellow-400 px-7 py-3 text-sm font-extrabold text-zinc-950 hover:bg-yellow-300"
                  >
                    {slide.buttonText}
                    <ArrowRight size={17} />
                  </Link>

                  <Link
                    to="/about"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-teal-400/40 px-7 py-3 text-sm font-bold text-teal-300 hover:bg-teal-500 hover:text-zinc-950"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={goToPreviousSlide}
              className="absolute left-5 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-zinc-950/70 text-white backdrop-blur hover:bg-yellow-400 hover:text-zinc-950"
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              type="button"
              onClick={goToNextSlide}
              className="absolute right-5 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-zinc-950/70 text-white backdrop-blur hover:bg-yellow-400 hover:text-zinc-950"
              aria-label="Next slide"
            >
              <ChevronRight size={24} />
            </button>

            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-3">
              {slides.map((item, index) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  className={`h-3 rounded-full transition-all ${
                    activeSlide === index
                      ? "w-10 bg-yellow-400"
                      : "w-3 bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeCarousel