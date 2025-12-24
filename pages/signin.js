import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConnectTogether from "../components/ConnectTogether/ConnectTogether";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { login as loginUser } from "../redux/userSlice";
import { login as loginAdmin } from "../redux/adminSlice";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, query, where, collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";

function Signin() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  
  // OTP related states
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isOtpSending, setIsOtpSending] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [userDataFetched, setUserDataFetched] = useState(null);
  
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart);

  // Check URL parameter for admin mode
  useEffect(() => {
    const { mode } = router.query;
    if (mode === 'admin') {
      setIsAdminMode(true);
    }
  }, [router.query]);

  // Check if user/admin is already logged in (only on initial page load, not when switching modes)
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  
  useEffect(() => {
    if (hasCheckedAuth) return; // Only check once on page load
    
    if (isAdminMode) {
      const currAdmin = localStorage.getItem("admin");
      if (currAdmin) {
        router.push("/dashboard/admin/products");
      }
    } else {
      const currUser = localStorage.getItem("currentUser");
      if (currUser) {
        setUser(JSON.parse(currUser));
      }
      const customer = localStorage.getItem("user");
      if (customer) {
        router.push("/");
      }
    }
    setHasCheckedAuth(true);
  }, [router]); // Remove isAdminMode from dependencies to prevent re-checking when switching

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

  // OTP Timer Effect
  useEffect(() => {
    let interval = null;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(timer => timer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Generate 6-digit OTP
  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Fetch user data from Firebase by email
  const fetchUserDataByEmail = async (email) => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error("No user found with this email");
      }
      
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      return { id: userDoc.id, ...userData };
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  };

  // Send OTP via SMS
  const sendOtp = async (phoneNumber) => {
    try {
      setIsOtpSending(true);
      const newOtp = generateOtp();
      setGeneratedOtp(newOtp);

      const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: phoneNumber,
          message: `Your AgriConnect ${isAdminMode ? 'Admin' : ''} verification code is: ${newOtp}. This code will expire in 5 minutes.`
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setOtpTimer(300);
        toast.success("OTP sent successfully!", {
          position: "bottom-right",
          autoClose: 3000,
        });
      } else {
        throw new Error(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error(error.message || "Failed to send OTP. Please try again.", {
        position: "bottom-right",
        autoClose: 5000,
      });
    } finally {
      setIsOtpSending(false);
    }
  };

  // Verify OTP
  const verifyOtp = () => {
    if (otp === generatedOtp) {
      setShowOtpInput(false);
      toast.success("Phone number verified successfully!", {
        position: "bottom-right",
        autoClose: 3000,
      });
      proceedWithLogin();
    } else {
      toast.error("Invalid OTP. Please try again.", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  // Resend OTP
  const resendOtp = async () => {
    if (otpTimer > 0) {
      toast.warning("Please wait before requesting a new OTP", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }
    await sendOtp(phoneNumber);
    setOtp("");
  };

  // Proceed with login after OTP verification
  const proceedWithLogin = async () => {
    try {
      // Special admin credentials handling (after OTP verification)
      if (isAdminMode && email === "admin@gmail.com" && password === "agriConnect2025") {
        toast.success("Admin login successful! Redirecting...", {
          position: "bottom-right",
          autoClose: 2000,
        });
        setTimeout(() => {
          window.location.href = "https://agriconnect-admin.netlify.app/";
        }, 2000);
        return;
      }

      // Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      let userData = userDataFetched;
      if (!userData) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        userData = userDoc.data();
      }

      if (!userData) {
        toast.error("User data not found", {
          position: "bottom-right",
          autoClose: 3000,
        });
        return;
      }

      if (isAdminMode) {
        // Admin login logic
        if (userData.role !== "farmer") {
          toast.error("Access denied. Only farmers can access this dashboard.", {
            position: "bottom-right",
            autoClose: 3000,
          });
          return;
        }

        const adminData = {
          email: userData.email,
          user_name: userData.username,
          id: firebaseUser.uid,
          mobile: userData.phonenumber,
          role: userData.role
        };

        localStorage.setItem("admin", JSON.stringify(adminData));
        dispatch(loginAdmin(adminData));
        
        toast.success("Login successful! Redirecting to dashboard...", {
          position: "bottom-right",
          autoClose: 2000,
        });

        router.push(`/dashboard/admin/profile/${firebaseUser.uid}`);
      } else {
        // User login logic
        const userForStorage = {
          email: userData.email,
          user_name: userData.username,
          id: firebaseUser.uid,
          mobile: userData.phonenumber,
          role: userData.role
        };

        localStorage.removeItem("currentUser");
        localStorage.setItem("user", JSON.stringify(userForStorage));
        setUser(userForStorage);
        dispatch(loginUser(userForStorage));
        
        toast.success("Login successful!", {
          position: "bottom-right",
          autoClose: 2000,
        });

        if (cartItems.length > 0) {
          router.push("/cart");
        } else {
          router.push("/");
        }
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message, {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };
  
  const handleSignIn = async () => {
    try {
      if (email === "" || password === "") {
        toast.error("Please fill in all fields", {
          position: "bottom-right",
          autoClose: 3000,
        });
        return;
      }

      // All logins require OTP verification - even special admin credentials
      // No direct login bypass - credentials must be entered manually and OTP verified

      // Fetch user data for OTP verification
      try {
        const userData = await fetchUserDataByEmail(email);
        
        if (!userData.phonenumber) {
          toast.error("Phone number not found for this account. Please contact support.", {
            position: "bottom-right",
            autoClose: 5000,
          });
          return;
        }

        if (isAdminMode && userData.role !== "farmer") {
          toast.error("Access denied. Only farmers can access this dashboard.", {
            position: "bottom-right",
            autoClose: 3000,
          });
          return;
        }

        setUserDataFetched(userData);
        setPhoneNumber(userData.phonenumber);

        const phoneRegex = /^(\+91|91)?[6-9]\d{9}$/;
        if (!phoneRegex.test(userData.phonenumber.replace(/\s+/g, ''))) {
          toast.error("Invalid phone number format in your account. Please contact support.", {
            position: "bottom-right",
            autoClose: 5000,
          });
          return;
        }

        await sendOtp(userData.phonenumber);
        setShowOtpInput(true);
        
        toast.info(`OTP sent to your registered phone number ending in ${userData.phonenumber.slice(-4)}`, {
          position: "bottom-right",
          autoClose: 4000,
        });

      } catch (fetchError) {
        console.error("Error fetching user data:", fetchError);
        toast.error("User not found. Please check your email address.", {
          position: "bottom-right",
          autoClose: 3000,
        });
        return;
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message, {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
{/* 
        <div className="mobile-translate-btn" style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999 }} title="Translate">
          🌐
        </div> */}

        {/* Logo */}
        {/* <div className="px-8 py-6">
          <Link href="/" passHref>
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
        </div> */}

        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* <ConnectTogether /> */}

          {/* Toggle Switch */}
          <div className="max-w-md mx-auto mt-12 mb-8">
            <div className="bg-white rounded-lg shadow-md p-1 flex">
              <button
                onClick={() => {
                  setIsAdminMode(false);
                  setShowOtpInput(false);
                  setEmail("");
                  setPassword("");
                  setOtp("");
                  setPhoneNumber("");
                  setUserDataFetched(null);
                  setGeneratedOtp("");
                  setOtpTimer(0);
                }}
                className={`flex-1 py-3 px-6 rounded-md font-poppins font-medium transition-all duration-200 ${
                  !isAdminMode
                    ? 'bg-[#2d8659] text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                User Login
              </button>
              <button
                onClick={() => {
                  setIsAdminMode(true);
                  setShowOtpInput(false);
                  setEmail("");
                  setPassword("");
                  setOtp("");
                  setPhoneNumber("");
                  setUserDataFetched(null);
                  setGeneratedOtp("");
                  setOtpTimer(0);
                }}
                className={`flex-1 py-3 px-6 rounded-md font-poppins font-medium transition-all duration-200 ${
                  isAdminMode
                    ? 'bg-[#2d8659] text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Farmer Login
              </button>
            </div>
          </div>

          {/* Login Form */}
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center font-poppins">
              {isAdminMode ? "Farmer Login" : "User Login"}
            </h2>
            
            <div className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d8659] focus:border-transparent font-poppins"
                />
              </div>
              
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d8659] focus:border-transparent font-poppins"
                />
              </div>

              {/* Phone number info */}
              {phoneNumber && !showOtpInput && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-800">
                  📱 OTP will be sent to: ***{phoneNumber.slice(-4)}
                </div>
              )}

              {/* OTP Input Section */}
              {showOtpInput && (
                <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="text-center">
                    <p className="font-semibold text-gray-900 mb-1">
                      📱 Verify Your Phone Number
                    </p>
                    <p className="text-sm text-gray-600">
                      OTP sent to: ***{phoneNumber.slice(-4)}
                    </p>
                  </div>

                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    maxLength="6"
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2d8659] focus:border-transparent font-poppins text-center text-lg tracking-widest"
                  />
                  
                  {otpTimer > 0 && (
                    <p className="text-sm text-center text-[#2d8659]">
                      ⏱️ OTP expires in: {formatTime(otpTimer)}
                    </p>
                  )}
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={verifyOtp}
                      disabled={!otp || otp.length !== 6}
                      className="flex-1 py-2.5 px-4 bg-[#2d8659] text-white rounded-md hover:bg-[#246548] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-poppins font-medium"
                    >
                      Verify OTP
                    </button>
                    
                    <button 
                      onClick={resendOtp}
                      disabled={otpTimer > 0 || isOtpSending}
                      className="flex-1 py-2.5 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-poppins font-medium"
                    >
                      {isOtpSending ? 'Sending...' : 'Resend'}
                    </button>
                  </div>
                </div>
              )}

              {!showOtpInput && (
                <button 
                  onClick={handleSignIn}
                  disabled={isOtpSending}
                  className="w-full py-3 px-4 bg-[#2d8659] text-white rounded-md hover:bg-[#246548] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-poppins font-medium text-lg"
                >
                  {isOtpSending ? 'Sending OTP...' : 'Sign In'}
                </button>
              )}
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="max-w-md mx-auto mt-6 text-center">
            <p className="text-gray-600 font-poppins">
              New here?{" "}
              <Link href="/signup">
                <span className="text-[#2d8659] hover:underline font-medium cursor-pointer">
                  Sign up
                </span>
              </Link>
            </p>
          </div>
        </div>
        <Footer />
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

export default Signin;