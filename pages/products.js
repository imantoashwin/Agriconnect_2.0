import Image from "next/image";
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import Styles from "../styles/Products.module.css";
import Footer from "../components/Footer/Footer";
import Link from "next/link";
import ProductSearchCard from "../components/ProductSearchCard/ProductSearchCard";
import ProductCard from "../components/ProductCard/ProductCard";
import { searchProducts } from "../testData";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../firebase";   // ✅ reuse single firebase instance
import { collection, getDocs } from "firebase/firestore";

function Product() {
  const [searchInput, setSearchInput] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const purchase = useSelector((state) => state.purchase);

  // Initialize Google Translate
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      document.head.appendChild(script);

      window.googleTranslateElementInit = function() {
        new window.google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: 'en,ta,hi,te,kn,ml,bn,gu,mr,or,ur',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
        }, 'google_translate_element');
      };
    }
  }, []);

  // Load products from Firebase
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "products"));
      const productsData = [];
      snap.forEach(docSnap => {
        const p = docSnap.data();
        const stock = parseFloat(p.productStock || 0);
        if (stock > 0) {
          // Convert to exact format your ProductCard expects
          productsData.push({
            id: docSnap.id,
            name: p.productName || "Unknown Product",
            image: p.image || "/placeholder.jpg",
            location: "5",
            price: p.productRate || 0,
            weight: `${stock} ${p.productUnit || "kg"}`
          });
        }
      });
      setProducts(productsData);
    } catch (error) {
      console.error("Error loading products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Your original search function
  const searchItems = (searchValue) => {
    setSearchInput(searchValue);
    if (searchValue !== "") {
      const filteredProduct = products.filter((item) => {
        return Object.values(item)
          .join("")
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      });
      setFilteredResults(filteredProduct);
    }
  };

  return (
    <>
      <Navbar />

      {/* Google Translate Widget */}
      <div className="fixed top-4 right-4 z-50">
        <div id="google_translate_element"></div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-3">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-[#2d8659] rounded-full animate-spin"></div>
            <p className="font-poppins text-gray-700">Loading...</p>
          </div>
        </div>
      )}

      <div className="w-full">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center bg-white border border-gray-300 w-full h-[56px] rounded-lg shadow-sm focus-within:border-[#2d8659] focus-within:shadow-md transition-all">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full h-full px-3 rounded-lg focus:outline-none font-poppins text-gray-700"
              onChange={(e) => searchItems(e.target.value)}
            />
          </div>
        </div>
      </div>

      {searchInput.length > 1 && (
        filteredResults.length > 0 ? (
          <div className="max-w-7xl mx-auto px-6 py-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8 font-poppins">
              Search Results ({filteredResults.length})
            </h2>
            <div className={`${Styles.productCards} mb-10`}>
              {filteredResults.map((product) => {
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    pids={product.id}
                    imageUrl={product.image}
                    productName={product.name}
                    location={product.location}
                    price={product.price}
                    weight={product.weight}
                  />
                );
              })}
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-6 py-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2 font-poppins">
              No products found
            </h2>
            <p className="text-gray-600 font-poppins">Try changing your keywords or filters.</p>
          </div>
        )
      )}

      {!loading && products.length === 0 ? (
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2 font-poppins">
            No products available
          </h2>
          <p className="text-gray-600 font-poppins">Please check back later for new products.</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-900 mb-2 font-poppins">
            Products Available
          </h2>
          <div className="w-20 h-1 bg-[#2d8659] rounded"></div>
        </div>
        <div className={`${Styles.productCards} mb-8`}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              productName={product.name}
              pids={product.id}
              imageUrl={product.image}
              location={product.location}
              product={product}
              price={product.price}
              weight={product.weight}
            />
          ))}
        </div>
      </div>
      )}
      
      <Footer />

      {/* ✅ TOAST CONTAINER - Added at the end for optimal positioning */}
      <ToastContainer/>
    </>
  );
}

export default Product;