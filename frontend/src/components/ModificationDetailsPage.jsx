import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ModificationDetailsPage() {
  const { modId } = useParams();
  const [details, setDetails] = useState([]);

  // enquiry form state
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    fetch(`http://localhost:5000/details/${modId}`)
      .then((res) => res.json())
      .then((data) => setDetails(data));
  }, [modId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO: send form data to backend API if required
    console.log("Enquiry submitted:", form);

    alert("Your enquiry has been submitted!");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="p-6">
      {/* Wraps Header */}
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Available Wraps
      </h1>

      {/* Wraps List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {details.map((detail) => (
          <div
            key={detail._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 text-center"
          >
            <img
              src={detail.image}
              alt={detail.title}
              className="w-full h-48 object-cover rounded-xl mb-3"
            />
            <h2 className="text-lg font-semibold text-gray-900">
              {detail.title}
            </h2>
            <p className="text-gray-600 text-sm">{detail.description}</p>
          </div>
        ))}
      </div>

      {/* Enquiry Form Section */}
      <div className="mt-12 bg-gray-50 p-6 rounded-2xl shadow-md max-w-xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
          Enquiry Form
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400"
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows="4"
            value={form.message}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400"
            required
          />
          <button
            type="submit"
            className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition"
          >
            Submit Enquiry
          </button>
        </form>
      </div>
    </div>
  );
}
