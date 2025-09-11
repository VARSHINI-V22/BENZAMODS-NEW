import React from "react";

const Dashboard = () => {
  // Optional: get token from localStorage
  const token = localStorage.getItem("token");

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Dashboard</h2>
      {token ? (
        <p>Welcome! You are logged in. Your token: <code>{token}</code></p>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  );
};

export default Dashboard; // ✅ default export
