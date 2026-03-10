"use client"; // ensures it only runs on client side

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import { useSelector } from "react-redux";
import OrderComponent from "../components/OrderComponent/OrderComponent";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import Footer from "../components/Footer/Footer";
import { useRouter } from "next/router";

const OrdersPage = () => {
  const router = useRouter();
  const user = useSelector((state) => state.user);
  const [orderPurchased, setOrderPurchased] = useState([]);
  const [orderStatus, setOrderStatus] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check authentication
  useEffect(() => {
    const checkAuth = () => {
      const currentUser = localStorage.getItem("currentUser");
      if (!currentUser && !user.isLoggedIn) {
        alert("Please sign in to view your orders");
        router.push("/signin");
        return;
      }
    };
    checkAuth();
  }, [user.isLoggedIn, router]);

  // Helper function to safely format dates
  const formatOrderDate = (dateValue) => {
    try {
      let date;

      // Handle Firebase Timestamp
      if (dateValue && typeof dateValue.toDate === 'function') {
        date = dateValue.toDate();
      }
      // Handle regular Date object
      else if (dateValue instanceof Date) {
        date = dateValue;
      }
      // Handle string dates
      else if (typeof dateValue === 'string') {
        date = new Date(dateValue);
      }
      // Handle timestamp numbers
      else if (typeof dateValue === 'number') {
        date = new Date(dateValue);
      }
      // Handle objects with seconds (Firebase timestamp structure)
      else if (dateValue && dateValue.seconds) {
        date = new Date(dateValue.seconds * 1000);
      }
      else {
        // Fallback to current date
        date = new Date();
      }

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Date not available";
      }

      return date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (error) {
      console.error("Error formatting date:", error, dateValue);
      return "Date not available";
    }
  };

  async function fetchOrderPurchased(user) {
    if (!user?.user?.id || !user?.isLoggedIn) {
      setError("Please log in to view your orders");
      return;
    }
    if (!db) {
      setError("Database connection failed");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const simpleQuery = query(
        collection(db, "orders"),
        where("userId", "==", user.user.id)
      );
      const querySnapshot = await getDocs(simpleQuery);

      const orders = [];
      querySnapshot.forEach((docSnapshot) => {
        const orderData = docSnapshot.data();

        // Better date handling
        let purchasedDate;
        if (orderData.purchasedAt) {
          if (typeof orderData.purchasedAt.toDate === 'function') {
            purchasedDate = orderData.purchasedAt.toDate();
          } else if (orderData.purchasedAt.seconds) {
            purchasedDate = new Date(orderData.purchasedAt.seconds * 1000);
          } else {
            purchasedDate = new Date(orderData.purchasedAt);
          }
        } else {
          purchasedDate = new Date();
        }

        const transformedOrder = {
          ...orderData,
          id: docSnapshot.id,
          purchasedAt: purchasedDate,
          formattedDate: formatOrderDate(orderData.purchasedAt), // Add formatted date
          totalAmount: orderData.totalPrice || orderData.totalAmount || 0,
          status: orderData.orderStatus || orderData.status || "pending",
          paymentStatus: orderData.paymentStatus || "pending",
          deliveryAddress: orderData.deliveryAddress || "Not provided",
          productsBrought: [
            {
              id: orderData.productId || docSnapshot.id,
              productName: orderData.productName || "Unknown Product",
              productDescription: orderData.productDescription || "",
              productRate: orderData.productRate || 0,
              productWeight: orderData.productWeight || "",
              productType: orderData.productType || "",
              productStock: orderData.productStock || 0,
              image: orderData.image || "",
              location: orderData.location || "",
              quantity: orderData.quantity || 1,
              totalPrice: orderData.totalPrice || 0,
            },
          ],
        };

        orders.push(transformedOrder);
      });

      // Sort by date (most recent first)
      orders.sort((a, b) => {
        const dateA = a.purchasedAt instanceof Date ? a.purchasedAt.getTime() : new Date(a.purchasedAt).getTime();
        const dateB = b.purchasedAt instanceof Date ? b.purchasedAt.getTime() : new Date(b.purchasedAt).getTime();
        return dateB - dateA; // Descending order (newest first)
      });

      console.log("Orders sorted (newest first):", orders.map(o => ({
        id: o.id,
        date: o.purchasedAt instanceof Date ? o.purchasedAt.toISOString() : o.purchasedAt
      })));

      setOrderPurchased(orders);
    } catch (err) {
      setError("Failed to fetch orders");
      console.error("Fetch orders error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function createOrder(orderData) {
    if (!user?.user?.id || !user?.isLoggedIn) {
      throw new Error("User not authenticated");
    }
    const newOrder = {
      userId: user.user.id,
      purchasedAt: serverTimestamp(),
      orderStatus: "pending",
      paymentStatus: "pending",
      createdAt: serverTimestamp(),
      ...orderData,
    };
    const docRef = await addDoc(collection(db, "orders"), newOrder);
    await fetchOrderPurchased(user);
    return docRef.id;
  }

  async function updateOrder(orderId, updateData) {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { ...updateData, updatedAt: serverTimestamp() });
    await fetchOrderPurchased(user);
  }

  async function deleteOrder(orderId) {
    await deleteDoc(doc(db, "orders", orderId));
    await fetchOrderPurchased(user);
  }

  async function updateOrderStatus(orderId, newStatus) {
    await updateOrder(orderId, { orderStatus: newStatus, status: newStatus });
    setOrderStatus(newStatus);
  }

  async function cancelOrder(orderId) {
    await updateOrder(orderId, {
      orderStatus: "cancelled",
      status: "cancelled",
      cancelledAt: serverTimestamp(),
    });
  }

  useEffect(() => {
    if (db && user?.user?.id && user?.isLoggedIn) {
      fetchOrderPurchased(user);
    }
  }, [user]);

  const orderOperations = {
    create: createOrder,
    update: updateOrder,
    delete: deleteOrder,
    updateStatus: updateOrderStatus,
    cancel: cancelOrder,
    refresh: () => fetchOrderPurchased(user),
  };

  return (
    <>
      <Navbar />

      {loading && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-3">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-[#2d8659] rounded-full animate-spin"></div>
            <p className="font-poppins text-gray-700">Loading...</p>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 sm:py-8 px-3 sm:px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">My Orders</h1>
            <p className="text-sm sm:text-base text-gray-600">Track and manage your recent purchases</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-6 py-3 sm:py-4 rounded-lg mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3">
              <div>
                <p className="font-semibold text-sm sm:text-base">Error</p>
                <p className="text-xs sm:text-sm mt-1">{error}</p>
              </div>
              <button
                onClick={() => fetchOrderPurchased(user)}
                className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-xs sm:text-sm font-medium whitespace-nowrap"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && orderPurchased.length === 0 && (
            <div className="bg-white rounded-xl shadow-md p-8 sm:p-12 text-center">
              <div className="mb-4">
                <svg className="w-12 sm:w-16 h-12 sm:h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2z" />
                </svg>
              </div>
              <p className="text-gray-900 text-lg sm:text-xl font-semibold mb-2">No orders yet</p>
              <p className="text-sm sm:text-base text-gray-500">Your orders will appear here once you make a purchase</p>
            </div>
          )}

          {/* Orders List */}
          {orderPurchased.length > 0 && (
            <div className="space-y-4 sm:space-y-6">
              {orderPurchased.map((order, index) => (
                <div
                  key={order.id || index}
                  className="bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200"
                >
                  {/* Order Header */}
                  <div className="bg-gradient-to-r from-[#2d8659]/5 to-[#2d8659]/10 px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-0.5 sm:mb-1">Order Date</p>
                        <p className="text-sm sm:text-lg font-semibold text-gray-900">
                          {order.formattedDate || formatOrderDate(order.purchasedAt)}
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 sm:ml-auto">
                        <div className="text-left sm:text-right">
                          <p className="text-xs text-gray-500 mb-0.5 sm:mb-1">Order Total</p>
                          <p className="text-lg sm:text-2xl font-bold text-[#2d8659]">
                            ₹{order.totalAmount?.toFixed(2) || 0}
                          </p>
                        </div>
                        {order.paymentStatus && (
                          <span
                            className={`inline-block px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs font-semibold whitespace-nowrap self-start sm:self-auto ${
                              order.paymentStatus === "completed"
                                ? "bg-green-100 text-green-800"
                                : order.paymentStatus === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.paymentStatus === "failed"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {order.paymentStatus}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-3 sm:p-6">
                    {order.productsBrought?.length > 0 ? (
                      <div className="space-y-3 sm:space-y-4">
                        {order.productsBrought.map((product, productIndex) => (
                          <div key={product.id || productIndex}>
                            <OrderComponent
                              product={product}
                              index={productIndex}
                              orderStatus={order.status || order.orderStatus || "pending"}
                              orderOperations={orderOperations}
                              orderId={order.id}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center text-sm sm:text-base py-6 sm:py-8">No products in this order</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default React.memo(OrdersPage);