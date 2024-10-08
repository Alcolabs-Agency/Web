"use client";
import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

const SocialMedia = () => {
  return (
    <div className="absolute top-12 right-40 flex space-x-12 text-white z-20">
      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
        <FaFacebookF />
      </a>
      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
        <FaTwitter />
      </a>
      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
        <FaInstagram />
      </a>
    </div>
  );
};

export default SocialMedia;
