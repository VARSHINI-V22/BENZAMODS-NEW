import React, { useEffect, useState } from "react";

// Configure API URL based on environment
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:5000' 
  : process.env.REACT_APP_API_URL || 'https://your-backend-api.vercel.app';

export default function ProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "car",
    price: "",
    description: "",
    image: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/products`);
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      alert('Failed to fetch products. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const url = editingId 
        ? `${API_BASE_URL}/api/products/${editingId}`
        : `${API_BASE_URL}/api/products`;
        
      const method = editingId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      
      if (!res.ok) throw new Error('Network response was not ok');
      
      const data = await res.json();
      
      if (editingId) {
        setProducts(products.map(p => (p._id === editingId ? data : p)));
        setEditingId(null);
      } else {
        setProducts([...products, data]);
      }
      
      setForm({ name: "", category: "car", price: "", description: "", image: "" });
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Failed to save product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${id}`, { 
        method: "DELETE" 
      });
      
      if (!res.ok) throw new Error('Network response was not ok');
      
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Failed to delete product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description,
      image: product.image
    });
    setEditingId(product._id);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 font-sans">
      {/* HEADER */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
          Product Admin Dashboard
        </h1>
        <button 
          onClick={fetchProducts}
          disabled={isLoading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </header>

      {/* FORM */}
      <div className="bg-gray-800 rounded-xl shadow-2xl p-6 mb-8 border border-gray-700">
        <h3 className="text-xl font-semibold mb-4 text-white">
          {editingId ? "Edit Product" : "Add New Product"}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Product Name</label>
              <input 
                name="name" 
                placeholder="Enter product name" 
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
                placeholder="Enter product description" 
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
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:-translate-y-1 mt-6 disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : (editingId ? "Update Product" : "Add Product")}
            </button>
          </div>
        </form>
      </div>

      {/* PRODUCTS GRID */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(p => (
            <div key={p._id} className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 transform transition-transform duration-300 hover:scale-105">
              <div className="relative">
                <img 
                  src={p.image} 
                  alt={p.name} 
                  className="h-48 w-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Available';
                  }}
                />
                <span className="absolute top-3 right-3 bg-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded">
                  {p.category}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-2">{p.name}</h3>
                <p className="text-gray-400 mb-3 text-sm">{p.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-xl font-bold text-indigo-400">₹{p.price}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(p)} 
                    disabled={isLoading}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(p._id)} 
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
      
      {products.length === 0 && !isLoading && (
        <div className="text-center py-12 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-16M9 9h6m-6 4h6m-6 4h6" />
          </svg>
          <p className="text-xl">No products found</p>
          <p className="mt-2">Add your first product using the form above</p>
        </div>
      )}
    </div>
  );
}