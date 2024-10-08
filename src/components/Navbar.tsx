"use client";
import Image from "next/legacy/image";
import React from "react";
import Link from "next/link";
import { useEffect , useState} from "react";

const MiNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    //algo
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <nav className="relative flex bg-gradient-to-r from-[#5232A1] via-[#4007b9] to-black items-center  px-10 py-8 left-0 right-0 z-10 bg-transparent">
<div className="flex items-center justify-between w-full md:w-2/6">
        <Image
          src="/images/Logo horizontal2.png"
          alt="Alcolab Logo"
          width={180}
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
    {/* Menú para dispositivos móviles */}
    {isOpen && (
   <div className="absolute top-full left-0 right-0 bg-black bg-opacity-70">
      <div className="flex flex-col items-center space-y-4 py-4 text-white">
        <Link href="#about" onClick={toggleMenu}>About Us</Link>
        <Link href="#services" onClick={toggleMenu}>Services</Link>
        <Link href="#solution" onClick={toggleMenu}>Solution</Link>
      </div>
    </div>
  )}
       <div className="hidden md:flex space-x-4 text-white">
          <Link href="#about">About Us</Link>
          <Link href="#services">Services</Link>
          <Link href="#solution">Solution</Link>
        </div>
      </div>
    </nav>
  );
};

export default MiNavbar;
// "use client";
// import Image from "next/legacy/image";
// import React from "react";
// import Link from "next/link";
// import { useEffect } from "react";

// const Navbar = () => {
//   useEffect(() => {
//     //algo
//   }, []);
//   return (
//     <nav className="flex items-center px-16 py-6 absolute top-3 left-14 right-0 z-10 bg-transparent">
//       <div className="flex items-center space-x-8">
//         <Image
//           src="/images/Logo horizontal2.png"
//           alt="Alcolab Logo"
//           width={150}
//           height={50}
//         />
//         <div className="flex space-x-10  text-white font-bold text-xl">
          
//           <Link href="#about">About Us</Link>
//           <Link href="#services">Services</Link>
//           <Link href="#solution">Solution</Link>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
