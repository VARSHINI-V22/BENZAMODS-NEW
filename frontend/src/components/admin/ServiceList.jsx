import React from "react";

export default function ServiceList({ services, handleEdit, handleDelete }) {
  return (
    <ul className="space-y-4">
      {services.map((s) => (
        <li
          key={s._id}
          className="flex flex-col md:flex-row justify-between items-start md:items-center border p-4 rounded"
        >
          {/* Service Info */}
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
            {s.image && (
              <img
                src={s.image}
                alt={s.name}
                className="w-20 h-20 object-cover rounded"
              />
            )}
            <div>
              <h3 className="font-semibold text-lg">{s.name}</h3>
              <p className="text-gray-600">₹{s.price}</p>
              {s.description && (
                <p className="text-gray-500">{s.description}</p>
              )}
              {s.category && (
                <p className="text-sm text-blue-600">
                  Category: {s.category.toUpperCase()}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-2 md:mt-0">
            <button
              onClick={() => handleEdit(s)}
              className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(s._id)}
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
