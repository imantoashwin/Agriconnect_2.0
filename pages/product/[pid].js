// pages/product/[pid].js
import Navbar from "../../components/Navbar/Navbar";
import Styles from "../../styles/IndivualProductPage.module.css";
import ReactStars from "react-stars";
import { addToCart } from "../../redux/cartSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { toast } from "react-toastify";
import React from "react";
import "react-toastify/dist/ReactToastify.css";

// Firebase
import { db } from "../../firebase";
import { doc, getDoc, collection, getDocs, addDoc, Timestamp } from "firebase/firestore";
import Footer from "../../components/Footer/Footer";

const InduvialPost = (props) => {
  const { loadedProduct } = props;
  const dispatch = useDispatch();
  const [stars, setStars] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Simulate loading completion after component mounts
  React.useEffect(() => {
    setLoading(false);
  }, [loadedProduct]);

  if (!loadedProduct) {
    return <p className="text-center mt-10">Product not found</p>;
  }

  const {
    id: productId,
    name,
    price,
    image,
    description,
    weight,
    quantity,
    productOwnerName,
    sellerContact,
  } = loadedProduct;

  const closeFeedBack = () => {
    setStars(0);
    setFeedback("");
  };

  const submitReview = async () => {
    if (stars === 0) {
      toast.error("Please select a rating");
      return;
    }

    // Get user info from localStorage
    const currentUser = localStorage.getItem("currentUser");
    const userName = currentUser ? JSON.parse(currentUser).user_name : "Anonymous";

    setSubmitting(true);
    try {
      await addDoc(collection(db, "reviews"), {
        productId,
        productName: name,
        userName: userName,
        rating: stars,
        feedback,
        createdAt: Timestamp.now(),
        timestamp: new Date().toISOString(),
      });
      toast.success("Review submitted successfully!");
      setStars(0);
      setFeedback("");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />

      {loading && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-3">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-[#2d8659] rounded-full animate-spin"></div>
            <p className="font-poppins text-gray-700">Loading...</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="flex items-center justify-center">
            <img
              src={image}
              alt={name}
              className="w-full h-auto object-cover rounded-lg shadow-md"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-start">
            {/* Product Name */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 font-poppins">
              {name}
            </h1>

            {/* Description */}
            <div className="mb-6">
              <p className="text-gray-700 text-sm md:text-base leading-relaxed font-poppins">
                {description}
              </p>
            </div>

            {/* Price */}
            <div className="mb-4">
              <p className="text-3xl font-bold text-[#2d8659] font-poppins">
                ₹{price}<span className="text-lg text-gray-600">/{weight}</span>
              </p>
            </div>

            {/* Seller Info */}
            <div className="border-t border-b border-gray-200 py-4 mb-6">
              <p className="text-sm md:text-base text-gray-700 mb-2 font-poppins">
                <b>Seller:</b> {productOwnerName}
              </p>
              {sellerContact && (
                <p className="text-sm md:text-base text-gray-700 font-poppins">
                  <b>Contact:</b>{" "}
                  <a
                    href={`tel:${sellerContact}`}
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    {sellerContact}
                  </a>
                </p>
              )}
            </div>

            {/* Quantity in Stock */}
            <div className="mb-6">
              <p className="text-sm md:text-base text-gray-700 font-poppins">
                <b>Available:</b> {quantity} {weight} in stock
              </p>
            </div>

            {/* Add to Cart Button */}
            <button
              className="w-full bg-[#2d8659] hover:bg-[#246548] text-white font-bold py-3 rounded-lg transition-colors font-poppins text-base"
              onClick={() => dispatch(addToCart(loadedProduct))}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default InduvialPost;

// ✅ Fetch single product
export async function getStaticProps(context) {
  const { params } = context;
  const productId = params.pid;

  const docRef = doc(db, "products", productId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return { notFound: true };
  }

  const p = docSnap.data();

  // 🔥 Map Firestore fields to component props and convert Timestamps to strings
  // Try multiple field name variations since exact field names may vary
  const safeProduct = {
    id: docSnap.id,
    name: p.productName || p.name || "Unknown Product",
    price: p.productRate || p.price || 0,
    image: p.image || "/placeholder.jpg",
    description: p.description || p.productDescription || p.desc || "No description available",
    location: p.location || "5",
    weight: p.productUnit || p.unit || "kg",
    quantity: parseFloat(p.productStock || p.stock || p.quantity || 0),
    productOwnerName: p.productOwnerName || p.sellerName || p.ownerName || p.farmerName || "Unknown Seller",
    createdAt: p.createdAt?.toDate?.().toISOString() || null,
    updatedAt: p.updatedAt?.toDate?.().toISOString() || null,
  };

  console.log("Product Data from Firebase:", p);
  console.log("Mapped Product:", safeProduct);

  return {
    props: {
      loadedProduct: safeProduct,
    },
    revalidate: 10, // ISR: refresh every 10s
  };
}

// ✅ Fetch all products for paths
export async function getStaticPaths() {
  const querySnapshot = await getDocs(collection(db, "products"));

  const paths = querySnapshot.docs.map((docSnap) => ({
    params: { pid: docSnap.id },
  }));

  return {
    paths,
    fallback: false,
  };
}
