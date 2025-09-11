import React, { useState } from "react";
import axios from "axios";

const EnquiryForm = ({ serviceId }) => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [success, setSuccess] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/enquiries", {
        ...form,
        serviceId, // attach service ID
      });
      setSuccess("Enquiry submitted successfully!");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      setSuccess("Failed to submit enquiry.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
      {success && <p className="text-green-600">{success}</p>}

      <input
        type="text"
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        required
        className="border p-2 w-full rounded"
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
        className="border p-2 w-full rounded"
      />

      <textarea
        name="message"
        placeholder="Your Message"
        value={form.message}
        onChange={handleChange}
        required
        className="border p-2 w-full rounded"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Send Enquiry
      </button>
    </form>
  );
};

export default EnquiryForm;
