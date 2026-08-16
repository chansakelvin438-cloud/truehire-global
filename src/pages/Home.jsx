import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import WhyTrueHire from "../components/WhyTrueHire"
import JobCategories from "../components/JobCategories"
import FeaturedJobs from "../components/FeaturedJobs"
import EmployerSection from "../components/EmployerSection"
import SafetyCentre from "../components/SafetyCentre"
import Footer from "../components/Footer"
import HomeCarousel from "../components/HomeCarousel"
import Seo from "../components/Seo"

function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Seo
        title="Verified Jobs and Trusted Employers"
        description="Find safer, reviewed job opportunities from verified employers on TrueHire Global."
        path="/"
      />
      <Navbar />
      <HomeCarousel />
      <Hero />
      <WhyTrueHire />
      <JobCategories />
      <FeaturedJobs />
      <EmployerSection />
      <SafetyCentre />
      <Footer />
    </main>
  )
}

export default Home