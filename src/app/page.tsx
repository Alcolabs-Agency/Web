"use client";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import SocialMedia from "../components/SocialMedia";

export default function Home() {
  return (
    <div className="relative">
      <Navbar />
      <HeroSection />
      <SocialMedia />
    </div>
  );
}
