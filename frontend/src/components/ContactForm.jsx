import React, { useState } from "react";
import api from "../api";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [errors, setErrors] = useState([]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);
    setSuccess(null);
    try {
      const res = await api.post("/contact", form);
      if (res.data?.ok) {
        setSuccess("Thanks! Your message has been sent.");
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        setErrors(["Something went wrong."]);
      }
    } catch (err) {
      const msgs = err.response?.data?.errors || [err.response?.data?.message || "Submission failed"];
      setErrors(msgs);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={onSubmit}>
      {success && <div className="alert success">{success}</div>}
      {errors.length > 0 && (
        <div className="alert error">
          {errors.map((e, i) => <div key={i}>{e}</div>)}
        </div>
      )}
      <div className="grid">
        <label>
          <span>Name</span>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Your full name"
            required
          />
        </label>
        <label>
          <span>Email</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="you@example.com"
            required
          />
        </label>
        <label>
          <span>Phone</span>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={onChange}
            placeholder="+91 98765 43210"
            required
          />
        </label>
      </div>
      <label>
        <span>Message</span>
        <textarea
          name="message"
          rows="5"
          value={form.message}
          onChange={onChange}
          placeholder="Tell us about your vehicle and the mods you’re interested in"
          required
        />
      </label>

      <button className="btn" disabled={loading}>
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
