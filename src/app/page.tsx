"use client";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import SocialMedia from "../components/SocialMedia";
import PeopleComments from "../components/PeopleComments";
import AboutUs from "../components/AboutUs";
import Footer from "../components/Footer";
import Calendar from "../components/Calendar"
import AboutOur from "../components/AboutOur";
import Analytics from "../components/Analytics";
import WhyChooseUs from "../components/WhyChooseUs"
import ServicesSection from "@/components/ServicesSection";


export default function Home() {
  return (
    <div className="relative bg-gradient-to-r from-[#5232A1] via-[#4007b9] to-[#000000] min-h-screen">
      <Navbar />
      <SocialMedia />
      <HeroSection />
      <ServicesSection/>
      <AboutOur />
      <WhyChooseUs />
      <Analytics />
      <PeopleComments />
      <AboutUs />
      <Calendar/>
      
      <Footer />
    </div>
  );
}
