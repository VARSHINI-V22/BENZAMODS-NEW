// src/components/HeroBanner.js
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function HeroBanner() {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const [view, setView] = useState("home");
  const [isSignup, setIsSignup] = useState(false);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  // Users
  const [users, setUsers] = useState(
    () => JSON.parse(localStorage.getItem("users")) || []
  );
  const [currentUser, setCurrentUser] = useState(
    () => JSON.parse(localStorage.getItem("currentUser")) || null
  );

  // Form state
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  // Admin State
  const [adminForm, setAdminForm] = useState({ username: "", password: "" });

  // Admin credentials
  const ADMIN_USERNAME = "admin";
  const ADMIN_PASSWORD = "1234";

  // Light theme background images
  const backgroundMedia = [
    { type: "image", src: "https://img.etimg.com/thumb/width-1200,height-900,imgsize-69266,resizemode-75,msid-106774994/industry/auto/cars-uvs/super-sports-car-segment-in-india-to-register-30-pc-growth-this-year-mclaren-automotive.jpg" },
    // { type: "image", src: "https://elitetraveler.com/wp-content/uploads/sites/8/2019/07/Screenshot-2020-05-12-at-15.10.34.png" },
    // { type: "image", src: "https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg" },
  ];

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

  // Persist data
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }, [currentUser]);

  // Handle Signup / Login
  const handleAuth = () => {
    if (isSignup) {
      if (!formData.name || !formData.email || !formData.password) {
        alert("Please fill all fields");
        return;
      }
      if (users.find((u) => u.name === formData.name)) {
        alert("User already exists, please login");
        return;
      }
      setUsers([...users, formData]);
      alert("Signup successful! Please login now.");
      setIsSignup(false);
    } else {
      const user = users.find(
        (u) => u.name === formData.name && u.password === formData.password
      );
      if (user) {
        setCurrentUser(user);
        setView("home");
        alert("Login successful!");
      } else {
        alert("Invalid credentials");
      }
    }
  };

  // Logout
  const handleLogout = () => {
    setCurrentUser(null);
    setView("home");
  };

  // Admin Login
  const handleAdminLogin = () => {
    if (
      adminForm.username === ADMIN_USERNAME &&
      adminForm.password === ADMIN_PASSWORD
    ) {
      alert("Admin login successful!");
      navigate("/admin");
    } else {
      alert("Invalid Admin credentials");
    }
  };

  return (
    <div style={styles.heroContainer}>
      {/* Background with dynamic media */}
      <div style={styles.backgroundMain}>
        {backgroundMedia.map((media, index) => {
          if (media.type === "image") {
            return (
              <div
                key={index}
                style={{
                  ...styles.backgroundMedia,
                  backgroundImage: `url(${media.src})`,
                  opacity: index === currentBgIndex ? 1 : 0,
                }}
              ></div>
            );
          } else {
            return (
              <video
                key={index}
                ref={index === currentBgIndex ? videoRef : null}
                style={{
                  ...styles.backgroundMedia,
                  opacity: index === currentBgIndex ? 1 : 0,
                }}
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

      <div style={styles.backgroundOverlay}></div>

      {/* Header */}
      <header style={styles.heroHeader}>
        <div style={styles.heroLogo}>
          <img
            src="https://static.vecteezy.com/system/resources/previews/019/514/636/original/letter-b-logo-design-for-business-and-company-identity-with-luxury-concept-free-vector.jpg"
            alt="Benzamods Logo"
            style={styles.logoImage}
          />
          <h2 style={styles.logoText}>Benzamods</h2>
        </div>

        <div style={styles.heroButtons}>
          <button onClick={() => setView("about")} style={styles.btnOutline}>
            About Us
          </button>
          {!currentUser ? (
            <button onClick={() => setView("auth")} style={styles.btnOutline}>
              Login / Signup
            </button>
          ) : (
            <button onClick={handleLogout} style={styles.btnOutline}>
              Logout
            </button>
          )}
          <button onClick={() => setView("admin-login")} style={styles.btnOutline}>
            Admin
          </button>
        </div>
      </header>

      {/* Main */}
      <main style={styles.heroMain}>
        {/* Home */}
        {view === "home" && (
          <div style={styles.homeContent}>
            <div style={styles.titleContainer}>
              <h1 style={styles.mainTitle}>BENZAMODS</h1>
              <div style={styles.titleUnderline}></div>
            </div>
            <p style={styles.heroDescription}>
              <b>
                Transform your ride with premium custom modifications, unique
                styling, and high-performance upgrades. Where passion meets
                perfection.
              </b>
            </p>

            <div style={styles.homeButtons}>
              <button
                style={styles.btnPrimary}
                onClick={() => navigate("/portfolio")}
              >
                Explore Now
              </button>
              <button
                style={styles.btnSecondary}
                onClick={() => navigate("/services")}
              >
                Explore Services
              </button>
            </div>
          </div>
        )}

        {/* About Us */}
        {view === "about" && (
          <div style={styles.aboutContent}>
            <h2 style={styles.aboutTitle}>About Benzamods</h2>
            <div style={styles.aboutText}>
              <p style={styles.aboutParagraph}>
                <b>Benzamods</b> is a premier automotive customization company
                dedicated to transforming vehicles into unique masterpieces.
              </p>
              <p style={styles.aboutParagraph}>
                With a passion for innovation and attention to detail, we
                specialize in high-performance upgrades, bespoke styling, and
                cutting-edge modifications.
              </p>
              <p style={styles.aboutParagraph}>
                Our team of expert technicians and designers work tirelessly to
                bring your vision to life, ensuring every project reflects the
                highest standards of quality and craftsmanship.
              </p>
              <p style={styles.aboutParagraph}>
                Whether you're looking to enhance your vehicle's performance,
                aesthetics, or both, Benzamods delivers exceptional results that
                set you apart on the road.
              </p>
            </div>
            <button style={styles.btnPrimary} onClick={() => setView("home")}>
              Back to Home
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

// Light theme styles
const styles = {
  heroContainer: {
    position: "relative",
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    color: "#222",
    fontFamily: "'Inter', sans-serif",
    overflow: "hidden",
    background: "#fff",
  },
  backgroundMain: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 1,
  },
  backgroundMedia: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    backgroundSize: "cover",
    backgroundPosition: "center",
    transition: "opacity 1.8s ease-in-out",
  },
  backgroundOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(255, 255, 255, 0.65)",
    zIndex: 2,
  },
  heroHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    background: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(6px)",
    zIndex: 10,
    borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
  },
  heroLogo: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  logoImage: {
    width: "55px",
    height: "55px",
    borderRadius: "10px",
    border: "2px solid #ddd",
    objectFit: "cover",
  },
  logoText: {
    fontSize: "28px",
    fontWeight: 700,
    margin: 0,
    color: "#222",
  },
  heroButtons: {
    display: "flex",
    gap: "15px",
  },
  btnOutline: {
    padding: "10px 20px",
    borderRadius: "8px",
    background: "transparent",
    border: "2px solid #444",
    color: "#222",
    cursor: "pointer",
    fontWeight: 600,
    transition: "all 0.3s ease",
    fontSize: "14px",
  },
  heroMain: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 20px",
    zIndex: 3,
    textAlign: "center",
  },
  homeContent: {
    maxWidth: "800px",
  },
  mainTitle: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "5rem",
    fontWeight: 900,
    marginBottom: "15px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: "#111",
    margin: 0,
  },
  titleUnderline: {
    width: "100px",
    height: "4px",
    background: "linear-gradient(135deg, #007bff, #00d4ff)",
    margin: "0 auto 30px auto",
    borderRadius: "2px",
  },
  heroDescription: {
    fontSize: "1.2rem",
    marginBottom: "40px",
    lineHeight: 1.6,
    fontWeight: 600, // <-- bold text
    maxWidth: "600px",
    marginLeft: "auto",
    marginRight: "auto",
    color: "#333",
  },
  homeButtons: {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  btnPrimary: {
    padding: "14px 40px",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #007bff, #00d4ff)",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    transition: "all 0.3s ease",
    fontSize: "16px",
  },
  btnSecondary: {
    padding: "14px 40px",
    borderRadius: "8px",
    background: "transparent",
    border: "2px solid #007bff",
    color: "#007bff",
    cursor: "pointer",
    fontWeight: 600,
    transition: "all 0.3s ease",
    fontSize: "16px",
  },
  aboutContent: {
    maxWidth: "700px",
    padding: "40px",
    background: "rgba(255, 255, 255, 0.9)",
    borderRadius: "15px",
    border: "1px solid rgba(0, 0, 0, 0.1)",
  },
  aboutTitle: {
    fontSize: "2.5rem",
    marginBottom: "25px",
    fontWeight: 700,
    color: "#111",
    margin: 0,
  },
  aboutText: {
    textAlign: "left",
    marginBottom: "30px",
  },
  aboutParagraph: {
    fontSize: "1.1rem",
    marginBottom: "15px",
    lineHeight: 1.6,
    fontWeight: 600, // <-- bold text
    color: "#444",
  },
};

export default HeroBanner;
