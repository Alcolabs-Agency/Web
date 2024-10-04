import Image from 'next/image';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-black via-purple-800 to-purple-900 py-8 text-white">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
      <div className="flex flex-col items-center md:items-start">
        <Image 
          src="/images/Logo horizontal2.png"
          alt="Alcolabs Logo"
          width={150} 
          height={50} 
        />
        <p className="text-white mt-4 text-center md:text-left">
          The advantage of hiring a workspace with us is that gives you comfortable service and all-around facilities.
        </p>
      </div>
  
      <div className="flex justify-center md:justify-end space-x-20">
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-lg font-semibold text-purple-950 mb-4">Home</h3>
          <ul className="text-center md:text-left">
            <li className="mb-2">
              <a href="#" className="text-white hover:text-purple-200">About Us</a>
            </li>
            <li className="mb-2">
              <a href="#" className="text-white hover:text-purple-200">Services</a>
            </li>
            <li className="mb-2">
              <a href="#" className="text-white hover:text-purple-200">Solution</a>
            </li>
          </ul>
        </div>
  
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-lg font-semibold text-purple-950 mb-4">Follow Us</h3>
          <ul className="flex flex-col items-center md:items-start space-y-2">
            <li className="flex items-center space-x-2">
              <FaFacebookF className="text-white hover:text-purple-200" />
              <a href="#" className="text-white hover:text-purple-200">Facebook</a>
            </li>
            <li className="flex items-center space-x-2">
              <FaTwitter className="text-white hover:text-purple-200" />
              <a href="#" className="text-white hover:text-purple-200">Twitter</a>
            </li>
            <li className="flex items-center space-x-2">
              <FaInstagram className="text-white hover:text-purple-200" />
              <a href="#" className="text-white hover:text-purple-200">Instagram</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  
    <div className="flex flex-col items-center pt-20 mt-8 border-gray-700 text-gray-400 text-center md:hidden">
      <p className="text-gray-500">Copyright © 2024</p>
    </div>
  
    <div className="hidden md:flex justify-around pt-20 mt-8 border-gray-700 text-gray-400 text-center">
      <p className="text-gray-500">Copyright © 2024</p>
      <span>
        <a href="#" className="hover:text-purple-200 mx-5">Terms & Conditions</a>
        <a href="#" className="hover:text-purple-200">Privacy Policy</a>
      </span>
    </div>
  </footer>
  
  
  );
};

export default Footer;
