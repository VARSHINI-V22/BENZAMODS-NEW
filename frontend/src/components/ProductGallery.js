import React, { useState } from "react";
import { useParams } from "react-router-dom";

const ProductGallery = () => {
  const { id } = useParams(); // Product ID from route

  // Dummy product data (replace with API call later)
  const product = {
    id: id,
    title: "Sporty Alloy Wheel Set",
    description:
      "Upgrade your car’s look and performance with this lightweight alloy wheel set. Precision engineered for a sleek, sporty finish and enhanced handling.",
    price: 14999,
    vehicleCompatibility: ["Honda Civic", "Toyota Corolla", "Hyundai Elantra"],
    images: [
      "/images/wheel1.jpg",
      "/images/wheel2.jpg",
      "/images/wheel3.jpg",
    ],
  };

  const [selectedImage, setSelectedImage] = useState(product.images[0]);

  const handleAddToCart = () => {
    alert("Added to cart!");
  };

  const handleBuyNow = () => {
    alert("Redirecting to checkout!");
  };

  const handleWishlist = () => {
    alert("Added to wishlist!");
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 md:px-12">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <img
            src={selectedImage}
            alt={product.title}
            className="w-full h-96 object-cover rounded-lg shadow-md"
          />
          <div className="flex mt-4 space-x-4">
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${
                  selectedImage === img ? "border-blue-600" : "border-gray-200"
                }`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <p className="text-xl font-semibold mb-4">₹{product.price}</p>

          {/* Vehicle Compatibility */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Compatible Vehicles:</h3>
            <ul className="list-disc list-inside text-gray-700">
              {product.vehicleCompatibility.map((v, idx) => (
                <li key={idx}>{v}</li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-6">
            <button
              onClick={handleAddToCart}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
            >
              Buy Now
            </button>
            <button
              onClick={handleWishlist}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition"
            >
              Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductGallery;
