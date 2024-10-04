"use client";
import AboutOur from "../components/AboutOur";
import Analytics from "../components/Analytics";
import WhyChooseUs from "../components/WhyChooseUs"

export default function Home() {
  return (
    
    
    
    <div className="relative bg-gradient-to-r from-purple-900 via-purple-800 to-black w-full min-h-screen">
      <AboutOur />
      <WhyChooseUs />
      <Analytics />
    </div>
  );
}
