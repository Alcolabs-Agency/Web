"use client";
import Image from "next/image";
import React from "react";

const ServicesSection = () => {
  return (
    <section className="relative py-16 text-white bg-gradient-to-r from-[#000000] to-[#5232A1]">
    <div className="relative z-10 container mx-auto mt-18 px-4 md:px-0">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-2 p-6 rounded-lg shadow-lg bg-white">
          <Image
            src="/images/Group 48095443.png"
            alt="Services Title and Description"
            width={1200}
            height={400}
            className="object-cover"
          />
        </div>
  
        <div className="p-6 rounded-lg shadow-lg bg-[#5232A1] text-white">
          <Image
            src="/images/Group 48095457.png"
            alt="Web 3 Consulting and Adaptation"
            width={300}
            height={300}
            className="object-contain"
          />
        </div>
  
        <div className="p-6 rounded-lg shadow-lg bg-white">
          <Image
            src="/images/Frame 8.png"
            alt="Maintenance and Technical Support"
            width={300}
            height={300}
            className="object-contain"
          />
        </div>
      </div>
  
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
        <div className="p-6 rounded-lg shadow-lg bg-white">
          <Image
            src="/images/Frame 13.png"
            alt="SEO Optimization"
            width={300}
            height={300}
            className="object-contain"
          />
        </div>
  
        <div className="p-6 rounded-lg shadow-lg bg-white">
          <Image
            src="/images/Frame 12.png"
            alt="Custom Web Development"
            width={300}
            height={300}
            className="object-contain"
          />
        </div>
  
        <div className="p-6 rounded-lg shadow-lg bg-white">
          <Image
            src="/images/Frame 11.png"
            alt="WordPress Web Development"
            width={300}
            height={300}
            className="object-contain"
          />
        </div>
  
        <div className="p-6 rounded-lg shadow-lg bg-white">
          <Image
            src="/images/Frame 10.png"
            alt="UX/UI Consulting"
            width={300}
            height={300}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  </section>
  
  );
};

export default ServicesSection;
