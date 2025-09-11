import React, { useState } from "react";
import axios from "axios";

/**
 * Drop this file into: frontend/src/pages/ContactPage.jsx
 * Your App.js already routes "/contact" to this page.
 */

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [errors, setErrors] = useState([]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setErrors([]);
    try {
      const res = await axios.post("http://localhost:5000/api/contact", form);
      if (res.data && res.data.ok) {
        setSuccess("✅ Your message has been sent! We'll reach out soon.");
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        setErrors([res.data?.message || "Something went wrong"]);
      }
    } catch (err) {
      const msgs = err.response?.data?.errors || [err.response?.data?.message || "Submission failed"];
      setErrors(msgs);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
        <p className="text-gray-600 mb-6">Have a question or need a quote? Fill out the form and we'll get back to you.</p>

        {success && <div className="mb-4 p-3 rounded bg-green-50 text-green-700">{success}</div>}
        {errors.length > 0 && (
          <div className="mb-4 p-3 rounded bg-red-50 text-red-700">
            {errors.map((e, i) => <div key={i}>{e}</div>)}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows="5"
              required
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>

        {/* Optional extras: map / whatsapp buttons can be added below if you want */}
      </div>
    </div>
  );
}
