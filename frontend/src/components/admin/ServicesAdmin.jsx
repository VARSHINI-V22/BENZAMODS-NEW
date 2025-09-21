import React, { useState, useEffect } from "react";

// Helper function to handle image sources
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

// Helper functions for localStorage operations
const getStoredServices = () => {
  const stored = localStorage.getItem('services');
  return stored ? JSON.parse(stored) : null;
};

const saveServices = (services) => {
  localStorage.setItem('services', JSON.stringify(services));
};

// Initial services data
const initialServices = [
  { _id: "s1", name: "Engine Tuning", description: "Professional engine tuning for optimal performance.", price: 12000, image: "https://tse4.mm.bing.net/th/id/OIP.XTDzDOraZgU5F63PW52rhQHaE8?pid=Api&P=0&h=220" },
    { _id: "s2", name: "Body Wrap Installation", description: "Premium body wrap installation with custom designs.", price: 25000, image: "https://i.ytimg.com/vi/bR4u4S6sH64/maxresdefault.jpg" },
    { _id: "s3", name: "Interior Customization", description: "Complete interior customization with premium materials.", price: 40000, image: "https://tse2.mm.bing.net/th/id/OIP.x4difOvxWCNlNdagoWsbLgHaEO?pid=Api&P=0&h=220" },
    { _id: "s4", name: "Wheel Alignment", description: "Precision wheel alignment for optimal handling and tire longevity.", price: 2500, image: "https://tse3.mm.bing.net/th/id/OIP.9NBI-4qmd0HhRMivYUUcOAHaFj?pid=Api&P=0&h=220" },
    { _id: "s5", name: "Car Wash & Detailing", description: "Complete interior and exterior detailing for a showroom finish.", price: 3500, image: "https://tse3.mm.bing.net/th/id/OIP.yVaOY54uohC12gwQXSR4ygHaEK?pid=Api&P=0&h=220" },
    { _id: "s6", name: "Paint Protection Film", description: "Invisible paint protection film to preserve your car's finish.", price: 18000, image: "https://tse3.mm.bing.net/th/id/OIP.M8k9NSGf2a8mlMuUc30VHgHaE7?pid=Api&P=0&h=220" },
    { _id: "s7", name: "Window Tinting", description: "Premium window tinting for privacy and UV protection.", price: 7500, image: "https://tse3.mm.bing.net/th/id/OIP.PdznukrEVKu2nvngXFC0hgHaHa?pid=Api&P=0&h=220" },
    { _id: "s8", name: "Tire Replacement", description: "Professional tire replacement with premium brands.", price: 12000, image: "https://tse3.mm.bing.net/th/id/OIP.aEVoNVK7wzp-9EFd-kRZcAHaEo?pid=Api&P=0&h=220" },
    { _id: "s9", name: "Battery Replacement", description: "Quick and reliable battery replacement service.", price: 5500, image: "https://tse1.mm.bing.net/th/id/OIP.KtO4Dq7chvlU418aBZ0LjwHaEK?pid=Api&P=0&h=220" },
    { _id: "s10", name: "AC Service", description: "Complete air conditioning service for optimal cooling performance.", price: 4500, image: "https://tse1.mm.bing.net/th/id/OIP.hh9Fgy01NNOzIn397Y-xAgHaEo?pid=Api&P=0&h=220" }
];

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
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  
  // Load services from localStorage on component mount, or use initial data if empty
  useEffect(() => {
    const storedServices = getStoredServices();
    if (storedServices && storedServices.length > 0) {
      setServices(storedServices);
    } else {
      setServices(initialServices);
      saveServices(initialServices);
    }
  }, []);
  
  // Show notification and auto-hide after 3 seconds
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };
  
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing service
      const updatedServices = services.map(s => 
        s._id === editingId ? { ...form, _id: editingId } : s
      );
      setServices(updatedServices);
      saveServices(updatedServices);
      setEditingId(null);
      showNotification("Service updated successfully!");
    } else {
      // Add new service
      const newService = { ...form, _id: Date.now().toString() };
      const newServices = [...services, newService];
      setServices(newServices);
      saveServices(newServices);
      showNotification("Service added successfully!");
    }
    
    // Reset form
    setForm({ name: "", category: "car", price: "", description: "", image: "" });
  };
  
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    
    const newServices = services.filter(s => s._id !== id);
    setServices(newServices);
    saveServices(newServices);
    showNotification("Service deleted successfully!");
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
  
  const handleCancelEdit = () => {
    setForm({ name: "", category: "car", price: "", description: "", image: "" });
    setEditingId(null);
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
          Services Admin Dashboard
        </h1>
      </header>
      
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 ${
          notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        } text-white`}>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {notification.message}
          </div>
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
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                {editingId ? "Update Service" : "Add Service"}
              </button>
              
              {editingId && (
                <button 
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(s => (
          <div key={s._id} className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 transform transition-transform duration-300 hover:scale-105">
            <div className="relative">
              <img 
                src={getImageSource(s.image)} 
                alt={s.name} 
                className="h-48 w-full object-cover"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMzAwIDIwMCI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNlZWVlZWUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzk5OSI+SW1hZ2UgTm90IEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';
                }}
              />
              <div className="absolute top-3 right-3 flex gap-2">
                <span className="text-xs font-semibold px-2 py-1 rounded bg-green-600 text-white">
                  {s.category}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-white mb-2">{s.name}</h3>
              <p className="text-gray-400 mb-3 text-sm">{s.description}</p>
              <div className="flex justify-between items-center mb-4">
                <p className="text-xl font-bold text-green-400">₹{s.price}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEdit(s)} 
                  className="flex-1 py-2 px-3 rounded-lg flex items-center justify-center transition-colors bg-gray-700 hover:bg-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(s._id)} 
                  className="flex-1 py-2 px-3 rounded-lg flex items-center justify-center transition-colors bg-red-700 hover:bg-red-600"
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
      
      {services.length === 0 && (
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