import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import WhyTrueHire from "../components/WhyTrueHire"
import JobCategories from "../components/JobCategories"
import FeaturedJobs from "../components/FeaturedJobs"
import EmployerSection from "../components/EmployerSection"
import SafetyCentre from "../components/SafetyCentre"
import Footer from "../components/Footer"

function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
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