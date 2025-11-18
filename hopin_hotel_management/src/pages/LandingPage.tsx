import { Navbar } from "../components/Navbar"
import { HeroSection } from "../sections/HeroSection"
import { Cards } from "../components/Cards"
import { FeaturedHotels } from "../sections/FeaturedHotels"
import { Footer } from "../components/Footer"

export const LandingPage = () => {
  return (
    <>
    <Navbar />
    <HeroSection />
    <Cards/>
    <FeaturedHotels/>
    <Footer />
    
    </>
  )
}
