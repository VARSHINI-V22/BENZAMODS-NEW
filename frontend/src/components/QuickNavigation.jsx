import React, { useEffect, useState } from "react";
import QuickNavCard from "./QuickNavCard";
import { Link } from "react-router-dom";
import { Car, Bike, Package } from "lucide-react";

const icons = {
  Cars: <Car className="w-10 h-10 text-red-500" />,
  Bikes: <Bike className="w-10 h-10 text-blue-500" />,
  Accessories: <Package className="w-10 h-10 text-green-500" />,
};

export default function QuickNavigation() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/categories")
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  return (
    <section className="py-16 bg-gray-100" id="categories">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10">
          Shop by <span className="text-red-500">Category</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map(cat => (
            <Link to={`/category/${cat._id}`} key={cat._id}>
              <QuickNavCard
                category={{
                  title: cat.name,
                  img: cat.image,
                  icon: icons[cat.name], // attach matching icon
                }}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
