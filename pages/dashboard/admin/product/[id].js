import { useState, useEffect } from "react";
import DashBoardNavBar from "../../../../components/DashBoardNavBar/DashBoardNavBar";
import DashBoardSidebar from "../../../../components/DashBoardSidebar/DashBoardSidebar";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import {db,auth} from '../../../../firebase';
import { useSelector } from "react-redux";

// Google Translate Component
const GoogleTranslate = () => {
  useEffect(() => {
    const addScript = () => {
      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    };

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,ta,hi,te,kn,ml,bn,gu,mr,or,ur',
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
      }, 'google_translate_element');
    };

    if (!window.google || !window.google.translate) {
      addScript();
    } else {
      window.googleTranslateElementInit();
    }
  }, []);

  return <div id="google_translate_element"></div>;
};

const EditProductPage = ({ product }) => {
  const router = useRouter();
  const isLoggedIn = useSelector((state) => state.admin)?.isLoggedIn;
  const [currentUser, setCurrentUser] = useState(null);
  const [editedProduct, setEditedProduct] = useState(product);
  const [loading, setLoading] = useState(true);

  // Check authentication
  useEffect(() => {
    const checkAuth = () => {
      const adminData = localStorage.getItem("admin");
      if (!adminData && !isLoggedIn) {
        router.push("/signin");
        return;
      }
      setLoading(false);
    };
    checkAuth();
  }, [isLoggedIn, router]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        // Load actual product data from Firebase
        try {
          const productRef = doc(db, "products", router.query.id);
          const productSnap = await getDoc(productRef);
          
          if (productSnap.exists()) {
            const productData = productSnap.data();
            // Map Firebase data to component structure
            setEditedProduct({
              productId: productData.productId,
              name: productData.productName,
              image: productData.image || productData.imageUrl,
              category: productData.productType,
              description: productData.productDescription,
              price: productData.productRate,
              quantity: productData.productStock,
              weight: productData.productWeight,
              location: productData.location
            });
          }
        } catch (error) {
          console.error("Error loading product:", error);
        }
      } else {
        router.push('/signin');
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.id]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-[#2d8659] rounded-full animate-spin"></div>
          <p className="font-poppins text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const productRef = doc(db, "products", router.query.id);
      
      await updateDoc(productRef, {
        productType: editedProduct.category,
        productDescription: editedProduct.description,
        location: editedProduct.location,
        productRate: parseInt(editedProduct.price),
        productWeight: editedProduct.weight,
        productStock: parseInt(editedProduct.quantity),
        updatedAt: new Date(),
      });

      toast.success("Product updated successfully!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });
    }
  };

  const onDeleteProduct = async (e, adminId, pid) => {
    e.preventDefault();
    
    try {
      await deleteDoc(doc(db, "products", router.query.id));
      
      toast.error("Product deleted successfully!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });
      
      setTimeout(() => {
        router.push("/dashboard/admin/products");
      }, 2000);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });
    }
  };

  return (
    <div>
      <GoogleTranslate />
      <DashBoardNavBar />
      <div>
        <DashBoardSidebar>
          <div className="w-full max-w-3xl mx-auto px-6">
            <div className="flex items-center mb-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-3 py-1.5 text-[13px] font-poppins text-gray-700 hover:text-gray-900 rounded border border-gray-300 hover:border-gray-400"
              >
                ← Back
              </button>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Edit Product</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name (readonly) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editedProduct.name}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none cursor-not-allowed bg-gray-50"
                  disabled
                />
              </div>

              {/* Image preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                <div className="w-[180px] h-[180px] bg-gray-50 border border-gray-200 rounded flex items-center justify-center overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    name="image"
                    src={editedProduct.image}
                    className="max-w-full max-h-full object-contain"
                    alt="product"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <input
                  type="text"
                  name="category"
                  value={editedProduct.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={editedProduct.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={editedProduct.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock ({editedProduct.weight})</label>
                <input
                  type="number"
                  name="quantity"
                  value={editedProduct.quantity}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit of Measurement</label>
                <input
                  type="text"
                  name="weight"
                  value={editedProduct.weight}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
              {/* Actions */}
              <div className="flex items-center gap-4 pt-2">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-gray-900 hover:bg-gray-700 text-white font-medium rounded"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded"
                  onClick={(e) => onDeleteProduct(e, currentUser?.uid, editedProduct.productId)}
                >
                  Delete
                </button>
              </div>
            </form>
          </div>
          <ToastContainer />
        </DashBoardSidebar>
      </div>
    </div>
  );
};

export async function getServerSideProps({ params }) {
  const productId = params.id;

  try {
    const product = {
      productId: productId,
      name: "Loading...",
      image: "/api/placeholder/150/150",
      category: "",
      description: "",
      price: 0,
      quantity: 0,
      weight: "",
      location: ""
    };

    return {
      props: {
        product: product,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}

export default EditProductPage;