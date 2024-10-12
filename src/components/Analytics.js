"use client";
import React, { useState } from "react";
import Image from "next/image";
import CountUp from "react-countup";
import ScrollTrigger from "react-scroll-trigger";

const Analytics = () => {
    const [counter, setCounter] = useState(false)

    return(
        <ScrollTrigger onEnter={() => setCounter(true)} onExit={() => setCounter(false)}>

            <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-[#3D0079] to-black"> 
            <div className="text-white text-center mb-40">
                <h1 className="text-5xl font-bold --font-sf-pro mb-28">Analytics</h1>
                <p className="text-base --font-sf-pro mx-4 md:mx-8 -mb-12">Assisting brands in painting their digital canvases with our technology-infused solutions. Emphasizing on the stats apart from the words.</p>
            </div>
            <div className="flex flex-col md:flex-row justify-center mx-4 md:space-x-20 text-white">
                <div className="flex flex-col items-center">
                    <Image
                        src="/images/icon1.png"
                        alt="App Development Icon"
                        width={67}
                        height={80}
                    />
                    <h3 className="text-3xl font-extrabold mt-4 pb-2">
                        {counter && <CountUp start={0} end={300} duration={2} delay={0}/>} +
                    </h3>
                    <p className="text-base --font-sf-pro">App Development</p>
                </div>
                <div className="flex flex-col items-center">
                    <Image
                        src="/images/icon2.png"
                        alt="Clients Icon"
                        width={80}
                        height={80}
                    />
                    <h3 className="text-3xl font-extrabold mt-4 pb-2">
                        {counter && <CountUp start={0} end={1250} duration={2} delay={0}/>}
                        +
                    </h3>
                    <p className="text-base --font-sf-pro">Clients Worldwide</p>
                </div>
                <div className="flex flex-col items-center">
                    <Image
                        src="/images/icon3.png"
                        alt="Blockchain Projects Icon"
                        width={67}
                        height={80}
                    />
                    <h3 className="text-3xl font-extrabold mt-4 pb-2">
                        {counter && <CountUp start={0} end={50} duration={2} delay={0}/>}
                        +
                    </h3>
                    <p className="text-base --font-sf-pro">Blockchain Projects</p>
                </div>
            </div>
        </section>

        </ScrollTrigger>
        
    )
}

export default Analytics;
