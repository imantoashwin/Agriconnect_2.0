import React from "react";
import Image from "next/image";
const FarmToHome = () => {
  return (
    <div className="w-full py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="relative w-full h-[300px] md:h-[400px]">
          <Image
            src="/Images/FarmToHomePic.png"
            alt="farm to home"
            fill
            className="object-contain"
          />
        </div>
        <div className="relative w-full h-[300px] md:h-[400px]">
          <Image
            src="/Images/FarmToHomeText.png"
            alt="farm to home text"
            fill
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default FarmToHome;
