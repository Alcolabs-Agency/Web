"use client";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import SocialMedia from "../components/SocialMedia";
import ServicesSection from "@/components/ServicesSection";

export default function Home() {
  return (
    <div className="relative">
      <Navbar />
      <HeroSection />
      <SocialMedia />
      <ServicesSection />
    </div>
  );
}
