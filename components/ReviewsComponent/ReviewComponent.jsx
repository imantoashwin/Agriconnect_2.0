import React, { useEffect, useState } from "react";
import ReactStars from "react-stars";

function ReviewComponent() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/reviews");
        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        } else {
          console.error("Failed to fetch reviews");
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

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
    <div className="w-full h-full px-20">
      <div>
        <p className="font-poppins text-3xl font-semibold text-gray-900 mb-6">Customer Reviews</p>
        {reviews.length === 0 ? (
          <div className="mt-8 text-center">
            <p className="font-poppins text-sm text-gray-500">No reviews yet</p>
          </div>
        ) : (
          reviews.map((reviewer) => (
            <div
              className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0"
              key={reviewer.id}
            >
              <div className="flex-1">
                <p className="font-poppins text-sm font-medium text-gray-900">{reviewer.name}</p>
                <p className="font-poppins text-xs text-gray-500 mt-1">{reviewer.productName}</p>
              </div>
              <div className="flex-shrink-0">
                <ReactStars count={5} value={reviewer.stars} edit={false} size={24} color2={"#fbbf24"} color1={"#e5e7eb"} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ReviewComponent;
