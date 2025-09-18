// HeroBanner.js
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function HeroBanner() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [signupData, setSignupData] = useState({ 
    username: "", 
    password: "", 
    confirmPassword: "",
    email: "" 
  });
  const [authError, setAuthError] = useState("");
  
  // Background images
  const backgroundMedia = [
    { type: "image", src: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" },
    { type: "image", src: "https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" },
    { type: "image", src: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1725&q=80" },
  ];
  
  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedData = JSON.parse(userData);
      setIsLoggedIn(true);
      setIsAdmin(parsedData.isAdmin || false);
    }
  }, []);
  
  // Background media rotation effect
  useEffect(() => {
    const bgInterval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % backgroundMedia.length);
    }, 6000);
    return () => clearInterval(bgInterval);
  }, [backgroundMedia.length]);
  
  // Handle video load
  useEffect(() => {
    if (videoRef.current && backgroundMedia[currentBgIndex].type === "video") {
      videoRef.current.load();
      videoRef.current.play().catch((error) => {
        console.log("Video autoplay failed:", error);
      });
    }
  }, [currentBgIndex, backgroundMedia]);
  
  // Handle login
  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError("");
    
    // Check admin credentials
    if (loginData.username === "admin" && loginData.password === "1234") {
      setIsLoggedIn(true);
      setIsAdmin(true);
      localStorage.setItem('userData', JSON.stringify({ 
        username: loginData.username, 
        isAdmin: true 
      }));
      setShowLoginForm(false);
      return;
    }
    
    // Check regular user credentials
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === loginData.username && u.password === loginData.password);
    
    if (user) {
      setIsLoggedIn(true);
      setIsAdmin(false);
      localStorage.setItem('userData', JSON.stringify({ 
        username: loginData.username, 
        isAdmin: false 
      }));
      setShowLoginForm(false);
    } else {
      setAuthError("Invalid username or password");
    }
  };
  
  // Handle signup
  const handleSignup = (e) => {
    e.preventDefault();
    setAuthError("");
    
    if (signupData.password !== signupData.confirmPassword) {
      setAuthError("Passwords do not match");
      return;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.find(u => u.username === signupData.username)) {
      setAuthError("Username already exists");
      return;
    }
    
    if (users.find(u => u.email === signupData.email)) {
      setAuthError("Email already registered");
      return;
    }
    
    users.push({
      username: signupData.username,
      password: signupData.password,
      email: signupData.email
    });
    
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto login after signup
    setIsLoggedIn(true);
    localStorage.setItem('userData', JSON.stringify({ 
      username: signupData.username, 
      isAdmin: false 
    }));
    setShowSignupForm(false);
  };
  
  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    localStorage.removeItem('userData');
  };
  
  // Close auth forms when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showLoginForm && !e.target.closest('.auth-form')) {
        setShowLoginForm(false);
      }
      if (showSignupForm && !e.target.closest('.auth-form')) {
        setShowSignupForm(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLoginForm, showSignupForm]);
  
  return (
    <div className="hero-container">
      {/* Background with dynamic media */}
      <div className="background-main">
        {backgroundMedia.map((media, index) => {
          if (media.type === "image") {
            return (
              <div
                key={index}
                className={`background-media ${index === currentBgIndex ? 'active' : ''}`}
                style={{ backgroundImage: `url(${media.src})` }}
              ></div>
            );
          } else {
            return (
              <video
                key={index}
                ref={index === currentBgIndex ? videoRef : null}
                className={`background-media ${index === currentBgIndex ? 'active' : ''}`}
                autoPlay
                loop
                muted
                playsInline
              >
                <source src={media.src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            );
          }
        })}
      </div>
      <div className="background-overlay"></div>
      
      {/* Header */}
      <header className="hero-header">
        <div className="hero-logo">
          <img
            src="https://static.vecteezy.com/system/resources/previews/019/514/636/original/letter-b-logo-design-for-business-and-company-identity-with-luxury-concept-free-vector.jpg"
            alt="Benzamods Logo"
            className="logo-image"
          />
          <h2 className="logo-text">Benzamods</h2>
        </div>
        <div className="hero-nav-buttons">
          <button onClick={() => navigate('/portfolio')} className="btn-outline">
            Portfolio
          </button>
          <button onClick={() => navigate('/services')} className="btn-outline">
            Services
          </button>
        </div>
        <div className="hero-auth-buttons">
          <button 
            onClick={() => isAdmin ? navigate('/admin') : setShowLoginForm(true)} 
            className={`btn-admin ${isAdmin ? 'active' : ''}`}
            title={isAdmin ? "Admin Dashboard" : "Login as admin"}
          >
            {isAdmin ? "Admin" : "Admin Login"}
          </button>
          
          {isLoggedIn ? (
            <button onClick={handleLogout} className="btn-outline">
              Logout
            </button>
          ) : (
            <>
              <button onClick={() => setShowLoginForm(true)} className="btn-outline">
                Login
              </button>
              <button onClick={() => setShowSignupForm(true)} className="btn-primary">
                Sign Up
              </button>
            </>
          )}
        </div>
      </header>
      
      {/* Login Form Modal */}
      {showLoginForm && (
        <div className="modal-overlay">
          <div className="auth-form">
            <h3 className="auth-title">Login</h3>
            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Username"
                value={loginData.username}
                onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                className="input-field"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                className="input-field"
                required
              />
              {authError && <p className="error-text">{authError}</p>}
              <div className="auth-form-buttons">
                <button type="submit" className="btn-primary">Login</button>
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => {
                    setShowLoginForm(false);
                    setShowSignupForm(true);
                  }}
                >
                  Create Account
                </button>
              </div>
            </form>
            <button 
              onClick={() => setShowLoginForm(false)} 
              className="close-button"
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      {/* Signup Form Modal */}
      {showSignupForm && (
        <div className="modal-overlay">
          <div className="auth-form">
            <h3 className="auth-title">Create Account</h3>
            <form onSubmit={handleSignup}>
              <input
                type="text"
                placeholder="Username"
                value={signupData.username}
                onChange={(e) => setSignupData({...signupData, username: e.target.value})}
                className="input-field"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={signupData.email}
                onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                className="input-field"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={signupData.password}
                onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                className="input-field"
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={signupData.confirmPassword}
                onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                className="input-field"
                required
              />
              {authError && <p className="error-text">{authError}</p>}
              <div className="auth-form-buttons">
                <button type="submit" className="btn-primary">Sign Up</button>
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => {
                    setShowSignupForm(false);
                    setShowLoginForm(true);
                  }}
                >
                  Already have an account?
                </button>
              </div>
            </form>
            <button 
              onClick={() => setShowSignupForm(false)} 
              className="close-button"
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <main className="hero-main">
        <div className="home-content">
          <div className="title-container">
            <div className="badge">PREMIUM AUTOMOTIVE CUSTOMIZATION</div>
            <h1 className="main-title">BENZAMODS</h1>
            <div className="title-underline"></div>
          </div>
          <p className="hero-description">
            Transform your ride with premium custom modifications, unique
            styling, and high-performance upgrades. Where passion meets
            perfection.
          </p>
          <div className="home-buttons">
            <button
              className="btn-primary-large pulse-btn"
              onClick={() => navigate("/portfolio")}
            >
              Portfolio
            </button>
            <button
              className="btn-secondary-large"
              onClick={() => navigate("/services")}
            >
              Our Services
            </button>
            <button
              className="btn-tertiary-large"
              onClick={() => navigate("/explore")}
            >
              Explore Now
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

// Add global styles
const addGlobalStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    /* Base Styles */
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: 'Inter', sans-serif;
      overflow-x: hidden;
    }
    
    /* Hero Container */
    .hero-container {
      position: relative;
      width: 100%;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      color: #fff;
      overflow: hidden;
    }
    
    /* Background */
    .background-main {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
    }
    
    .background-media {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      background-size: cover;
      background-position: center;
      opacity: 0;
      transform: scale(1);
      transition: opacity 1.5s ease-in-out, transform 10s ease-in-out;
    }
    
    .background-media.active {
      opacity: 1;
      transform: scale(1.1);
    }
    
    .background-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%);
      z-index: 2;
    }
    
    /* Header */
    .hero-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 20px;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(10px);
      z-index: 10;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      animation: slideDown 0.8s ease-out;
    }
    
    .hero-logo {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .logo-image {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 2px solid rgba(255, 255, 255, 0.2);
      object-fit: cover;
      animation: rotate 20s linear infinite;
    }
    
    .logo-text {
      font-size: 20px;
      font-weight: 700;
      margin: 0;
      color: #fff;
      letter-spacing: 1px;
    }
    
    .hero-nav-buttons {
      display: flex;
      gap: 10px;
    }
    
    .hero-auth-buttons {
      display: flex;
      gap: 10px;
      align-items: center;
    }
    
    /* Buttons */
    .btn-outline {
      padding: 8px 16px;
      border-radius: 30px;
      background: transparent;
      border: 2px solid rgba(255, 255, 255, 0.3);
      color: #fff;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
      font-size: 14px;
      letter-spacing: 0.5px;
    }
    
    .btn-primary {
      padding: 8px 16px;
      border-radius: 30px;
      background: linear-gradient(135deg, #007bff, #00d4ff);
      color: white;
      border: none;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
      font-size: 14px;
      letter-spacing: 0.5px;
      box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
    }
    
    .btn-admin {
      padding: 8px 16px;
      border-radius: 30px;
      background: transparent;
      color: white;
      border: 2px solid rgba(255, 0, 128, 0.5);
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
      font-size: 14px;
      letter-spacing: 0.5px;
    }
    
    .btn-admin.active {
      background: linear-gradient(135deg, #ff0080, #ff8c00);
      border: none;
      box-shadow: 0 4px 15px rgba(255, 0, 128, 0.3);
    }
    
    /* Main Content */
    .hero-main {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 30px 20px;
      z-index: 3;
      text-align: center;
    }
    
    .home-content {
      max-width: 800px;
      padding: 20px;
      animation: fadeIn 1s ease-out, float 6s ease-in-out infinite;
    }
    
    .badge {
      display: inline-block;
      padding: 6px 12px;
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 30px;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 1px;
      margin-bottom: 15px;
      color: #00d4ff;
      animation: pulse 2s infinite;
    }
    
    .main-title {
      font-family: 'Montserrat', sans-serif;
      font-size: 3rem;
      font-weight: 900;
      margin-bottom: 10px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #fff;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
      animation: fadeInUp 1s ease-out;
    }
    
    .title-underline {
      width: 60px;
      height: 3px;
      background: linear-gradient(135deg, #007bff, #00d4ff);
      margin: 0 auto 20px auto;
      border-radius: 2px;
      animation: expandWidth 1s ease-out;
    }
    
    .hero-description {
      font-size: 1rem;
      margin-bottom: 30px;
      line-height: 1.5;
      font-weight: 400;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
      color: rgba(255, 255, 255, 0.9);
      animation: fadeIn 1.5s ease-out;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }
    
    .home-buttons {
      display: flex;
      gap: 15px;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    .btn-primary-large, .btn-secondary-large, .btn-tertiary-large {
      padding: 12px 25px;
      border-radius: 30px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
      font-size: 16px;
      letter-spacing: 0.5px;
      border: none;
    }
    
    .btn-primary-large {
      background: linear-gradient(135deg, #007bff, #00d4ff);
      color: white;
      box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
    }
    
    .btn-secondary-large {
      background: transparent;
      border: 2px solid rgba(255, 255, 255, 0.3);
      color: #fff;
    }
    
    .btn-tertiary-large {
      background: linear-gradient(135deg, #ff0080, #ff8c00);
      color: white;
      box-shadow: 0 4px 15px rgba(255, 0, 128, 0.3);
    }
    
    /* Auth Forms */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      backdrop-filter: blur(5px);
    }
    
    .auth-form {
      background: rgba(26, 26, 26, 0.95);
      padding: 25px;
      border-radius: 15px;
      width: 90%;
      max-width: 400px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      position: relative;
      animation: fadeIn 0.3s ease-out;
    }
    
    .auth-title {
      text-align: center;
      margin-bottom: 20px;
      font-size: 22px;
      font-weight: 700;
      color: #fff;
    }
    
    .input-field {
      width: 100%;
      padding: 12px 15px;
      margin-bottom: 12px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      background-color: rgba(0, 0, 0, 0.4);
      color: #fff;
      font-size: 16px;
      box-sizing: border-box;
    }
    
    .error-text {
      color: #ff4757;
      text-align: center;
      margin-bottom: 15px;
      font-size: 14px;
    }
    
    .auth-form-buttons {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    
    .close-button {
      position: absolute;
      top: 10px;
      right: 15px;
      background: none;
      border: none;
      color: #fff;
      font-size: 24px;
      cursor: pointer;
      font-weight: bold;
    }
    
    /* Animations */
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(50px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-100%); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes expandWidth {
      from { width: 0; opacity: 0; }
      to { width: 60px; opacity: 1; }
    }
    
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(0, 212, 255, 0.4); }
      70% { box-shadow: 0 0 0 10px rgba(0, 212, 255, 0); }
      100% { box-shadow: 0 0 0 0 rgba(0, 212, 255, 0); }
    }
    
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-20px); }
      60% { transform: translateY(-10px); }
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    
    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    /* Button hover effects */
    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    }
    
    .btn-outline:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.5);
    }
    
    .btn-primary:hover, .btn-primary-large:hover {
      box-shadow: 0 6px 20px rgba(0, 123, 255, 0.5);
    }
    
    .btn-tertiary-large:hover {
      box-shadow: 0 6px 20px rgba(255, 0, 128, 0.5);
    }
    
    .pulse-btn {
      position: relative;
      overflow: hidden;
    }
    
    .pulse-btn:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
      transform: translateY(100%);
      transition: transform 0.3s ease;
      z-index: -1;
    }
    
    .pulse-btn:hover:before {
      transform: translateY(0);
    }
    
    input::placeholder {
      color: rgba(255, 255, 255, 0.6);
    }
    
    /* Mobile Responsive Styles */
    @media (max-width: 768px) {
      .hero-header {
        flex-direction: column;
        padding: 15px;
      }
      
      .hero-logo {
        margin-bottom: 15px;
      }
      
      .hero-nav-buttons, .hero-auth-buttons {
        margin-top: 10px;
        justify-content: center;
        flex-wrap: wrap;
      }
      
      .home-content {
        padding: 15px;
      }
      
      .main-title {
        font-size: 2.5rem;
      }
      
      .hero-description {
        font-size: 0.95rem;
        margin-bottom: 25px;
      }
      
      .home-buttons {
        flex-direction: column;
        align-items: center;
        gap: 10px;
      }
      
      .btn-primary-large, .btn-secondary-large, .btn-tertiary-large {
        width: 100%;
        max-width: 300px;
        padding: 12px 20px;
        font-size: 15px;
      }
      
      .auth-form {
        width: 95%;
        padding: 20px;
      }
      
      .input-field {
        padding: 10px;
        font-size: 16px;
      }
      
      .auth-title {
        font-size: 20px;
      }
    }
    
    @media (max-width: 480px) {
      .main-title {
        font-size: 2rem;
      }
      
      .hero-description {
        font-size: 0.9rem;
      }
      
      .btn-primary-large, .btn-secondary-large, .btn-tertiary-large {
        width: 100%;
        max-width: 250px;
      }
      
      .logo-image {
        width: 35px;
        height: 35px;
      }
      
      .logo-text {
        font-size: 18px;
      }
    }
  `;
  document.head.appendChild(style);
};

// Call the function to add global styles
addGlobalStyles();

export default HeroBanner;