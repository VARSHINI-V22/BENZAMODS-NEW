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
        // Load existing data or initialize with empty arrays
        const existingUsers = safeStorage.getItem("users") || [];
        const existingMessages = safeStorage.getItem("submittedMessages") || [];
        const ordersData = safeStorage.getItem("orders") || 
                          safeStorage.getItem("orderHistory") || 
                          [];
        const existingReviews = safeStorage.getItem("reviews") || [];
        
        // Add static users if they don't exist
        const staticUsers = [
          { name: "varshini", email: "varshini22@gmail.com" },
          { name: "ashwini", email: "ashwini11@gmail.com" }
        ];
        
        // Add static messages if they don't exist
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
        
        // Merge existing data with static data
        const allUsers = existingUsers.length > 0 ? existingUsers : staticUsers;
        const allMessages = existingMessages.length > 0 ? existingMessages : staticMessages;
        
        setUsers(allUsers);
        setOrders(ordersData);
        setMessages(allMessages);
        setReviews(existingReviews);
        
        // Save to localStorage if we're using static data
        if (existingUsers.length === 0) {
          safeStorage.setItem("users", staticUsers);
        }
        if (existingMessages.length === 0) {
          safeStorage.setItem("submittedMessages", staticMessages);
        }
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
      <div style={styles.header}>
        <h1 style={styles.heading}>Admin Dashboard</h1>
        <button style={styles.logoutBtn} onClick={() => navigate("/")}>
          ⬅ Back to Home
        </button>
      </div>
      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={activeTab === "dashboard" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("dashboard")}
        >
          📊 Dashboard
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
          style={activeTab === "reviews" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("reviews")}
        >
          ⭐ Reviews
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
                    <p style={styles.cardText}>Status: 
                      <span style={{ 
                        color: o.status === "Confirmed" ? "#2ecc71" : 
                              o.status === "Cancelled" ? "#e74c3c" : "#f39c12",
                        fontWeight: "bold",
                        marginLeft: "5px"
                      }}>
                        {o.status}
                      </span>
                    </p>
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
      </div>
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
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    flexWrap: "wrap",
    gap: "15px",
  },
  heading: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#7b68ee",
    textShadow: "0 0 15px rgba(123, 104, 238, 0.5)",
    letterSpacing: "1px",
    margin: 0,
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
  }
};
// Add this to your main HTML file or use a CSS-in-JS solution to import fonts
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);
export default AdminPanel;