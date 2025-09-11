import React, { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/products";

export default function ProductForm() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    category: "Car"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(API, form);
      console.log("✅ Product saved:", res.data);
      alert("Product added successfully!");
      setForm({ name: "", price: "", description: "", image: "", category: "Car" });
    } catch (err) {
      console.error("❌ Error saving product:", err);
      alert("Failed to save product. Check console.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
      <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
      <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
      <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} />
      <select name="category" value={form.category} onChange={handleChange}>
        <option value="Car">Car</option>
        <option value="Bike">Bike</option>
      </select>
      <button type="submit">Add Product</button>
    </form>
  );
}                                                                                                                                                                      