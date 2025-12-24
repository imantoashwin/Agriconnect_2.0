import React from "react";
import Image from "next/image";
const FarmingContent = () => {
  return (
    <div className="w-full py-16 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <Image
          src="/Images/FarmingContent.png"
          alt="farming content"
          width={1440}
          height={764}
          layout="responsive"
          className="rounded-lg"
        />
      </div>
    </div>
  );
};

export default FarmingContent;
