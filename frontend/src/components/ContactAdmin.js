import React, { useState, useEffect } from "react";

const ContactAdmin = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // Save submitted messages in localStorage
  const [submittedMessages, setSubmittedMessages] = useState(
    () => JSON.parse(localStorage.getItem("submittedMessages")) || []
  );

  // Persist messages
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
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "700px",
    margin: "30px auto",
    padding: "15px",
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: "#f5f7fa",
  },
  heading: {
    textAlign: "center",
    fontSize: "32px",
    marginBottom: "30px",
    color: "#1e1e2f",
    fontWeight: "700",
  },

  card: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    marginBottom: "30px",
  },
  cardHeading: {
    textAlign: "center",
    fontSize: "22px",
    marginBottom: "20px",
    color: "#ff6b81",
    fontWeight: "700",
    borderBottom: "1px solid #ff6b81",
    paddingBottom: "5px",
  },

  form: { display: "flex", flexDirection: "column", gap: "15px" },
  input: {
    padding: "10px",
    fontSize: "14px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    outline: "none",
  },
  textarea: {
    padding: "10px",
    fontSize: "14px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    minHeight: "80px",
    outline: "none",
  },
  submitButton: {
    padding: "12px",
    fontSize: "14px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#ff6b81",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default ContactAdmin;
