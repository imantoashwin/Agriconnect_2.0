import React from "react";
import Image from "next/image";
const OrdersLocation = () => {
  return (
    <div className="w-full py-16 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="relative w-full h-[400px] md:h-[500px]">
          <Image
            src="/Images/ViewOrderText.png"
            alt="orders location"
            fill
            className="object-contain"
          />
        </div>
        <div className="relative w-full h-[400px] md:h-[500px]">
          <Image
            src="/Images/MapImg.png"
            alt="map"
            fill
            className="object-contain rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default OrdersLocation;
