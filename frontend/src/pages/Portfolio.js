import React, { useState } from "react";
import projects from "../data/projects";
import { QRCode } from "qrcode.react";

export default function Portfolio() {
  const [filterType, setFilterType] = useState("all");
  const [filterBrand, setFilterBrand] = useState("all");
  const [filterService, setFilterService] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [showPayment, setShowPayment] = useState(false);

  const filteredProjects = projects.filter(
    (p) =>
      (filterType === "all" || p.type === filterType) &&
      (filterBrand === "all" || p.brand === filterBrand) &&
      (filterService === "all" || p.service === filterService)
  );

  const uniqueBrands = ["all", ...new Set(projects.map((p) => p.brand))];
  const uniqueServices = ["all", ...new Set(projects.map((p) => p.service))];

  const nextImage = () => {
    setCurrentImage((prev) =>
      prev + 1 < selectedProject.beforeAfter.length ? prev + 1 : 0
    );
  };

  const prevImage = () => {
    setCurrentImage((prev) =>
      prev - 1 >= 0 ? prev - 1 : selectedProject.beforeAfter.length - 1
    );
  };

  const handleBuyNow = () => {
    // Show the QR code for payment
    setShowPayment(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Portfolio</h1>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4 justify-center">
        <select
          className="px-3 py-2 border rounded"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="car">Car</option>
          <option value="bike">Bike</option>
        </select>

        <select
          className="px-3 py-2 border rounded"
          value={filterBrand}
          onChange={(e) => setFilterBrand(e.target.value)}
        >
          {uniqueBrands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>

        <select
          className="px-3 py-2 border rounded"
          value={filterService}
          onChange={(e) => setFilterService(e.target.value)}
        >
          {uniqueServices.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="border rounded-lg overflow-hidden shadow hover:shadow-lg cursor-pointer"
            onClick={() => {
              setSelectedProject(project);
              setCurrentImage(0);
              setShowPayment(false);
            }}
          >
            <img
              src={project.beforeAfter[0]}
              alt={project.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold text-lg">{project.title}</h3>
              <p className="text-sm text-gray-600">
                {project.brand} | {project.service}
              </p>
              <p className="font-semibold mt-2 text-red-600">
                Price: ₹{project.price}
              </p>
              <button
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
                onClick={handleBuyNow}
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50 overflow-auto">
          <div className="bg-white rounded-lg w-11/12 md:w-3/4 lg:w-1/2 p-6 relative transform transition-transform duration-300 scale-100">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-3 right-3 text-gray-500 text-xl font-bold"
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold mb-2">
              {selectedProject.title}
            </h2>
            <p className="mb-4">{selectedProject.description}</p>

            <h3 className="text-xl font-semibold mb-2">Before / After</h3>
            <div className="relative mb-4">
              <img
                src={selectedProject.beforeAfter[currentImage]}
                alt={`${selectedProject.title} ${currentImage}`}
                className="w-full object-cover rounded"
              />
              {selectedProject.beforeAfter.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full px-2 py-1 font-bold"
                  >
                    &#8592;
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full px-2 py-1 font-bold"
                  >
                    &#8594;
                  </button>
                </>
              )}
            </div>

            <h3 className="text-xl font-semibold mb-2">Client Review</h3>
            <p className="italic mb-4">"{selectedProject.clientReview}"</p>

            {/* Payment QR Code */}
            {showPayment && (
              <div className="flex flex-col items-center mt-4">
                <QRCode
                  value={`upi://pay?pa=example@upi&pn=Demo&am=${selectedProject.price}&cu=INR&tn=Portfolio+Payment`}
                  size={200}
                />
                <p className="mt-2 text-gray-600 text-center">
                  Scan this QR code with any UPI app (PhonePe, GPay, Paytm)
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
