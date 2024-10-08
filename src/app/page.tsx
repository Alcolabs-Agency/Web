"use client";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import SocialMedia from "../components/SocialMedia";
import ServicesSection from "@/components/ServicesSection";

export default function Home() {
  return (
    <div className="relative bg-gradient-to-r from-[#5232A1] via-[#4007b9] to-[#000000] min-h-screen">
      <Navbar />
      <HeroSection />
      <SocialMedia />
      <ServicesSection />
    </div>
  );
}
