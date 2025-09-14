import React from "react";
import ProductsAdmin from "./ProductsAdmin";
import ServicesAdmin from "./ServicesAdmin";

export default function AdminDashboard() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Manage Products */}
        <div className="bg-black shadow rounded p-4">
          <h2 className="text-xl font-semibold mb-4">Manage Products</h2>
          <ProductsAdmin />
        </div>
        {/* Manage Services */}
        <div className="bg-black shadow rounded p-4">
          <h2 className="text-xl font-semibold mb-4">Manage Services</h2>
          <ServicesAdmin />
        </div>
      </div>
    </div>
  );
}