// src/components/DetailEnquiryForm.js
import React, { useState } from "react";

export default function DetailEnquiryForm() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log("Enquiry Submitted:", formData);
    alert("Enquiry submitted successfully!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto mt-6 p-6 bg-white rounded-xl shadow-lg"
    >
      <h3 className="text-xl font-semibold mb-4">Send an Enquiry</h3>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
        className="w-full mb-3 p-2 border rounded"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
        className="w-full mb-3 p-2 border rounded"
      />
      <textarea
        name="message"
        placeholder="Message"
        value={formData.message}
        onChange={handleChange}
        required
        className="w-full mb-3 p-2 border rounded"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
      >
        Submit
      </button>
    </form>
  );
}
