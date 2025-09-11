import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function CarsPage() {
  const { categoryId } = useParams();
  const [mods, setMods] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/modifications/${categoryId}`)
      .then(res => res.json())
      .then(data => setMods(data));
  }, [categoryId]);

  return (
    <div className="p-10 text-center">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        All Car Modifications
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mods.map(mod => (
          <Link
            key={mod._id}
            to={`/modification/${mod._id}`}
            className="p-4 bg-white rounded-2xl shadow hover:shadow-lg transition"
          >
            <img
              src={mod.image}
              alt={mod.name}
              className="rounded-lg mb-4 w-full h-48 object-cover"
            />
            <h2 className="text-xl font-semibold">{mod.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
