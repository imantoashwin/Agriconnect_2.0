import Image from "next/image";
import home09 from "../../public/Images/home-assets-09.jpg";
import home10 from "../../public/Images/home-assets-10.jpg";

const HomeComponent4 = () =>{
    return(<>
    {/* round image section */}
      <div className="flex items-center justify-center p-10  bg-white">
        {/* Container for the images and text */}
        <div className="flex items-start max-w-6xl pl-52">
          {/* Image section */}
          <div className="relative w-1/2 ">
            {/* Main large circle image */}
            <div className="relative">
              <div className="w-80 h-80 bg-gray-200 rounded-full overflow-hidden">
                <Image
                  src={home09} // Replace with actual path or import
                  alt="Harvest Image"
                  width={320} // Direct width and height instead of layout fill
                  height={320} // Matching the container size for proper rendering
                  className="object-cover rounded-full" // Ensure the image is round
                />
              </div>
            </div>

            {/* Small circle image overlapping */}
            <div className="absolute bottom-0 left-0 transform -translate-x-8 translate-y-8">
              <div className="w-32 h-32 bg-gray-300 rounded-full overflow-hidden border-4 border-white">
                <Image
                  src={home10} // Replace with actual path or import
                  alt="Small Image"
                  width={128} // Direct width and height instead of layout fill
                  height={128} // Matching the container size for proper rendering
                  className="object-cover rounded-full" // Ensure the image is round
                />
              </div>
            </div>
          </div>

          {/* Text section */}
          <div className="w-1/2  ">
            {" "}
            {/* Reduced padding on the left side */}
            <h1 className="text-4xl font-bold text-gray-800">
              Agriculture & Organic Product Farm
            </h1>
            <p className="mt-2 text-lg text-gray-500">
              {" "}
              {/* Reduced margin-top */}
              <span className="font-bold text-green-600">AgriConnect</span> is
              the largest global organic farm. At AgriConnect, we bridge the gap
              between farmers and consumers...
            </p>
            <ul className="mt-4 space-y-2">
              {" "}
              {/* Reduced margin-top and list item spacing */}
              <li className="flex items-center">
                <span className="text-green-600 mr-2">✔</span> Reach more
                buyers, expand your market.
              </li>
              <li className="flex items-center">
                <span className="text-green-600 mr-2">✔</span> Choose from a
                variety of fresh products.
              </li>
            </ul>
          </div>
        </div>
      </div>
    
    </>)
}

export default HomeComponent4;