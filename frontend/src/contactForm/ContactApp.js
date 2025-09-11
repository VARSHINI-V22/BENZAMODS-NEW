import React, { useState } from "react";
import User from "./User";
import Admin from "./Admin";

export default function ContactApp() {
  const [submissions, setSubmissions] = useState([]); // store all user data
  const [view, setView] = useState("user"); // toggle between user and admin

  // Function to add user submission
  const addSubmission = (data) => {
    setSubmissions([...submissions, data]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg">
      {/* Toggle Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setView("user")}
          className={`px-4 py-2 rounded ${
            view === "user" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          User Form
        </button>
        <button
          onClick={() => setView("admin")}
          className={`px-4 py-2 rounded ${
            view === "admin" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Admin Panel
        </button>
      </div>

      {/* Conditional Rendering */}
      {view === "user" ? (
        <User onSubmit={addSubmission} />
      ) : (
        <Admin submissions={submissions} />
      )}
    </div>
  );
}
