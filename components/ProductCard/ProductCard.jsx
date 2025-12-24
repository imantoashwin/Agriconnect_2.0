// ProductCard.jsx - Adds to both Redux (immediate UI) and Firebase (persistence)

import React, { useEffect, useState } from "react";
import Image from "next/image";
import ReactStars from "react-stars";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/cartSlice";
import { toast } from "react-toastify";
import { auth, db } from "../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

function ProductCard({
  pids,
  productName,
  product,
  imageUrl,
  location,
  price,
  weight,
}) {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user);

  // ⭐ Rating state
  const [avgRating, setAvgRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);

  // ✅ Fetch ratings whenever product changes
  useEffect(() => {
    if (!pids) return;

    const q = query(collection(db, "orders"), where("productId", "==", pids));
    const unsubscribe = onSnapshot(q, (snap) => {
      let sum = 0,
        count = 0;
      snap.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.rating) {
          sum += data.rating;
          count++;
        }
      });
      setAvgRating(count > 0 ? sum / count : 0);
      setRatingCount(count);
    });

    return () => unsubscribe();
  }, [pids]);

  // ⭐ Rating Handler
  const rateProduct = async () => {
    const rating = parseInt(prompt("Rate this product (1-5):"), 10);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      return toast.error("Please enter a number between 1 and 5.", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });
    }

    if (!auth.currentUser) {
      return toast.error("Please log in to rate.", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });
    }

    try {
      const q = query(
        collection(db, "orders"),
        where("userId", "==", auth.currentUser.uid),
        where("productId", "==", pids)
      );
      const snap = await getDocs(q);

      if (snap.empty) {
        return toast.error("You can only rate products you purchased.", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
        });
      }

      const orderRef = doc(db, "orders", snap.docs[0].id);
      const orderData = snap.docs[0].data();

      if (orderData.rating !== undefined) {
        return toast.info("You already rated this order.", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
        });
      }

      await updateDoc(orderRef, {
        rating: rating,
      });

      toast.success("Thanks for rating!", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
      });
    } catch (err) {
      console.error("Rating error:", err);
      toast.error("Something went wrong while rating.", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });
    }
  };

  // 🛒 Check if product already exists in Firebase cart
  const checkIfInCart = async (userId, productId) => {
    try {
      const cartQuery = query(
        collection(db, "carts"),
        where("userId", "==", userId),
        where("id", "==", productId)
      );
      
      const querySnapshot = await getDocs(cartQuery);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking cart:', error);
      return false;
    }
  };

  // 🛒 Add to Firebase Cart (matching Cart.js structure - separate documents)
  const addToFirebaseCart = async (userId, product) => {
    try {
      // Create separate document for each cart item
      await addDoc(collection(db, "carts"), {
        userId: userId,
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
        weight: product.weight,
        location: product.location,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const onAddProducts = async () => {
    // Check if user is logged in
    if (!user.isLoggedIn) {
      toast.error("Please login to add items to cart!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });
      return;
    }

    try {
      // 🔍 First check if product already exists in Redux cart (immediate check)
      const itemInReduxCart = cart.find((item) => item.id === pids);
      if (itemInReduxCart) {
        toast.info("Product already in cart! Use cart page to update quantity.", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
        });
        return;
      }

      const userId = user.user?.id || user.user?.uid || user.id || user.uid;
      
      if (!userId) {
        console.error("❌ User ID not found:", user);
        toast.error("User information not available. Please login again.", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
        });
        return;
      }

      // 🔍 Check if product already in Firebase cart
      const alreadyInFirebaseCart = await checkIfInCart(userId, pids);
      
      if (alreadyInFirebaseCart) {
        toast.info("Product already added to cart!", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
        });
        return;
      }

      // Prepare product object
      const productToAdd = {
        id: pids,
        name: productName,
        price: price,
        weight: weight,
        image: imageUrl,
        location: location,
        quantity: 1
      };

      // Add to Redux store first (immediate UI update)
      dispatch(addToCart(productToAdd));

      // Then add to Firebase (persistence) - only if user is logged in
      if (userId) {
        try {
          await addToFirebaseCart(userId, productToAdd);
        } catch (firebaseError) {
          console.error("⚠️ Firebase cart update failed, but item added to local cart:", firebaseError);
          // Don't fail the entire operation if Firebase fails - Redux cart still works
        }
      }

      toast.success("Added to cart successfully!", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
      });

      console.log("✅ Product added to cart:", productToAdd);

    } catch (error) {
      console.error("❌ Error adding to cart:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        user: user,
        pids: pids
      });
      
      toast.error("Failed to add to cart. Please try again!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });
    }
  };

  return (
    <div
      className="w-full max-w-[280px] bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 sm_max:mb-8"
      key={pids}
    >
      <div className="w-full h-[200px] relative overflow-hidden bg-gray-50 flex items-center justify-center">
        <Image
          src={imageUrl}
          alt={productName}
          className="object-contain"
          fill
          sizes="(max-width: 768px) 100vw, 280px"
        />
      </div>
      <div className="p-4">
        <div className="mb-3">
          <Link href={`/product/${pids}`} passHref>
            <h3 className="font-semibold text-lg text-gray-900 cursor-pointer hover:text-[#2d8659] transition-colors mb-1">
              {productName}
            </h3>
          </Link>
        </div>

        {/* ⭐ Reviews Section */}
        <div className="flex items-center mb-3">
          <ReactStars
            count={5}
            value={avgRating}
            size={18}
            edit={false}
            color2={"#fbbf24"}
          />
          <p className="ml-2 text-xs text-gray-600">
            ({ratingCount})
          </p>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xl font-bold text-gray-900">₹{price}</p>
            <p className="text-xs text-gray-500">{weight}</p>
          </div>
        </div>

        {/* 🛒 Add to Cart Button */}
        <button
          className="w-full py-2.5 px-4 rounded-md bg-[#2d8659] hover:bg-[#246548] text-white font-medium text-sm transition-colors duration-200 flex items-center justify-center gap-2"
          onClick={onAddProducts}
        >
          <Image
            src="/Images/Icons/shopping-cart.png"
            width={16}
            height={16}
            alt="shopping cart"
          />
          <span>Add to cart</span>
        </button>
      </div>
    </div>
  );
}

export default ProductCard;