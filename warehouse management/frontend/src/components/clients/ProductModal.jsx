import React from "react";

const ProductModal = ({ client, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="text-xl font-bold mb-4">Products of {client.name}</h2>
        {client.products && client.products.length > 0 ? (
          <ul>
            {client.products.map((product, idx) => (
              <li key={idx} className="mb-2">
                {product.name} - {product.quantity}
              </li>
            ))}
          </ul>
        ) : (
          <p>No products available</p>
        )}
        <button
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ProductModal;
