"use client";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import SocialMedia from "../components/SocialMedia";
import PeopleComments from "../components/PeopleComments";
import AboutUs from "../components/AboutUs";
import Footer from "../components/Footer";
import Calendar from "../components/Calendar";

export default function Home() {
  return (
    <div className="relative">
      <Navbar />
      <HeroSection />
      <SocialMedia />
      <PeopleComments />
      <AboutUs />
      <Calendar />
      <Footer />
    </div>
  );
}