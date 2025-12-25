import React from "react";
import home01 from "../../public/Images/home-assets-01.jpg";
import Image from "next/image";

const HomeComponent = () => {
    return(<>
        <div className="relative w-full max-w-[100vw] h-[80vh] overflow-hidden">
        {" "}
        <Image
          src={home01}
          alt="Agriconnect background"
          layout="fill" 
          objectFit="cover" 
          quality={100}
          className="max-w-full max-h-full"
        />
        {/* Overlay content: Text and Button */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
          {/* Welcome Text */}
          <h1 className="text-4xl font-bold md:text-6xl leading-tight mb-4">
            Welcome to <span className="text-[#f8f9fa]">AgriConnect</span>
          </h1>
          <p className="text-lg md:text-xl font-light mb-6">
            Empowering Farmers. Connecting Communities. Revolutionizing
            Agriculture.
          </p>
        </div>
      </div>
    </>)
}

export default HomeComponent;