import Image from "next/image";
import home06 from "../../public/Images/home-assets-06.jpg";
import home07 from "../../public/Images/home-assets-07.jpg";
import home08 from "../../public/Images/home-assets-08.jpg";

const HomeComponent3 = () =>{
    return(<>
    {/* feature boxes */}
      <div className="flex justify-center py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 text-center w-64">
            <h2 className="text-yellow-500 font-bold mb-2">Feature 01</h2>
            <h3 className="text-xl font-semibold mb-4">
              Direct Farmer-to-Consumer Sales
            </h3>
            <Image
              src={home06} // Replace with the actual image path
              alt="Direct Farmer-to-Consumer Sales"
              className="w-16 h-16 rounded-md mb-2 object-cover"
            />
          </div>

          {/* Card 2 */}
          <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 text-center w-64">
            <h2 className="text-yellow-500 font-bold mb-2">Feature 02</h2>
            <h3 className="text-xl font-semibold mb-4">
              Seamless Order Management
            </h3>
            <Image
              src={home07} // Replace with the actual image path
              alt="Seamless Order Management"
              className="w-16 h-16 rounded-md mb-2 object-cover"
            />
          </div>

          {/* Card 3 */}
          <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 text-center w-64">
            <h2 className="text-yellow-500 font-bold mb-2">Feature 03</h2>
            <h3 className="text-xl font-semibold mb-4">
              Sustainable & Transparent Sourcing
            </h3>
            <Image
              src={home08} // Replace with the actual image path
              alt="Sustainable & Transparent Sourcing"
              className="w-16 h-16 rounded-md mb-2 object-cover"
            />
          </div>
        </div>
      </div>
    
    </>)
}

export default HomeComponent3;