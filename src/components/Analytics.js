"use client";
import React from "react";
import Image from "next/image";

const Analytics = () => {
    return(
        <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-[#3D0079] to-black"> 
            <div className="text-white text-center mb-16">
                <h1 className="text-5xl font-bold --font-sf-pro mb-4">Analytics</h1>
                <p className="text-base --font-sf-pro">Assisting brands in painting their digital canvases with our technology-infused solutions. Emphasizing on the stats apart from the words.</p>
            </div>
            <div className="flex justify-center space-x-20 text-white">
                <div className="flex flex-col items-center">
                    <Image
                        src="/images/icon1.png"
                        alt="App Development Icon"
                        width={67}
                        height={80}
                    />
                    <h3 className="text-3xl font-extrabold mt-4">300+</h3>
                    <p className="text-base --font-sf-pro">App Development</p>
                </div>
                <div className="flex flex-col items-center">
                    <Image
                        src="/images/icon2.png"
                        alt="Clients Icon"
                        width={80}
                        height={80}
                    />
                    <h3 className="text-3xl font-extrabold mt-4">1250+</h3>
                    <p className="text-base --font-sf-pro">Clients Worldwide</p>
                </div>
                <div className="flex flex-col items-center">
                    <Image
                        src="/images/icon3.png"
                        alt="Blockchain Projects Icon"
                        width={67}
                        height={80}
                    />
                    <h3 className="text-3xl font-extrabold mt-4">50+</h3>
                    <p className="text-base --font-sf-pro">Blockchain Projects</p>
                </div>
            </div>
        </section>
    )
}

export default Analytics;
