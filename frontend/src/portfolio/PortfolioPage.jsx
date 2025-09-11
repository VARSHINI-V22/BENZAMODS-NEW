import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import portfolioData from "./portfolioData";

const PortfolioPage = () => {
  const { id } = useParams();
  const project = portfolioData.find((p) => p.id === parseInt(id));
  const [selectedImage, setSelectedImage] = useState(
    project.beforeAfter[0]
  );

  if (!project) return <p>Project not found</p>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
      <p className="mb-4">{project.description}</p>

      {/* Before/After Gallery */}
      <div>
        <img
          src={selectedImage}
          alt="Project"
          className="w-full h-96 object-cover rounded-lg mb-4"
        />
        <div className="flex space-x-4">
          {project.beforeAfter.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Thumbnail ${idx}`}
              className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                selectedImage === img ? "border-blue-600" : "border-gray-200"
              }`}
              onClick={() => setSelectedImage(img)}
            />
          ))}
        </div>
      </div>

      {/* Client Review */}
      <div className="mt-6 p-4 bg-gray-100 rounded">
        <strong>Client Review:</strong>
        <p>{project.clientReview}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6">
        <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Add to Cart
        </button>
        <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
          Buy Now
        </button>
        <button className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300">
          Wishlist
        </button>
      </div>

      <Link to="/portfolio" className="mt-6 inline-block text-blue-600 hover:underline">
        Back to Portfolio
      </Link>
    </div>
  );
};

export default PortfolioPage;
