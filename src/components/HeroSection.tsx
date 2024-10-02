"use client";
import React from "react";
import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="relative flex justify-between items-center px-16 py-16 bg-gradient-to-r from-[#5232A1] via-[#4007b9] to-black text-white min-h-screen">
      <div className="flex-1 max-w-lg">
        <h1 className="text-6xl font-bold mb-8 leading-tight">
          ASK <span className="text-[#201146]">ANYTHING</span>
          <br />
          ANYTIME
          <br />
          ANYWHERE
        </h1>
        <p className="text-lg mb-14">
          We are professional consultants specialized in helping startups and
          businesses that are incurring towards blockchain technology.
        </p>
        <button className="bg-white text-[#5232A1] font-semibold px-8 py-4 rounded-md">
          Contact Us
        </button>
      </div>

      <div className="flex-2 relative">
        <Image
          src="/images/Rectangle 4.png"
          alt="Hero Image"
          width={600}
          height={800}
          className="object-cover -mt-20"
        />
      </div>
    </section>
  );
};

export default HeroSection;
