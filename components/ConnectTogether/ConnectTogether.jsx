import React from "react";
import Image from "next/image";
import Link from "next/link";

const ConnectTogether = () => {
  return (
    <div className="w-full min-h-[600px] flex items-center justify-center bg-gradient-to-br from-green-50 to-white py-16 px-6">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-poppins">
            Connecting End to End Agriculture
          </h1>
          <p className="text-lg text-gray-600 mb-8 font-poppins">
            Solutions to help the world thrive
          </p>
          <Link href="/products">
            <button className="w-fit px-8 py-3 rounded-md font-poppins font-medium text-white bg-[#2d8659] hover:bg-[#246548] transition-colors">
              View Products
            </button>
          </Link>
        </div>
        <div className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center">
          <Image
            src="/Images/Agri_leaf.png"
            alt="leaf"
            width={600}
            height={450}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default ConnectTogether;
