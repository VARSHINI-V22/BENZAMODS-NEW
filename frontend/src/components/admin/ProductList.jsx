import React from "react";

export default function ProductList({ products, handleEdit, handleDelete }) {
  return (
    <ul className="space-y-4">
      {products.map((p) => (
        <li key={p._id} className="flex flex-col md:flex-row justify-between items-start md:items-center border p-4 rounded">
          
          {/* Product Info */}
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
            {p.image && (
              <img src={p.image} alt={p.name} className="w-20 h-20 object-cover rounded" />
            )}
            <div>
              <h3 className="font-semibold text-lg">{p.name}</h3>
              <p className="text-gray-600">₹{p.price}</p>
              {p.description && <p className="text-gray-500">{p.description}</p>}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-2 md:mt-0">
            <button
              onClick={() => handleEdit(p)}
              className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(p._id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
