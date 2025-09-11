import React, { useState } from "react";
import Login from "../pages/Login";
import Signup from "../pages/Signup";

const Access = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [message, setMessage] = useState("");

  const handleSuccess = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000); // Auto hide after 3 sec
    setShowLogin(false);
    setShowSignup(false);
  };

  return (
    <div className="flex justify-end gap-4 p-4 bg-gray-100">
      <button onClick={() => setShowLogin(true)} className="text-blue-600 hover:underline">
        Login
      </button>
      <button onClick={() => setShowSignup(true)} className="text-blue-600 hover:underline">
        Signup
      </button>

      {/* Success message */}
      {message && (
        <div className="fixed top-5 right-5 bg-green-500 text-white p-3 rounded shadow-md z-50">
          {message}
        </div>
      )}

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md relative">
            <button className="absolute top-2 right-2 text-gray-500" onClick={() => setShowLogin(false)}>
              ✕
            </button>
            <Login onSuccess={handleSuccess} />
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md relative">
            <button className="absolute top-2 right-2 text-gray-500" onClick={() => setShowSignup(false)}>
              ✕
            </button>
            <Signup onSuccess={handleSuccess} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Access;
