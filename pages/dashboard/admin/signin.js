import { useEffect } from "react";
import { useRouter } from "next/router";

function AdminSignin() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to main signin page with admin mode enabled via query parameter
    router.push("/signin?mode=admin");
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600 font-poppins">Redirecting to login...</p>
      </div>
    </div>
  );
}

export default AdminSignin;