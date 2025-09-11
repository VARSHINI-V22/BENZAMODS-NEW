// src/components/HeroBanner.js
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function HeroBanner() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  // Background images
  const backgroundMedia = [
    { type: "image", src: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" },
    { type: "image", src: "https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" },
    { type: "image", src: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1725&q=80" },
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
                  transform: index === currentBgIndex ? 'scale(1.1)' : 'scale(1)',
                }}
                className="zoom-bg"
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
          <button onClick={() => navigate('/portfolio')} style={styles.btnOutline}>
            Portfolio
          </button>
          <button onClick={() => navigate('/services')} style={styles.btnOutline}>
            Services
          </button>
          <button onClick={() => navigate('/contact')} style={styles.btnOutline}>
            Contact
          </button>
        </div>
      </header>

      {/* Main */}
      <main style={styles.heroMain}>
        <div style={styles.homeContent}>
          <div style={styles.titleContainer}>
            <div style={styles.badge}>PREMIUM AUTOMOTIVE CUSTOMIZATION</div>
            <h1 style={styles.mainTitle}>BENZAMODS</h1>
            <div style={styles.titleUnderline}></div>
          </div>
          <p style={styles.heroDescription}>
            Transform your ride with premium custom modifications, unique
            styling, and high-performance upgrades. Where passion meets
            perfection.
          </p>

          <div style={styles.homeButtons}>
            <button
              style={styles.btnPrimary}
              onClick={() => navigate("/portfolio")}
              className="pulse-btn"
            >
              Explore Now
              <span style={styles.nestedButton} onClick={(e) => {
                e.stopPropagation();
                navigate('/explore');
              }}>
                View Gallery
              </span>
            </button>
            <button
              style={styles.btnSecondary}
              onClick={() => navigate("/services")}
            >
              Our Services
            </button>
            <button
              style={styles.btnTertiary}
              onClick={() => navigate("/explore")}
            >
              Explore Wraps
            </button>
          </div>
        </div>
      </main>

      {/* Floating inquiry form button */}
      <div style={styles.inquiryButton} onClick={() => navigate('/contact')}>
        <span>Inquiry Form</span>
      </div>
    </div>
  );
}

// Modern dark theme styles with animations
const styles = {
  heroContainer: {
    position: "relative",
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    color: "#fff",
    fontFamily: "'Inter', sans-serif",
    overflow: "hidden",
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
    transition: "opacity 1.5s ease-in-out, transform 10s ease-in-out",
  },
  backgroundOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)",
    zIndex: 2,
  },
  heroHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    background: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(10px)",
    zIndex: 10,
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    animation: "slideDown 0.8s ease-out",
  },
  heroLogo: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  logoImage: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    border: "2px solid rgba(255, 255, 255, 0.2)",
    objectFit: "cover",
    animation: "rotate 20s linear infinite",
  },
  logoText: {
    fontSize: "24px",
    fontWeight: 700,
    margin: 0,
    color: "#fff",
    letterSpacing: "1px",
  },
  heroButtons: {
    display: "flex",
    gap: "15px",
  },
  btnOutline: {
    padding: "10px 20px",
    borderRadius: "30px",
    background: "transparent",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
    transition: "all 0.3s ease",
    fontSize: "14px",
    letterSpacing: "0.5px",
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
    padding: "40px",
    background: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    animation: "fadeIn 1s ease-out, float 6s ease-in-out infinite",
  },
  badge: {
    display: "inline-block",
    padding: "8px 16px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "30px",
    fontSize: "12px",
    fontWeight: 600,
    letterSpacing: "1px",
    marginBottom: "20px",
    color: "#00d4ff",
    animation: "pulse 2s infinite",
  },
  mainTitle: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "4.5rem",
    fontWeight: 900,
    marginBottom: "15px",
    letterSpacing: "3px",
    textTransform: "uppercase",
    color: "#fff",
    margin: 0,
    textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
    animation: "fadeInUp 1s ease-out",
  },
  titleUnderline: {
    width: "80px",
    height: "4px",
    background: "linear-gradient(135deg, #007bff, #00d4ff)",
    margin: "0 auto 30px auto",
    borderRadius: "2px",
    animation: "expandWidth 1s ease-out",
  },
  heroDescription: {
    fontSize: "1.2rem",
    marginBottom: "40px",
    lineHeight: 1.6,
    fontWeight: 400,
    maxWidth: "600px",
    marginLeft: "auto",
    marginRight: "auto",
    color: "rgba(255, 255, 255, 0.9)",
    animation: "fadeIn 1.5s ease-out",
  },
  homeButtons: {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
    flexWrap: "wrap",
    position: "relative",
  },
  btnPrimary: {
    padding: "15px 40px",
    borderRadius: "30px",
    background: "linear-gradient(135deg, #007bff, #00d4ff)",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    transition: "all 0.3s ease",
    fontSize: "16px",
    letterSpacing: "0.5px",
    boxShadow: "0 4px 15px rgba(0, 123, 255, 0.3)",
    position: "relative",
    overflow: "hidden",
  },
  nestedButton: {
    position: "absolute",
    bottom: "-10px",
    right: "10px",
    background: "linear-gradient(135deg, #ff0080, #ff8c00)",
    color: "white",
    padding: "5px 10px",
    borderRadius: "15px",
    fontSize: "10px",
    fontWeight: "bold",
    cursor: "pointer",
    transform: "translateY(100%)",
    transition: "all 0.3s ease",
    opacity: 0,
  },
  btnSecondary: {
    padding: "15px 40px",
    borderRadius: "30px",
    background: "transparent",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
    transition: "all 0.3s ease",
    fontSize: "16px",
    letterSpacing: "0.5px",
  },
  btnTertiary: {
    padding: "15px 40px",
    borderRadius: "30px",
    background: "linear-gradient(135deg, #ff0080, #ff8c00)",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    transition: "all 0.3s ease",
    fontSize: "16px",
    letterSpacing: "0.5px",
    boxShadow: "0 4px 15px rgba(255, 0, 128, 0.3)",
  },
  inquiryButton: {
    position: "fixed",
    bottom: "30px",
    right: "30px",
    background: "linear-gradient(135deg, #00d4ff, #007bff)",
    color: "white",
    padding: "15px 25px",
    borderRadius: "50px",
    cursor: "pointer",
    fontWeight: 600,
    boxShadow: "0 5px 15px rgba(0, 123, 255, 0.4)",
    zIndex: 100,
    animation: "bounce 2s infinite",
    transition: "all 0.3s ease",
  },
};

// Add these global styles for animations
const addGlobalStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
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
      to { width: 80px; opacity: 1; }
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
    
    .zoom-bg {
      transition: transform 10s ease-in-out !important;
    }
    
    button {
      transition: all 0.3s ease !important;
    }
    
    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    }
    
    .btn-outline:hover {
      background: rgba(255, 255, 255, 0.1) !important;
      border-color: rgba(255, 255, 255, 0.5) !important;
    }
    
    .btn-primary:hover {
      box-shadow: 0 6px 20px rgba(0, 123, 255, 0.5) !important;
    }
    
    .btn-primary:hover .nested-button {
      transform: translateY(0);
      opacity: 1;
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
  `;
  document.head.appendChild(style);
};

// Call the function to add global styles
addGlobalStyles();

export default HeroBanner;