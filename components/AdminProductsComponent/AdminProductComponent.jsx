import React, { useEffect, useState } from "react";
import AdminProductCard from "../AdminProductCard/AdminProductCard";
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, getDocs, setDoc, getDoc, deleteDoc, doc } from 'firebase/firestore';
import Link from "next/link";
import { db,auth } from "../../firebase";
// const firebaseConfig = {
//   apiKey: "AIzaSyB0mvAaGlZl9_-TPHLe_Cgkofhlvj64rdc",
//   authDomain: "agriconnect-3c327.firebaseapp.com",
//   projectId: "agriconnect-3c327",
//   storageBucket: "agriconnect-3c327.appspot.com",
//   messagingSenderId: "522663366346",
//   appId: "1:522663366346:web:812340ea9450a74150ae33",
//   measurementId: "G-DB1CY1X8JP"
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);



function AdminProductComponent() {
  const [currentUser, setCurrentUser] = useState(null);
  const [farmerName, setFarmerName] = useState("");
  const [ownerProducts, setOwnerProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getProducts = async () => {
    if (!currentUser) {
      console.log("No current user found");
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "products"));
      const filteredData = [];
      
      querySnapshot.forEach((docSnap) => {
        const product = docSnap.data();
        const stock = parseFloat(
          product.productStock ?? product.stock ?? product.quantity ?? 0
        );

        if (product.farmerId === currentUser.uid) {
          // Map Firebase data to match your existing structure
          filteredData.push({
            id: product.productId,
            name: product.productName,
            image: product.image,
            productOwnerName: product.farmerName,
            stock,
          });
        }
      });
      
      setOwnerProducts(filteredData);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.log("No user found, should redirect to login");
        setLoading(false);
        return;
      }
      
      setCurrentUser(user);
      
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFarmerName(docSnap.data().name);
        }
      } catch (error) {
        console.error("Error in auth state change:", error);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentUser) {
      getProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  return (
    <div className="w-full h-full px-8">
      {loading && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-3">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-[#2d8659] rounded-full animate-spin"></div>
            <p className="font-poppins text-gray-700">Loading...</p>
          </div>
        </div>
      )}
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Your Products</h1>

        {ownerProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ownerProducts.map((product, index) => (
              <Link key={index} href={`/dashboard/admin/product/${product.id}`}>
                <AdminProductCard
                  key={index}
                  productName={product.name}
                  productImg={product.image}
                  stock={product.stock}
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-10 text-center">
            <p className="text-gray-600">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminProductComponent;