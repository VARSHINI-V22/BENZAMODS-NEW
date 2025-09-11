import React from "react";

export default function ProductForm({ form, setForm, handleSubmit, editId, cancelEdit }) {
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="mb-6 space-y-2">
      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <input
        name="price"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <input
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <input
        name="image"
        placeholder="Image URL"
        value={form.image}
        onChange={handleChange}
        className="border p-2 w-full"
      />

      {/* Dropdown for Category */}
      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      >
        <option value="">Select Category</option>
        <option value="car">Car</option>
        <option value="bike">Bike</option>
      </select>

      {/* Live Preview */}
      {form.image && (
        <div className="mt-2">
          <p className="text-gray-600 mb-1">Image Preview:</p>
          <img src={form.image} alt="Preview" className="w-32 h-32 object-cover rounded border" />
        </div>
      )}

      <div className="mt-2">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editId ? "Update Product" : "Add Product"}
        </button>
        {editId && (
          <button
            onClick={cancelEdit}
            className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
