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
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showAboutUs, setShowAboutUs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [signupData, setSignupData] = useState({ 
    username: "", 
    password: "", 
    confirmPassword: "",
    email: "" 
  });
  const [forgotPasswordData, setForgotPasswordData] = useState({ 
    identifier: "" 
  });
  const [resetPasswordData, setResetPasswordData] = useState({ 
    username: "", 
    newPassword: "", 
    confirmPassword: "" 
  });
  const [authError, setAuthError] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [resetToken, setResetToken] = useState("");
  
  // User profile data
  const [userProfile, setUserProfile] = useState({
    username: "",
    email: "",
    orders: [],
    reviews: [],
    enquiries: []
  });
  const [activeProfileTab, setActiveProfileTab] = useState("info");
  
  // Initialize admin password if not exists
  useEffect(() => {
    if (!localStorage.getItem('adminPassword')) {
      localStorage.setItem('adminPassword', "1234");
    }
  }, []);
  
  // Background images
  const backgroundMedia = [
    { type: "image", src: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" },
    { type: "image", src: "https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" },
    { type: "image", src: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1725&q=80" },
  ];
  
  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    const currentAdmin = localStorage.getItem('currentAdmin');
    
    if (userData) {
      const parsedData = JSON.parse(userData);
      setIsLoggedIn(true);
      setIsAdmin(parsedData.isAdmin || false);
      
      // If admin is already logged in, redirect to admin panel
      if (parsedData.isAdmin) {
        navigate('/admin');
      }
    } else if (currentAdmin) {
      // Handle legacy admin login
      setIsLoggedIn(true);
      setIsAdmin(true);
      navigate('/admin');
    }
  }, [navigate]);
  
  // Load user profile data when profile is opened
  useEffect(() => {
    if (showProfile && isLoggedIn && !isAdmin) {
      loadUserProfile();
    }
  }, [showProfile, isLoggedIn, isAdmin]);
  
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
  
  // Load user profile data
  const loadUserProfile = () => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const currentUser = users.find(u => u.username === userData.username);
    
    if (currentUser) {
      // Load orders
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const userOrders = orders.filter(order => 
        order.buyerEmail === currentUser.email || order.buyerName === currentUser.username
      );
      
      // Load reviews
      const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
      const userReviews = reviews.filter(review => 
        review.userId === currentUser.username || review.userName === currentUser.username
      );
      
      // Load enquiries
      const enquiries = JSON.parse(localStorage.getItem('enquiries') || '[]');
      const userEnquiries = enquiries.filter(enquiry => 
        enquiry.email === currentUser.email || enquiry.name === currentUser.username
      );
      
      setUserProfile({
        username: currentUser.username,
        email: currentUser.email,
        orders: userOrders,
        reviews: userReviews,
        enquiries: userEnquiries
      });
    }
  };
  
  // Handle login
  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError("");
    
    // Check admin credentials using stored password
    const adminPassword = localStorage.getItem('adminPassword') || "1234";
    if (loginData.username === "admin" && loginData.password === adminPassword) {
      setIsLoggedIn(true);
      setIsAdmin(true);
      localStorage.setItem('userData', JSON.stringify({ 
        username: loginData.username, 
        isAdmin: true 
      }));
      localStorage.setItem('currentAdmin', loginData.username);
      setShowLoginForm(false);
      
      // Navigate to admin panel after successful login
      navigate('/admin');
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
    
    // Prevent users from registering with "admin" username
    if (signupData.username.toLowerCase() === "admin") {
      setAuthError("This username is reserved");
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
  
  // Handle forgot password request
  const handleForgotPassword = (e) => {
    e.preventDefault();
    setAuthError("");
    setResetMessage("");
    
    // Check if the identifier is "admin" -> then it's admin reset
    if (forgotPasswordData.identifier === "admin") {
      // Handle admin password reset
      // Generate a simple token (in a real app, this would be more secure)
      const token = Math.random().toString(36).substring(2, 15);
      setResetToken(token);
      localStorage.setItem('adminResetToken', token);
      
      setResetMessage("Admin password reset initiated. Check your console for the reset token.");
      console.log("Admin Reset Token:", token);
      
      setTimeout(() => {
        setShowForgotPassword(false);
        setShowResetPassword(true);
        setResetPasswordData({
          ...resetPasswordData,
          username: "admin"
        });
      }, 2000);
    } else {
      // Handle regular user password reset
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === forgotPasswordData.identifier || u.username === forgotPasswordData.identifier);
      
      if (user) {
        // Generate a simple token (in a real app, this would be more secure)
        const token = Math.random().toString(36).substring(2, 15);
        setResetToken(token);
        localStorage.setItem('userResetToken', token);
        localStorage.setItem('resetUsername', user.username);
        
        setResetMessage("Password reset initiated. Check your console for the reset token.");
        console.log("User Reset Token:", token);
        
        setTimeout(() => {
          setShowForgotPassword(false);
          setShowResetPassword(true);
          setResetPasswordData({
            ...resetPasswordData,
            username: user.username
          });
        }, 2000);
      } else {
        setAuthError("Email or username not found in our records");
      }
    }
  };
  
  // Handle password reset
  const handleResetPassword = (e) => {
    e.preventDefault();
    setAuthError("");
    
    // Verify token
    const storedToken = resetPasswordData.username === "admin" 
      ? localStorage.getItem('adminResetToken') 
      : localStorage.getItem('userResetToken');
    
    if (storedToken !== resetToken) {
      setAuthError("Invalid or expired reset token");
      return;
    }
    
    if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
      setAuthError("Passwords do not match");
      return;
    }
    
    if (resetPasswordData.username === "admin") {
      // Update admin password in localStorage
      localStorage.setItem('adminPassword', resetPasswordData.newPassword);
      
      setResetMessage("Admin password has been reset successfully!");
      
      // Clear tokens
      localStorage.removeItem('adminResetToken');
      
      setTimeout(() => {
        setShowResetPassword(false);
        setShowLoginForm(true);
        setResetMessage("");
      }, 2000);
    } else {
      // Update user password
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex(u => u.username === resetPasswordData.username);
      
      if (userIndex !== -1) {
        users[userIndex].password = resetPasswordData.newPassword;
        localStorage.setItem('users', JSON.stringify(users));
        
        setResetMessage("Password has been reset successfully!");
        
        // Clear tokens
        localStorage.removeItem('userResetToken');
        localStorage.removeItem('resetUsername');
        
        setTimeout(() => {
          setShowResetPassword(false);
          setShowLoginForm(true);
          setResetMessage("");
        }, 2000);
      } else {
        setAuthError("User not found");
      }
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    localStorage.removeItem('userData');
    localStorage.removeItem('currentAdmin');
    setShowProfile(false);
  };
  
  // Handle profile actions
  const handleChangePassword = () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    setShowProfile(false);
    setShowForgotPassword(true);
    setForgotPasswordData({
      identifier: userData.username
    });
    setAuthError("");
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
      if (showForgotPassword && !e.target.closest('.auth-form')) {
        setShowForgotPassword(false);
      }
      if (showResetPassword && !e.target.closest('.auth-form')) {
        setShowResetPassword(false);
      }
      if (showAboutUs && !e.target.closest('.about-modal')) {
        setShowAboutUs(false);
      }
      if (showProfile && !e.target.closest('.auth-form')) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLoginForm, showSignupForm, showForgotPassword, showResetPassword, showAboutUs, showProfile]);
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };
  
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
          <button onClick={() => setShowAboutUs(true)} className="btn-outline">
            About Us
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
            <>
              {/* Only show My Profile for regular users (not admins) */}
              {!isAdmin && (
                <button onClick={() => setShowProfile(true)} className="btn-outline">
                  My Profile
                </button>
              )}
              <button onClick={handleLogout} className="btn-outline">
                Logout
              </button>
            </>
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
      
      {/* Forgot Password Form Modal */}
      {showForgotPassword && (
        <div className="modal-overlay">
          <div className="auth-form">
            <h3 className="auth-title">Reset Password</h3>
            <p className="auth-subtitle">Enter your username or email to reset your password</p>
            <form onSubmit={handleForgotPassword}>
              <input
                type="text"
                placeholder="Username or Email"
                value={forgotPasswordData.identifier}
                onChange={(e) => setForgotPasswordData({...forgotPasswordData, identifier: e.target.value})}
                className="input-field"
                required
              />
              {authError && <p className="error-text">{authError}</p>}
              {resetMessage && <p className="success-text">{resetMessage}</p>}
              <div className="auth-form-buttons">
                <button type="submit" className="btn-primary">Reset Password</button>
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setShowLoginForm(true);
                  }}
                >
                  Back to Login
                </button>
              </div>
            </form>
            <button 
              onClick={() => setShowForgotPassword(false)} 
              className="close-button"
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      {/* Reset Password Form Modal */}
      {showResetPassword && (
        <div className="modal-overlay">
          <div className="auth-form">
            <h3 className="auth-title">Set New Password</h3>
            <p className="auth-subtitle">Enter your new password below</p>
            <form onSubmit={handleResetPassword}>
              <input
                type="text"
                placeholder="Username"
                value={resetPasswordData.username}
                onChange={(e) => setResetPasswordData({...resetPasswordData, username: e.target.value})}
                className="input-field"
                disabled
              />
              <input
                type="password"
                placeholder="New Password"
                value={resetPasswordData.newPassword}
                onChange={(e) => setResetPasswordData({...resetPasswordData, newPassword: e.target.value})}
                className="input-field"
                required
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={resetPasswordData.confirmPassword}
                onChange={(e) => setResetPasswordData({...resetPasswordData, confirmPassword: e.target.value})}
                className="input-field"
                required
              />
              <input
                type="text"
                placeholder="Reset Token (check console)"
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                className="input-field"
                required
              />
              {authError && <p className="error-text">{authError}</p>}
              {resetMessage && <p className="success-text">{resetMessage}</p>}
              <div className="auth-form-buttons">
                <button type="submit" className="btn-primary">Update Password</button>
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => {
                    setShowResetPassword(false);
                    setShowLoginForm(true);
                  }}
                >
                  Back to Login
                </button>
              </div>
            </form>
            <button 
              onClick={() => setShowResetPassword(false)} 
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
      
      {/* Profile Modal - Only for regular users */}
      {showProfile && !isAdmin && (
        <div className="modal-overlay">
          <div className="auth-form profile-modal">
            <h3 className="auth-title">My Profile</h3>
            
            {/* Profile Tabs */}
            <div className="profile-tabs">
              <button 
                className={`profile-tab ${activeProfileTab === 'info' ? 'active' : ''}`}
                onClick={() => setActiveProfileTab('info')}
              >
                Account Info
              </button>
              <button 
                className={`profile-tab ${activeProfileTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveProfileTab('orders')}
              >
                Orders ({userProfile.orders.length})
              </button>
              <button 
                className={`profile-tab ${activeProfileTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveProfileTab('reviews')}
              >
                Reviews ({userProfile.reviews.length})
              </button>
              <button 
                className={`profile-tab ${activeProfileTab === 'enquiries' ? 'active' : ''}`}
                onClick={() => setActiveProfileTab('enquiries')}
              >
                Enquiries ({userProfile.enquiries.length})
              </button>
            </div>
            
            {/* Profile Tab Content */}
            <div className="profile-content">
              {activeProfileTab === 'info' && (
                <div className="profile-info">
                  <p><strong>Username:</strong> {userProfile.username}</p>
                  <p><strong>Email:</strong> {userProfile.email}</p>
                  <p><strong>Account Type:</strong> User</p>
                  <div className="auth-form-buttons">
                    <button 
                      type="button" 
                      className="btn-primary"
                      onClick={handleChangePassword}
                    >
                      Change Password
                    </button>
                    <button 
                      type="button" 
                      className="btn-secondary"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
              
              {activeProfileTab === 'orders' && (
                <div className="profile-section">
                  <h4>Your Orders</h4>
                  {userProfile.orders.length === 0 ? (
                    <p className="no-data">You haven't placed any orders yet.</p>
                  ) : (
                    <div className="profile-list">
                      {userProfile.orders.map((order, index) => (
                        <div key={index} className="profile-item">
                          <p><strong>Product:</strong> {order.title || order.product || 'Unknown'}</p>
                          <p><strong>Price:</strong> ₹{order.price?.toLocaleString() || '0'}</p>
                          <p><strong>Status:</strong> 
                            <span className={`status-badge ${order.status?.toLowerCase() || 'confirmed'}`}>
                              {order.status || 'Confirmed'}
                            </span>
                          </p>
                          <p><strong>Date:</strong> {formatDate(order.date)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {activeProfileTab === 'reviews' && (
                <div className="profile-section">
                  <h4>Your Reviews</h4>
                  {userProfile.reviews.length === 0 ? (
                    <p className="no-data">You haven't submitted any reviews yet.</p>
                  ) : (
                    <div className="profile-list">
                      {userProfile.reviews.map((review, index) => (
                        <div key={index} className="profile-item">
                          <p><strong>Rating:</strong> 
                            <span className="rating-stars">
                              {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                            </span>
                          </p>
                          <p><strong>Comment:</strong> {review.comment}</p>
                          <p><strong>Status:</strong> 
                            <span className={`status-badge ${review.status?.toLowerCase() || 'pending'}`}>
                              {review.status || 'Pending'}
                            </span>
                          </p>
                          <p><strong>Date:</strong> {formatDate(review.date)}</p>
                          {review.beforeImage && (
                            <div className="review-image-container">
                              <p><strong>Before Image:</strong></p>
                              <img src={review.beforeImage} alt="Before" className="review-image" />
                            </div>
                          )}
                          {review.afterImage && (
                            <div className="review-image-container">
                              <p><strong>After Image:</strong></p>
                              <img src={review.afterImage} alt="After" className="review-image" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {activeProfileTab === 'enquiries' && (
                <div className="profile-section">
                  <h4>Your Enquiries</h4>
                  {userProfile.enquiries.length === 0 ? (
                    <p className="no-data">You haven't made any enquiries yet.</p>
                  ) : (
                    <div className="profile-list">
                      {userProfile.enquiries.map((enquiry, index) => (
                        <div key={index} className="profile-item">
                          <p><strong>Enquiry:</strong> {enquiry.message}</p>
                          <p><strong>Date:</strong> {formatDate(enquiry.timestamp)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <button 
              onClick={() => setShowProfile(false)} 
              className="close-button"
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      {/* About Us Modal */}
      {showAboutUs && (
        <div className="modal-overlay">
          <div className="about-modal">
            <h3 className="about-title">About Benzamods</h3>
            <div className="about-content">
              <div className="about-section">
                <h4>Our Story</h4>
                <p>
                  Founded in 2015, Benzamods started as a passion project by automotive enthusiasts 
                  who wanted to transform ordinary vehicles into extraordinary works of art. What began 
                  in a small garage has now grown into a premier automotive customization studio known 
                  for quality, innovation, and attention to detail.
                </p>
              </div>
              
              <div className="about-section">
                <h4>Our Mission</h4>
                <p>
                  At Benzamods, we believe that every vehicle has the potential to be a masterpiece. 
                  Our mission is to bring our clients' automotive dreams to life through expert 
                  craftsmanship, cutting-edge technology, and a deep understanding of automotive design.
                </p>
              </div>
              
              <div className="about-section">
                <h4>Our Team</h4>
                <p>
                  Our team consists of certified automotive technicians, designers, and engineers 
                  with decades of combined experience. Each member of our team shares a passion for 
                  automobiles and a commitment to excellence in every project we undertake.
                </p>
              </div>
              
              <div className="about-section">
                <h4>What We Do</h4>
                <ul>
                  <li>Custom body kits and aerodynamic enhancements</li>
                  <li>Performance engine tuning and upgrades</li>
                  <li>Luxury interior customization</li>
                  <li>Advanced lighting and audio systems</li>
                  <li>Paint protection and ceramic coating</li>
                  <li>Wheel and tire customization</li>
                </ul>
              </div>
              
              <div className="about-section">
                <h4>Our Values</h4>
                <p>
                  Quality, innovation, and customer satisfaction are at the core of everything we do. 
                  We treat every vehicle as if it were our own and every client as part of the Benzamods family.
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowAboutUs(false)} 
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
      alignItems: center;
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
    
    .auth-subtitle {
      text-align: center;
      margin-bottom: 20px;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
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
    
    .input-field:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .error-text {
      color: #ff4757;
      text-align: center;
      margin-bottom: 15px;
      font-size: 14px;
    }
    
    .success-text {
      color: #2ed573;
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
    
    /* Profile Section */
    .profile-modal {
      width: 90%;
      max-width: 600px;
      max-height: 80vh;
      overflow-y: auto;
    }
    
    .profile-tabs {
      display: flex;
      margin-bottom: 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      overflow-x: auto;
    }
    
    .profile-tab {
      padding: 10px 15px;
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.7);
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
      white-space: nowrap;
      border-bottom: 2px solid transparent;
    }
    
    .profile-tab.active {
      color: #00d4ff;
      border-bottom: 2px solid #00d4ff;
    }
    
    .profile-content {
      min-height: 300px;
    }
    
    .profile-info {
      margin-bottom: 20px;
      text-align: left;
    }
    
    .profile-info p {
      margin-bottom: 10px;
      font-size: 16px;
    }
    
    .profile-info strong {
      color: #00d4ff;
    }
    
    .profile-section {
      margin-bottom: 20px;
    }
    
    .profile-section h4 {
      margin-bottom: 15px;
      color: #00d4ff;
      font-size: 18px;
    }
    
    .profile-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    
    .profile-item {
      background: rgba(0, 0, 0, 0.3);
      padding: 15px;
      border-radius: 10px;
      border-left: 3px solid #00d4ff;
    }
    
    .profile-item p {
      margin-bottom: 5px;
      font-size: 14px;
    }
    
    .profile-item strong {
      color: #00d4ff;
    }
    
    .status-badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      margin-left: 5px;
    }
    
    .status-badge.confirmed, .status-badge.approved {
      background: rgba(46, 204, 113, 0.2);
      color: #2ecc71;
    }
    
    .status-badge.pending {
      background: rgba(241, 196, 15, 0.2);
      color: #f1c40f;
    }
    
    .status-badge.cancelled, .status-badge.rejected {
      background: rgba(231, 76, 60, 0.2);
      color: #e74c3c;
    }
    
    .no-data {
      color: rgba(255, 255, 255, 0.6);
      text-align: center;
      padding: 20px;
      font-style: italic;
    }
    
    /* Review specific styles */
    .rating-stars {
      color: #ffd700;
      margin-left: 5px;
    }
    
    .review-image-container {
      margin-top: 10px;
    }
    
    .review-image {
      width: 100%;
      max-height: 150px;
      object-fit: cover;
      border-radius: 8px;
      margin-top: 5px;
    }
    
    /* About Us Modal */
    .about-modal {
      background: rgba(26, 26, 26, 0.95);
      padding: 30px;
      border-radius: 15px;
      width: 90%;
      max-width: 700px;
      max-height: 80vh;
      overflow-y: auto;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      position: relative;
      animation: fadeIn 0.3s ease-out;
    }
    
    .about-title {
      text-align: center;
      margin-bottom: 25px;
      font-size: 28px;
      font-weight: 700;
      color: #fff;
    }
    
    .about-content {
      color: rgba(255, 255, 255, 0.9);
      line-height: 1.6;
    }
    
    .about-section {
      margin-bottom: 25px;
    }
    
    .about-section h4 {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 10px;
      color: #00d4ff;
    }
    
    .about-section p {
      margin-bottom: 15px;
    }
    
    .about-section ul {
      list-style-type: none;
      padding-left: 0;
    }
    
    .about-section li {
      margin-bottom: 8px;
      padding-left: 20px;
      position: relative;
    }
    
    .about-section li:before {
      content: "•";
      color: #00d4ff;
      font-weight: bold;
      position: absolute;
      left: 0;
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
      
      .about-modal {
        width: 95%;
        padding: 20px;
      }
      
      .about-title {
        font-size: 24px;
      }
      
      .profile-modal {
        width: 95%;
        max-width: none;
      }
      
      .profile-tabs {
        flex-wrap: wrap;
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