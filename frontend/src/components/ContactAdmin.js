// ContactAdmin.js
import React, { useState, useEffect } from "react";

const ContactAdmin = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // Set body background color when component mounts
  useEffect(() => {
    document.body.style.backgroundColor = "#0f0f1a";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.fontFamily = "'Montserrat', sans-serif";
    
    // Clean up when component unmounts
    return () => {
      document.body.style.backgroundColor = "";
      document.body.style.margin = "";
      document.body.style.padding = "";
      document.body.style.fontFamily = "";
    };
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Get existing messages or initialize empty array
    const existingMessages = JSON.parse(localStorage.getItem("submittedMessages")) || [];
    
    // Create new message with timestamp
    const newMessage = { 
      ...form, 
      timestamp: new Date().toLocaleString(),
      id: Date.now() // Add unique ID
    };
    
    // Save to localStorage
    localStorage.setItem("submittedMessages", JSON.stringify([...existingMessages, newMessage]));
    
    alert("Message submitted successfully! Admin will review it shortly.");
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div style={styles.pageContainer}>
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
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#0f0f1a",
    overflowY: "auto",
    fontFamily: "'Montserrat', sans-serif",
  },
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "30px 20px",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
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
    border: "1px solid #2d2d4d", // Fixed the syntax error here
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
    border: "2px solid #2d2d4d", // Fixed the syntax error here
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
    border: "2px solid #2d2d4d", // Fixed the syntax error here
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
};

export default ContactAdmin;