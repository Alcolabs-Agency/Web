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
    <nav className="flex items-center px-16 py-4 absolute top-2 left-0 right-0 z-10 bg-transparent">
      <div className="flex items-center space-x-14">
        <Image
          src="/images/Logo horizontal2.png"
          alt="Alcolab Logo"
          width={180}
          height={40}
        />

        <div className="flex space-x-14 text-white">
          <Link href="#about">About Us</Link>
          <Link href="#services">Services</Link>
          <Link href="#solution">Solution</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
