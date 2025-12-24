import axios from "axios";
import Image from "next/image";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../../firebase";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";

function ProfileComponent({ admin, productsSold }) {
  const { isLoggedIn } = useSelector((state) => state.admin);
  const [adminAnalytics, setAdminAnalytics] = useState(null);
  const [address, setAddress] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(true);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    axios
      .get(
        `http://localhost:3000/api/admin/purchase/analysis?adminId=${admin.id}`
      )
      .then((response) => {
        const { data } = response;
        setAdminAnalytics(data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", admin.id));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.address) {
            setAddress(userData.address);
          }
        }
      } catch (error) {
        console.error("Error fetching address:", error);
      } finally {
        setLoadingAddress(false);
      }
    };

    if (admin?.id) {
      fetchAddress();
    }
  }, [admin]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRef = collection(db, "products");
        const q = query(productsRef, where("farmerId", "==", admin.id));
        const querySnapshot = await getDocs(q);
        
        const productList = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          productList.push({
            id: doc.id,
            name: data.productName || data.name,
            price: data.productRate || data.price,
          });
        });
        
        setProducts(productList);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoadingProducts(false);
      }
    };

    if (admin?.id) {
      fetchProducts();
    }
  }, [admin]);
  return (
    <div className="w-full h-full px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-8">My Profile</h1>

        {/* Profile Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
          <div className="flex items-start gap-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <Image
                src="https://images.unsplash.com/photo-1670438664300-d6d70b3fbf64?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80"
                width={120}
                height={120}
                alt="profile"
                className="rounded-full object-cover"
              />
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                {admin.user_name}
              </h2>
              <p className="text-gray-600 text-sm mb-4">{admin.email}</p>
              {admin.mobile && (
                <p className="text-gray-600 text-sm mb-4">
                  <span className="font-medium">Phone:</span> {admin.mobile}
                </p>
              )}
            </div>
          </div>

          {/* Address */}
          {address && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Address</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {address.street && `${address.street}, `}
                {address.area && `${address.area}, `}
                {address.city && `${address.city}`}
                {address.state && `, ${address.state}`}
                {address.pincode && ` - ${address.pincode}`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Products Sold */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Products Listed</h3>
          {loadingProducts ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : products.length > 0 ? (
            <div className="space-y-2">
              {products.map((product) => (
                <div key={product.id} className="text-sm">
                  <p className="text-gray-600">• {product.name}</p>
                  <p className="text-xs text-gray-500">₹{product.price}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No products listed</p>
          )}
        </div>

        {/* Average Rating */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Average Rating</h3>
          <p className="text-2xl font-semibold text-gray-900">4.5/5</p>
          <p className="text-xs text-gray-500 mt-2">Based on customer reviews</p>
        </div>

        {/* Income Generated */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Income Generated</h3>
          <p className="text-2xl font-semibold text-gray-900">
            {adminAnalytics
              ? `₹${adminAnalytics.totalSalesAmount._sum.totalCost}`
              : "₹0"}
          </p>
          <p className="text-xs text-gray-500 mt-2">Total earnings</p>
        </div>
      </div>
    </div>
  );
}

export default ProfileComponent;
