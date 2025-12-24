import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar/Navbar";

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase"; 

function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [street, setStreet] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [postalcode, setPostalcode] = useState("");
  const [doorNumber, setDoorNumber] = useState("");
  const [addressline2, setAddressline2] = useState("");
  const [role, setRole] = useState("consumer");
  const [createdUser, setCreatedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (createdUser !== null) {
      localStorage.setItem("currentUser", JSON.stringify(createdUser));
      router.push("/signin");
      setAddressline2("Def");
    }
    const user = localStorage.getItem("user");
    if (user) {
      router.push("/");
    }
  }, [createdUser, router]);

  // Google Translate initialization
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    window.googleTranslateElementInit = function () {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,ta,hi,te,kn,ml,bn,gu,mr,or,ur",
          layout: window.google.translate.TranslateElement.InlineLayout.HORIZONTAL,
          autoDisplay: false,
          multilanguagePage: true,
        },
        "google_translate_element"
      );

      setTimeout(hideBanner, 500);
      setTimeout(hideBanner, 1500);
    };

    const hideBanner = () => {
      const banner = document.querySelector(".goog-te-banner-frame");
      if (banner) banner.style.display = "none";
      document.body.style.top = "0px";
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const createUser = async () => {
    try {
      if (
        email === "" ||
        username === "" ||
        password === "" ||
        confirmedPassword === "" ||
        phonenumber === "" ||
        street === "" ||
        area === "" ||
        city === "" ||
        country === "" ||
        state === "" ||
        postalcode === "" ||
        doorNumber === ""
      ) {
        toast.error("Please fill in all fields", {
          position: "bottom-right",
          autoClose: 3000,
        });
        return;
      }

      if (password !== confirmedPassword) {
        toast.error("Passwords do not match", {
          position: "bottom-right",
          autoClose: 3000,
        });
        return;
      }

      if (password.length < 6) {
        toast.error("Password must be at least 6 characters long", {
          position: "bottom-right",
          autoClose: 3000,
        });
        return;
      }

      setIsLoading(true);

      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: email,
        username: username,
        role: role,
        phonenumber: phonenumber,
        addressline1: doorNumber,
        addressline2: addressline2,
        area: area,
        city: city,
        country: country,
        pincode: parseInt(postalcode),
        state: state,
        street: street,
        createdAt: new Date()
      });

      console.log("User created successfully:", user);
      setCreatedUser(user);

      toast.success("Signup successful! Redirecting to login...", {
        position: "bottom-right",
        autoClose: 2000,
      });

    } catch (err) {
      console.log(err);
      toast.error(err.message, {
        position: "bottom-right",
        autoClose: 3000,
      });
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Google Translate Elements */}
        <div className="translate-micro" style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999, display: 'none' }}>
          <div id="google_translate_element" className="translate-icon"></div>
          <div className="custom-translate-btn" title="Translate">🌐</div>
        </div>

        <div className="mobile-translate-btn" style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999 }} title="Translate">
          🌐
        </div>

        {/* Logo */}
        <div className="px-8 py-6">
          <Link href="/">
            <div className="cursor-pointer">
              <Image
                src="/Images/Logo/Agriconnect_logo.png"
                className="cursor-pointer"
                alt="logo"
                width={180}
                height={60}
              />
            </div>
          </Link>
        </div>

        {/* Signup Form */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 font-poppins">Create Account</h1>
            <p className="text-gray-600 font-poppins">Join AgriConnect to get started</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Account Information Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 font-poppins">Account Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                    Username *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d8659] focus:border-transparent font-poppins"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                    Email *
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d8659] focus:border-transparent font-poppins"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 xxxxxxxxxx"
                    value={phonenumber}
                    onChange={(e) => setPhonenumber(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d8659] focus:border-transparent font-poppins"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                    Role *
                  </label>
                  <div className="flex gap-6 items-center h-full">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        value="consumer"
                        checked={role === "consumer"}
                        onChange={(e) => setRole(e.target.value)}
                        className="mr-2 h-4 w-4 text-[#2d8659] focus:ring-[#2d8659]"
                      />
                      <span className="text-gray-700 font-poppins">Consumer</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        value="farmer"
                        checked={role === "farmer"}
                        onChange={(e) => setRole(e.target.value)}
                        className="mr-2 h-4 w-4 text-[#2d8659] focus:ring-[#2d8659]"
                      />
                      <span className="text-gray-700 font-poppins">Farmer</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                    Password *
                  </label>
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d8659] focus:border-transparent font-poppins"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm password"
                    value={confirmedPassword}
                    onChange={(e) => setConfirmedPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d8659] focus:border-transparent font-poppins"
                  />
                </div>
              </div>
            </div>

            {/* Address Information Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 font-poppins">Address Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                    Door Number *
                  </label>
                  <input
                    type="text"
                    placeholder="Street address, P.O. box"
                    value={doorNumber}
                    onChange={(e) => setDoorNumber(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d8659] focus:border-transparent font-poppins"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                    Street *
                  </label>
                  <input
                    type="text"
                    placeholder="Street name"
                    value={street}
                    onChange={(e) => {
                      setStreet(e.target.value);
                      setArea(e.target.value);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d8659] focus:border-transparent font-poppins"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                    City *
                  </label>
                  <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d8659] focus:border-transparent font-poppins"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                    State *
                  </label>
                  <input
                    type="text"
                    placeholder="State/Province"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d8659] focus:border-transparent font-poppins"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    placeholder="Postal/ZIP code"
                    value={postalcode}
                    onChange={(e) => setPostalcode(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d8659] focus:border-transparent font-poppins"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                    Country *
                  </label>
                  <input
                    type="text"
                    placeholder="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d8659] focus:border-transparent font-poppins"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                onClick={createUser}
                disabled={isLoading}
                className="px-8 py-3 bg-[#2d8659] text-white rounded-md hover:bg-[#246548] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-poppins font-medium"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
              
              <div className="text-sm text-gray-600 font-poppins">
                Already have an account?{" "}
                <Link href="/signin">
                  <span className="text-[#2d8659] hover:underline font-medium cursor-pointer">
                    Sign in
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />

      {/* Translate Button Styles */}
      <style jsx global>{`
        .translate-micro {
          position: relative;
          display: inline-block;
          width: 20px;
          height: 20px;
        }
        
        .goog-te-gadget > span > a,
        .goog-te-gadget .goog-logo-link,
        .goog-te-gadget span:first-child,
        .goog-te-banner-frame,
        .goog-te-banner-frame.skiptranslate {
          display: none !important;
        }
        
        .goog-te-gadget {
          font-size: 0 !important;
          line-height: 0 !important;
        }
        
        .goog-te-combo {
          position: absolute !important;
          opacity: 0 !important;
          pointer-events: none !important;
          width: 20px !important;
          height: 20px !important;
          top: 0 !important;
          left: 0 !important;
          z-index: 1 !important;
        }
        
        .custom-translate-btn {
          display: flex !important;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 20px;
          transition: all 0.2s ease;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 5;
          pointer-events: auto;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid #e5e7eb;
        }
        
        .custom-translate-btn:hover {
          background: rgba(255, 255, 255, 1);
          transform: scale(1.05);
        }
        
        .translate-micro.open .goog-te-combo {
          opacity: 1 !important;
          pointer-events: auto !important;
          position: absolute !important;
          top: 45px !important;
          left: 0 !important;
          width: auto !important;
          height: auto !important;
          background: white !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 8px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
          z-index: 1000 !important;
        }

        .mobile-translate-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          font-size: 20px;
          cursor: pointer;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid #e5e7eb;
          transition: all 0.2s ease;
        }

        .mobile-translate-btn:hover {
          background: white;
          transform: scale(1.05);
        }
      `}</style>
    </>
  );
}

export default Signup;
