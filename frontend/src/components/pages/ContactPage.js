import React, { useState } from "react";
import axios from "axios";
import MyMap from "../MyMap"; // ✅ your existing map component

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/contact", formData);
      setStatus("✅ Message sent successfully!");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      console.error(error);
      setStatus("❌ Failed to send. Please try again.");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Page Heading */}
      <h1 className="text-3xl font-bold mb-6 text-center">Contact Us</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Form */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Your Phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              rows="4"
              required
            ></textarea>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Submit
            </button>
          </form>
          {status && (
            <p className="mt-3 text-center font-medium text-gray-700">{status}</p>
          )}
        </div>

        {/* Contact Info & Map */}
        <div className="space-y-6">
          {/* WhatsApp Button */}
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-3">Chat with us</h2>
            <a
              href="https://wa.me/919876543210?text=Hello%20I%20would%20like%20to%20know%20more%20about%20your%20services"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              💬 WhatsApp Us
            </a>
          </div>

          {/* Workshop Info */}
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-3">Our Workshop</h2>
            <p className="text-gray-700">
              <strong>Address:</strong> #123, MG Road, Bangalore, India
            </p>
            <p className="text-gray-700">
              <strong>Timings:</strong> Mon - Sat, 10:00 AM - 8:00 PM
            </p>
            <p className="text-gray-700">
              <strong>Phone:</strong> +91 98765 43210
            </p>
          </div>

          {/* Google Map */}
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-3">Find Us Here</h2>
            <MyMap />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
