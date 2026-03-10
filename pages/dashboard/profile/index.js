import React from "react";
import DashBoardNavBar from "../../../components/DashBoardNavBar/DashBoardNavBar";
import DashBoardSidebar from "../../../components/DashBoardSidebar/DashBoardSidebar";
import ProfileComponent from "../../../components/Profile/ProfileComponent.";
import { useSelector } from "react-redux";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useRouter } from "next/router";

function Profile() {
  const router = useRouter();
  const admin = useSelector((state) => state.admin)?.admin;
  const isLoggedIn = useSelector((state) => state.admin)?.isLoggedIn;
  const [productsSold, setProductsSold] = useState([]);
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

  const getProductsAndFilterNames = async () => {
    const res = await axios.get(
      `http://localhost:3000/api/admin/products/${admin.id}`
    );
    const names = res.data.map((product) => product.name);
    const productSoldNames = Array.from(new Set(names));
    setProductsSold(productSoldNames);
  };

  useEffect(() => {
    if (admin?.id) {
      getProductsAndFilterNames();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admin]);

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

  return (
    <div>
      {" "}
      <div className="w-full h-full">
        <DashBoardNavBar />
        <div className="flex">
          <div className="w-full h-full">
            <DashBoardSidebar>
              <ProfileComponent admin={admin} productsSold={productsSold} />
            </DashBoardSidebar>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
