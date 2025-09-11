import { useState } from "react";

const initialMods = [
  { id: 1, name: "Body Kits", desc: "Enhance your car’s looks with custom body kits." },
  { id: 2, name: "Interiors", desc: "Luxury seat covers, dashboards, and ambient lighting." },
  { id: 3, name: "Exhaust Systems", desc: "Performance exhaust upgrades for sound & power." },
  { id: 4, name: "Alloy Wheels", desc: "Premium alloy wheels in various stylish designs." },
  { id: 5, name: "Wraps & Paint", desc: "Custom wraps and premium paint finishes." },
];

export default function CarModifications() {
  const [mods, setMods] = useState(initialMods);
  const [form, setForm] = useState({ name: "", desc: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.name && form.desc) {
      setMods([...mods, { id: mods.length + 1, ...form }]);
      setForm({ name: "", desc: "" });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Car <span className="text-red-500">Modifications</span>
      </h2>

      {/* Modification Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {mods.map((mod) => (
          <div
            key={mod.id}
            className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg"
          >
            <h3 className="text-xl font-semibold text-gray-800">{mod.name}</h3>
            <p className="text-gray-600 mt-2">{mod.desc}</p>
          </div>
        ))}
      </div>

      {/* Add New Modification Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 p-6 rounded-2xl shadow-lg max-w-lg mx-auto"
      >
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">
          Add a Modification
        </h3>
        <input
          type="text"
          placeholder="Modification Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:outline-none"
        />
        <textarea
          placeholder="Description"
          value={form.desc}
          onChange={(e) => setForm({ ...form, desc: e.target.value })}
          className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:outline-none"
        ></textarea>
        <button
          type="submit"
          className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition"
        >
          Add Modification
        </button>
      </form>
    </div>
  );
}
