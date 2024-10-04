"use client";
import React from "react";
import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="relative flex flex-col md:flex-row justify-between items-center px-8 md:px-16 py-10 bg-gradient-to-r from-[#5232A1] via-[#4007b9] to-black text-white min-h-screen">
  <div className="flex-1 max-w-lg text-left mb-12 md:mb-0">
    <h1 className="text-4xl md:text-6xl font-bold mb-6 md:mb-8 leading-tight">
      ASK <span className="text-[#201146]">ANYTHING</span>
      <br />
      ANYTIME
      <br />
      ANYWHERE
    </h1>
    <p className="text-base md:text-lg mb-10 md:mb-14">
      We are professional consultants specialized in helping startups and
      businesses that are incurring towards blockchain technology.
    </p>
    <button className="bg-white text-[#5232A1] font-semibold px-6 md:px-8 py-3 md:py-4 rounded-md">
      Contact Us
    </button>
  </div>

  <div className="flex-2 relative w-full md:w-auto">
    <Image
      src="/images/Rectangle 4.png"
      alt="Hero Image"
      width={600}
      height={800}
      className="object-cover -mt-10 md:-mt-20 mx-auto md:mx-0"
    />
  </div>
</section>

  );
};

export default HeroSection;
