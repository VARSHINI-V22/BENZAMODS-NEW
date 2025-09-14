import React, { useEffect, useState } from "react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const FeaturedServices = () => {
  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined';
  
  // Utility function for safe localStorage access
  const safeStorage = {
    getItem: (key, fallback = null) => {
      if (!isBrowser) return fallback;
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
      } catch (error) {
        console.error(`Error reading ${key} from localStorage:`, error);
        return fallback;
      }
    },
    setItem: (key, value) => {
      if (!isBrowser) return false;
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        console.error(`Error saving ${key} to localStorage:`, error);
        return false;
      }
    }
  };
  
  // States - initialize with empty values
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Toggles
  const [showProducts, setShowProducts] = useState(false);
  const [showServices, setShowServices] = useState(false);
  
  // Modals
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [authData, setAuthData] = useState({ name: "", email: "", password: "" });
  const [showProfile, setShowProfile] = useState(false);
  const [showBuy, setShowBuy] = useState(false);
  const [buyItem, setBuyItem] = useState(null);
  const [orderData, setOrderData] = useState({ address: "", payment: "COD" });
  const [showCartModal, setShowCartModal] = useState(false);
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  
  // Demo data
  const demoProducts = [
     { _id: "1", name: "Performance Exhaust System", price: 25000, image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" },
    { _id: "2", name: "Carbon Fiber Spoiler", price: 18000, image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" },
    { _id: "3", name: "Sport Suspension Kit", price: 35000, image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" }
  ];
  
  const demoServices = [
    { _id: "s1", name: "Engine Tuning", price: 12000, image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" },
    { _id: "s2", name: "Body Wrap Installation", price: 25000, image: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" },
    { _id: "s3", name: "Interior Customization", price: 40000, image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" }
  ];
  
  // Initialize state from localStorage only on the client side
  useEffect(() => {
    if (isBrowser) {
      setCart(safeStorage.getItem("cart", []));
      setWishlist(safeStorage.getItem("wishlist", []));
      setOrders(safeStorage.getItem("orders", []));
      setCurrentUser(safeStorage.getItem("currentUser", null));
    }
  }, []);
  
  // Fetch products & services (with fallback)
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.length ? data : demoProducts))
      .catch(() => setProducts(demoProducts));
      
    fetch("http://localhost:5000/api/services")
      .then((res) => res.json())
      .then((data) => setServices(data.length ? data : demoServices))
      .catch(() => setServices(demoServices));
  }, []);
  
  // Persist localStorage when state changes
  useEffect(() => { 
    if (cart.length > 0) {
      safeStorage.setItem("cart", cart); 
    }
  }, [cart]);
  
  useEffect(() => { 
    if (wishlist.length > 0) {
      safeStorage.setItem("wishlist", wishlist); 
    }
  }, [wishlist]);
  
  useEffect(() => { 
    if (orders.length > 0) {
      safeStorage.setItem("orders", orders); 
    }
  }, [orders]);
  
  useEffect(() => { 
    if (currentUser) {
      safeStorage.setItem("currentUser", currentUser); 
    }
  }, [currentUser]);
  
  // Filter products and services based on search query
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Auth
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      if (!authData.email || !authData.password) return alert("Enter details");
      const newUser = { name: authData.name || "User", email: authData.email };
      setCurrentUser(newUser);
      safeStorage.setItem("currentUser", newUser);
      setShowAuth(false);
    } else {
      if (!authData.name || !authData.email || !authData.password) return alert("Enter all fields");
      const newUser = { name: authData.name, email: authData.email };
      setCurrentUser(newUser);
      safeStorage.setItem("currentUser", newUser);
      setShowAuth(false);
    }
    setAuthData({ name: "", email: "", password: "" });
  };
  
  const handleLogout = () => { 
    setCurrentUser(null); 
    if (isBrowser) {
      localStorage.removeItem("currentUser");
    }
  };
  
  const requireLogin = () => {
    if (!currentUser) {
      setShowAuth(true);
      setIsLogin(true);
      return false;
    }
    return true;
  };
  
  // Cart / Wishlist
  const handleAddCart = (item) => {
    if (!requireLogin()) return;
    setCart(prev => {
      const exists = prev.find(i => i._id === item._id);
      const newCart = exists
        ? prev.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { ...item, quantity: 1 }];
      
      safeStorage.setItem("cart", newCart);
      return newCart;
    });
  };
  
  const handleWishlist = (item) => {
    if (!requireLogin()) return;
    setWishlist(prev => {
      const exists = prev.find(i => i._id === item._id);
      const newWishlist = exists ? prev.filter(i => i._id !== item._id) : [...prev, item];
      
      safeStorage.setItem("wishlist", newWishlist);
      return newWishlist;
    });
  };
  
  const handleQuantityChange = (id, delta) => {
    setCart(prev => {
      const newCart = prev.map(i => i._id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i);
      safeStorage.setItem("cart", newCart);
      return newCart;
    });
  };
  
  const handleRemoveCartItem = (id) => {
    setCart(prev => {
      const newCart = prev.filter(i => i._id !== id);
      safeStorage.setItem("cart", newCart);
      return newCart;
    });
  };
  
  const handleRemoveWishlistItem = (id) => {
    setWishlist(prev => {
      const newWishlist = prev.filter(i => i._id !== id);
      safeStorage.setItem("wishlist", newWishlist);
      return newWishlist;
    });
  };
  
  // Buy
  const handleBuyNow = (item) => {
    if (!requireLogin()) return;
    setBuyItem(item);
    setShowBuy(true);
  };
  
  const confirmOrder = (e) => {
    e.preventDefault();
    
    // Create consistent order object
    const newOrder = {
      id: Date.now(),
      buyerName: currentUser.name,
      buyerEmail: currentUser.email,
      title: buyItem.name,
      price: buyItem.price,
      address: orderData.address,
      payment: "Cash on Delivery",
      date: new Date().toLocaleString(),
      image: buyItem.image,
      status: "Confirmed"
    };
    
    // Save to multiple keys for compatibility
    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    safeStorage.setItem("orders", updatedOrders);
    safeStorage.setItem("orderHistory", updatedOrders);
    
    setShowBuy(false);
    setOrderData({ address: "", payment: "COD" });
    alert("Order placed successfully!");
  };
  
  // Cancel order function
  const handleCancelOrder = (orderId) => {
    setOrders(prevOrders => {
      const updatedOrders = prevOrders.map(order => 
        order.id === orderId ? { ...order, status: "Cancelled" } : order
      );
      safeStorage.setItem("orders", updatedOrders);
      safeStorage.setItem("orderHistory", updatedOrders);
      return updatedOrders;
    });
    alert("Order has been cancelled!");
  };
  
  const totalAmount = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100 p-4 font-sans">
      {/* Custom font styles */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');
          body {
            font-family: 'Inter', sans-serif;
          }
          h1, h2, h3, h4, h5, h6, .font-heading {
            font-family: 'Montserrat', sans-serif;
          }
        `}
      </style>
      
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 px-6 py-4 rounded-xl shadow-2xl mb-6 sticky top-2 z-10 border border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg mr-3 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Benzamods</h1>
          </div>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-xl w-full">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search products and services..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-md border border-gray-700 placeholder-gray-400"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <nav className="flex flex-wrap gap-3 items-center">
            {currentUser ? (
              <>
                <span className="bg-gradient-to-r from-blue-700 to-purple-700 px-3 py-1 rounded-full text-sm">{currentUser.name}</span>
                <button onClick={() => setShowProfile(true)} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-3 py-2 rounded-lg transition-all flex items-center shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </button>
                <button onClick={handleLogout} className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-3 py-2 rounded-lg transition-all flex items-center shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </>
            ) : (
              <button 
                onClick={() => { setShowAuth(true); setIsLogin(true); }} 
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-4 py-2 rounded-lg transition-all flex items-center shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Login / Signup
              </button>
            )}
            <button 
              onClick={() => setShowWishlistModal(true)} 
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 px-3 py-2 rounded-lg transition-all flex items-center relative shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Wishlist
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-md">
                  {wishlist.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setShowCartModal(true)} 
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-3 py-2 rounded-lg transition-all flex items-center relative shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Cart
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-md">
                  {cart.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setShowOrdersModal(true)} 
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 px-3 py-2 rounded-lg transition-all flex items-center relative shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Orders
              {orders.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-md">
                  {orders.length}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        {/* Products Section */}
        <section className="mb-10">
          <div
            className="bg-gradient-to-r from-blue-700 via-purple-700 to-blue-700 rounded-xl shadow-2xl p-6 cursor-pointer hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 border border-blue-500/30"
            onClick={() => setShowProducts(!showProducts)}
          >
            <div className="flex items-center">
              <div className="bg-white/10 p-3 rounded-lg mr-4 backdrop-blur-sm border border-white/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white font-heading">Premium Products</h2>
                <p className="text-blue-200">{showProducts ? "Hide products" : "View our premium car modification products"}</p>
              </div>
              <div className="ml-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-white transform transition-transform ${showProducts ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          {showProducts && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {filteredProducts.map((p) => (
                <div key={p._id} className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-700">
                  <div className="relative">
                    <img src={p.image} alt={p.name} className="h-56 w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
                    <button 
                      onClick={() => handleWishlist(p)}
                      className="absolute top-3 right-3 bg-gray-900/80 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-red-500/80 transition-all"
                    >
                      {wishlist.find(i => i._id === p._id) ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-2 text-white">{p.name}</h3>
                    <p className="text-red-400 font-semibold text-xl mb-4">₹{p.price.toLocaleString()}</p>
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => handleBuyNow(p)} 
                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-2 rounded-lg transition-all flex items-center justify-center shadow-md"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Buy Now
                      </button>
                      <button 
                        onClick={() => handleAddCart(p)} 
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 rounded-lg transition-all flex items-center justify-center shadow-md"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        
        {/* Services Section */}
        <section className="mb-10">
          <div
            className="bg-gradient-to-r from-green-700 via-teal-700 to-green-700 rounded-xl shadow-2xl p-6 cursor-pointer hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 border border-green-500/30"
            onClick={() => setShowServices(!showServices)}
          >
            <div className="flex items-center">
              <div className="bg-white/10 p-3 rounded-lg mr-4 backdrop-blur-sm border border-white/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white font-heading">Professional Services</h2>
                <p className="text-green-200">{showServices ? "Hide services" : "View our professional car modification services"}</p>
              </div>
              <div className="ml-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-white transform transition-transform ${showServices ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          {showServices && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {filteredServices.map((s) => (
                <div key={s._id} className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-700">
                  <div className="relative">
                    <img src={s.image} alt={s.name} className="h-56 w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
                    <button 
                      onClick={() => handleWishlist(s)}
                      className="absolute top-3 right-3 bg-gray-900/80 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-red-500/80 transition-all"
                    >
                      {wishlist.find(i => i._id === s._id) ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-2 text-white">{s.name}</h3>
                    <p className="text-red-400 font-semibold text-xl mb-4">₹{s.price.toLocaleString()}</p>
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => handleBuyNow(s)} 
                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-2 rounded-lg transition-all flex items-center justify-center shadow-md"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Buy Now
                      </button>
                      <button 
                        onClick={() => handleAddCart(s)} 
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 rounded-lg transition-all flex items-center justify-center shadow-md"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      
      {/* Footer Section */}
      <footer className="bg-gradient-to-b from-gray-900 to-black text-white py-12 px-4 mt-12 border-t border-gray-800">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white font-heading">About Benzamods</h3>
            <p className="text-gray-300 mb-4">
              We specialize in premium vehicle modifications, wraps, and customizations for cars and bikes. 
              Transform your vehicle with our expert services.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-300 hover:text-white transition">
                {/* Social media icons would go here */}
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                {/* Social media icons would go here */}
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                {/* Social media icons would go here */}
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                {/* Social media icons would go here */}
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white font-heading"></h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition"></a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition"></a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition"></a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition"></a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition"></a></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white font-heading">Contact Us</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center gap-2">
                <Phone size={18} className="text-blue-400" /> 
                <span>+91 8904708819</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} className="text-blue-400" /> 
                <span>info@Benzamods12.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={18} className="text-blue-400 mt-1 flex-shrink-0" /> 
                <span>1st cross, 2nd stage jayanagar opp to myura bakery, Bengaluru, karnataka, india</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock size={18} className="text-blue-400" /> 
                <span>Monday - Saturday: 9:00 AM - 8:00 PM</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock size={18} className="text-blue-400" /> 
                <span>Sunday: Closed</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-gray-800 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Benzamods. All rights reserved.</p>
        </div>
      </footer>
      
      {/* --- Modals for Auth, Cart, Wishlist, Buy, Orders --- */}
      {showAuth && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleAuthSubmit} className="bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-2xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-center text-white font-heading">{isLogin ? "Login" : "Create Account"}</h2>
            {!isLogin && (
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Full Name</label>
                <input 
                  type="text" 
                  placeholder="Enter your name" 
                  value={authData.name} 
                  onChange={(e) => setAuthData({ ...authData, name: e.target.value })} 
                  className="border border-gray-700 bg-gray-900 text-white p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                />
              </div>
            )}
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Email Address</label>
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={authData.email} 
                onChange={(e) => setAuthData({ ...authData, email: e.target.value })} 
                className="border border-gray-700 bg-gray-900 text-white p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-300 mb-2">Password</label>
              <input 
                type="password" 
                placeholder="Enter your password" 
                value={authData.password} 
                onChange={(e) => setAuthData({ ...authData, password: e.target.value })} 
                className="border border-gray-700 bg-gray-900 text-white p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
              />
            </div>
            <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-3 rounded-lg w-full hover:from-purple-700 hover:to-purple-800 transition-all mb-4 font-medium shadow-md">
              {isLogin ? "Login" : "Create Account"}
            </button>
            <p className="text-center">
              <span className="text-gray-400">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button 
                type="button"
                onClick={() => setIsLogin(!isLogin)} 
                className="text-purple-400 hover:underline font-medium"
              >
                {isLogin ? "Sign up" : "Login"}
              </button>
            </p>
            <button 
              type="button"
              onClick={() => setShowAuth(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </form>
        </div>
      )}
      
      {showBuy && buyItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={confirmOrder} className="bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-2xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-center text-white font-heading">Confirm Order</h2>
            <div className="flex items-center mb-6 p-4 bg-gray-900 rounded-lg">
              <img src={buyItem.image} alt={buyItem.name} className="w-20 h-20 object-contain rounded-lg mr-4" />
              <div>
                <p className="font-semibold text-lg text-white">{buyItem.name}</p>
                <p className="text-red-400 font-bold text-xl">₹{buyItem.price.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Username</label>
              <input 
                type="text" 
                value={currentUser.name} 
                readOnly
                className="border border-gray-700 bg-gray-900 text-white p-3 w-full rounded-lg" 
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Email</label>
              <input 
                type="email" 
                value={currentUser.email} 
                readOnly
                className="border border-gray-700 bg-gray-900 text-white p-3 w-full rounded-lg" 
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Payment Method</label>
              <input 
                type="text" 
                value="Cash on Delivery (COD)" 
                readOnly
                className="border border-gray-700 bg-gray-900 text-white p-3 w-full rounded-lg" 
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-300 mb-2">Delivery Address</label>
              <textarea 
                placeholder="Enter your complete delivery address" 
                value={orderData.address} 
                onChange={(e) => setOrderData({ ...orderData, address: e.target.value })} 
                className="border border-gray-700 bg-gray-900 text-white p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                rows="3"
                required 
              />
            </div>
            
            <div className="flex gap-3">
              <button 
                type="submit" 
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all font-medium shadow-md"
              >
                Confirm Order
              </button>
              <button 
                type="button" 
                onClick={() => setShowBuy(false)} 
                className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-3 rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all font-medium shadow-md"
              >
                Cancel
              </button>
            </div>
            
            <button 
              type="button"
              onClick={() => setShowBuy(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </form>
        </div>
      )}
      
      {showCartModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 p-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-center text-white font-heading">Shopping Cart</h2>
            {cart.length === 0 ? (
              <div className="text-center py-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-gray-400 text-lg">Your cart is empty</p>
                <button 
                  onClick={() => setShowCartModal(false)} 
                  className="mt-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                {cart.map((c) => (
                  <div key={c._id} className="flex items-center gap-4 border-b border-gray-700 py-4">
                    <img src={c.image} alt={c.name} className="w-16 h-16 object-contain rounded-lg" />
                    <div className="flex-1">
                      <p className="font-semibold text-white">{c.name}</p>
                      <p className="text-red-400 font-medium">₹{c.price.toLocaleString()} x {c.quantity}</p>
                      <div className="flex gap-2 mt-2">
                        <button 
                          onClick={() => handleQuantityChange(c._id, -1)} 
                          className="bg-gray-700 px-2 py-1 rounded hover:bg-gray-600 transition-all"
                        >
                          -
                        </button>
                        <span className="px-2 text-white">{c.quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(c._id, 1)} 
                          className="bg-gray-700 px-2 py-1 rounded hover:bg-gray-600 transition-all"
                        >
                          +
                        </button>
                        <button 
                          onClick={() => handleRemoveCartItem(c._id)} 
                          className="text-red-400 hover:text-red-300 ml-4 transition-all"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="mt-6 pt-4 border-t border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-white">Total Amount:</span>
                    <span className="text-red-400 font-bold text-xl">₹{totalAmount.toLocaleString()}</span>
                  </div>
                  <button 
                    onClick={() => {
                      if (cart.length > 0) {
                        handleBuyNow({...cart[0], price: totalAmount});
                        setShowCartModal(false);
                      }
                    }} 
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all font-medium mb-3 shadow-md"
                  >
                    Checkout All Items
                  </button>
                </div>
              </>
            )}
            <button 
              onClick={() => setShowCartModal(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {showWishlistModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 p-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-center text-white font-heading">My Wishlist</h2>
            {wishlist.length === 0 ? (
              <div className="text-center py-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <p className="text-gray-400 text-lg">Your wishlist is empty</p>
                <button 
                  onClick={() => setShowWishlistModal(false)} 
                  className="mt-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {wishlist.map((w) => (
                  <div key={w._id} className="flex items-center gap-4 border border-gray-700 rounded-lg p-4 bg-gray-900">
                    <img src={w.image} alt={w.name} className="w-16 h-16 object-contain rounded-lg" />
                    <div className="flex-1">
                      <p className="font-semibold text-white">{w.name}</p>
                      <p className="text-red-400 font-medium">₹{w.price.toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleAddCart(w)} 
                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center shadow-md"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add to Cart
                      </button>
                      <button 
                        onClick={() => handleRemoveWishlistItem(w._id)} 
                        className="bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-1 rounded-lg hover:from-red-700 hover:to-red-800 transition-all flex items-center shadow-md"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button 
              onClick={() => setShowWishlistModal(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {showOrdersModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 p-6 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-center text-white font-heading">My Orders</h2>
            {orders.length === 0 ? (
              <div className="text-center py-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p className="text-gray-400 text-lg">You haven't placed any orders yet</p>
                <button 
                  onClick={() => setShowOrdersModal(false)} 
                  className="mt-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-700 rounded-lg p-4 bg-gray-900">
                    <div className="flex flex-col md:flex-row gap-4">
                      <img src={order.image} alt={order.title} className="w-24 h-24 object-contain rounded-lg" />
                      <div className="flex-1">
                        <p className="font-semibold text-lg text-white">{order.title}</p>
                        <p className="text-red-400 font-medium">₹{order.price.toLocaleString()}</p>
                        <p className="text-gray-400">Order ID: {order.id}</p>
                        <p className="text-gray-400">Placed on: {order.date}</p>
                        <p className="text-gray-400">Status: 
                          <span className={`font-semibold ${
                            order.status === "Confirmed" ? "text-green-400" : 
                            order.status === "Cancelled" ? "text-red-400" : "text-blue-400"
                          }`}>
                            {order.status}
                          </span>
                        </p>
                        <p className="text-gray-400">Delivery Address: {order.address}</p>
                        <p className="text-gray-400">Payment Method: {order.payment}</p>
                      </div>
                    </div>
                    {order.status === "Confirmed" && (
                      <div className="mt-4">
                        <button 
                          onClick={() => handleCancelOrder(order.id)} 
                          className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-md"
                        >
                          Cancel Order
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            <button 
              onClick={() => setShowOrdersModal(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {showProfile && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-2xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-center text-white font-heading">User Profile</h2>
            {currentUser ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Name</label>
                  <input 
                    type="text" 
                    value={currentUser.name} 
                    readOnly
                    className="border border-gray-700 bg-gray-900 text-white p-3 w-full rounded-lg" 
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Email</label>
                  <input 
                    type="email" 
                    value={currentUser.email} 
                    readOnly
                    className="border border-gray-700 bg-gray-900 text-white p-3 w-full rounded-lg" 
                  />
                </div>
                <div className="pt-4">
                  <button 
                    onClick={handleLogout} 
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition-all font-medium shadow-md"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-center py-4 text-gray-400">Please login to view your profile</p>
            )}
            <button 
              onClick={() => setShowProfile(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturedServices;