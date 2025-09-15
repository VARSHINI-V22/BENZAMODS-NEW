import React from "react";
import ProductsAdmin from "./ProductsAdmin";
import ServicesAdmin from "./ServicesAdmin";

export default function AdminDashboard() {
  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-100 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Manage Products */}
          <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Manage Products
              </h2>
            </div>
            <div className="p-1">
              <ProductsAdmin />
            </div>
          </div>
          
          {/* Manage Services */}
          <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Manage Services
              </h2>
            </div>
            <div className="p-1">
              <ServicesAdmin />
            </div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-indigo-500 bg-opacity-30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-indigo-100">Total Products</p>
                <p className="text-2xl font-semibold text-white">
                  {JSON.parse(localStorage.getItem('products') || '[]').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-500 bg-opacity-30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-purple-100">Total Services</p>
                <p className="text-2xl font-semibold text-white">
                  {JSON.parse(localStorage.getItem('services') || '[]').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-500 bg-opacity-30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-100">Total Items</p>
                <p className="text-2xl font-semibold text-white">
                  {JSON.parse(localStorage.getItem('products') || '[]').length + 
                   JSON.parse(localStorage.getItem('services') || '[]').length}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>Admin Dashboard • All data is stored locally in your browser</p>
          <p className="mt-1">Clearing browser data will remove all products and services</p>
        </div>
      </div>
    </div>
  );
}