import React from "react";
import Image from "next/image";
import Link from "next/link";
const Footer = () => {
  return (
    <div className="w-full bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white py-10 px-6 mt-10">
      <div className="max-w-6xl mx-auto">
        {/* Top brand strip */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 pb-6 border-b border-gray-800">
            <div className="flex flex-col items-center gap-3">
              <Image
                src="/Images/Logo/Agriconnect_logo.png"
                alt="AgriConnect logo"
                width={140}
                height={40}
                className="filter"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
              <p className="text-gray-300 text-sm md:text-base font-poppins text-center">
                Fresh produce, directly from farmers to your home.
              </p>
            </div>

          </div>

          {/* Main footer links */}
        <div className="grid md:grid-cols-3 gap-8 py-8">
          <div>
            <h3 className="font-semibold text-lg mb-4 font-poppins">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 font-poppins text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">Products</Link></li>
              <li><Link href="/signin" className="hover:text-white transition-colors">Sign in</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4 font-poppins">Legal</h3>
            <ul className="space-y-2 text-gray-400 font-poppins text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Terms of use</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4 font-poppins">Connect</h3>
            <p className="text-gray-400 text-sm mb-3 font-poppins">
              Follow AgriConnect for updates and tips from the farming community.
            </p>
            <div className="flex gap-4">
              <Image
                src="/Images/Logo/Instagram.png"
                width={32}
                height={32}
                alt="instagram"
                className="hover:opacity-80 cursor-pointer transition-opacity"
                unoptimized={true}
              />
              <Image
                src="/Images/Logo/Facebook.png"
                width={32}
                height={32}
                alt="facebook"
                className="hover:opacity-80 cursor-pointer transition-opacity"
                unoptimized={true}
              />
              <Image
                src="/Images/Logo/WhatsApp.png"
                width={32}
                height={32}
                alt="whatsapp"
                className="hover:opacity-80 cursor-pointer transition-opacity"
                unoptimized={true}
              />
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="border-t border-gray-800 pt-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-gray-400 text-xs md:text-sm font-poppins text-center md:text-left">
            &copy; {new Date().getFullYear()} AgriConnect. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs font-poppins text-center md:text-right">
            Built as a modern, minimal ecommerce experience for agriculture.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
