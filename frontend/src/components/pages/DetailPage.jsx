import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function DetailPage() {
  const { id } = useParams(); // modificationId
  const [details, setDetails] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    fetch(`http://localhost:5000/details/${id}`)
      .then(res => res.json())
      .then(data => setDetails(data));
  }, [id]);

  const handleSubmit = e => {
    e.preventDefault();
    alert("Inquiry submitted ");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Wrap Options</h2>
      
      {/* Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {details.map(item => (
          <div key={item._id} className="bg-white rounded-xl shadow p-4">
            <img src={item.image} alt={item.title} className="w-full h-40 object-cover rounded-lg" />
            <h3 className="mt-2 font-semibold">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>

      {/* Inquiry Form */}
      <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded-xl max-w-lg">
        <h3 className="text-xl font-bold mb-4">Inquiry Form</h3>
        <input
          type="text"
          placeholder="Your Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="w-full p-2 mb-3 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Your Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          className="w-full p-2 mb-3 border rounded"
          required
        />
        <textarea
          placeholder="Message"
          value={form.message}
          onChange={e => setForm({ ...form, message: e.target.value })}
          className="w-full p-2 mb-3 border rounded"
          rows="3"
          required
        />
        <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Submit
        </button>
      </form>
    </div>
  );
}
