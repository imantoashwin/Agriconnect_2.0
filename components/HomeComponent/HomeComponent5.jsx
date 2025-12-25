import Image from "next/image";
import home11 from "../../public/Images/home-assets-11.jpg";

const HomeComponent5 = () =>{
    return(<>
    {/*  why article */}
      <div className="max-w-7xl mx-auto py-12 px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Image */}
          <div className="relative">
            <Image
              src={home11}
              alt="Agriculture Landscape"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* Right Side - Content */}
          <div className="flex flex-col justify-center">
            <h4 className="text-sm font-semibold text-yellow-500 mb-2">
              Our Farm Benefits
            </h4>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Why Choose AgriConnect Market
            </h2>
            <p className="text-gray-600 mb-6">
              There are many variations of passages of available but the
              majority have suffered alteration in some form by injected humor
              or random words which don't look even.
            </p>

            {/* Benefits List */}
            <ul className="space-y-4">
              <li className="flex items-center space-x-4">
                <span className="bg-green-500 text-white rounded-full p-2">
                  {/* Check Icon */}
                  ✔️
                </span>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    Quality Organic Food
                  </h4>
                  <p className="text-sm text-gray-600">
                    There are variation. You need to be sure there is anything
                    hidden in the middle of text.
                  </p>
                </div>
              </li>
              <li className="flex items-center space-x-4">
                <span className="bg-green-500 text-white rounded-full p-2">
                  {/* Check Icon */}
                  ✔️
                </span>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    Professional Farmers
                  </h4>
                  <p className="text-sm text-gray-600">
                    There are variation. You need to be sure there is anything
                    hidden in the middle of text.
                  </p>
                </div>
              </li>
              <li className="flex items-center space-x-4">
                <span className="bg-green-500 text-white rounded-full p-2">
                  {/* Check Icon */}
                  ✔️
                </span>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    Quality Products
                  </h4>
                  <p className="text-sm text-gray-600">
                    There are variation. You need to be sure there is anything
                    hidden in the middle of text.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>)
}

export default HomeComponent5;