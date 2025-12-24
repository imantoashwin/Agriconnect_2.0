import React, { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";

const NewsFeed = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }
    toast.success("Thank you for subscribing!", {
      position: "bottom-right",
      autoClose: 3000,
    });
    setEmail("");
  };

  return (
    <div className="w-full py-16 px-6 bg-white">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-semibold text-gray-900 mb-4 font-poppins">
          Stay in the Loop
        </h2>
        <p className="text-gray-600 mb-8 font-poppins">
          Subscribe to receive news and updates
        </p>
        <form onSubmit={handleSubscribe} className="flex items-center border border-gray-300 w-full max-w-md mx-auto h-[56px] rounded-lg shadow-sm focus-within:border-[#2d8659] focus-within:shadow-md transition-all">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-full px-6 focus:outline-none font-poppins text-gray-700"
          />
          <button 
            type="submit"
            className="w-12 h-12 bg-[#2d8659] hover:bg-[#246548] rounded-lg mr-1 flex items-center justify-center transition-colors"
          >
            <Image
              src="/Images/Icons/RightArrow.png"
              alt="subscribe"
              width={20}
              height={10}
            />
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewsFeed;
