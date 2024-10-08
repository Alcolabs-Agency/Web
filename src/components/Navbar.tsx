"use client";
import Image from "next/legacy/image";
import React from "react";
import Link from "next/link";
import { useEffect } from "react";

const Navbar = () => {
  useEffect(() => {
    //algo
  }, []);
  return (
    <nav className="flex items-center px-16 py-6 absolute top-3 left-14 right-0 z-10 bg-transparent">
      <div className="flex items-center space-x-8">
        <Image
          src="/images/Logo horizontal2.png"
          alt="Alcolab Logo"
          width={150}
          height={50}
        />
        <div className="flex space-x-10  text-white font-bold text-xl">
          
          <Link href="#about">About Us</Link>
          <Link href="#services">Services</Link>
          <Link href="#solution">Solution</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
