import React, { useEffect, useState } from "react";
import { Phone, Mail, MapPin, Clock, Package, Truck, CheckCircle } from "lucide-react";

const CombinedApp = () => {
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
  
  // App states
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminTab, setAdminTab] = useState('products');
  
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
  const [showBuy, setShowBuy] = useState(false);
  const [buyItem, setBuyItem] = useState(null);
  const [orderData, setOrderData] = useState({ address: "", payment: "COD" });
  const [showCartModal, setShowCartModal] = useState(false);
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [showTrackOrderModal, setShowTrackOrderModal] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState(null);
  
  // Admin states
  const [formProduct, setFormProduct] = useState({
    name: "",
    category: "car",
    price: "",
    description: "",
    image: ""
  });
  const [formService, setFormService] = useState({
    name: "",
    price: "",
    description: "",
    image: ""
  });
  const [editingProductId, setEditingProductId] = useState(null);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  
  // Demo data - Expanded to 10 products and 10 services
  const demoProducts = [
    { _id: "1", name: "Performance Exhaust System", category: "car", description: "High-performance exhaust system for improved engine efficiency and sound.", price: 25000, image: "https://tse2.mm.bing.net/th/id/OIP.FPvcDC0I2QAT2-ZMzMbvVQHaE8?pid=Api&P=0&h=220" },
    { _id: "2", name: "Carbon Fiber Spoiler", category: "car", description: "Lightweight carbon fiber spoiler for enhanced aerodynamics.", price: 18000, image: "https://m.media-amazon.com/images/I/61gAb77Hs9L.jpg" },
    { _id: "3", name: "Sport Suspension Kit", category: "car", description: "Sport suspension kit for improved handling and performance.", price: 35000, image: "https://tse2.mm.bing.net/th/id/OIP.JulTBx1UPcpJ4JIhtMdR2wHaFe?pid=Api&P=0&h=220" },
    { _id: "4", name: "LED Headlight Kit", category: "car", description: "Ultra-bright LED headlights with improved visibility and modern look.", price: 12000, image: "https://tse3.mm.bing.net/th/id/OIP.K1VijNzI40PetpAFkZSrMQHaHa?pid=Api&P=0&h=220" },
    { _id: "5", name: "Alloy Wheels", category: "car", description: "Premium alloy wheels to enhance your vehicle's appearance and performance.", price: 45000, image: "https://tse4.mm.bing.net/th/id/OIP.DOeQUu06qYkdkobQAlO4ygHaHa?pid=Api&P=0&h=220" },
    { _id: "6", name: "Performance Brakes", category: "car", description: "High-performance brake system for improved stopping power and safety.", price: 28000, image: "https://tse2.mm.bing.net/th/id/OIP.fDlAkDnxBDnMu_Z77e8X7AHaE7?pid=Api&P=0&h=220" },
    { _id: "7", name: "Car Cover", category: "car", description: "Dust and water-resistant car cover for all-weather protection.", price: 3500, image: "https://tse4.mm.bing.net/th/id/OIP.OuybaUg1eQOefg2qY7lMfAHaDu?pid=Api&P=0&h=220" },
    { _id: "8", name: "Seat Covers", category: "car", description: "Premium leather seat covers for comfort and style.", price: 8500, image: "https://tse1.mm.bing.net/th/id/OIP.C3jpE0tjow0TPhfqf0usCgHaHa?pid=Api&P=0&h=220" },
    { _id: "9", name: "Floor Mats", category: "car", description: "Heavy-duty rubber floor mats for all-weather protection.", price: 2500, image: "https://tse1.mm.bing.net/th/id/OIP.ifQJfWptFruDzownGRBhTQHaHa?pid=Api&P=0&h=220" },
    { _id: "10", name: "High-Flow Air Filter", category: "car", description: "Performance air filter for improved engine airflow and efficiency.", price: 4500, image: "https://tse4.mm.bing.net/th/id/OIP.cJpgEEhbWs0dq9z4Ekjs-AHaHa?pid=Api&P=0&h=220" }
  ];
  
  const demoServices = [
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
  
  // Order tracking stages
  const orderStages = [
    { id: 1, name: "Order Confirmed", description: "We have received your order.", icon: <CheckCircle size={24} />, duration: 0 },
    { id: 2, name: "Processing", description: "Your order is being prepared.", icon: <Package size={24} />, duration: 24 * 60 * 60 * 1000 }, // 24 hours
    { id: 3, name: "Shipped", description: "Your order has been shipped.", icon: <Truck size={24} />, duration: 48 * 60 * 60 * 1000 }, // 48 hours
    { id: 4, name: "Out for Delivery", description: "Your order is out for delivery.", icon: <Truck size={24} />, duration: 24 * 60 * 60 * 1000 }, // 24 hours
    { id: 5, name: "Delivered", description: "Your order has been delivered.", icon: <CheckCircle size={24} />, duration: 0 } // Final stage
  ];
  
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
  
  // Initialize state from localStorage only on the client side
  useEffect(() => {
    if (isBrowser) {
      setCart(safeStorage.getItem("cart", []));
      setWishlist(safeStorage.getItem("wishlist", []));
      setOrders(safeStorage.getItem("orders", []));
      setCurrentUser(safeStorage.getItem("currentUser", null));
      
      // Load products from localStorage or API
      const storedProducts = safeStorage.getItem("products");
      if (storedProducts) {
        setProducts(storedProducts);
      } else {
        fetch("http://localhost:5000/api/products")
          .then((res) => res.json())
          .then((data) => {
            if (data.length) {
              setProducts(data);
              safeStorage.setItem("products", data);
            } else {
              setProducts(demoProducts);
              safeStorage.setItem("products", demoProducts);
            }
          })
          .catch(() => {
            setProducts(demoProducts);
            safeStorage.setItem("products", demoProducts);
          });
      }
      
      // Load services from localStorage or API
      const storedServices = safeStorage.getItem("services");
      if (storedServices) {
        setServices(storedServices);
      } else {
        fetch("http://localhost:5000/api/services")
          .then((res) => res.json())
          .then((data) => {
            if (data.length) {
              setServices(data);
              safeStorage.setItem("services", data);
            } else {
              setServices(demoServices);
              safeStorage.setItem("services", demoServices);
            }
          })
          .catch(() => {
            setServices(demoServices);
            safeStorage.setItem("services", demoServices);
          });
      }
    }
  }, []);
  
  // Effect to update order status based on time
  useEffect(() => {
    if (!isBrowser || orders.length === 0) return;
    
    const updateOrderStatus = () => {
      const now = Date.now();
      let updatedOrders = [...orders];
      let hasChanges = false;
      
      updatedOrders = updatedOrders.map(order => {
        if (order.status === "Cancelled" || order.trackingStatus === "Delivered") {
          return order;
        }
        
        const orderDate = new Date(order.date).getTime();
        const timeSinceOrder = now - orderDate;
        
        let currentStageIndex = 0;
        let accumulatedTime = 0;
        
        for (let i = 0; i < orderStages.length; i++) {
          accumulatedTime += orderStages[i].duration;
          if (timeSinceOrder >= accumulatedTime) {
            currentStageIndex = i;
          } else {
            break;
          }
        }
        
        const newTrackingStatus = orderStages[currentStageIndex].name;
        
        if (order.trackingStatus !== newTrackingStatus) {
          hasChanges = true;
          return { ...order, trackingStatus: newTrackingStatus };
        }
        
        return order;
      });
      
      if (hasChanges) {
        setOrders(updatedOrders);
        safeStorage.setItem("orders", updatedOrders);
      }
    };
    
    // Update status every minute
    const interval = setInterval(updateOrderStatus, 60000);
    
    // Initial update
    updateOrderStatus();
    
    return () => clearInterval(interval);
  }, [orders]);
  
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
  
  // Auth functions
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
  
  // Cart / Wishlist functions
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
  
  // Buy functions
  const handleBuyNow = (item) => {
    if (!requireLogin()) return;
    setBuyItem(item);
    setShowBuy(true);
  };
  
  const confirmOrder = (e) => {
    e.preventDefault();
    
    const newOrder = {
      id: Date.now(),
      buyerName: currentUser.name,
      buyerEmail: currentUser.email,
      title: buyItem.name,
      price: buyItem.price,
      address: orderData.address,
      payment: "Cash on Delivery",
      date: new Date().toISOString(),
      image: buyItem.image,
      status: "Confirmed",
      trackingStatus: "Order Confirmed"
    };
    
    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    safeStorage.setItem("orders", updatedOrders);
    
    setShowBuy(false);
    setOrderData({ address: "", payment: "COD" });
    alert("Order placed successfully!");
  };
  
  const handleCancelOrder = (orderId) => {
    setOrders(prevOrders => {
      const updatedOrders = prevOrders.map(order => 
        order.id === orderId ? { ...order, status: "Cancelled" } : order
      );
      safeStorage.setItem("orders", updatedOrders);
      return updatedOrders;
    });
    alert("Order has been cancelled!");
  };
  
  const handleTrackOrder = (order) => {
    setTrackingOrder(order);
    setShowTrackOrderModal(true);
  };
  
  const totalAmount = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  
  // Admin functions
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };
  
  const handleProductChange = (e) => setFormProduct({ ...formProduct, [e.target.name]: e.target.value });
  const handleServiceChange = (e) => setFormService({ ...formService, [e.target.name]: e.target.value });
  
  const handleProductSubmit = (e) => {
    e.preventDefault();
    
    if (editingProductId) {
      const updatedProducts = products.map(p => 
        p._id === editingProductId ? { ...formProduct, _id: editingProductId } : p
      );
      setProducts(updatedProducts);
      safeStorage.setItem("products", updatedProducts);
      setEditingProductId(null);
      showNotification("Product updated successfully!");
    } else {
      const newProduct = { ...formProduct, _id: Date.now().toString() };
      const newProducts = [...products, newProduct];
      setProducts(newProducts);
      safeStorage.setItem("products", newProducts);
      showNotification("Product added successfully!");
    }
    
    setFormProduct({ name: "", category: "car", price: "", description: "", image: "" });
  };
  
  const handleServiceSubmit = (e) => {
    e.preventDefault();
    
    if (editingServiceId) {
      const updatedServices = services.map(s => 
        s._id === editingServiceId ? { ...formService, _id: editingServiceId } : s
      );
      setServices(updatedServices);
      safeStorage.setItem("services", updatedServices);
      setEditingServiceId(null);
      showNotification("Service updated successfully!");
    } else {
      const newService = { ...formService, _id: Date.now().toString() };
      const newServices = [...services, newService];
      setServices(newServices);
      safeStorage.setItem("services", newServices);
      showNotification("Service added successfully!");
    }
    
    setFormService({ name: "", price: "", description: "", image: "" });
  };
  
  const handleDeleteProduct = (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    const newProducts = products.filter(p => p._id !== id);
    setProducts(newProducts);
    safeStorage.setItem("products", newProducts);
    showNotification("Product deleted successfully!");
  };
  
  const handleDeleteService = (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    
    const newServices = services.filter(s => s._id !== id);
    setServices(newServices);
    safeStorage.setItem("services", newServices);
    showNotification("Service deleted successfully!");
  };
  
  const handleEditProduct = (product) => {
    setFormProduct({
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description,
      image: product.image
    });
    setEditingProductId(product._id);
  };
  
  const handleEditService = (service) => {
    setFormService({
      name: service.name,
      price: service.price,
      description: service.description,
      image: service.image
    });
    setEditingServiceId(service._id);
  };
  
  const handleCancelProductEdit = () => {
    setFormProduct({ name: "", category: "car", price: "", description: "", image: "" });
    setEditingProductId(null);
  };
  
  const handleCancelServiceEdit = () => {
    setFormService({ name: "", price: "", description: "", image: "" });
    setEditingServiceId(null);
  };
  
  // Render either admin panel or user view
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100 p-4 font-sans">
      {/* Custom font styles and animations */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');
          body {
            font-family: 'Inter', sans-serif;
          }
          h1, h2, h3, h4, h5, h6, .font-heading {
            font-family: 'Montserrat', sans-serif;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes slideIn {
            from { transform: translateX(-100%); }
            to { transform: translateX(0); }
          }
          
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          
          @keyframes glow {
            0% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.5); }
            50% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.8); }
            100% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.5); }
          }
          
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
          
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
          
          @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.6s ease-out forwards;
          }
          
          .animate-slideIn {
            animation: slideIn 0.5s ease-out forwards;
          }
          
          .animate-pulse {
            animation: pulse 2s infinite;
          }
          
          .animate-glow {
            animation: glow 2s infinite;
          }
          
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          
          .animate-bounce:hover {
            animation: bounce 0.5s ease-in-out;
          }
          
          .shimmer {
            position: relative;
            overflow: hidden;
          }
          
          .shimmer::before {
            content: "";
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            animation: shimmer 2s infinite;
          }
          
          .hover-lift {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          
          .hover-lift:hover {
            transform: translateY(-8px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
          }
          
          .gradient-text {
            background: linear-gradient(90deg, #60a5fa, #c084fc);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
          }
          
          .card-shadow {
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          }
        `}
      </style>
      
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 animate-fadeIn ${
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
      
      {isAdmin ? (
        // Admin Panel View
        <div className="min-h-screen bg-gray-900 text-gray-100 p-6 font-sans">
          {/* Admin Navigation */}
          <div className="flex justify-between items-center mb-8 animate-fadeIn">
            <div className="flex gap-4">
              <button 
                onClick={() => setAdminTab('products')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                  adminTab === 'products' 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Products
              </button>
              <button 
                onClick={() => setAdminTab('services')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                  adminTab === 'services' 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Services
              </button>
            </div>
            <button 
              onClick={() => setIsAdmin(false)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Store
            </button>
          </div>
          
          {adminTab === 'products' ? (
            // Products Admin
            <div>
              <div className="bg-gray-800 rounded-xl shadow-2xl p-6 mb-8 border border-gray-700 animate-fadeIn">
                <h3 className="text-xl font-semibold mb-4 text-white">
                  {editingProductId ? "Edit Product" : "Add New Product"}
                </h3>
                <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Product Name</label>
                      <input 
                        name="name" 
                        placeholder="Enter product name" 
                        value={formProduct.name} 
                        onChange={handleProductChange} 
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition" 
                        required 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                      <select 
                        name="category" 
                        value={formProduct.category} 
                        onChange={handleProductChange} 
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
                        value={formProduct.price} 
                        onChange={handleProductChange} 
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
                        value={formProduct.description} 
                        onChange={handleProductChange} 
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition" 
                        required 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Image URL</label>
                      <input 
                        name="image" 
                        placeholder="Enter image URL" 
                        value={formProduct.image} 
                        onChange={handleProductChange} 
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition" 
                        required 
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        type="submit" 
                        className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
                      >
                        {editingProductId ? "Update Product" : "Add Product"}
                      </button>
                      
                      {editingProductId && (
                        <button 
                          type="button"
                          onClick={handleCancelProductEdit}
                          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p, index) => (
                  <div 
                    key={p._id} 
                    className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 hover-lift card-shadow animate-fadeIn"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative">
                      <img 
                        src={getImageSource(p.image)} 
                        alt={p.name} 
                        className="h-48 w-full object-cover shimmer"
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMzAwIDIwMCI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNlZWVlZWUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzk5OSI+SW1hZ2UgTm90IEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';
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
                          onClick={() => handleEditProduct(p)} 
                          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(p._id)} 
                          className="flex-1 bg-red-700 hover:bg-red-600 text-white py-2 px-3 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105"
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
              
              {products.length === 0 && (
                <div className="text-center py-12 text-gray-400 animate-fadeIn">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-16M9 9h6m-6 4h6m-6 4h6" />
                  </svg>
                  <p className="text-xl">No products found</p>
                  <p className="mt-2">Add your first product using the form above</p>
                </div>
              )}
            </div>
          ) : (
            // Services Admin
            <div>
              <div className="bg-gray-800 rounded-xl shadow-2xl p-6 mb-8 border border-gray-700 animate-fadeIn">
                <h3 className="text-xl font-semibold mb-4 text-white">
                  {editingServiceId ? "Edit Service" : "Add New Service"}
                </h3>
                <form onSubmit={handleServiceSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Service Name</label>
                      <input 
                        name="name" 
                        placeholder="Enter service name" 
                        value={formService.name} 
                        onChange={handleServiceChange} 
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition" 
                        required 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Price (₹)</label>
                      <input 
                        name="price" 
                        placeholder="Enter price" 
                        type="number" 
                        value={formService.price} 
                        onChange={handleServiceChange} 
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
                        value={formService.description} 
                        onChange={handleServiceChange} 
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition" 
                        required 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Image URL</label>
                      <input 
                        name="image" 
                        placeholder="Enter image URL" 
                        value={formService.image} 
                        onChange={handleServiceChange} 
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition" 
                        required 
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        type="submit" 
                        className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
                      >
                        {editingServiceId ? "Update Service" : "Add Service"}
                      </button>
                      
                      {editingServiceId && (
                        <button 
                          type="button"
                          onClick={handleCancelServiceEdit}
                          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((s, index) => (
                  <div 
                    key={s._id} 
                    className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 hover-lift card-shadow animate-fadeIn"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative">
                      <img 
                        src={getImageSource(s.image)} 
                        alt={s.name} 
                        className="h-48 w-full object-cover shimmer"
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMzAwIDIwMCI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNlZWVlZWUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzk5OSI+SW1hZ2UgTm90IEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';
                        }}
                      />
                      <span className="absolute top-3 right-3 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded">
                        Service
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">{s.name}</h3>
                      <p className="text-gray-400 mb-3 text-sm">{s.description}</p>
                      <div className="flex justify-between items-center mb-4">
                        <p className="text-xl font-bold text-green-400">₹{s.price}</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEditService(s)} 
                          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteService(s._id)} 
                          className="flex-1 bg-red-700 hover:bg-red-600 text-white py-2 px-3 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105"
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
                <div className="text-center py-12 text-gray-400 animate-fadeIn">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-16M9 9h6m-6 4h6m-6 4h6" />
                  </svg>
                  <p className="text-xl">No services found</p>
                  <p className="mt-2">Add your first service using the form above</p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        // User View (FeaturedServices)
        <div>
          {/* Header */}
          <header className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 px-6 py-4 rounded-xl shadow-2xl mb-6 sticky top-2 z-10 border border-gray-700 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center animate-float">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg mr-3 shadow-md animate-glow">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold gradient-text">Benzamods</h1>
              </div>
              
              {/* Search Bar */}
              <div className="flex-1 max-w-xl w-full animate-slideIn">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search products and services..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-md border border-gray-700 placeholder-gray-400 transition-all duration-300"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              <nav className="flex flex-wrap gap-3 items-center animate-fadeIn">
                {currentUser ? (
                  <>
                    <div className="flex items-center">
                      <div className="bg-gradient-to-r from-blue-700 to-purple-700 px-3 py-1 rounded-full text-sm flex items-center transition-all duration-300 hover:scale-105">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Hi, {currentUser.name}
                      </div>
                    </div>
                    <button onClick={handleLogout} className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => { setShowAuth(true); setIsLogin(true); }} 
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center shadow-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Login / Signup
                  </button>
                )}
                <button 
                  onClick={() => setShowWishlistModal(true)} 
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center relative shadow-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Wishlist
                  {wishlist.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-md animate-pulse">
                      {wishlist.length}
                    </span>
                  )}
                </button>
                <button 
                  onClick={() => setShowCartModal(true)} 
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center relative shadow-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Cart
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-md animate-pulse">
                      {cart.length}
                    </span>
                  )}
                </button>
                <button 
                  onClick={() => setShowOrdersModal(true)} 
                  className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center relative shadow-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Orders
                  {orders.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-md animate-pulse">
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
                className="bg-gradient-to-r from-blue-700 via-purple-700 to-blue-700 rounded-xl shadow-2xl p-6 cursor-pointer hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 border border-blue-500/30 animate-fadeIn"
                onClick={() => setShowProducts(!showProducts)}
              >
                <div className="flex items-center">
                  <div className="bg-white/10 p-3 rounded-lg mr-4 backdrop-blur-sm border border-white/10 animate-pulse">
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
                  {filteredProducts.map((p, index) => (
                    <div key={p._id} className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-700 hover-lift card-shadow animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="relative">
                        <img src={getImageSource(p.image)} alt={p.name} className="h-56 w-full object-cover shimmer" />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
                        <button 
                          onClick={() => handleWishlist(p)}
                          className="absolute top-3 right-3 bg-gray-900/80 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-red-500/80 transition-all duration-300 transform hover:scale-110"
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
                        <p className="text-gray-400 mb-2 text-sm">{p.description}</p>
                        <p className="text-red-400 font-semibold text-xl mb-4">₹{p.price.toLocaleString()}</p>
                        <div className="flex flex-col gap-2">
                          <button 
                            onClick={() => handleBuyNow(p)} 
                            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-md animate-bounce"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Buy Now
                          </button>
                          <button 
                            onClick={() => handleAddCart(p)} 
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-md animate-bounce"
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
                className="bg-gradient-to-r from-green-700 via-teal-700 to-green-700 rounded-xl shadow-2xl p-6 cursor-pointer hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 border border-green-500/30 animate-fadeIn"
                onClick={() => setShowServices(!showServices)}
              >
                <div className="flex items-center">
                  <div className="bg-white/10 p-3 rounded-lg mr-4 backdrop-blur-sm border border-white/10 animate-pulse">
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
                  {filteredServices.map((s, index) => (
                    <div key={s._id} className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-700 hover-lift card-shadow animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="relative">
                        <img src={getImageSource(s.image)} alt={s.name} className="h-56 w-full object-cover shimmer" />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
                        <button 
                          onClick={() => handleWishlist(s)}
                          className="absolute top-3 right-3 bg-gray-900/80 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-red-500/80 transition-all duration-300 transform hover:scale-110"
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
                        <p className="text-gray-400 mb-2 text-sm">{s.description}</p>
                        <p className="text-red-400 font-semibold text-xl mb-4">₹{s.price.toLocaleString()}</p>
                        <div className="flex flex-col gap-2">
                          <button 
                            onClick={() => handleBuyNow(s)} 
                            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-md animate-bounce"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Buy Now
                          </button>
                          <button 
                            onClick={() => handleAddCart(s)} 
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-md animate-bounce"
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
          <footer className="bg-gradient-to-b from-gray-900 to-black text-white py-12 px-4 mt-12 border-t border-gray-800 animate-fadeIn">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* About Section */}
              <div>
                <h3 className="text-xl font-bold mb-4 text-white font-heading">About Benzamods</h3>
                <p className="text-gray-300 mb-4">
                  We specialize in premium vehicle modifications, wraps, and customizations for cars and bikes. 
                  Transform your vehicle with our expert services.
                </p>
                <div className="flex gap-4">
                  {/* Social media icons can be added here */}
                </div>
              </div>
              
              {/* Quick Links */}
              <div>
                <h3 className="text-xl font-bold mb-4 text-white font-heading">Quick Links</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">Home</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">Products</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">Services</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">About Us</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">Contact</a></li>
                </ul>
              </div>
              
              {/* Contact Info */}
              <div>
                <h3 className="text-xl font-bold mb-4 text-white font-heading">Contact Us</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center gap-2 transition-all duration-300 hover:translate-x-1">
                    <Phone size={18} className="text-blue-400" /> 
                    <span>+91 8904708819</span>
                  </li>
                  <li className="flex items-center gap-2 transition-all duration-300 hover:translate-x-1">
                    <Mail size={18} className="text-blue-400" /> 
                    <span>info@Benzamods12.com</span>
                  </li>
                  <li className="flex items-start gap-2 transition-all duration-300 hover:translate-x-1">
                    <MapPin size={18} className="text-blue-400 mt-1 flex-shrink-0" /> 
                    <span>1st cross, 2nd stage jayanagar opp to myura bakery, Bengaluru, karnataka, india</span>
                  </li>
                  <li className="flex items-center gap-2 transition-all duration-300 hover:translate-x-1">
                    <Clock size={18} className="text-blue-400" /> 
                    <span>Monday - Saturday: 9:00 AM - 8:00 PM</span>
                  </li>
                  <li className="flex items-center gap-2 transition-all duration-300 hover:translate-x-1">
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
          
          {/* --- Modals for Auth, Cart, Wishlist, Buy, Orders, Profile, Track Order --- */}
          {showAuth && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
              <form onSubmit={handleAuthSubmit} className="bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-2xl border border-gray-700 animate-slideIn">
                <h2 className="text-2xl font-bold mb-6 text-center text-white font-heading">{isLogin ? "Login" : "Create Account"}</h2>
                {!isLogin && (
                  <div className="mb-4">
                    <label className="block text-gray-300 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="Enter your name" 
                      value={authData.name} 
                      onChange={(e) => setAuthData({ ...authData, name: e.target.value })} 
                      className="border border-gray-700 bg-gray-900 text-white p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" 
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
                    className="border border-gray-700 bg-gray-900 text-white p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" 
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-300 mb-2">Password</label>
                  <input 
                    type="password" 
                    placeholder="Enter your password" 
                    value={authData.password} 
                    onChange={(e) => setAuthData({ ...authData, password: e.target.value })} 
                    className="border border-gray-700 bg-gray-900 text-white p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" 
                  />
                </div>
                <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-3 rounded-lg w-full hover:from-purple-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 mb-4 font-medium shadow-md">
                  {isLogin ? "Login" : "Create Account"}
                </button>
                <p className="text-center">
                  <span className="text-gray-400">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                  </span>
                  <button 
                    type="button"
                    onClick={() => setIsLogin(!isLogin)} 
                    className="text-purple-400 hover:underline font-medium transition-all duration-300"
                  >
                    {isLogin ? "Sign up" : "Login"}
                  </button>
                </p>
                <button 
                  type="button"
                  onClick={() => setShowAuth(false)} 
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </form>
            </div>
          )}
          
          {showBuy && buyItem && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
              <form onSubmit={confirmOrder} className="bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-2xl border border-gray-700 animate-slideIn">
                <h2 className="text-2xl font-bold mb-6 text-center text-white font-heading">Confirm Order</h2>
                <div className="flex items-center mb-6 p-4 bg-gray-900 rounded-lg">
                  <img src={getImageSource(buyItem.image)} alt={buyItem.name} className="w-20 h-20 object-contain rounded-lg mr-4" />
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
                    className="border border-gray-700 bg-gray-900 text-white p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" 
                    rows="3"
                    required 
                  />
                </div>
                
                <div className="flex gap-3">
                  <button 
                    type="submit" 
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105 font-medium shadow-md"
                  >
                    Confirm Order
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowBuy(false)} 
                    className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-3 rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 font-medium shadow-md"
                  >
                    Cancel
                  </button>
                </div>
                
                <button 
                  type="button"
                  onClick={() => setShowBuy(false)} 
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </form>
            </div>
          )}
          
          {showCartModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
              <div className="bg-gray-800 p-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700 animate-slideIn">
                <h2 className="text-2xl font-bold mb-6 text-center text-white font-heading">Shopping Cart</h2>
                {cart.length === 0 ? (
                  <div className="text-center py-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="text-gray-400 text-lg">Your cart is empty</p>
                    <button 
                      onClick={() => setShowCartModal(false)} 
                      className="mt-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-md"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <>
                    {cart.map((c) => (
                      <div key={c._id} className="flex items-center gap-4 border-b border-gray-700 py-4 transition-all duration-300 hover:bg-gray-750 rounded-lg p-2">
                        <img src={getImageSource(c.image)} alt={c.name} className="w-16 h-16 object-contain rounded-lg" />
                        <div className="flex-1">
                          <p className="font-semibold text-white">{c.name}</p>
                          <p className="text-red-400 font-medium">₹{c.price.toLocaleString()} x {c.quantity}</p>
                          <div className="flex gap-2 mt-2">
                            <button 
                              onClick={() => handleQuantityChange(c._id, -1)} 
                              className="bg-gray-700 px-2 py-1 rounded hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
                            >
                              -
                            </button>
                            <span className="px-2 text-white">{c.quantity}</span>
                            <button 
                              onClick={() => handleQuantityChange(c._id, 1)} 
                              className="bg-gray-700 px-2 py-1 rounded hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
                            >
                              +
                            </button>
                            <button 
                              onClick={() => handleRemoveCartItem(c._id)} 
                              className="text-red-400 hover:text-red-300 ml-4 transition-all duration-300 transform hover:scale-105"
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
                        className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105 font-medium mb-3 shadow-md"
                      >
                        Checkout All Items
                      </button>
                    </div>
                  </>
                )}
                <button 
                  onClick={() => setShowCartModal(false)} 
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
          
          {showWishlistModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
              <div className="bg-gray-800 p-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700 animate-slideIn">
                <h2 className="text-2xl font-bold mb-6 text-center text-white font-heading">My Wishlist</h2>
                {wishlist.length === 0 ? (
                  <div className="text-center py-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <p className="text-gray-400 text-lg">Your wishlist is empty</p>
                    <button 
                      onClick={() => setShowWishlistModal(false)} 
                      className="mt-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-md"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {wishlist.map((w) => (
                      <div key={w._id} className="flex items-center gap-4 border border-gray-700 rounded-lg p-4 bg-gray-900 transition-all duration-300 hover:bg-gray-850 hover-lift">
                        <img src={getImageSource(w.image)} alt={w.name} className="w-16 h-16 object-contain rounded-lg" />
                        <div className="flex-1">
                          <p className="font-semibold text-white">{w.name}</p>
                          <p className="text-red-400 font-medium">₹{w.price.toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleAddCart(w)} 
                            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 flex items-center shadow-md"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add to Cart
                          </button>
                          <button 
                            onClick={() => handleRemoveWishlistItem(w._id)} 
                            className="bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-1 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 flex items-center shadow-md"
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
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
          
          {showOrdersModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
              <div className="bg-gray-800 p-6 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700 animate-slideIn">
                <h2 className="text-2xl font-bold mb-6 text-center text-white font-heading">My Orders</h2>
                {orders.length === 0 ? (
                  <div className="text-center py-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <p className="text-gray-400 text-lg">You haven't placed any orders yet</p>
                    <button 
                      onClick={() => setShowOrdersModal(false)} 
                      className="mt-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-md"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-700 rounded-lg p-4 bg-gray-900 transition-all duration-300 hover:bg-gray-850 hover-lift">
                        <div className="flex flex-col md:flex-row gap-4">
                          <img src={getImageSource(order.image)} alt={order.title} className="w-24 h-24 object-contain rounded-lg" />
                          <div className="flex-1">
                            <p className="font-semibold text-lg text-white">{order.title}</p>
                            <p className="text-red-400 font-medium">₹{order.price.toLocaleString()}</p>
                            <p className="text-gray-400">Order ID: {order.id}</p>
                            <p className="text-gray-400">Placed on: {new Date(order.date).toLocaleString()}</p>
                            <p className="text-gray-400">Status: 
                              <span className={`font-semibold ${
                                order.status === "Confirmed" ? "text-green-400" : 
                                order.status === "Cancelled" ? "text-red-400" : "text-blue-400"
                              }`}>
                                {order.status}
                              </span>
                            </p>
                            <p className="text-gray-400">Tracking Status: 
                              <span className={`font-semibold ${
                                order.trackingStatus === "Order Confirmed" ? "text-blue-400" : 
                                order.trackingStatus === "Processing" ? "text-yellow-400" :
                                order.trackingStatus === "Shipped" ? "text-purple-400" :
                                order.trackingStatus === "Out for Delivery" ? "text-indigo-400" :
                                order.trackingStatus === "Delivered" ? "text-green-400" : "text-gray-400"
                              }`}>
                                {order.trackingStatus || "Order Confirmed"}
                              </span>
                            </p>
                            <p className="text-gray-400">Delivery Address: {order.address}</p>
                            <p className="text-gray-400">Payment Method: {order.payment}</p>
                          </div>
                        </div>
                        <div className="flex gap-3 mt-4">
                          {order.status === "Confirmed" && (
                            <button 
                              onClick={() => handleCancelOrder(order.id)} 
                              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 shadow-md"
                            >
                              Cancel Order
                            </button>
                          )}
                          <button 
                            onClick={() => handleTrackOrder(order)} 
                            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-md"
                          >
                            Track Order
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <button 
                  onClick={() => setShowOrdersModal(false)} 
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
          
          {showTrackOrderModal && trackingOrder && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
              <div className="bg-gray-800 p-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700 animate-slideIn">
                <h2 className="text-2xl font-bold mb-6 text-center text-white font-heading">Track Your Order</h2>
                
                <div className="flex items-center mb-6 p-4 bg-gray-900 rounded-lg">
                  <img src={getImageSource(trackingOrder.image)} alt={trackingOrder.title} className="w-20 h-20 object-contain rounded-lg mr-4" />
                  <div>
                    <p className="font-semibold text-lg text-white">{trackingOrder.title}</p>
                    <p className="text-red-400 font-bold text-xl">₹{trackingOrder.price.toLocaleString()}</p>
                    <p className="text-gray-400">Order ID: {trackingOrder.id}</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Order Status</h3>
                  <div className="space-y-4">
                    {orderStages.map((stage, index) => {
                      const currentStageIndex = orderStages.findIndex(s => s.name === trackingOrder.trackingStatus);
                      const isCompleted = index < currentStageIndex;
                      const isActive = index === currentStageIndex;
                      
                      return (
                        <div key={stage.id} className="flex items-start">
                          <div className={`flex flex-col items-center mr-4 ${
                            isCompleted ? 'text-green-400' : isActive ? 'text-blue-400' : 'text-gray-500'
                          }`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              isCompleted ? 'bg-green-500' : isActive ? 'bg-blue-500' : 'bg-gray-700'
                            }`}>
                              {stage.icon}
                            </div>
                            {index < orderStages.length - 1 && (
                              <div className={`h-16 w-1 ${
                                isCompleted ? 'bg-green-500' : 'bg-gray-700'
                              }`}></div>
                            )}
                          </div>
                          <div className="pb-6">
                            <h4 className={`font-semibold ${
                              isCompleted ? 'text-green-400' : isActive ? 'text-blue-400' : 'text-gray-400'
                            }`}>{stage.name}</h4>
                            <p className="text-gray-400 text-sm">{stage.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Delivery Information</h3>
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <p className="text-gray-300"><span className="font-medium">Address:</span> {trackingOrder.address}</p>
                    <p className="text-gray-300"><span className="font-medium">Payment Method:</span> {trackingOrder.payment}</p>
                    <p className="text-gray-300"><span className="font-medium">Order Date:</span> {new Date(trackingOrder.date).toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowTrackOrderModal(false)} 
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 font-medium shadow-md"
                  >
                    Close
                  </button>
                </div>
                
                <button 
                  onClick={() => setShowTrackOrderModal(false)} 
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CombinedApp;