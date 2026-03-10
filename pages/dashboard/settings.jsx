import React, { useEffect, useState } from "react";
import DashBoardNavBar from "../../components/DashBoardNavBar/DashBoardNavBar";
import DashBoardSidebar from "../../components/DashBoardSidebar/DashBoardSidebar";
import Settings from "../../components/Settings/Settings";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const SettingsPage = () => {
  const router = useRouter();
  const isLoggedIn = useSelector((state) => state.admin)?.isLoggedIn;
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
      <DashBoardNavBar />
      <DashBoardSidebar>
        <Settings />
      </DashBoardSidebar>
    </div>
  );
};

export default SettingsPage;
