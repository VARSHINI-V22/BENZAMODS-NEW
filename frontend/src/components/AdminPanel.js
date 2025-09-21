import React, { useState, useEffect, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";

// Admin components - lazy loaded
const AdminDashboard = lazy(() => import("./admin/AdminDashboard"));
const ProductsAdmin = lazy(() => import("./admin/ProductsAdmin"));
const ServicesAdmin = lazy(() => import("./admin/ServicesAdmin"));

// Utility function for safe localStorage access
const safeStorage = {
  getItem: (key) => {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
      return false;
    }
  }
};

function AdminPanel() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("chart");
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [messageSearch, setMessageSearch] = useState("");
  const [reviewSearch, setReviewSearch] = useState("");
  const [enquirySearch, setEnquirySearch] = useState("");
  
  // Admin authentication states
  const [admins, setAdmins] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [loginError, setLoginError] = useState("");
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [currentAdmin, setCurrentAdmin] = useState(null);
  
  // Admin profile states
  const [showAdminProfile, setShowAdminProfile] = useState(false);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newAdminData, setNewAdminData] = useState({ username: "", password: "" });
  const [changePasswordData, setChangePasswordData] = useState({ 
    currentPassword: "", 
    newPassword: "", 
    confirmPassword: "" 
  });
  const [adminError, setAdminError] = useState("");
  const [adminSuccess, setAdminSuccess] = useState("");
  
  // Order status tracking
  const [orderStatuses, setOrderStatuses] = useState({});
  const orderStatusOptions = [
    "Confirmed",
    "Processing",
    "Shipped",
    "Out for Delivery",
    "Delivered",
    "Cancelled"
  ];

  useEffect(() => {
    // Load all data from localStorage
    const loadData = () => {
      try {
        // Load existing data or initialize with empty arrays
        const existingUsers = safeStorage.getItem("users") || [];
        const existingMessages = safeStorage.getItem("submittedMessages") || [];
        const ordersData = safeStorage.getItem("orders") || 
                          safeStorage.getItem("orderHistory") || 
                          [];
        const existingReviews = safeStorage.getItem("reviews") || [];
        const existingEnquiries = safeStorage.getItem("enquiries") || [];
        const existingProducts = safeStorage.getItem("products") || [];
        const existingServices = safeStorage.getItem("services") || [];
        
        // Load admin data
        const existingAdmins = safeStorage.getItem("admins") || [{ username: "admin", password: "1234" }];
        
        // Check if admin is already logged in
        const loggedInAdmin = safeStorage.getItem("currentAdmin");
        if (loggedInAdmin && existingAdmins.some(admin => admin.username === loggedInAdmin)) {
          setIsLoggedIn(true);
          setCurrentAdmin(loggedInAdmin);
          setShowLogin(false);
        }
        
        // Define static users that must always be present
        const staticUsers = [
          { name: "varshini", email: "varshini22@gmail.com" },
          { name: "ashwini", email: "ashwini11@gmail.com" }
        ];
        
        // Only add static users if they don't already exist
        const filteredStaticUsers = staticUsers.filter(staticUser => 
          !existingUsers.some(user => 
            user.name === staticUser.name && user.email === staticUser.email
          )
        );
        
        // Define static messages that must always be present
        const staticMessages = [
          { 
            name: "varshini", 
            email: "varshini22@gmail.com", 
            phone: "1234567890", 
            message: "Wow, amazing work!", 
            timestamp: new Date().toLocaleString() 
          },
          { 
            name: "ashwini", 
            email: "ashwini11@gmail.com", 
            phone: "0987654321", 
            message: "Hi, I love your designs!", 
            timestamp: new Date().toLocaleString() 
          },
          { 
            name: "varshini", 
            email: "varshini22@gmail.com", 
            phone: "1234567890", 
            message: "When will you be available for a consultation?", 
            timestamp: new Date().toLocaleString() 
          },
          { 
            name: "ashwini", 
            email: "ashwini11@gmail.com", 
            phone: "0987654321", 
            message: "Can you send me a quote for bike wrapping?", 
            timestamp: new Date().toLocaleString() 
          }
        ];
        
        // Define static enquiries that must always be present
        const staticEnquiries = [
          { 
            name: "varshini", 
            email: "varshini22@gmail.com", 
            message: "I'm interested in a full car wrap. What options do you have?", 
            timestamp: new Date().toLocaleString() 
          },
          { 
            name: "ashwini", 
            email: "ashwini11@gmail.com", 
            message: "I want to upgrade my car's lighting system. Can you help?", 
            timestamp: new Date().toLocaleString() 
          },
          { 
            name: "varshini", 
            email: "varshini22@gmail.com", 
            message: "Looking for engine tuning options for my Mercedes.", 
            timestamp: new Date().toLocaleString() 
          },
          { 
            name: "ashwini", 
            email: "ashwini11@gmail.com", 
            message: "I'd like to customize my car's interior. What materials do you offer?", 
            timestamp: new Date().toLocaleString() 
          }
        ];
        
        // Define static orders that must always be present
        const staticOrders = [
          {
            id: 1001,
            buyerName: "Alex Johnson",
            buyerEmail: "alex@example.com",
            title: "Premium Car Wrap Package",
            price: 18500,
            payment: "Credit Card",
            status: "Confirmed",
            date: new Date(Date.now() - 86400000 * 3).toLocaleString(), // 3 days ago
            address: "123 Main Street, Cityville",
            image: null
          },
          {
            id: 1002,
            buyerName: "Sarah Williams",
            buyerEmail: "sarah@example.com",
            title: "LED Headlight Upgrade",
            price: 9500,
            payment: "Cash on Delivery",
            status: "Processing",
            date: new Date(Date.now() - 86400000 * 2).toLocaleString(), // 2 days ago
            address: "456 Park Avenue, Townsville",
            image: null
          },
          {
            id: 1003,
            buyerName: "Michael Chen",
            buyerEmail: "michael@example.com",
            title: "Performance Engine Tuning",
            price: 27500,
            payment: "Bank Transfer",
            status: "Shipped",
            date: new Date(Date.now() - 86400000 * 1).toLocaleString(), // 1 day ago
            address: "789 Oak Road, Villageburg",
            image: null
          },
          {
            id: 1004,
            buyerName: "Emma Rodriguez",
            buyerEmail: "emma@example.com",
            title: "Custom Interior Upholstery",
            price: 22000,
            payment: "Credit Card",
            status: "Out for Delivery",
            date: new Date().toLocaleString(), // today
            address: "321 Pine Street, Hamletton",
            image: null
          },
          {
            id: 1005,
            buyerName: "David Thompson",
            buyerEmail: "david@example.com",
            title: "Alloy Wheel Package",
            price: 32000,
            payment: "Cash on Delivery",
            status: "Delivered",
            date: new Date(Date.now() - 86400000 * 5).toLocaleString(), // 5 days ago
            address: "654 Elm Avenue, Borough City",
            image: null
          }
        ];
        
        // Initialize order statuses
        const initialStatuses = {};
        staticOrders.forEach(order => {
          initialStatuses[order.id] = order.status;
        });
        ordersData.forEach(order => {
          initialStatuses[order.id] = order.status;
        });
        setOrderStatuses(initialStatuses);
        
        // Merge static data with existing data
        const allUsers = [...filteredStaticUsers, ...existingUsers];
        const allMessages = [...staticMessages, ...existingMessages];
        const allEnquiries = [...staticEnquiries, ...existingEnquiries];
        const allOrders = [...staticOrders, ...ordersData];
        
        setUsers(allUsers);
        setOrders(allOrders);
        setMessages(allMessages);
        setReviews(existingReviews);
        setEnquiries(allEnquiries);
        setProducts(existingProducts);
        setServices(existingServices);
        setAdmins(existingAdmins);
        
        // Save to localStorage if needed
        if (existingUsers.length === 0) safeStorage.setItem("users", allUsers);
        if (existingMessages.length === 0) safeStorage.setItem("submittedMessages", allMessages);
        if (existingEnquiries.length === 0) safeStorage.setItem("enquiries", allEnquiries);
        if (ordersData.length === 0) safeStorage.setItem("orders", allOrders);
        if (existingAdmins.length === 0) safeStorage.setItem("admins", existingAdmins);
      } catch (error) {
        console.error("Error loading data from localStorage:", error);
      }
    };
    
    // Data migration for existing orders
    const migrateOrders = () => {
      try {
        const oldOrders = safeStorage.getItem("orderHistory") || [];
        const newOrders = safeStorage.getItem("orders") || [];
        
        if (oldOrders.length > 0 && newOrders.length === 0) {
          const migratedOrders = oldOrders.map(order => ({
            id: order.id || Date.now(),
            buyerName: order.user || "Unknown Customer",
            buyerEmail: order.email || "No email",
            title: order.product || order.name || "Unknown Item",
            price: order.price || 0,
            payment: order.payment || "Cash on Delivery",
            status: order.status || "Confirmed",
            date: order.date || new Date().toLocaleString(),
            address: order.address || "No address provided",
            image: order.image || null
          }));
          
          setOrders(migratedOrders);
          safeStorage.setItem("orders", migratedOrders);
        }
      } catch (error) {
        console.error("Error migrating orders:", error);
      }
    };
    
    loadData();
    migrateOrders();
    
    // Set up storage event listener
    const handleStorageChange = (e) => {
      if (e.key === "orders") {
        try {
          setOrders(JSON.parse(e.newValue) || []);
        } catch (error) {
          console.error("Error parsing orders data:", error);
        }
      } else if (e.key === "enquiries") {
        try {
          setEnquiries(JSON.parse(e.newValue) || []);
        } catch (error) {
          console.error("Error parsing enquiries data:", error);
        }
      } else if (e.key === "admins") {
        try {
          setAdmins(JSON.parse(e.newValue) || []);
        } catch (error) {
          console.error("Error parsing admins data:", error);
        }
      } else if (e.key === "products") {
        try {
          setProducts(JSON.parse(e.newValue) || []);
        } catch (error) {
          console.error("Error parsing products data:", error);
        }
      } else if (e.key === "services") {
        try {
          setServices(JSON.parse(e.newValue) || []);
        } catch (error) {
          console.error("Error parsing services data:", error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Admin authentication handlers
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError("");
    
    const admin = admins.find(
      a => a.username === loginData.username && a.password === loginData.password
    );
    
    if (admin) {
      setIsLoggedIn(true);
      setCurrentAdmin(loginData.username);
      safeStorage.setItem("currentAdmin", loginData.username);
      setShowLogin(false);
      setLoginData({ username: "", password: "" });
    } else {
      setLoginError("Invalid username or password");
    }
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentAdmin(null);
    safeStorage.setItem("currentAdmin", null);
    setShowLogin(true);
    navigate("/");
  };

  // Remove handlers
  const handleRemoveUser = (index) => {
    const user = users[index];
    
    // Static user protection removed - now all users can be deleted
    
    if (window.confirm("Remove this user?")) {
      const updated = users.filter((_, i) => i !== index);
      setUsers(updated);
      safeStorage.setItem("users", updated);
    }
  };

  const handleRemoveOrder = (index) => {
    if (window.confirm("Remove this order?")) {
      try {
        const updated = orders.filter((_, i) => i !== index);
        setOrders(updated);
        safeStorage.setItem("orders", updated);
        
        if (safeStorage.getItem("orderHistory")) {
          safeStorage.setItem("orderHistory", updated);
        }
      } catch (error) {
        console.error("Error removing order:", error);
        alert("Failed to remove order. Check console for details.");
      }
    }
  };

  const handleRemoveMessage = (index) => {
    if (window.confirm("Delete this message?")) {
      const updated = messages.filter((_, i) => i !== index);
      setMessages(updated);
      safeStorage.setItem("submittedMessages", updated);
    }
  };

  const handleRemoveReview = (index) => {
    if (window.confirm("Delete this review?")) {
      const updated = reviews.filter((_, i) => i !== index);
      setReviews(updated);
      safeStorage.setItem("reviews", updated);
    }
  };

  const handleRemoveEnquiry = (index) => {
    if (window.confirm("Delete this enquiry?")) {
      const updated = enquiries.filter((_, i) => i !== index);
      setEnquiries(updated);
      safeStorage.setItem("enquiries", updated);
    }
  };

  const handleToggleReviewStatus = (index) => {
    const updated = [...reviews];
    updated[index].status = updated[index].status === "approved" ? "pending" : "approved";
    setReviews(updated);
    safeStorage.setItem("reviews", updated);
  };

  // Order status update handler
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return { ...order, status: newStatus };
      }
      return order;
    });
    
    setOrders(updatedOrders);
    safeStorage.setItem("orders", updatedOrders);
    
    // Update the orderStatuses state
    setOrderStatuses(prev => ({
      ...prev,
      [orderId]: newStatus
    }));
  };

  // Admin handlers
  const handleAddAdmin = (e) => {
    e.preventDefault();
    setAdminError("");
    setAdminSuccess("");
    
    if (!newAdminData.username || !newAdminData.password) {
      setAdminError("Username and password are required");
      return;
    }
    
    if (admins.some(admin => admin.username === newAdminData.username)) {
      setAdminError("Admin with this username already exists");
      return;
    }
    
    const updatedAdmins = [...admins, { 
      username: newAdminData.username, 
      password: newAdminData.password 
    }];
    
    setAdmins(updatedAdmins);
    safeStorage.setItem("admins", updatedAdmins);
    
    setAdminSuccess("Admin added successfully");
    setNewAdminData({ username: "", password: "" });
    
    setTimeout(() => {
      setShowAddAdmin(false);
      setAdminSuccess("");
    }, 2000);
  };
  
  const handleChangePassword = (e) => {
    e.preventDefault();
    setAdminError("");
    setAdminSuccess("");
    
    const currentAdminData = admins.find(admin => admin.username === currentAdmin);
    
    if (!currentAdminData) {
      setAdminError("Admin not found");
      return;
    }
    
    if (changePasswordData.currentPassword !== currentAdminData.password) {
      setAdminError("Current password is incorrect");
      return;
    }
    
    if (changePasswordData.newPassword !== changePasswordData.confirmPassword) {
      setAdminError("New passwords do not match");
      return;
    }
    
    const updatedAdmins = admins.map(admin => {
      if (admin.username === currentAdmin) {
        return { ...admin, password: changePasswordData.newPassword };
      }
      return admin;
    });
    
    setAdmins(updatedAdmins);
    safeStorage.setItem("admins", updatedAdmins);
    
    setAdminSuccess("Password changed successfully");
    setChangePasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    
    setTimeout(() => {
      setShowChangePassword(false);
      setAdminSuccess("");
    }, 2000);
  };
  
  const handleRemoveAdmin = (index) => {
    const admin = admins[index];
    
    if (admin.username === "admin") {
      alert("Cannot remove the main admin account");
      return;
    }
    
    if (admin.username === currentAdmin) {
      alert("Cannot remove your own account while logged in");
      return;
    }
    
    if (window.confirm("Remove this admin?")) {
      const updated = admins.filter((_, i) => i !== index);
      setAdmins(updated);
      safeStorage.setItem("admins", updated);
    }
  };

  // Normalize order data
  const normalizeOrder = (order) => {
    return {
      id: order.id || order._id || Date.now(),
      buyerName: order.buyerName || order.user || "Unknown Customer",
      buyerEmail: order.buyerEmail || order.email || "No email",
      title: order.title || order.product || order.name || "Unknown Product/Service",
      price: order.price || 0,
      payment: order.payment || "Cash on Delivery",
      status: order.status || "Confirmed",
      date: order.date || new Date().toLocaleString(),
      address: order.address || "No address provided",
      image: order.image || null
    };
  };

  // Filtered data
  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredOrders = orders
    .map(normalizeOrder)
    .filter((o) =>
      o.buyerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.buyerEmail.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.title.toLowerCase().includes(orderSearch.toLowerCase())
    );

  const filteredMessages = messages.filter(
    (m) =>
      m.name?.toLowerCase().includes(messageSearch.toLowerCase()) ||
      m.email?.toLowerCase().includes(messageSearch.toLowerCase()) ||
      m.message?.toLowerCase().includes(messageSearch.toLowerCase())
  );

  const filteredReviews = reviews.filter(
    (r) =>
      r.userName?.toLowerCase().includes(reviewSearch.toLowerCase()) ||
      r.comment?.toLowerCase().includes(reviewSearch.toLowerCase()) ||
      r.status?.toLowerCase().includes(reviewSearch.toLowerCase())
  );

  const filteredEnquiries = enquiries.filter(
    (e) =>
      e.name?.toLowerCase().includes(enquirySearch.toLowerCase()) ||
      e.email?.toLowerCase().includes(enquirySearch.toLowerCase()) ||
      e.message?.toLowerCase().includes(enquirySearch.toLowerCase())
  );

  // Prepare data for charts
  const chartData = [
    { title: "Users", value: users.length, icon: "👥", color: "#3498db" },
    { title: "Products", value: products.length, icon: "🛍️", color: "#2ecc71" },
    { title: "Services", value: services.length, icon: "🛠️", color: "#e74c3c" },
    { title: "Orders", value: orders.length, icon: "📦", color: "#f39c12" },
    { title: "Messages", value: messages.length, icon: "✉️", color: "#9b59b6" },
    { title: "Enquiries", value: enquiries.length, icon: "📝", color: "#1abc9c" },
    { title: "Reviews", value: reviews.length, icon: "⭐", color: "#d35400" }
  ];

  // Find max value for chart scaling
  const maxValue = Math.max(...chartData.map(item => item.value), 1);

  // Admin Login Form
  if (showLogin) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginForm}>
          <h2 style={styles.loginHeading}>Admin Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Admin Username"
              value={loginData.username}
              onChange={(e) => setLoginData({...loginData, username: e.target.value})}
              style={styles.inputField}
              required
            />
            <input
              type="password"
              placeholder="Admin Password"
              value={loginData.password}
              onChange={(e) => setLoginData({...loginData, password: e.target.value})}
              style={styles.inputField}
              required
            />
            {loginError && <p style={styles.errorText}>{loginError}</p>}
            <button type="submit" style={styles.loginBtn}>Login</button>
          </form>
          <div style={styles.loginFooter}>
            <button 
              style={styles.backBtn} 
              onClick={() => navigate(-1)}
            >
              ⬅ Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.heading}>Admin Chart</h1>
        <div style={styles.headerActions}>
          <span style={styles.adminInfo}>Logged in as: <strong>{currentAdmin}</strong></span>
          <button 
            style={styles.profileBtn} 
            onClick={() => setShowAdminProfile(true)}
          >
            👤 Admin Profile
          </button>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            ⬅ Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={activeTab === "chart" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("chart")}
        >
          📊 Chart
        </button>
        <button
          style={activeTab === "products" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("products")}
        >
          🛍️ Products
        </button>
        <button
          style={activeTab === "services" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("services")}
        >
          🛠️ Services
        </button>
        <button
          style={activeTab === "users" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("users")}
        >
          👥 Users
        </button>
        <button
          style={activeTab === "orders" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("orders")}
        >
          📦 Orders
        </button>
        <button
          style={activeTab === "messages" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("messages")}
        >
          ✉️ Messages
        </button>
        <button
          style={activeTab === "enquiries" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("enquiries")}
        >
          📝 Enquiries
        </button>
        <button
          style={activeTab === "reviews" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("reviews")}
        >
          ⭐ Reviews
        </button>
        <button
          style={activeTab === "admins" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("admins")}
        >
          🔐 Admins
        </button>
      </div>

      {/* TAB CONTENT */}
      <div style={styles.tabContent}>
        {activeTab === "chart" && (
          <div style={styles.chartContainer}>
            <h2 style={styles.sectionHeading}>System Overview</h2>
            
            {/* Stats Cards Grid */}
            <div style={styles.statsGrid}>
              {chartData.map((item, index) => (
                <div 
                  key={index} 
                  style={{
                    ...styles.statCard,
                    borderLeft: `4px solid ${item.color}`,
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={styles.statIcon}>{item.icon}</div>
                  <h3 style={styles.statTitle}>{item.title}</h3>
                  <p style={styles.statNumber}>{item.value}</p>
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '4px',
                    background: `linear-gradient(90deg, ${item.color}, transparent)`,
                    opacity: 0.7
                  }}></div>
                </div>
              ))}
            </div>
            
            {/* Bar Chart Section */}
            <div style={styles.barChartSection}>
              <h3 style={styles.barChartTitle}>Statistics Visualization</h3>
              <div style={styles.barChartContainer}>
                {chartData.map((item, index) => (
                  <div key={index} style={styles.barChartItem}>
                    <div style={styles.barChartLabel}>
                      <span style={{ marginRight: '8px' }}>{item.icon}</span>
                      {item.title}
                    </div>
                    <div style={styles.barChartBarContainer}>
                      <div 
                        style={{
                          ...styles.barChartBar,
                          height: `${(item.value / maxValue) * 100}%`,
                          background: `linear-gradient(180deg, ${item.color}, ${item.color}dd)`
                        }}
                      />
                    </div>
                    <div style={styles.barChartValue}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {activeTab === "products" && (
          <Suspense fallback={<div style={styles.loading}>Loading Products...</div>}>
            <ProductsAdmin />
          </Suspense>
        )}
        {activeTab === "services" && (
          <Suspense fallback={<div style={styles.loading}>Loading Services...</div>}>
            <ServicesAdmin />
          </Suspense>
        )}
        {activeTab === "users" && (
          <div style={styles.tabSection}>
            <h2 style={styles.sectionHeading}>Users ({users.length})</h2>
            <input
              type="text"
              placeholder="Search Users..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              style={styles.searchInput}
            />
            {filteredUsers.length === 0 ? (
              <p style={styles.noDataText}>No users found</p>
            ) : (
              <div style={styles.grid}>
                {filteredUsers.map((u, i) => (
                  <div key={i} style={styles.card}>
                    <h4 style={styles.cardTitle}>{u.name}</h4>
                    <p style={styles.cardText}>{u.email}</p>
                    <button
                      onClick={() => handleRemoveUser(i)}
                      style={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {activeTab === "orders" && (
          <div style={styles.tabSection}>
            <h2 style={styles.sectionHeading}>Orders ({orders.length})</h2>
            <input
              type="text"
              placeholder="Search Orders..."
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              style={styles.searchInput}
            />
            {filteredOrders.length === 0 ? (
              <div style={styles.emptyState}>
                <h3 style={styles.emptyStateHeading}>No orders found</h3>
                <p style={styles.emptyStateText}>Orders placed on product or service pages will appear here.</p>
              </div>
            ) : (
              <div style={styles.grid}>
                {filteredOrders.map((o, i) => (
                  <div key={i} style={styles.card}>
                    <h4 style={styles.cardTitle}>User: {o.buyerName} ({o.buyerEmail})</h4>
                    <p style={styles.cardText}>Product: {o.title}</p>
                    <p style={styles.cardText}>Price: ₹{o.price.toLocaleString()}</p>
                    <p style={styles.cardText}>Payment: {o.payment}</p>
                    
                    {/* Order Status Tracking */}
                    <div style={styles.statusContainer}>
                      <p style={styles.cardText}>Status: 
                        <span style={{ 
                          color: o.status === "Confirmed" ? "#3498db" : 
                                o.status === "Processing" ? "#f39c12" :
                                o.status === "Shipped" ? "#9b59b6" :
                                o.status === "Out for Delivery" ? "#1abc9c" :
                                o.status === "Delivered" ? "#2ecc71" : "#e74c3c",
                          fontWeight: "bold",
                          marginLeft: "5px"
                        }}>
                          {o.status}
                        </span>
                      </p>
                      
                      <div style={styles.statusControls}>
                        <select
                          value={orderStatuses[o.id] || o.status}
                          onChange={(e) => setOrderStatuses({...orderStatuses, [o.id]: e.target.value})}
                          style={styles.statusSelect}
                        >
                          {orderStatusOptions.map((status, idx) => (
                            <option key={idx} value={status}>{status}</option>
                          ))}
                        </select>
                        
                        <button
                          onClick={() => handleUpdateOrderStatus(o.id, orderStatuses[o.id] || o.status)}
                          style={styles.updateStatusBtn}
                        >
                          Update Status
                        </button>
                      </div>
                    </div>
                    
                    <p style={styles.cardText}>Date: {o.date}</p>
                    <p style={styles.cardText}>Address: {o.address}</p>
                    {o.image && (
                      <div>
                        <p style={styles.cardText}>Product Image:</p>
                        <img src={o.image} alt="Product" style={styles.imagePreview} />
                      </div>
                    )}
                    <button
                      onClick={() => handleRemoveOrder(i)}
                      style={styles.deleteBtn}
                    >
                      Delete Order
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {activeTab === "messages" && (
          <div style={styles.tabSection}>
            <h2 style={styles.sectionHeading}>Messages ({messages.length})</h2>
            <input
              type="text"
              placeholder="Search Messages..."
              value={messageSearch}
              onChange={(e) => setMessageSearch(e.target.value)}
              style={styles.searchInput}
            />
            {filteredMessages.length === 0 ? (
              <p style={styles.noDataText}>No messages found</p>
            ) : (
              <div style={styles.grid}>
                {filteredMessages.map((m, i) => (
                  <div key={i} style={styles.card}>
                    <h4 style={styles.cardTitle}>{m.name}</h4>
                    <p style={styles.cardText}>Email: {m.email}</p>
                    <p style={styles.cardText}>Phone: {m.phone}</p>
                    <p style={styles.cardText}>Message: {m.message}</p>
                    <p style={styles.timestamp}>{m.timestamp}</p>
                    <button
                      onClick={() => handleRemoveMessage(i)}
                      style={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {activeTab === "enquiries" && (
          <div style={styles.tabSection}>
            <h2 style={styles.sectionHeading}>Enquiries ({enquiries.length})</h2>
            <input
              type="text"
              placeholder="Search Enquiries..."
              value={enquirySearch}
              onChange={(e) => setEnquirySearch(e.target.value)}
              style={styles.searchInput}
            />
            {filteredEnquiries.length === 0 ? (
              <div style={styles.emptyState}>
                <h3 style={styles.emptyStateHeading}>No enquiries found</h3>
                <p style={styles.emptyStateText}>Enquiries submitted from the Explore page will appear here.</p>
              </div>
            ) : (
              <div style={styles.grid}>
                {filteredEnquiries.map((e, i) => (
                  <div key={i} style={styles.card}>
                    <h4 style={styles.cardTitle}>{e.name}</h4>
                    <p style={styles.cardText}>Email: {e.email}</p>
                    <p style={styles.cardText}>Message: {e.message}</p>
                    <p style={styles.timestamp}>{e.timestamp}</p>
                    <button
                      onClick={() => handleRemoveEnquiry(i)}
                      style={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {activeTab === "reviews" && (
          <div style={styles.tabSection}>
            <h2 style={styles.sectionHeading}>Client Reviews ({reviews.length})</h2>
            <input
              type="text"
              placeholder="Search Reviews..."
              value={reviewSearch}
              onChange={(e) => setReviewSearch(e.target.value)}
              style={styles.searchInput}
            />
            {filteredReviews.length === 0 ? (
              <p style={styles.noDataText}>No reviews found</p>
            ) : (
              <div style={styles.grid}>
                {filteredReviews.map((r, i) => (
                  <div key={i} style={styles.card}>
                    <h4 style={styles.cardTitle}>{r.userName} ({r.userId})</h4>
                    <p style={styles.cardText}>Rating: {r.rating}/5</p>
                    <p style={styles.cardText}>Comment: {r.comment}</p>
                    <p style={styles.cardText}>Status: 
                      <span style={{ 
                        color: r.status === "approved" ? "#2ecc71" : "#f39c12",
                        fontWeight: "bold",
                        marginLeft: "5px"
                      }}>
                        {r.status}
                      </span>
                    </p>
                    <p style={styles.timestamp}>Date: {r.date}</p>
                    {r.beforeImage && (
                      <div>
                        <p style={styles.cardText}>Before Image:</p>
                        <img src={r.beforeImage} alt="Before" style={styles.imagePreview} />
                      </div>
                    )}
                    {r.afterImage && (
                      <div>
                        <p style={styles.cardText}>After Image:</p>
                        <img src={r.afterImage} alt="After" style={styles.imagePreview} />
                      </div>
                    )}
                    <div style={styles.buttonGroup}>
                      <button
                        onClick={() => handleToggleReviewStatus(i)}
                        style={r.status === "approved" ? styles.rejectBtn : styles.approveBtn}
                      >
                        {r.status === "approved" ? "Reject" : "Approve"}
                      </button>
                      <button
                        onClick={() => handleRemoveReview(i)}
                        style={styles.deleteBtn}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {activeTab === "admins" && (
          <div style={styles.tabSection}>
            <h2 style={styles.sectionHeading}>Admins ({admins.length})</h2>
            <div style={styles.adminActions}>
              <button 
                style={styles.addBtn} 
                onClick={() => setShowAddAdmin(true)}
              >
                ➕ Add New Admin
              </button>
            </div>
            <div style={styles.grid}>
              {admins.map((admin, i) => (
                <div key={i} style={styles.card}>
                  <h4 style={styles.cardTitle}>{admin.username}</h4>
                  <p style={styles.cardText}>Password: {admin.password.replace(/./g, '*')}</p>
                  <div style={styles.buttonGroup}>
                    {admin.username !== "admin" && admin.username !== currentAdmin && (
                      <button
                        onClick={() => handleRemoveAdmin(i)}
                        style={styles.deleteBtn}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Admin Profile Modal */}
      {showAdminProfile && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Admin Profile</h3>
            <div style={styles.profileInfo}>
              <p style={styles.profileInfoText}>
                <strong style={styles.profileInfoStrong}>Username:</strong> {currentAdmin}
              </p>
            </div>
            <div style={styles.modalButtons}>
              <button 
                style={styles.primaryBtn} 
                onClick={() => {
                  setShowAdminProfile(false);
                  setShowChangePassword(true);
                }}
              >
                🔒 Change Password
              </button>
              <button 
                style={styles.secondaryBtn} 
                onClick={() => setShowAdminProfile(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Admin Modal */}
      {showAddAdmin && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Add New Admin</h3>
            <form onSubmit={handleAddAdmin}>
              <input
                type="text"
                placeholder="Admin Username"
                value={newAdminData.username}
                onChange={(e) => setNewAdminData({...newAdminData, username: e.target.value})}
                style={styles.inputField}
                required
              />
              <input
                type="password"
                placeholder="Admin Password"
                value={newAdminData.password}
                onChange={(e) => setNewAdminData({...newAdminData, password: e.target.value})}
                style={styles.inputField}
                required
              />
              {adminError && <p style={styles.errorText}>{adminError}</p>}
              {adminSuccess && <p style={styles.successText}>{adminSuccess}</p>}
              <div style={styles.modalButtons}>
                <button type="submit" style={styles.primaryBtn}>Add Admin</button>
                <button 
                  type="button" 
                  style={styles.secondaryBtn} 
                  onClick={() => {
                    setShowAddAdmin(false);
                    setAdminError("");
                    setAdminSuccess("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Change Password Modal */}
      {showChangePassword && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Change Admin Password</h3>
            <form onSubmit={handleChangePassword}>
              <input
                type="password"
                placeholder="Current Password"
                value={changePasswordData.currentPassword}
                onChange={(e) => setChangePasswordData({...changePasswordData, currentPassword: e.target.value})}
                style={styles.inputField}
                required
              />
              <input
                type="password"
                placeholder="New Password"
                value={changePasswordData.newPassword}
                onChange={(e) => setChangePasswordData({...changePasswordData, newPassword: e.target.value})}
                style={styles.inputField}
                required
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={changePasswordData.confirmPassword}
                onChange={(e) => setChangePasswordData({...changePasswordData, confirmPassword: e.target.value})}
                style={styles.inputField}
                required
              />
              {adminError && <p style={styles.errorText}>{adminError}</p>}
              {adminSuccess && <p style={styles.successText}>{adminSuccess}</p>}
              <div style={styles.modalButtons}>
                <button type="submit" style={styles.primaryBtn}>Update Password</button>
                <button 
                  type="button" 
                  style={styles.secondaryBtn} 
                  onClick={() => {
                    setShowChangePassword(false);
                    setAdminError("");
                    setAdminSuccess("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------- STYLES -----------------
const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#0f0f1a",
    color: "#e6e6ff",
    fontFamily: "'Montserrat', sans-serif",
    padding: "20px",
    backgroundImage: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    flexWrap: "wrap",
    gap: "15px",
  },
  headerActions: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  adminInfo: {
    color: "#e6e6ff",
    marginRight: "15px",
    fontWeight: "600",
  },
  heading: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#7b68ee",
    textShadow: "0 0 15px rgba(123, 104, 238, 0.5)",
    letterSpacing: "1px",
    margin: 0,
  },
  profileBtn: {
    background: "linear-gradient(45deg, #ff6b6b, #ee5a24)",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
    boxShadow: "0 4px 15px rgba(238, 90, 36, 0.3)",
    transition: "all 0.3s ease",
    fontFamily: "'Montserrat', sans-serif",
  },
  logoutBtn: {
    background: "linear-gradient(45deg, #7b68ee, #6a5acd)",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
    boxShadow: "0 4px 15px rgba(123, 104, 238, 0.3)",
    transition: "all 0.3s ease",
    fontFamily: "'Montserrat', sans-serif",
  },
  tabs: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "30px",
    justifyContent: "center",
  },
  tab: {
    padding: "12px 20px",
    borderRadius: "12px",
    border: "2px solid #2d2d4d",
    background: "#1a1a2e",
    color: "#e6e6ff",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
    fontFamily: "'Montserrat', sans-serif",
  },
  activeTab: {
    padding: "12px 20px",
    borderRadius: "12px",
    border: "2px solid #7b68ee",
    background: "linear-gradient(45deg, #7b68ee, #6a5acd)",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
    boxShadow: "0 4px 15px rgba(123, 104, 238, 0.3)",
    fontFamily: "'Montserrat', sans-serif",
  },
  tabContent: {
    marginBottom: "40px",
  },
  tabSection: {
    backgroundColor: "#1a1a2e",
    padding: "25px",
    borderRadius: "20px",
    border: "1px solid #2d2d4d",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
  },
  sectionHeading: {
    fontSize: "24px",
    marginTop: 0,
    marginBottom: "20px",
    color: "#9370db",
    fontWeight: "700",
    borderBottom: "2px solid #9370db",
    paddingBottom: "10px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  card: {
    background: "#252547",
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
    border: "1px solid #3d3d6b",
    transition: "transform 0.3s ease",
  },
  cardTitle: {
    fontSize: "18px",
    marginTop: 0,
    marginBottom: "10px",
    color: "#9370db",
    fontWeight: "600",
  },
  cardText: {
    margin: "8px 0",
    color: "#e6e6ff",
    lineHeight: "1.5",
  },
  deleteBtn: {
    background: "#e74c3c",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
    fontFamily: "'Montserrat', sans-serif",
  },
  approveBtn: {
    background: "#2ecc71",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
    fontFamily: "'Montserrat', sans-serif",
  },
  rejectBtn: {
    background: "#f39c12",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
    fontFamily: "'Montserrat', sans-serif",
  },
  addBtn: {
    background: "#2ecc71",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
    fontFamily: "'Montserrat', sans-serif",
    marginBottom: "15px",
  },
  adminActions: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "15px",
  },
  searchInput: {
    width: "100%",
    padding: "12px 15px",
    borderRadius: "10px",
    border: "2px solid #2d2d4d",
    backgroundColor: "#252547",
    color: "#e6e6ff",
    fontSize: "16px",
    marginBottom: "15px",
    fontFamily: "'Montserrat', sans-serif",
    outline: "none",
    transition: "border-color 0.3s ease",
  },
  imagePreview: {
    width: "100%",
    maxHeight: "200px",
    objectFit: "cover",
    borderRadius: "8px",
    marginTop: "8px",
    border: "2px solid #3d3d6b",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "15px",
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
    color: '#a9a9cc'
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    color: '#a9a9cc'
  },
  emptyStateHeading: {
    fontSize: '22px',
    marginBottom: '10px',
    color: '#9370db'
  },
  emptyStateText: {
    fontSize: '16px',
    lineHeight: '1.5'
  },
  noDataText: {
    textAlign: 'center',
    color: '#a9a9cc',
    fontSize: '18px',
    padding: '30px'
  },
  timestamp: {
    fontSize: "14px",
    color: "#a9a9cc",
    marginTop: "10px",
    fontStyle: "italic",
  },
  // Chart styles
  chartContainer: {
    backgroundColor: "#1a1a2e",
    padding: "25px",
    borderRadius: "20px",
    border: "1px solid #2d2d4d",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
    backgroundImage: "linear-gradient(135deg, #1a1a2e 0%, #252547 100%)",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "20px",
    marginTop: "20px",
    marginBottom: "40px",
  },
  statCard: {
    background: "linear-gradient(135deg, #252547 0%, #2d2d5a 100%)",
    padding: "25px 20px",
    borderRadius: "15px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
    border: "1px solid #3d3d6b",
    textAlign: "center",
    transition: "all 0.3s ease",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
  },
  statIcon: {
    fontSize: "32px",
    marginBottom: "15px",
    filter: "drop-shadow(0 0 8px rgba(123, 104, 238, 0.5))",
  },
  statTitle: {
    fontSize: "18px",
    marginTop: 0,
    marginBottom: "10px",
    color: "#e6e6ff",
    fontWeight: "600",
  },
  statNumber: {
    fontSize: "36px",
    fontWeight: "700",
    color: "#fff",
    margin: 0,
    textShadow: "0 0 10px rgba(123, 104, 238, 0.5)",
  },
  // Bar Chart styles
  barChartSection: {
    marginTop: "40px",
    marginBottom: "40px",
  },
  barChartTitle: {
    fontSize: "20px",
    color: "#e6e6ff",
    marginBottom: "20px",
    fontWeight: "600",
  },
  barChartContainer: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-around",
    height: "250px",
    backgroundColor: "rgba(45, 45, 77, 0.5)",
    borderRadius: "15px",
    padding: "20px",
    border: "1px solid #3d3d6b",
  },
  barChartItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "12%",
    height: "100%",
  },
  barChartLabel: {
    color: "#e6e6ff",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "10px",
    textAlign: "center",
  },
  barChartBarContainer: {
    flex: 1,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  barChartBar: {
    width: "70%",
    borderRadius: "8px 8px 0 0",
    transition: "height 1s ease-in-out",
    position: "relative",
  },
  barChartValue: {
    color: "#fff",
    fontSize: "16px",
    fontWeight: "700",
    marginTop: "10px",
  },
  // Modal styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    background: '#1a1a2e',
    padding: '25px',
    borderRadius: '15px',
    width: '90%',
    maxWidth: '400px',
    border: '1px solid #2d2d4d',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
    position: 'relative',
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '22px',
    fontWeight: '700',
    color: '#fff',
  },
  inputField: {
    width: '100%',
    padding: '12px 15px',
    marginBottom: '12px',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    color: '#fff',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  modalButtons: {
    display: 'flex',
    gap: '10px',
    marginTop: '15px',
  },
  primaryBtn: {
    flex: 1,
    padding: '10px',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #7b68ee, #6a5acd)',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontFamily: "'Montserrat', sans-serif",
  },
  secondaryBtn: {
    flex: 1,
    padding: '10px',
    borderRadius: '8px',
    background: 'transparent',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    cursor: 'pointer',
    fontWeight: '600',
    fontFamily: "'Montserrat', sans-serif",
  },
  profileInfo: {
    textAlign: 'left',
  },
  profileInfoText: {
    marginBottom: '10px',
    fontSize: '16px',
  },
  profileInfoStrong: {
    color: '#00d4ff',
  },
  errorText: {
    color: '#ff4757',
    textAlign: 'center',
    marginBottom: '15px',
    fontSize: '14px',
  },
  successText: {
    color: '#2ed573',
    textAlign: 'center',
    marginBottom: '15px',
    fontSize: '14px',
  },
  // Login form styles
  loginContainer: {
    minHeight: "100vh",
    backgroundColor: "#0f0f1a",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    backgroundImage: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%)",
  },
  loginForm: {
    background: "#1a1a2e",
    padding: "40px",
    borderRadius: "20px",
    width: "100%",
    maxWidth: "400px",
    border: "1px solid #2d2d4d",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
  },
  loginHeading: {
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "28px",
    fontWeight: "700",
    color: "#7b68ee",
  },
  loginBtn: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #7b68ee, #6a5acd)",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "16px",
    fontFamily: "'Montserrat', sans-serif",
    marginTop: "10px",
  },
  loginFooter: {
    marginTop: "20px",
    textAlign: "center",
  },
  backBtn: {
    background: "transparent",
    color: "#7b68ee",
    border: "1px solid #7b68ee",
    padding: "8px 15px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
    fontFamily: "'Montserrat', sans-serif",
  },
  // Order status tracking styles
  statusContainer: {
    margin: "15px 0",
    padding: "10px",
    backgroundColor: "rgba(45, 45, 77, 0.5)",
    borderRadius: "8px",
  },
  statusControls: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  statusSelect: {
    flex: 1,
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #3d3d6b",
    backgroundColor: "#252547",
    color: "#e6e6ff",
    fontSize: "14px",
  },
  updateStatusBtn: {
    background: "linear-gradient(45deg, #3498db, #2980b9)",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.3s ease",
    fontFamily: "'Montserrat', sans-serif",
  },
};

// Add this to your main HTML file or use a CSS-in-JS solution to import fonts
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

export default AdminPanel;