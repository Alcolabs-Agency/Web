"use client";
import React from "react";
import { AiOutlineCode } from 'react-icons/ai';
import { FaCode, FaUsers, FaBuilding } from "react-icons/fa";
import { HiOutlineDesktopComputer } from "react-icons/hi";


const ServicesSection = () => {
  return (
    <section className="flex justify-center items-center px-4 py-16 bg-gradient-to-r from-[#5232A1] via-[#4007b9] to-black text-white min-h-screen">
      <div className="relative z-10 container mx-auto px-20"> 
      
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 -mt-16">
      
          <div className="lg:col-span-2 p-8 rounded-lg shadow-lg bg-white text-black">
            <h2 className="text-2xl font-bold text-[#5232A1]">Services</h2>
            <p>
              We promote the growth and digital innovation of the different sectors and industries through our affordable high-quality services, meeting budget standards and delivering jobs on time.
            </p>
          </div>

        
          <div className="p-6 rounded-lg shadow-lg bg-[#501bd6] text-white">
            <div className="flex items-center mb-3">
              <FaUsers className="text-6xl mr-2" />
              <h3 className="text-1xl font-semibold">Web 3 Consulting and Adaptation</h3>
            </div>
            <p className="font-sans text-sm"> We help you integrate cryptocurrency payments like Binance and Binance Pay into your website, providing ongoing support and SEO optimization to adapt to Web 3 technologies.</p>
          </div>

        
          <div className="p-6 rounded-lg shadow-lg bg-white text-black">
            <div className="flex items-center mb-4">
            <FaBuilding className="text-6xl text-[#5232A1] mr-1" />
              <h3 className="text-1xl font-semibold">Maintenance and Technical Support</h3>
    
            </div>
            <p className="font-sans text-base">We offer ongoing maintenance to keep your website up-to-date, secure and running as agreed in your contract.</p>
          </div>
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
  
          <div className="p-6 rounded-lg shadow-lg bg-white text-black">
            <div className="flex items-center mb-4">
            <AiOutlineCode className="text-5xl text-[#5232A1] mr-1" />
    
              <h3 className="text-xl font-semibold">SEO Optimization</h3>
            </div>
            <p className="font-sans text-base">We optimize your site&apos;s SEO to improve its positioning, speed, and accessibility, making it more competitive in the digital enviroment.</p>
          </div>

    
          <div className="p-6 rounded-lg shadow-lg bg-white text-black">
            <div className="flex items-center mb-4">
              <FaCode className="text-6xl text-[#5232A1] mr-3" /> 
              <h3 className="text-xl font-semibold">Custom Web Development</h3>
            </div>
            <p className="font-sans text-base">We develop custom websites with customized front-end and back-end solutions for optimal performance and attractive design.</p>
          </div>

      
          <div className="p-5 rounded-lg shadow-lg bg-white text-black">
            <div className="flex items-center mb-6">
            <HiOutlineDesktopComputer className="text-7xl text-[#5232A1] mr-3" />
              <h3 className="text-xl font-semibold">WordPress Web Development</h3>
            </div>
            <p className="font-sans text-sm">We create custom, responsive, and SEO-optimized WordPress sites, making them easy to manage and ensuring the success of your business.</p>
          </div>
          <div className="p-6 rounded-lg shadow-lg bg-white text-black">
            <div className="flex items-center mb-4">
            <div className="grid grid-cols-2 gap-2 mr-4">
                <div className="w-4 h-4 bg-[#5232A1] rounded-full"></div>
                <div className="w-4 h-4 bg-[#5232A1] rounded-full"></div>
                <div className="w-4 h-4 bg-[#5232A1] rounded-full"></div>
                <div className="w-4 h-4 bg-[#5232A1] rounded-full"></div>
              </div>
    
              <h3 className="text-xl font-semibold">UX/UI Consulting</h3>
            </div>
            <p className="font-sans text-sm">We improve the experience and design of your website, adapting it to achieve intuitive  and effective navigation.</p>
          </div>
        </div>
      </div>
      
    </section>
  );
};

export default ServicesSection;


