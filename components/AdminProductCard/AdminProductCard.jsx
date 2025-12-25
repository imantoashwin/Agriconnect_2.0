import React from "react";

function AdminProductCard({ productName, productImg, stock }) {
  const stockValue = parseFloat(stock) || 0;
  const isLowStock = stockValue > 0 && stockValue <= 10;
  const isOutOfStock = stockValue === 0;

  return (
    <div className="w-full max-w-[280px] bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer">
      <div className="w-full h-[180px] bg-gray-50 flex items-center justify-center relative">
        <img
          className="max-h-full max-w-full object-contain"
          src={productImg}
          alt={productName || "Product image"}
        />
        {isOutOfStock && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
            Out of Stock
          </div>
        )}
        {isLowStock && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded">
            Low Stock
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-base font-medium text-gray-900 truncate hover:text-[#2d8659] transition-colors">
          {productName}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-gray-500">Stock:</p>
          <p className={`text-sm font-semibold ${
            isOutOfStock ? 'text-red-600' : 
            isLowStock ? 'text-orange-600' : 
            'text-green-600'
          }`}>
            {stockValue} units
          </p>
        </div>
        <p className="mt-1 text-xs text-gray-500">Tap to view details</p>
      </div>
    </div>
  );
}

export default AdminProductCard;
