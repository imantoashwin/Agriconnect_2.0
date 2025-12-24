import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Styles from "../../styles/Nav.module.css";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/userSlice";
import { resetOrder } from "../../redux/orderSlice";

const Navbar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const getItemsCount = () => {
    return cart.reduce((accumulator, item) => accumulator + item.quantity, 0);
  };

  const genericHamburgerLine = `h-0.5 w-5 my-0.5 rounded-full bg-gray-700 transition ease transform duration-300`;

  const onSignOut = () => {
    dispatch(logout());
    setUser(null);
  };

  useEffect(() => {
    const currUser = localStorage.getItem("user");
    if (currUser) {
      setUser(JSON.parse(currUser));
    }
  }, []);

  // ✅ Google Translate initialization with proper functionality
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
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

      // Hide banner
      setTimeout(hideBanner, 500);
      setTimeout(hideBanner, 1500);
      
      // Add click functionality to custom button (desktop)
      setTimeout(() => {
        const customBtn = document.querySelector('.custom-translate-btn');
        const googleSelect = document.querySelector('.goog-te-combo');
        const translateContainer = document.querySelector('.translate-micro');
        
        if (customBtn && googleSelect && translateContainer) {
          let isOpen = false;
          
          customBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (!isOpen) {
              translateContainer.classList.add('open');
              googleSelect.style.display = 'block';
              googleSelect.focus();
              googleSelect.click();
              isOpen = true;
            }
          });
          
          // Close dropdown when clicking outside
          document.addEventListener('click', (e) => {
            if (!translateContainer.contains(e.target)) {
              translateContainer.classList.remove('open');
              isOpen = false;
            }
          });
          
          // Handle dropdown change
          googleSelect.addEventListener('change', () => {
            translateContainer.classList.remove('open');
            isOpen = false;
          });
        }

        // Add click functionality for mobile translate button in navbar
        const mobileNavTranslateBtn = document.querySelector('.mobile-nav-translate-btn');
        if (mobileNavTranslateBtn) {
          let customDropdown = null;
          
          mobileNavTranslateBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Find the Google translate combo box
            const googleSelect = document.querySelector('.goog-te-combo');
            console.log('Google Select found:', googleSelect);
            
            if (googleSelect) {
              // Remove existing custom dropdown if any
              if (customDropdown) {
                customDropdown.remove();
                customDropdown = null;
                return;
              }
              
              // Get button position
              const rect = mobileNavTranslateBtn.getBoundingClientRect();
              
              // Create custom styled dropdown
              customDropdown = document.createElement('div');
              customDropdown.className = 'custom-mobile-dropdown';
              customDropdown.style.cssText = `
                position: fixed;
                top: ${rect.bottom + 8}px;
                right: ${window.innerWidth - rect.right}px;
                z-index: 9999;
                background: white;
               border: 2px solid #004e16;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                padding: 8px 0;
                min-width: 160px;
                max-height: 250px;
                overflow-y: auto;
                animation: fadeInScale 0.2s ease-out;
              `;
              
              // Get all language options
              const options = googleSelect.querySelectorAll('option');
              options.forEach((option, index) => {
                if (index === 0) return; // Skip "Select Language"
                
                const optionDiv = document.createElement('div');
                optionDiv.textContent = option.textContent;
                optionDiv.style.cssText = `
                  padding: 12px 16px;
                  cursor: pointer;
                  font-size: 15px;
                  color: #333;
                  border-bottom: 1px solid #f0f0f0;
                  transition: all 0.2s ease;
                `;
                
                // Hover effect
                optionDiv.addEventListener('mouseenter', () => {
                  optionDiv.style.background = 'linear-gradient(135deg, #46b57f, #46b5a7)';
                  optionDiv.style.color = 'white';
                  optionDiv.style.transform = 'translateX(4px)';
                });
                
                optionDiv.addEventListener('mouseleave', () => {
                  optionDiv.style.background = 'white';
                  optionDiv.style.color = '#333';
                  optionDiv.style.transform = 'translateX(0)';
                });
                
                // Click handler
                optionDiv.addEventListener('click', () => {
                  console.log('Language selected:', option.value);
                  googleSelect.value = option.value;
                  
                  // Trigger change event on Google Select
                  const changeEvent = new Event('change', { bubbles: true });
                  googleSelect.dispatchEvent(changeEvent);
                  
                  // Remove custom dropdown
                  customDropdown.remove();
                  customDropdown = null;
                });
                
                customDropdown.appendChild(optionDiv);
              });
              
              // Add to page
              document.body.appendChild(customDropdown);
              
              // Hide on click outside
              const handleClickOutside = (event) => {
                if (!customDropdown.contains(event.target) && !mobileNavTranslateBtn.contains(event.target)) {
                  if (customDropdown) {
                    customDropdown.remove();
                    customDropdown = null;
                  }
                  document.removeEventListener('click', handleClickOutside);
                }
              };
              
              setTimeout(() => {
                document.addEventListener('click', handleClickOutside);
              }, 100);
              
            } else {
              console.log('Google Translate not ready yet, retrying...');
              setTimeout(() => {
                mobileNavTranslateBtn.click();
              }, 500);
            }
          });
        }
      }, 1000);
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

  return (
    <>
      <nav className="grid grid-cols-3 items-center px-6 py-2 bg-white border-b border-gray-100">
        <div className="col-span-1 flex-shrink-0 flex items-center">
          <Link href="/" passHref>
            <div className="cursor-pointer">
              <Image
                src="/Images/Logo/Agriconnect_logo.png"
                className="cursor-pointer"
                alt="logo"
                width={150}
                height={48}
              />
            </div>
          </Link>
        </div>

        <div className={`${Styles.navLinks} col-span-1`}>
          <div
            className={`${Styles.navRes} flex items-center justify-center gap-6 font-poppins text-[14px] text-gray-700`}
          >
            <div className={`hover:text-[#2d8659] transition-colors ${router.pathname === "/" ? "active" : ""}`}>
              <Link href="/">Home</Link>
            </div>

            {user && (
              <div className={`hover:text-[#2d8659] transition-colors ${router.pathname === "/products" ? "active" : ""}`}>
                <Link href="/products">Products</Link>
              </div>
            )}

            {user && (
              <div className={`hover:text-[#2d8659] transition-colors ${router.pathname === "/orders" ? "active" : ""}`}>
                <Link href="/orders">Orders</Link>
              </div>
            )}

            <div className={`hover:text-[#2d8659] transition-colors ${router.pathname === "/about" ? "active" : ""}`}>
              <Link href="/about">About</Link>
            </div>

            {user && (
              <div
                className={`cursor-pointer font-poppins text-[16px] hover:text-[#2d8659] transition-colors ${
                  router.pathname === "/cart" ? "active" : ""
                }`}
              >
                <Link href="/cart" passHref>
                  <p className="flex items-center gap-1">
                    <span>Cart</span>
                    <span className="bg-[#2d8659] text-white text-xs px-2 py-0.5 rounded-full">{getItemsCount()}</span>
                  </p>
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="col-span-1 flex items-center justify-end gap-4">
          {/* ✅ Hidden Google Translate Element - Required for functionality but invisible */}
          <div className="translate-micro" style={{ display: 'none' }}>
            <div id="google_translate_element" className="translate-icon"></div>
            <div className="custom-translate-btn" title="Translate">🌐</div>
          </div>

          {user ? (
            <div className={`${Styles.navLeft} flex items-center gap-4`}>
              <p className="font-poppins text-[15px] text-gray-700 md_max:hidden">{user.user_name}</p>
              <Link href="/" passHref>
                <button
                  className="px-4 py-2 text-sm font-poppins text-gray-700 hover:text-[#2d8659] transition-colors md_max:hidden"
                  onClick={() => onSignOut()}
                >
                  Sign Out
                </button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3 md_max:hidden">
              <Link href="/signin" passHref>
                <button className="px-3 py-1.5 text-xs font-poppins text-gray-700 hover:text-[#2d8659] transition-colors border border-gray-200 rounded-md">
                  Sign In
                </button>
              </Link>
            </div>
          )}

          {/* Mobile Translate Icon */}
          <div className="mobile-nav-translate-btn md:hidden mr-1" title="Translate">🌐</div>

          <button
            className="flex flex-col h-8 w-8 justify-center cursor-pointer items-center group md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div
              className={`${genericHamburgerLine} ${
                isOpen
                  ? "rotate-45 translate-y-3 opacity-50 group-hover:opacity-100"
                  : "opacity-50 group-hover:opacity-100"
              }`}
            />
            <div
              className={`${genericHamburgerLine} ${
                isOpen ? "opacity-0" : "opacity-50 group-hover:opacity-100"
              }`}
            />
            <div
              className={`${genericHamburgerLine} ${
                isOpen
                  ? "-rotate-45 -translate-y-3 opacity-50 group-hover:opacity-100"
                  : "opacity-50 group-hover:opacity-100"
              }`}
            />
          </button>
        </div>
        
        {isOpen && <MobileNavLine />}
      </nav>

      {/* ✅ Translate Button Styles */}
      <style jsx global>{`
        .translate-micro {
          position: relative;
          margin: 0 8px;
          display: inline-block;
          width: 20px;
          height: 20px;
        }
        
        /* Hide Google branding but keep dropdown functional */
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
        
        /* Style the actual Google dropdown */
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
        
        /* Custom translate button overlay */
        .custom-translate-btn {
          display: flex !important;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.2s ease;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 5;
          pointer-events: auto;
        }
        
        .custom-translate-btn:active {
          transform: scale(0.95);
        }
        
        /* When dropdown is opened, show it */
        .translate-micro.open .goog-te-combo {
          opacity: 1 !important;
          pointer-events: auto !important;
          position: absolute !important;
          top: 25px !important;
          left: -20px !important;
          width: auto !important;
          height: auto !important;
          background: white !important;
          border: 1px solid #ccc !important;
          border-radius: 4px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
          z-index: 1000 !important;
        }
        
        .translate-micro.open .goog-te-combo option {
          padding: 4px 8px !important;
          font-size: 12px !important;
          color: #333 !important;
        }

        /* Mobile translate button in navbar - Simplified without hover */
        .mobile-nav-translate-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          font-size: 20px;
          cursor: pointer;
          border-radius: 10px;
          background: #f4f8f6;
          border: 2px solid #004e16;
          color: white;
          box-shadow: 0 4px 15px rgba(70, 181, 127, 0.4);
          position: relative;
        }

        .mobile-nav-translate-btn:active {
          transform: scale(0.95);
        }

        /* Custom dropdown animation */
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.9) translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        /* Custom scrollbar for mobile dropdown */
        .custom-mobile-dropdown::-webkit-scrollbar {
          width: 6px;
        }

        .custom-mobile-dropdown::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }

        .custom-mobile-dropdown::-webkit-scrollbar-thumb {
         background: #46b57f;
          border-radius: 3px;
        }

        .custom-mobile-dropdown::-webkit-scrollbar-thumb:hover {
         background: #004e16;
        }

        /* Custom scrollbar for mobile dropdown */
        .goog-te-combo::-webkit-scrollbar {
          width: 8px;
        }

        .goog-te-combo::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 6px;
        }

        .goog-te-combo::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 6px;
        }

        .goog-te-combo::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </>
  );
};

const MobileNavLine = () => {
  const router = useRouter();
  const cart = useSelector((state) => state.cart);
  const [user, setUser] = useState(null);

  const getItemsCount = () => {
    return cart.reduce((accumulator, item) => accumulator + item.quantity, 0);
  };

  const onSignOut = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  useEffect(() => {
    const currUser = localStorage.getItem("user");
    if (currUser) {
      setUser(JSON.parse(currUser));
    }
  }, []);

  return (
    <div className="w-full bg-white border-t border-gray-100 flex flex-col items-center py-8 gap-6 md:hidden">
      <div className={`font-poppins text-gray-700 hover:text-[#2d8659] transition-colors ${router.pathname === "/" ? "active" : ""}`}>
        <Link href="/">Home</Link>
      </div>
      {user && (
        <div className={`font-poppins text-gray-700 hover:text-[#2d8659] transition-colors ${router.pathname === "/products" ? "active" : ""}`}>
          <Link href="/products">Products</Link>
        </div>
      )}
      <div className={`font-poppins text-gray-700 hover:text-[#2d8659] transition-colors ${router.pathname === "/about" ? "active" : ""}`}>
        <Link href="/about">About</Link>
      </div>
      {user && (
        <div className={`font-poppins text-gray-700 hover:text-[#2d8659] transition-colors cursor-pointer ${
            router.pathname === "/cart" ? "active" : ""
          }`}
        >
          <Link href="/cart" passHref>
            <p>Cart ({getItemsCount()})</p>
          </Link>
        </div>
      )}

        {user && (
        <div>
          <Link href="/" passHref>
            <button
              className="px-6 py-2 text-sm font-poppins text-gray-700 hover:text-[#2d8659] transition-colors"
              onClick={() => onSignOut()}
            >
              Sign Out
            </button>
          </Link>
        </div>
      )}
      {!user && (
        <Link href="/signin" passHref>
          <button className="px-6 py-2 text-sm font-poppins text-gray-700 hover:text-[#2d8659] transition-colors">
            Sign In
          </button>
        </Link>
      )}
    </div>
  );
};

export default Navbar;