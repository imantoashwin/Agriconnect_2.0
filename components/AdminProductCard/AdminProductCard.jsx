import React from "react";

function AdminProductCard({ productName, productImg }) {
  return (
    <div className="w-full max-w-[280px] bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer">
      <div className="w-full h-[180px] bg-gray-50 flex items-center justify-center">
        <img
          className="max-h-full max-w-full object-contain"
          src={productImg}
          alt={productName || "Product image"}
        />
      </div>
      <div className="p-4">
        <h3 className="text-base font-medium text-gray-900 truncate hover:text-[#2d8659] transition-colors">
          {productName}
        </h3>
        <p className="mt-1 text-xs text-gray-500">Tap to view details</p>
      </div>
    </div>
  );
}

export default AdminProductCard;
