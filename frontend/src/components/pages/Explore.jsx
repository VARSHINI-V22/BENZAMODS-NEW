
import React from "react";

export default function Explore() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-10 text-gray-800">Explore</h1>

      <div className="flex flex-col md:flex-row gap-10 w-full max-w-6xl">
        {/* Car Card */}
        <div
          className="relative cursor-pointer flex-1 rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105 bg-white"
          onClick={() => alert("Explore Cars clicked!")}
        >
          <img
            src="https://img.freepik.com/free-photo/view-3d-car_23-2150796894.jpg?w=360"
            alt="Explore Cars"
            className="w-full h-80 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white p-6">
            <h2 className="text-3xl font-semibold mb-2">Explore Cars</h2>
            <p className="text-lg text-center max-w-xs">
              Discover the latest and greatest cars available.
            </p>
          </div>
        </div>

        {/* Bike Card */}
        <div
          className="relative cursor-pointer flex-1 rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105 bg-white"
          onClick={() => alert("Explore Bikes clicked!")}
        >
          <img
            src="https://i.pinimg.com/236x/b6/9a/ef/b69aef4f7a74a7fe4d23e30626ac6464.jpg"
            alt="Explore Bikes"
            className="w-full h-80 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white p-6">
            <h2 className="text-3xl font-semibold mb-2">Explore Bikes</h2>
            <p className="text-lg text-center max-w-xs">
              Check out the coolest bikes for every adventure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
