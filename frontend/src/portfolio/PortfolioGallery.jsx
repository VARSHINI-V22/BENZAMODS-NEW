import React from "react";
import { Link } from "react-router-dom";
import portfolioData from "./portfolioData";

const PortfolioGallery = () => {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Portfolio Gallery</h1>
      <div className="grid md:grid-cols-2 gap-8">
        {portfolioData.map((project) => (
          <div key={project.id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{project.title}</h2>
            <p className="text-gray-700">{project.description}</p>
            <Link
              to={`/portfolio/${project.id}`}
              className="mt-2 inline-block text-blue-600 hover:underline"
            >
              View Project
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioGallery;
