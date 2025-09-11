// src/components/AdminPanel.js
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
  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [messageSearch, setMessageSearch] = useState("");
  const [reviewSearch, setReviewSearch] = useState("");

  useEffect(() => {
    // Load all data from localStorage
    const loadData = () => {
      try {
        setUsers(safeStorage.getItem("users") || []);
        
        // Try multiple possible keys for orders
        const ordersData = safeStorage.getItem("orders") || 
                          safeStorage.getItem("orderHistory") || 
                          [];
        setOrders(ordersData);
        
        setMessages(safeStorage.getItem("submittedMessages") || []);
        setReviews(safeStorage.getItem("reviews") || []);
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
          // Migrate old orders to new format
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
    
    // Set up storage event listener to sync data across tabs
    const handleStorageChange = (e) => {
      if (e.key === "orders") {
        try {
          setOrders(JSON.parse(e.newValue) || []);
        } catch (error) {
          console.error("Error parsing orders data:", error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Remove handlers
  const handleRemoveUser = (index) => {
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
        
        // Also update alternative key if exists
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

  const handleToggleReviewStatus = (index) => {
    const updated = [...reviews];
    updated[index].status = updated[index].status === "approved" ? "pending" : "approved";
    setReviews(updated);
    safeStorage.setItem("reviews", updated);
  };

  // Normalize order data for consistent display
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

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Admin Panel</h1>
      <button style={styles.logoutBtn} onClick={() => navigate("/")}>
        ⬅ Back to Home
      </button>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={activeTab === "dashboard" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("dashboard")}
        >
          Dashboard
        </button>
        <button
          style={activeTab === "products" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("products")}
        >
          Products
        </button>
        <button
          style={activeTab === "services" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("services")}
        >
          Services
        </button>
        <button
          style={activeTab === "users" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
        <button
          style={activeTab === "orders" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </button>
        <button
          style={activeTab === "messages" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("messages")}
        >
          Messages
        </button>
        <button
          style={activeTab === "reviews" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("reviews")}
        >
          Reviews
        </button>
      </div>

      {/* ----------------- TAB CONTENT ----------------- */}
      <div style={styles.tabContent}>
        {activeTab === "dashboard" && (
          <Suspense fallback={<div style={styles.loading}>Loading Dashboard...</div>}>
            <AdminDashboard />
          </Suspense>
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
          <div>
            <h2>Users ({users.length})</h2>
            <input
              type="text"
              placeholder="Search Users..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              style={styles.searchInput}
            />
            {filteredUsers.length === 0 ? (
              <p>No users found</p>
            ) : (
              <div style={styles.grid}>
                {filteredUsers.map((u, i) => (
                  <div key={i} style={styles.card}>
                    <h4>{u.name}</h4>
                    <p>{u.email}</p>
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
          <div>
            <h2>Orders ({orders.length})</h2>
            <input
              type="text"
              placeholder="Search Orders..."
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              style={styles.searchInput}
            />
            {filteredOrders.length === 0 ? (
              <div style={styles.emptyState}>
                <h3>No orders found</h3>
                <p>Orders placed on product or service pages will appear here.</p>
              </div>
            ) : (
              <div style={styles.grid}>
                {filteredOrders.map((o, i) => (
                  <div key={i} style={styles.card}>
                    <h4>User: {o.buyerName} ({o.buyerEmail})</h4>
                    <p>Product: {o.title}</p>
                    <p>Price: ₹{o.price.toLocaleString()}</p>
                    <p>Payment: {o.payment}</p>
                    <p>Status: 
                      <span style={{ 
                        color: o.status === "Confirmed" ? "green" : 
                              o.status === "Cancelled" ? "red" : "orange",
                        fontWeight: "bold",
                        marginLeft: "5px"
                      }}>
                        {o.status}
                      </span>
                    </p>
                    <p>Date: {o.date}</p>
                    <p>Address: {o.address}</p>
                    {o.image && (
                      <div>
                        <p>Product Image:</p>
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
          <div>
            <h2>Messages ({messages.length})</h2>
            <input
              type="text"
              placeholder="Search Messages..."
              value={messageSearch}
              onChange={(e) => setMessageSearch(e.target.value)}
              style={styles.searchInput}
            />
            {filteredMessages.length === 0 ? (
              <p>No messages found</p>
            ) : (
              <div style={styles.grid}>
                {filteredMessages.map((m, i) => (
                  <div key={i} style={styles.card}>
                    <h4>{m.name}</h4>
                    <p>Email: {m.email}</p>
                    <p>Phone: {m.phone}</p>
                    <p>Message: {m.message}</p>
                    <p style={{ fontSize: "12px", color: "gray" }}>{m.timestamp}</p>
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
        {activeTab === "reviews" && (
          <div>
            <h2>Client Reviews ({reviews.length})</h2>
            <input
              type="text"
              placeholder="Search Reviews..."
              value={reviewSearch}
              onChange={(e) => setReviewSearch(e.target.value)}
              style={styles.searchInput}
            />
            {filteredReviews.length === 0 ? (
              <p>No reviews found</p>
            ) : (
              <div style={styles.grid}>
                {filteredReviews.map((r, i) => (
                  <div key={i} style={styles.card}>
                    <h4>{r.userName} ({r.userId})</h4>
                    <p>Rating: {r.rating}/5</p>
                    <p>Comment: {r.comment}</p>
                    <p>Status: 
                      <span style={{ 
                        color: r.status === "approved" ? "green" : "orange",
                        fontWeight: "bold",
                        marginLeft: "5px"
                      }}>
                        {r.status}
                      </span>
                    </p>
                    <p style={{ fontSize: "12px", color: "gray" }}>Date: {r.date}</p>
                    {r.beforeImage && (
                      <div>
                        <p>Before Image:</p>
                        <img src={r.beforeImage} alt="Before" style={styles.imagePreview} />
                      </div>
                    )}
                    {r.afterImage && (
                      <div>
                        <p>After Image:</p>
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
      </div>
    </div>
  );
}

// ----------------- STYLES -----------------
const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Poppins, sans-serif",
  },
  heading: {
    fontSize: "32px",
    textAlign: "center",
    marginBottom: "20px",
    fontWeight: "bold",
    color: "#2c3e50",
  },
  logoutBtn: {
    background: "#34495e",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "20px",
  },
  tabs: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "20px",
  },
  tab: {
    padding: "10px 15px",
    borderRadius: "8px",
    border: "1px solid #34495e",
    background: "#ecf0f1",
    cursor: "pointer",
  },
  activeTab: {
    padding: "10px 15px",
    borderRadius: "8px",
    border: "1px solid #34495e",
    background: "#34495e",
    color: "white",
    cursor: "pointer",
  },
  tabContent: {
    marginBottom: "40px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "15px",
    marginTop: "15px",
  },
  card: {
    background: "white",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  deleteBtn: {
    background: "#e74c3c",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  approveBtn: {
    background: "#2ecc71",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "5px",
  },
  rejectBtn: {
    background: "#f39c12",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "5px",
  },
  searchInput: {
    width: "100%",
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #bdc3c7",
    marginBottom: "10px",
  },
  imagePreview: {
    width: "100%",
    maxHeight: "150px",
    objectFit: "cover",
    borderRadius: "5px",
    marginTop: "5px",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
    color: '#666'
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    color: '#666'
  }
};

export default AdminPanel;