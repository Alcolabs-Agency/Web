"use client";
import React from "react";
import Image from "next/legacy/image";

const HeroSection = () => {
  return (
    <section className="relative flex justify-between items-center px-20 py-28 bg-gradient-to-r from-[#5232A1] via-[#4007b9] to-black text-white min-h-screen">
      <div className="relative z-10 container mx-auto px-0">
        <h1 className="text-7xl font-bold mb-16 leading-tight">
          ASK <span className="text-[#201146]">ANYTHING</span>
          <br />
          ANYTIME
          <br />
          ANYWHERE
        </h1>
        <p className="text-3xl mb-16">
          We are professional consultants specialized in helping startups and
          businesses that are incurring towards blockchain technology.
        </p>
        <button className="bg-white text-[#5232A1] font-semibold px-20 py-4 rounded-md">
          Contact Us
        </button>
      </div>

      <div className="flex-2 relative">
        <Image
          src="/images/Rectangle 4.png"
          alt="Hero Image"
          width={700}
          height={900}
          className="object-cover -mt-20"
        />
      </div>
    </section>
  );
};

export default HeroSection;
