// Updated success.js - Handles order creation after successful Stripe payment (NO WEBHOOK)
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BsBagCheckFill } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../components/Navbar/Navbar";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { resetCart } from "../redux/cartSlice";
import { db } from "../firebase";
import { 
  collection, 
  addDoc, 
  serverTimestamp,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc
} from "firebase/firestore";

const Success = () => {
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const [orderProcessed, setOrderProcessed] = useState(false);
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    // Process the order when component mounts
    processSuccessfulStripeOrder();

    // Clear cart and redirect after delay
    setTimeout(() => {
      router.push("/orders");
    }, 8000);
  }, []);

  // Process order after successful Stripe payment
  const processSuccessfulStripeOrder = async () => {
    if (orderProcessed) return; // Prevent duplicate processing

    try {
      // Get pending order from sessionStorage
      const pendingOrderData = sessionStorage.getItem('pendingStripeOrder');
      
      if (!pendingOrderData) {
        console.log('No pending order found - user may have paid directly');
        setProcessing(false);
        return;
      }

      const { cart: orderCart, userId, userEmail, totalAmount, timestamp } = JSON.parse(pendingOrderData);
      
      if (!orderCart || orderCart.length === 0) {
        console.log('No cart items in pending order');
        setProcessing(false);
        return;
      }

      console.log('Processing Stripe order for user:', userId);
      setOrderProcessed(true);

      const orderPromises = [];
      const stockUpdatePromises = [];

      // Create Firebase orders for each cart item
      for (const item of orderCart) {
        // Fetch current product data to get accurate info
        let productData = {};
        try {
          const productQuery = query(
            collection(db, "products"),
            where("productId", "==", item.id)
          );
          const productSnapshot = await getDocs(productQuery);
          
          if (!productSnapshot.empty) {
            productData = productSnapshot.docs[0].data();
          }
        } catch (error) {
          console.log('Could not fetch product data for:', item.id);
        }

        const orderData = {
          userId: userId,
          productId: item.id,
          productName: productData.productName || item.name,
          productRate: productData.productRate || item.price,
          productWeight: productData.productWeight || item.weight || "/kg",
          productType: productData.productType || "fruit",
          productDescription: productData.productDescription || "fresh and straight from farm",
          productStock: productData.productStock || 25, // Current stock at time of order
          quantity: item.quantity,
          totalPrice: item.price * item.quantity,
          image: item.image,
          location: item.location || productData.location || "Farm location",
          orderStatus: "confirmed", // Stripe payment successful
          paymentStatus: "completed",
          paymentMethod: "stripe",
          stripePayment: true,
          purchasedAt: serverTimestamp(),
          deliveryAddress: user.user?.address || user.address || "Address not provided"
        };

        // Add to order creation promises
        orderPromises.push(addDoc(collection(db, "orders"), orderData));
        
        // Add to stock update promises
        stockUpdatePromises.push(updateProductStock(item.id, item.quantity));
      }

      // Execute all order creations and stock updates
      const [orderRefs] = await Promise.all([
        Promise.all(orderPromises),
        Promise.all(stockUpdatePromises)
      ]);

      // Clear user's cart from Firebase
      await clearUserCart(userId);

      // Clear Redux cart
      dispatch(resetCart());

      // Clean up sessionStorage
      sessionStorage.removeItem('pendingStripeOrder');

      console.log('Stripe orders created successfully:', orderRefs.map(ref => ref.id));
      toast.success(`Payment successful! ${orderRefs.length} orders created.`);
      
      setProcessing(false);
      
    } catch (error) {
      console.error('Error processing successful payment:', error);
      toast.error("Payment successful but order creation failed. Please contact support.");
      setProcessing(false);
    }
  };

  // Helper function to update product stock
  const updateProductStock = async (productId, orderedQuantity) => {
    try {
      const productQuery = query(
        collection(db, "products"),
        where("productId", "==", productId)
      );
      
      const productSnapshot = await getDocs(productQuery);
      
      if (!productSnapshot.empty) {
        const productDoc = productSnapshot.docs[0];
        const currentStock = productDoc.data().productStock;
        const newStock = Math.max(0, currentStock - orderedQuantity); // Ensure stock doesn't go below 0
        
        await updateDoc(productDoc.ref, {
          productStock: newStock,
          updatedAt: serverTimestamp()
        });
        
        console.log(`Stock updated for ${productId}: ${currentStock} -> ${newStock}`);
      }
    } catch (error) {
      console.error("Error updating product stock:", error);
    }
  };

  // Helper function to clear user's cart
  const clearUserCart = async (userId) => {
    try {
      const cartQuery = query(
        collection(db, "carts"),
        where("userId", "==", userId)
      );
      
      const querySnapshot = await getDocs(cartQuery);
      const deletePromises = querySnapshot.docs.map(docSnapshot => 
        deleteDoc(docSnapshot.ref)
      );
      
      await Promise.all(deletePromises);
      console.log('Cart cleared for user:', userId);
    } catch (error) {
      console.error("Error clearing user cart:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-sm p-6 text-center">
          <div className="flex items-center justify-center">
            <div className="text-green-600 text-4xl">
              <BsBagCheckFill />
            </div>
          </div>

          {processing ? (
            <>
              <h2 className="mt-3 text-lg font-semibold text-gray-900">Processing your order…</h2>
              <p className="mt-1 text-sm text-gray-600">This will take just a moment.</p>
              <div className="flex items-center justify-center mt-4">
                <div className="w-6 h-6 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
              </div>
            </>
          ) : (
            <>
              <h2 className="mt-3 text-lg font-semibold text-gray-900">Thank you for your order</h2>
              <p className="mt-1 text-sm text-gray-600">Your payment was successful. A receipt has been emailed.</p>
            </>
          )}

          <div className="mt-6 text-sm text-gray-600">
            <span>Need help?</span>
            <a className="ml-2 text-gray-900 hover:underline" href="mailto:order@agriconnect.com">order@agriconnect.com</a>
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <Link href="/orders">
              <button type="button" className="px-4 py-2 rounded-md bg-gray-900 text-white hover:bg-gray-700 text-sm font-medium">View orders</button>
            </Link>
            <Link href="/products">
              <button type="button" className="px-4 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-900 hover:bg-gray-100">Continue shopping</button>
            </Link>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default Success;