import React, { useState, useEffect } from "react";

const ContactAdmin = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [submittedMessages, setSubmittedMessages] = useState(
    () => JSON.parse(localStorage.getItem("submittedMessages")) || []
  );

  const [showAdminPanel, setShowAdminPanel] = useState(false);

  useEffect(() => {
    localStorage.setItem("submittedMessages", JSON.stringify(submittedMessages));
  }, [submittedMessages]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMessage = { ...form, timestamp: new Date().toLocaleString() };
    setSubmittedMessages([newMessage, ...submittedMessages]);
    alert("Message submitted successfully!");
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  const toggleAdminPanel = () => {
    setShowAdminPanel(!showAdminPanel);
  };

  const clearAllMessages = () => {
    if (window.confirm("Are you sure you want to clear all messages?")) {
      setSubmittedMessages([]);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Contact Us</h1>

      {/* User Form */}
      <div style={styles.card}>
        <h2 style={styles.cardHeading}>Send a Message</h2>
        <form style={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <textarea
            name="message"
            placeholder="Message"
            value={form.message}
            onChange={handleChange}
            style={styles.textarea}
            required
          />
          <button type="submit" style={styles.submitButton}>
            Send Message
          </button>
        </form>
      </div>

      {/* Admin Panel Toggle Button */}
      <div style={styles.adminButtonContainer}>
        <button onClick={toggleAdminPanel} style={styles.adminToggleButton}>
          {showAdminPanel ? "Hide Admin Panel" : "Show Admin Panel"}
        </button>
      </div>

      {/* Admin Panel */}
      {showAdminPanel && (
        <div style={styles.adminPanel}>
          <div style={styles.adminHeader}>
            <h2 style={styles.adminHeading}>Admin Panel - Messages</h2>
            {submittedMessages.length > 0 && (
              <button onClick={clearAllMessages} style={styles.clearButton}>
                Clear All Messages
              </button>
            )}
          </div>
          
          {submittedMessages.length === 0 ? (
            <p style={styles.noMessages}>No messages yet.</p>
          ) : (
            <div style={styles.messagesList}>
              {submittedMessages.map((msg, index) => (
                <div key={index} style={styles.messageItem}>
                  <div style={styles.messageHeader}>
                    <span style={styles.senderName}>{msg.name}</span>
                    <span style={styles.timestamp}>{msg.timestamp}</span>
                  </div>
                  <p style={styles.messageText}>{msg.message}</p>
                  <div style={styles.contactInfo}>
                    <span style={styles.contactItem}>{msg.email}</span>
                    <span style={styles.contactItem}>{msg.phone}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "30px 20px",
    fontFamily: "'Montserrat', sans-serif",
    backgroundColor: "#0f0f1a",
    minHeight: "100vh",
    color: "#e6e6ff",
  },
  heading: {
    textAlign: "center",
    fontSize: "42px",
    marginBottom: "40px",
    color: "#7b68ee",
    fontWeight: "800",
    textShadow: "0 0 15px rgba(123, 104, 238, 0.5)",
    letterSpacing: "1px",
  },
  card: {
    backgroundColor: "#1a1a2e",
    padding: "30px",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
    marginBottom: "20px",
    border: "1px solid #2d2d4d",
  },
  cardHeading: {
    textAlign: "center",
    fontSize: "28px",
    marginBottom: "25px",
    color: "#9370db",
    fontWeight: "700",
    borderBottom: "2px solid #9370db",
    paddingBottom: "10px",
    letterSpacing: "0.5px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  input: {
    padding: "15px",
    fontSize: "16px",
    borderRadius: "12px",
    border: "2px solid #2d2d4d",
    outline: "none",
    backgroundColor: "#252547",
    color: "#e6e6ff",
    transition: "all 0.3s ease",
    fontFamily: "'Montserrat', sans-serif",
  },
  textarea: {
    padding: "15px",
    fontSize: "16px",
    borderRadius: "12px",
    border: "2px solid #2d2d4d",
    minHeight: "120px",
    outline: "none",
    backgroundColor: "#252547",
    color: "#e6e6ff",
    transition: "all 0.3s ease",
    resize: "vertical",
    fontFamily: "'Montserrat', sans-serif",
  },
  submitButton: {
    padding: "16px",
    fontSize: "18px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(45deg, #7b68ee, #6a5acd)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(123, 104, 238, 0.3)",
    fontFamily: "'Montserrat', sans-serif",
  },
  adminButtonContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  adminToggleButton: {
    padding: "12px 24px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(45deg, #9370db, #7b68ee)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
  },
  adminPanel: {
    backgroundColor: "#1a1a2e",
    padding: "30px",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
    border: "1px solid #2d2d4d",
    marginTop: "20px",
  },
  adminHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "10px",
  },
  adminHeading: {
    fontSize: "24px",
    color: "#9370db",
    fontWeight: "700",
    margin: 0,
  },
  clearButton: {
    padding: "8px 16px",
    fontSize: "14px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#ff4757",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
  },
  noMessages: {
    textAlign: "center",
    color: "#a9a9cc",
    fontSize: "16px",
    padding: "20px",
  },
  messagesList: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    maxHeight: "400px",
    overflowY: "auto",
    padding: "10px",
  },
  messageItem: {
    backgroundColor: "#252547",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #3d3d6b",
  },
  messageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  senderName: {
    fontWeight: "600",
    color: "#9370db",
    fontSize: "18px",
  },
  timestamp: {
    color: "#a9a9cc",
    fontSize: "14px",
  },
  messageText: {
    margin: "10px 0",
    lineHeight: "1.6",
    color: "#e6e6ff",
  },
  contactInfo: {
    display: "flex",
    gap: "15px",
    marginTop: "10px",
  },
  contactItem: {
    color: "#a9a9cc",
    fontSize: "14px",
  },
};

// Add this to your main HTML file or use a CSS-in-JS solution to import fonts
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

export default ContactAdmin;