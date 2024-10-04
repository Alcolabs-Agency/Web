"use client";
import React from "react";
import Image from "next/image";

const WhyChooseUs = () => {
    return (
        <section className="flex justify-center items-center px-4 py-16 bg-gradient-to-r from-[#5232A1] via-[#4007b9] to-black text-white min-h-screen">
        <div className="flex flex-col md:flex-row-reverse gap-16 w-full max-w-7xl">
            <div className="flex-1 flex justify-center">
                <Image
                    src="/images/image2.jpg"
                    alt="developer image"
                    width={477}
                    height={596}
                    className="object-cover"
                />
            </div>
            <div className="flex-1 flex flex-col justify-center px-4">
                <h1 className="text-5xl font-extrabold --font-sf-pro md:text-left text-center">Why Choose Us</h1> 
                <br />
                <p className="text-base mt-4 --font-sf-pro md:text-left text-center">
                    At Alcolabs, we are more than just a web development agency: we are your allies in digital transformation. These are the reasons why companies trust us to boost their online presence:
                </p>
                <h3 className="font-extrabold mt-4 md:text-left text-center">1. Tailor-made solutions:</h3>
                <p className="--font-sf-pro md:text-left text-center">
                    We believe that every business is unique. Our team designs and develops custom websites that reflect the essence of your brand, ensuring they are perfectly tailored to your specific needs and goals.
                </p>
                <h3 className="font-extrabold mt-4 md:text-left text-center --font-sf-pro">2. Experience in Web 3.0:</h3>
                <p className="--font-sf-pro md:text-left text-center">
                    As pioneers in integrating cutting-edge technology, we offer hassle-free solutions for your transition to Web 3.0, including cryptocurrency payment systems and decentralized platforms.
                </p>
                <h3 className="font-extrabold mt-4 md:text-left text-center">3. User-centered design:</h3>
                <p className="--font-sf-pro md:text-left text-center">
                    Our UX/UI specialists focus on creating intuitive and visually appealing websites that offer a seamless and engaging user experience, helping to increase customer satisfaction and conversion rates.
                </p>
                <h3 className="font-extrabold mt-4 md:text-left text-center">4. Dedicated support:</h3>
                <p className="--font-sf-pro md:text-left text-center">
                    From initial consultation to final product launch, our team is with you every step of the way, ensuring a smooth workflow and results that exceed your expectations.
                </p>
            </div>
        </div>
    </section>
    
    )
}

export default WhyChooseUs;
