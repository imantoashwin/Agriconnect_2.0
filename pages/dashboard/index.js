import { useEffect } from "react";
import { useRouter } from "next/router";

function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Check if admin is logged in
    const admin = localStorage.getItem("admin");
    
    if (admin) {
      try {
        const adminData = JSON.parse(admin);
        const adminId = adminData.id || adminData.user_id || adminData.uid;
        
        if (adminId) {
          // Redirect to admin profile with ID
          router.push(`/dashboard/admin/profile/${adminId}`);
        } else {
          // If no ID found, redirect to admin signin
          router.push("/signin");
        }
      } catch (error) {
        console.error("Error parsing admin data:", error);
        router.push("/signin");
      }
    } else {
      // No admin logged in, redirect to admin signin
      router.push("/signin");
    }
  }, [router]);

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-3">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-[#2d8659] rounded-full animate-spin"></div>
        <p className="font-poppins text-gray-700">Loading...</p>
      </div>
    </div>
  );
}

export default DashboardRedirect;
