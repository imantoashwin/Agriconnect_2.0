import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { initializeApp, getApps, getApp } from "firebase/app";
import { db } from "../../firebase";
function AddProductAdmin() {
  const [productName, setProductName] = useState("");
  const [productType, setProductType] = useState("");
  const [productRate, setProductRate] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [productLocation, setProductLocation] = useState("0");
  const [productPicture, setProductPicture] = useState("");
  const [productWeight, setProductWeight] = useState("");
  const [fileInputState, setFileInputState] = useState("");
  const [previewSource, setPreviewSource] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [file, setFile] = useState(null);

  const admin = useSelector((state) => state.admin)?.admin;
  const router = useRouter();

  // // Firebase configuration
  // const firebaseConfig = {
  //   apiKey: "AIzaSyB0mvAaGlZl9_-TPHLe_Cgkofhlvj64rdc",
  //   authDomain: "agriconnect-3c327.firebaseapp.com",
  //   projectId: "agriconnect-3c327",
  //   storageBucket: "agriconnect-3c327.appspot.com",
  //   messagingSenderId: "522663366346",
  //   appId: "1:522663366346:web:812340ea9450a74150ae33",
  //   measurementId: "G-DB1CY1X8JP"
  // };

  // // Initialize Firebase - better way
  // const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  // const auth = getAuth(app);
  // const db = getFirestore(app);
  // const storage = getStorage(app);

  // Google Translate initialization
  

  
  const onAddProduct = async (e) => {
    e.preventDefault();
    
    // Check if user is a farmer (changed from "ADMIN" to "farmer" to match your Firebase structure)
    if (admin?.role !== "farmer") {
      toast.error("You're not authorized to add products", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });
      return;
    }

    if (
      !productName ||
      !productType ||
      !productRate ||
      !productDescription ||
      !productQuantity ||
      !productLocation ||
      !productPicture ||
      !productWeight
    ) {
      toast.error("Please fill in all fields", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });
      return;
    }

    try {
      // Generate unique product ID
      const productId = Date.now().toString();
      
      // Create product document in Firestore
      await setDoc(doc(db, "products", productId), {
        productId: productId,
        productName: productName,
        productType: productType,
        productRate: parseInt(productRate),
        image: productPicture,
        productDescription: productDescription,
        productStock: parseInt(productQuantity),
        location: productLocation,
        productWeight: productWeight,
        adminId: admin.id,
        farmerId: admin.id,
        farmerName: admin.user_name || admin.username,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      toast.success("Product Added successfully!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });

      // Reset form
      setProductDescription("");
      setProductLocation("0");
      setProductName("");
      setProductPicture("");
      setProductQuantity("");
      setProductRate("");
      setProductType("");
      setProductWeight("");
      setPreviewSource("");
      setFileInputState("");
      setFile(null);

      router.push("/dashboard/admin/products");
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product. Please try again.", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setFile(file);
    previewFile(file);
    setFileInputState(e.target.value);
    
    // Automatically upload the image
    const reader = new FileReader();
    reader.onload = function () {
      const base64Image = reader.result;
      setProductPicture(base64Image);
      toast.success("Image uploaded successfully!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });
    };
    reader.readAsDataURL(file);
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const handleRemoveImage = () => {
    setFile(null);
    setPreviewSource("");
    setProductPicture("");
    setFileInputState("");
    toast.info("Image removed", {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
    });
  };

  return (
    <>
      <div className="w-full h-full px-16 py-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">Add New Product</h1>

        {/* Image Upload Section */}
        <div className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Product Image</h2>
          <div className="flex flex-col gap-4">
            <input
              type="file"
              name="image"
              onChange={handleFileInputChange}
              value={fileInputState}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-gray-900 file:text-white hover:file:bg-gray-700 cursor-pointer"
              accept="image/*"
            />
            {previewSource && (
              <div className="mt-2 relative inline-block">
                <img
                  src={previewSource}
                  alt="Preview"
                  className="h-48 w-auto object-cover rounded border border-gray-200"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 transition-colors font-bold text-lg"
                  title="Remove image"
                >
                  ×
                </button>
              </div>
            )}
          </div>
          {uploadError && <p className="mt-2 text-sm text-red-600">{uploadError}</p>}
        </div>

        {/* Product Details Form */}
        <form onSubmit={onAddProduct} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name
              </label>
              <input
                type="text"
                placeholder="e.g., Gold Rice"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            {/* Product Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Category
              </label>
              <input
                type="text"
                placeholder="e.g., Grains, Vegetables"
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            {/* Product Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price per Unit
              </label>
              <input
                type="number"
                placeholder="₹"
                value={productRate}
                onChange={(e) => setProductRate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            {/* Measuring Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit of Measurement
              </label>
              <input
                type="text"
                placeholder="e.g., /kg, /piece"
                value={productWeight}
                onChange={(e) => setProductWeight(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            {/* Product Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity
              </label>
              <input
                type="number"
                placeholder="Available stock"
                value={productQuantity}
                onChange={(e) => setProductQuantity(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
          </div>

          {/* Product Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Description
            </label>
            <textarea
              placeholder="Enter product details..."
              maxLength={120}
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
            />
            <p className="mt-1 text-xs text-gray-500">{productDescription.length}/120 characters</p>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="bg-gray-900 text-white py-3 px-8 rounded hover:bg-gray-700 transition-colors font-medium"
            >
              Add Product
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </>
  );
}

export default AddProductAdmin;