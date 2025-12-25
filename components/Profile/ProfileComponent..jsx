import axios from "axios";
import Image from "next/image";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../../firebase";
import { doc, getDoc, collection, getDocs, query, where, onSnapshot } from "firebase/firestore";

function ProfileComponent({ admin, productsSold }) {
  const { isLoggedIn } = useSelector((state) => state.admin);
  const [adminAnalytics, setAdminAnalytics] = useState(null);
  const [address, setAddress] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(true);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [loadingRating, setLoadingRating] = useState(true);
  const [ratingDistribution, setRatingDistribution] = useState({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0
  });
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loadingEarnings, setLoadingEarnings] = useState(true);

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

  // Fetch average rating and total earnings from Firebase
  useEffect(() => {
    if (!admin?.id) return;

    const fetchRatingsAndEarnings = async () => {
      try {
        setLoadingRating(true);
        setLoadingEarnings(true);
        
        // Get all orders first
        const allOrdersQuery = query(collection(db, "orders"));
        const allOrdersSnap = await getDocs(allOrdersQuery);
        
        let totalRating = 0;
        let ratingCount = 0;
        let totalEarningsAmount = 0;
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

        // Process each order to check if it belongs to current farmer
        for (const orderDoc of allOrdersSnap.docs) {
          const orderData = orderDoc.data();
          
          if (orderData.productId) {
            try {
              // Get the product details using productId
              const productQuery = query(
                collection(db, "products"),
                where("productId", "==", orderData.productId)
              );
              const productSnap = await getDocs(productQuery);
              
              // Check if product belongs to current farmer
              productSnap.forEach((productDoc) => {
                const productData = productDoc.data();
                
                if (productData.farmerId === admin.id) {
                  // Calculate ratings
                  if (orderData.rating && orderData.rating > 0) {
                    totalRating += orderData.rating;
                    ratingCount++;
                    
                    // Count rating distribution
                    const ratingValue = Math.round(orderData.rating);
                    if (distribution.hasOwnProperty(ratingValue)) {
                      distribution[ratingValue]++;
                    }
                  }
                  
                  // Calculate total earnings using totalPrice field
                  totalEarningsAmount += orderData.totalPrice || orderData.totalAmount || 0;
                }
              });
            } catch (productError) {
              console.error("Error fetching product for order:", orderData.productId, productError);
            }
          }
        }

        const avgRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : 0;
        setAverageRating(parseFloat(avgRating));
        setRatingCount(ratingCount);
        setRatingDistribution(distribution);
        setTotalEarnings(totalEarningsAmount);
      } catch (error) {
        console.error("Error fetching ratings and earnings:", error);
        setAverageRating(0);
        setRatingCount(0);
        setTotalEarnings(0);
      } finally {
        setLoadingRating(false);
        setLoadingEarnings(false);
      }
    };

    fetchRatingsAndEarnings();
  }, [admin?.id]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 px-4 sm:px-8">
      {/* Header Section */}
      <div className="mb-12">
        <div className="inline-block">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-2">
            My Profile
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full"></div>
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 sm:p-10 mb-8 border border-slate-100">
        <div className="flex flex-col sm:flex-row items-start gap-8">
          {/* Avatar Section */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full opacity-10 blur-lg"></div>
              <Image
                src="https://images.unsplash.com/photo-1670438664300-d6d70b3fbf64?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80"
                width={140}
                height={140}
                alt="profile"
                className="rounded-full object-cover border-4 border-white shadow-lg relative z-10"
              />
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 w-full">
            <div className="space-y-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-1">
                  {admin.user_name}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-green-600 rounded-full"></span>
                  <p className="text-sm text-green-600 font-medium">Active Farmer</p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center text-gray-600">
                  <span className="text-sm font-medium">📧 Email:</span>
                  <span className="ml-3 text-sm">{admin.email}</span>
                </div>
                {admin.mobile && (
                  <div className="flex items-center text-gray-600">
                    <span className="text-sm font-medium">📞 Phone:</span>
                    <span className="ml-3 text-sm">{admin.mobile}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Address Section */}
            {address && (
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  📍 Primary Address
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed bg-slate-50 rounded-lg p-4">
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
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Products Listed Card */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-8 border border-slate-100 group cursor-default">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">Products Listed</p>
              <h3 className="text-4xl font-bold text-gray-900">{loadingProducts ? "..." : products.length}</h3>
            </div>
            <div className="text-3xl group-hover:scale-110 transition-transform duration-300">🌾</div>
          </div>
          
          {loadingProducts ? (
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded animate-pulse w-1/2"></div>
            </div>
          ) : products.length > 0 ? (
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {products.slice(0, 3).map((product) => (
                <div key={product.id} className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                  <p className="text-sm font-medium text-gray-900">{product.name}</p>
                  <p className="text-xs text-green-600 font-semibold mt-1">₹{product.price}</p>
                </div>
              ))}
              {products.length > 3 && (
                <p className="text-xs text-gray-500 text-center pt-2">+{products.length - 3} more products</p>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No products listed yet</p>
          )}
        </div>

        {/* Average Rating Card */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-8 border border-slate-100 group cursor-default">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">Average Rating</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-4xl font-bold text-gray-900">
                  {loadingRating ? "..." : averageRating}
                </h3>
                <span className="text-xl text-yellow-400">★</span>
              </div>
            </div>
            <div className="text-3xl group-hover:scale-110 transition-transform duration-300">⭐</div>
          </div>
          
          {loadingRating ? (
            <div className="space-y-3">
              <div className="h-3 bg-slate-200 rounded animate-pulse"></div>
              <div className="h-3 bg-slate-200 rounded animate-pulse w-4/5"></div>
              <div className="h-3 bg-slate-200 rounded animate-pulse w-1/2"></div>
            </div>
          ) : ratingCount > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gradient-to-r from-yellow-300 to-yellow-400 h-2 rounded-full"
                  style={{ width: `${(ratingDistribution[5] / ratingCount) * 100}%` }}>
                </div>
                <span className="text-sm font-semibold text-gray-700 min-w-fit">5 ★</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gradient-to-r from-yellow-300 to-yellow-400 h-2 rounded-full"
                  style={{ width: `${(ratingDistribution[4] / ratingCount) * 100}%` }}>
                </div>
                <span className="text-sm font-semibold text-gray-700 min-w-fit">4 ★</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gradient-to-r from-yellow-300 to-yellow-400 h-2 rounded-full"
                  style={{ width: `${(ratingDistribution[3] / ratingCount) * 100}%` }}>
                </div>
                <span className="text-sm font-semibold text-gray-700 min-w-fit">3 ★</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gradient-to-r from-yellow-300 to-yellow-400 h-2 rounded-full"
                  style={{ width: `${(ratingDistribution[2] / ratingCount) * 100}%` }}>
                </div>
                <span className="text-sm font-semibold text-gray-700 min-w-fit">2 ★</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gradient-to-r from-yellow-300 to-yellow-400 h-2 rounded-full"
                  style={{ width: `${(ratingDistribution[1] / ratingCount) * 100}%` }}>
                </div>
                <span className="text-sm font-semibold text-gray-700 min-w-fit">1 ★</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No ratings yet</p>
          )}
          <p className="text-xs text-gray-500 mt-4">
            Based on {ratingCount} customer {ratingCount === 1 ? "review" : "reviews"}
          </p>
        </div>

        {/* Income Generated Card */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-8 border border-slate-100 group cursor-default">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">Total Earnings</p>
              <h3 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                {loadingEarnings ? "₹..." : `₹${totalEarnings.toLocaleString('en-IN')}`}
              </h3>
            </div>
            <div className="text-3xl group-hover:scale-110 transition-transform duration-300">💰</div>
          </div>
          
          {loadingEarnings ? (
            <div className="space-y-2 pt-4 border-t border-slate-200">
              <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded animate-pulse w-1/2"></div>
            </div>
          ) : totalEarnings > 0 ? (
            <div className="space-y-2 pt-4 border-t border-slate-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Monthly Average</span>
                <span className="font-semibold text-gray-900">₹{Math.round(totalEarnings / 12).toLocaleString('en-IN')}</span>
              </div>
              <p className="text-xs text-gray-500 italic">Cumulative income from all sales</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic pt-4 border-t border-slate-200">No earnings yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileComponent;
