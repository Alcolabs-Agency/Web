"use client";
import React from "react";
import Image from "next/legacy/image";

const HeroSection = () => {
  return (
    <section className="relative flex justify-between items-center px-32 py-40 bg-gradient-to-tr from-[#5232A1] to-[#000000] min-h-screen">
      <div className="relative z-10 container mx-auto px-0">
        <h1 className="text-6xl font-extrabold mb-10">
          ASK <span className="text-[#552bc0]">ANYTHING</span>
          <br />
          ANYTIME
          <br />
          ANYWHERE
        </h1>
        <p className="text-1xl mb-28 font-semibold" 
        style={{ width: "85%" }}>
    
          We are professional consultants specialized in helping startups and
          businesses that are incurring towards blockchain technology
        </p>
        <button className=" bg-white text-[#5232A1] font-bold px-10 py-4  rounded-md">
          Contact Us
        </button>
      </div>

      <div className="flex-2 relative -mt-44">
        <Image
          src="/images/Rectangle 4.png"
          alt="Hero Image"
          width={1100}
          height={1400}
          className="object-cover"
        />
      </div>
    </section>
  );
};

export default HeroSection;
