import React, { useEffect, useState } from "react";

/* ------------------ helper for localStorage ------------------ */
const readLS = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};
const writeLS = (key, value) => localStorage.setItem(key, JSON.stringify(value));

export default function ServicesAdmin() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "car",
    price: "",
    description: "",
    image: ""
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/services");
      const data = await res.json();
      setServices(data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ------------------ FORM HANDLERS ------------------ */
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        const res = await fetch(`http://localhost:5000/api/services/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        });
        const updated = await res.json();
        setServices(services.map(s => (s._id === editingId ? updated : s)));
        setEditingId(null);
      } else {
        const res = await fetch("http://localhost:5000/api/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        });
        const data = await res.json();
        setServices([...services, data]);
      }
      setForm({ name: "", category: "car", price: "", description: "", image: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to save service");
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/services/${id}`, { method: "DELETE" });
      setServices(services.filter(s => s._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete service");
    }
  };

  const handleEdit = (service) => {
    setForm({
      name: service.name,
      category: service.category,
      price: service.price,
      description: service.description,
      image: service.image
    });
    setEditingId(service._id);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* HEADER */}
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Services Admin</h1>
      </header>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-2">{editingId ? "Edit Service" : "Add New Service"}</h3>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border p-2 mb-2 w-full rounded" required />
        <select name="category" value={form.category} onChange={handleChange} className="border p-2 mb-2 w-full rounded">
          <option value="car">Car</option>
          <option value="bike">Bike</option>
        </select>
        <input name="price" placeholder="Price" type="number" value={form.price} onChange={handleChange} className="border p-2 mb-2 w-full rounded" required />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border p-2 mb-2 w-full rounded" required />
        <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} className="border p-2 mb-2 w-full rounded" required />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{editingId ? "Update Service" : "Add Service"}</button>
      </form>

      {/* SERVICES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(s => (
          <div key={s._id} className="bg-white shadow-lg rounded p-4 flex flex-col">
            <img src={s.image} alt={s.name} className="h-48 w-full object-cover rounded mb-3" />
            <h3 className="text-lg font-semibold">{s.name}</h3>
            <p className="text-gray-600 mb-2">{s.description}</p>
            <p className="text-gray-800 font-bold mb-2">₹{s.price}</p>
            <p className="text-gray-500 mb-2">Category: {s.category}</p>
            <div className="flex gap-2 mt-auto">
              <button onClick={() => handleEdit(s)} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Edit</button>
              <button onClick={() => handleDelete(s._id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
