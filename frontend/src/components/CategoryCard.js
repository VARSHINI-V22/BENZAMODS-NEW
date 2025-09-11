// src/components/CategoryCard.js
import React from "react";
import { useNavigate } from "react-router-dom";

export default function CategoryCard({ type, category }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/explore/${type}/${category.id}`);
  };

  return (
    <div
      className="relative cursor-pointer rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105 bg-white"
      onClick={handleClick}
    >
      <img
        src={category.images[0]}
        alt={category.title}
        className="w-full h-60 object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white p-4">
        <h2 className="text-2xl font-semibold mb-1">{category.title}</h2>
        <p className="text-center text-sm">{category.description}</p>
      </div>
    </div>
  );
}
