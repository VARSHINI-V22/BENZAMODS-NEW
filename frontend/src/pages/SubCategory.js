import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { categories } from "../data/categoryData";

export default function SubCategory() {
  const { type } = useParams();
  const navigate = useNavigate();
  const data = categories[type];

  if (!data) return <p className="p-6 text-xl">No categories found for {type}</p>;

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">{type.toUpperCase()}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.map(cat => (
          <div
            key={cat.id}
            className="bg-white rounded shadow-lg cursor-pointer hover:scale-105 transform transition overflow-hidden"
            onClick={() => navigate(`/explore/${type}/${cat.id}`)}
          >
            <img src={cat.image} alt={cat.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{cat.title}</h2>
              <p className="text-gray-600">{cat.description.substring(0, 50)}...</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
