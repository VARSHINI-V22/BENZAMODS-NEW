import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { categories } from "../data/categoryData";

// Simulate localStorage for users & currentUser
const readLS = (key, fallback) => {
  try { const val = localStorage.getItem(key); return val ? JSON.parse(val) : fallback; } 
  catch { return fallback; }
};
const writeLS = (key, value) => localStorage.setItem(key, JSON.stringify(value));

export default function CategoryDetail() {
  const { type, catId } = useParams();
  const data = categories[type];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // For login/signup prompt
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // "login" or "signup"
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [currentUser, setCurrentUser] = useState(() => readLS("currentUser", null));
  const [users, setUsers] = useState(() => readLS("users", []));

  if (!data) return <p className="p-6 text-xl">No categories found for {type}</p>;

  const subCategory = data.find(item => item.id === catId);
  if (!subCategory) return <p className="p-6 text-xl">Subcategory not found</p>;

  // --- Handle login/signup ---
  const signup = () => {
    const { name, email, password } = authForm;
    if (!name || !email || !password) return alert("Fill all fields");
    if (users.find(u => u.email === email)) return alert("User exists");
    const newUser = { name, email, password, role: "user" };
    setUsers([...users, newUser]);
    writeLS("users", [...users, newUser]);
    setCurrentUser(newUser);
    writeLS("currentUser", newUser);
    setAuthForm({ name: "", email: "", password: "" });
    setShowLoginModal(false);
    alert("Signup successful! You can now submit your enquiry.");
  };

  const login = () => {
    const { email, password } = authForm;
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) return alert("Invalid credentials");
    setCurrentUser(found);
    writeLS("currentUser", found);
    setAuthForm({ name: "", email: "", password: "" });
    setShowLoginModal(false);
    alert("Login successful! You can now submit your enquiry.");
  };

  // --- Handle enquiry submit ---
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }
    // Store enquiry in localStorage as part of "admin panel"
    const enquiries = readLS("enquiries", []);
    const newEnquiry = {
      id: Date.now(),
      name: currentUser.name,
      email: currentUser.email,
      message,
      category: subCategory.title,
    };
    writeLS("enquiries", [...enquiries, newEnquiry]);
    alert(`Thank you ${currentUser.name}! Your enquiry for ${subCategory.title} has been received.`);

    // Reset the form
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">{subCategory.title}</h1>
      <p className="text-gray-700 mb-6">{subCategory.description}</p>

      {/* Gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {subCategory.gallery.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`${subCategory.title} ${idx + 1}`}
            className="w-full h-48 object-cover rounded shadow"
          />
        ))}
      </div>

      {/* Enquiry Form */}
      <form onSubmit={handleSubmit} className="max-w-xl bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Enquiry Form</h2>
        <input
          type="text"
          placeholder="Name"
          className="w-full mb-3 p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <textarea
          placeholder="Message"
          className="w-full mb-3 p-2 border rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        ></textarea>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>

      {/* Login/Signup Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <button onClick={() => setShowLoginModal(false)} className="float-right text-red-500 text-xl font-bold">✕</button>
            <h2 className="text-2xl font-bold mb-4">{authMode === "login" ? "Login" : "Signup"}</h2>
            <div className="flex flex-col gap-3">
              {authMode === "signup" && (
                <input
                  placeholder="Name"
                  value={authForm.name}
                  onChange={(e) => setAuthForm(f => ({ ...f, name: e.target.value }))}
                  className="border p-2 rounded"
                />
              )}
              <input
                placeholder="Email"
                type="email"
                value={authForm.email}
                onChange={(e) => setAuthForm(f => ({ ...f, email: e.target.value }))}
                className="border p-2 rounded"
              />
              <input
                placeholder="Password"
                type="password"
                value={authForm.password}
                onChange={(e) => setAuthForm(f => ({ ...f, password: e.target.value }))}
                className="border p-2 rounded"
              />
              <button
                onClick={authMode === "login" ? login : signup}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                {authMode === "login" ? "Login" : "Signup"}
              </button>
              <p className="text-sm text-gray-600 text-center">
                Or <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}>
                  {authMode === "login" ? "Signup" : "Login"}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
