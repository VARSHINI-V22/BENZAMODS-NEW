// src/components/admin/ServicesAdmin.jsx
import React, { useEffect, useState, useCallback } from "react";
import { API_BASE_URL } from '../../config';

// Add a fallback value in case config is undefined
const API_URL = API_BASE_URL || 'http://localhost:5000';

// Debug logging - remove this in production
console.log('API_BASE_URL from config:', API_BASE_URL);
console.log('API_URL with fallback:', API_URL);

// Add this function to handle image sources
const getImageSource = (image) => {
  if (!image) return null;
  
  // If it's already a complete data URL, use it as is
  if (image.startsWith('data:')) {
    return image;
  }
  
  // If it's just the base64 part without the prefix
  if (image.match(/^[A-Za-z0-9+/]+={0,2}$/)) {
    return `data:image/jpeg;base64,${image}`;
  }
  
  // Otherwise, treat it as a regular URL
  return image;
};

export default function ServicesAdmin() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "car",
    price: "",
    description: "",
    image: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Use useCallback to prevent recreation of the function on every render
  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const url = `${API_URL}/api/services`;
      console.log('Fetching services from:', url);
      const res = await fetch(url);
      console.log('Response status:', res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('Services data:', data);
      setServices(data);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError(err.message);
      alert(`Failed to fetch services. Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]); // Only recreate if API_URL changes
  
  // Only run once on component mount
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);
  
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const url = editingId 
        ? `${API_URL}/api/services/${editingId}`
        : `${API_URL}/api/services`;
        
      const method = editingId ? 'PUT' : 'POST';
      
      console.log('Submitting to:', url);
      console.log('Method:', method);
      console.log('Form data:', form);
      
      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(form)
      });
      
      console.log('Response status:', res.status);
      console.log('Response headers:', res.headers);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Error response text:', errorText);
        
        // Try to parse error response as JSON
        let errorMessage = `HTTP error! status: ${res.status}`;
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.message) {
            errorMessage = errorJson.message;
          }
          if (errorJson.errors) {
            errorMessage = errorJson.errors.map(e => e.msg).join(', ');
          }
        } catch (e) {
          // If parsing fails, use the raw error text
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }
      
      const data = await res.json();
      console.log('Response data:', data);
      
      if (editingId) {
        setServices(services.map(s => (s._id === editingId ? data : s)));
        setEditingId(null);
      } else {
        setServices([...services, data]);
      }
      
      setForm({ name: "", category: "car", price: "", description: "", image: "" });
      
      // Show success message
      alert(editingId ? "Service updated successfully!" : "Service added successfully!");
    } catch (err) {
      console.error('Error saving service:', err);
      setError(err.message);
      alert(`Failed to save service. Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const url = `${API_URL}/api/services/${id}`;
      console.log('Deleting service at:', url);
      
      const res = await fetch(url, { 
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      });
      
      console.log('Response status:', res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      setServices(services.filter(s => s._id !== id));
      alert("Service deleted successfully!");
    } catch (err) {
      console.error('Error deleting service:', err);
      setError(err.message);
      alert(`Failed to delete service. Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEdit = (service) => {
    setForm({
      name: service.name,
      category: service.category,
      price: service.price,
      description: service.description,
      image: service.image
    });
    setEditingId(service._id);
  };

  // Reset form when canceling edit
  const handleCancelEdit = () => {
    setForm({ name: "", category: "car", price: "", description: "", image: "" });
    setEditingId(null);
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 font-sans">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
          Services Admin Dashboard
        </h1>
        <button 
          onClick={fetchServices}
          disabled={isLoading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </header>
      
      {/* Error Display */}
      {error && (
        <div className="bg-red-900 text-white p-4 rounded-lg mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold mb-2">Error</h3>
              <p className="whitespace-pre-wrap">{error}</p>
            </div>
            <button 
              onClick={() => setError(null)}
              className="text-white hover:text-gray-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <button 
            onClick={fetchServices}
            className="mt-3 bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      )}
      
      <div className="bg-gray-800 rounded-xl shadow-2xl p-6 mb-8 border border-gray-700">
        <h3 className="text-xl font-semibold mb-4 text-white">
          {editingId ? "Edit Service" : "Add New Service"}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Service Name</label>
              <input 
                name="name" 
                placeholder="Enter service name" 
                value={form.name} 
                onChange={handleChange} 
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition" 
                required 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
              <select 
                name="category" 
                value={form.category} 
                onChange={handleChange} 
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              >
                <option value="car">Car</option>
                <option value="bike">Bike</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Price (₹)</label>
              <input 
                name="price" 
                placeholder="Enter price" 
                type="number" 
                value={form.price} 
                onChange={handleChange} 
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition" 
                required 
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <input 
                name="description" 
                placeholder="Enter service description" 
                value={form.description} 
                onChange={handleChange} 
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition" 
                required 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Image URL</label>
              <input 
                name="image" 
                placeholder="Enter image URL" 
                value={form.image} 
                onChange={handleChange} 
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition" 
                required 
              />
            </div>
            
            <div className="flex gap-2">
              <button 
                type="submit" 
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : (editingId ? "Update Service" : "Add Service")}
              </button>
              
              {editingId && (
                <button 
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={isLoading}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 disabled:opacity-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(s => (
            <div key={s._id} className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 transform transition-transform duration-300 hover:scale-105">
              <div className="relative">
                {/* Updated image tag with the new function and error handling */}
                <img 
                  src={getImageSource(s.image)} 
                  alt={s.name} 
                  className="h-48 w-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null; 
                    // Use a local SVG instead of external URL
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMzAwIDIwMCI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNlZWVlZWUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzk5OSI+SW1hZ2UgTm90IEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';
                  }}
                />
                <span className="absolute top-3 right-3 bg-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded">
                  {s.category}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-2">{s.name}</h3>
                <p className="text-gray-400 mb-3 text-sm">{s.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-xl font-bold text-indigo-400">₹{s.price}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(s)} 
                    disabled={isLoading}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(s._id)} 
                    disabled={isLoading}
                    className="flex-1 bg-red-700 hover:bg-red-600 text-white py-2 px-3 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {services.length === 0 && !isLoading && !error && (
        <div className="text-center py-12 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <p className="text-xl">No services found</p>
          <p className="mt-2">Add your first service using the form above</p>
        </div>
      )}
    </div>
  );
}