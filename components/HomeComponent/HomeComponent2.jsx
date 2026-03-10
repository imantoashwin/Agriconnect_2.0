import React from "react";
import Image from "next/image";
import home02 from "../../public/Images/home-assets-02.jpg";
import home02a from "../../public/Images/home-assets-02-a.jpg";
import home03 from "../../public/Images/home-assets-03.jpg";
import home03a from "../../public/Images/home-assets-03-a.jpg";
import home04 from "../../public/Images/home-assets-04.jpg";
import home04a from "../../public/Images/home-assets-04-a.jpg";
import home05 from "../../public/Images/home-assets-05.jpg";
import home05a from "../../public/Images/home-assets-05-a.jpg";

const HomeComponent2 = () => {
    return(<>
        <div className="w-full flex flex-col items-center justify-center py-16">
            {/* Our Services Section */}
            <div className="text-center mb-12">
                <p className="text-yellow-500 text-lg">Our Services</p>
                <h2 className="text-4xl font-bold">What We Offer</h2>
            </div>
        </div>

        {/* Product Display Card  */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-8 lg:px-24">
        {/* Card 1: Agriculture Products */}
        <div className="relative group">
          <Image
            src={home02} // Replace with your actual image
            alt="Agriculture Products"
            className="rounded-lg object-cover"
            layout="responsive"
            width={300}
            height={400}
          />
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center mb-4">
            {/* Box for Agriculture Products */}
            <div className="bg-white py-6 px-6 rounded-md shadow-lg text-center w-3/4 h-40 relative">
              {/* Small Image (Logo) */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <Image
                  src={home02a} // Replace with your small logo/image
                  alt="Small Logo"
                  className="w-16 h-16 shadow-md rounded-lg" // Adjusted size, no longer rounded
                />
              </div>
              <p className="text-green-600 font-bold text-2xl mt-10">
                Agriculture Products
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Organic Products */}
        <div className="relative group">
          <Image
            src={home03} // Replace with your actual image
            alt="Organic Products"
            className="rounded-lg object-cover"
            layout="responsive"
            width={300}
            height={400}
          />
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center mb-4">
            <div className="bg-white py-6 px-6 rounded-md shadow-lg text-center w-3/4 h-40 relative">
              {/* Small Image (Logo) */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <Image
                  src={home03a} // Replace with your small logo/image
                  alt="Small Logo"
                  className="w-16 h-16 shadow-md rounded-lg"
                />
              </div>
              <p className="text-green-600 font-bold text-2xl mt-10">
                Organic Products
              </p>
            </div>
          </div>
        </div>

        {/* Card 3: Fresh Vegetables */}
        <div className="relative group">
          <Image
            src={home04} // Replace with your actual image
            alt="Fresh Vegetables"
            className="rounded-lg object-cover"
            layout="responsive"
            width={300}
            height={400}
          />
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center mb-4">
            <div className="bg-white py-6 px-6 rounded-md shadow-lg text-center w-3/4 h-40 relative">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <Image
                  src={home04a} // Replace with your small logo/image
                  alt="Small Logo"
                  className="w-16 h-16 shadow-md rounded-lg"
                />
              </div>
              <p className="text-green-600 font-bold text-2xl mt-10">
                Fresh Vegetables
              </p>
            </div>
          </div>
        </div>

        {/* Card 4: Dairy Products */}
        <div className="relative group">
          <Image
            src={home05} // Replace with your actual image
            alt="Dairy Products"
            className="rounded-lg object-cover"
            layout="responsive"
            width={300}
            height={400}
          />
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center mb-4">
            <div className="bg-white py-6 px-6 rounded-md shadow-lg text-center w-3/4 h-40 relative">
              {/* Small Image (Logo) */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <Image
                  src={home05a} // Replace with your small logo/image
                  alt="Small Logo"
                  className="w-16 h-16 shadow-md rounded-lg"
                />
              </div>

              <p className="text-green-600 font-bold text-2xl mt-10">
                Dairy <br /> Products
              </p>
            </div>
          </div>
        </div>
      </div>
    </>)
}

export default HomeComponent2;