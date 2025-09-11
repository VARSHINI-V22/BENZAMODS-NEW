import React from "react";
import { useNavigate } from "react-router-dom";

export default function Explore() {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-6 relative"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1536240478700-b869070f9279?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1540&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay for better text visibility */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      
      <h1 className="text-4xl font-bold mb-10 text-white z-10">Explore</h1>

      <div className="flex flex-col md:flex-row gap-10 w-full max-w-6xl z-10">
        {/* Car Card */}
        <div
          className="relative cursor-pointer flex-1 rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105 bg-gray-800"
          onClick={() => navigate("/explore/cars")}
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
          className="relative cursor-pointer flex-1 rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105 bg-gray-800"
          onClick={() => navigate("/explore/bikes")}
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