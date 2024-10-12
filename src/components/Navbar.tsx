/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import Link from "next/link";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="flex items-center px-16 py-6 absolute top-3 left-14 right-0 z-10 bg-transparent">
      <div className="flex items-center space-x-8">
        
        <img
          src="/images/Frame 48095441 2.svg"
          alt="Alcolab Logo"
          width={150}
          height={40}
        />
        
        <button
          className="md:hidden flex items-center mb-5 text-white"
          onClick={toggleMenu}
        >
          <svg
            className="h-6 w-6 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 bg-black bg-opacity-70">
            <div className="flex flex-col items-center space-y-4 py-4 text-white">
              <Link href="#about" onClick={toggleMenu}>About Us</Link>
              <Link href="#services" onClick={toggleMenu}>Services</Link>
              <Link href="#solution" onClick={toggleMenu}>Solution</Link>
            </div>
          </div>
        )}

        <div className="flex space-x-10 text-white font-bold text-xl">
          <Link href="#about">About Us</Link>
          <Link href="#services">Services</Link>
          <Link href="#solution">Solution</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
