"use client";
import React from "react";
import Image from "next/image";

const AboutOur = () => {
    return (
        <section className="flex justify-center items-center px-16 py-16 bg-gradient-to-r from-[#5232A1] via-[#4007b9] to-black text-white min-h-screen">
            <div className="flex flex-row gap-16 w-full max-w-7xl">
                <div className="flex-1 max-w-[50%] flex justify-center">
                    <Image
                        src="/images/image1.jpg"
                        alt="developer image"
                        width={477}
                        height={596}
                        className="object-cover"
                    />
                </div>
                <div className="flex-1 max-w-[50%] flex flex-col justify-center px-8">
                    <h1 className="text-4xl font-extrabold --font-sf-pro">About Our Services</h1>
                    <p className="text-base mt-4 --font-sf-pro">
                        At Alcolabs, we understand that every business is unique, and as such, we offer custom digital solutions that are tailored to your specific needs. Our goal is to create digital experiences that are not only visually appealing, but also function effectively to drive your business growth.
                        <br /><br />
                        We specialize in developing bespoke websites, designed to capture the essence of your brand and enhance user experience. Additionally, we are at the forefront of technology, helping our clients integrate into the Web 3.0 ecosystem, incorporating cryptocurrency payments such as Binance and Binance Pay, facilitating the transition to a more advanced digital environment.
                        <br /><br />
                        We work with platforms such as WordPress, creating fully SEO-optimized sites, ensuring greater visibility in search engines and attracting more customers. We also place a strong emphasis on user experience (UX) and interface design (UI), making sure that every interaction on your site is smooth and efficient.
                        <br /><br />
                        Every project at Alcolabs is a unique collaboration, where we focus on understanding your goals to transform your ideas into digital realities that generate concrete results. We are committed to offering a comprehensive service that covers everything from conceptualization to ongoing maintenance, ensuring that your online presence is always optimized and ready to grow.
                    </p>
                </div>
            </div>
        </section>
    );
}

export default AboutOur;
