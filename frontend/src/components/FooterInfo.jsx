import React from "react";

export default function Footer() {
  return (
    <div style={footerContainer}>
      {/* Footer Info Section */}
      <div style={styles.container}>
        <h2 style={styles.mainHeading}>
          BENZAMODS
        </h2>
        <p style={styles.tagline}>
          Ride Free, Live Wild
        </p>
        <p style={styles.description}>
          Premium vehicle customization services that transform your ride into a masterpiece. 
          Experience the perfect blend of style, performance, and individuality.
        </p>
        
        {/* Additional decorative elements */}
        <div style={styles.decorativeElements}>
          <div style={styles.dot}></div>
          <div style={styles.dot}></div>
          <div style={styles.dot}></div>
        </div>

        {/* Social icons */}
        <div style={styles.socialContainer}>
          <div style={styles.socialIcon}>📱</div>
          <div style={styles.socialIcon}>💬</div>
          <div style={styles.socialIcon}>📸</div>
        </div>
      </div>

      {/* Footer Contact Section */}
      <div style={contactContainer}>
        <h3 style={contactHeading}>
          Contact Us
        </h3>
        <ul style={contactList}>
          <li style={contactListItem}>
            <div style={iconContainer}>
              <span style={icon}>📞</span>
            </div>
            <span style={contactText}>+91 8904708819</span>
          </li>
          <li style={contactListItem}>
            <div style={iconContainer}>
              <span style={icon}>✉️</span>
            </div>
            <span style={contactText}>info@Benzamods12.com</span>
          </li>
          <li style={contactListItem}>
            <div style={iconContainer}>
              <span style={icon}>📍</span>
            </div>
            <span style={contactText}>1st cross, 2nd stage jayanagar opp to myura bakery, Bengaluru, karnataka, india</span>
          </li>
          <li style={contactListItem}>
            <div style={iconContainer}>
              <span style={icon}>🕒</span>
            </div>
            <div>
              <p style={contactText}>Monday - Saturday: 9:00 AM - 8:00 PM</p>
              <p style={hoursText}>Sunday: Closed</p>
            </div>
          </li>
        </ul>
        
        {/* Call to Action Button */}
        <button style={ctaButton}>
          Get In Touch
        </button>
      </div>

      {/* Font import script */}
      <script dangerouslySetInnerHTML={{ __html: `
        const fontLink = document.createElement("link");
        fontLink.href = "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap";
        fontLink.rel = "stylesheet";
        document.head.appendChild(fontLink);
      `}} />
    </div>
  );
}

// Main container styles
const footerContainer = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '40px',
  padding: '40px',
  backgroundColor: '#0a0a12',
  fontFamily: "'Montserrat', sans-serif",
};

// Footer Info Styles
const styles = {
  container: {
    backgroundColor: "#0f0f1a",
    color: "#ffffff",
    padding: "30px",
    borderRadius: "15px",
    maxWidth: "380px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
    border: "1px solid #2d2d4d",
    textAlign: "center",
    flex: 1,
    minWidth: '300px'
  },
  mainHeading: {
    fontSize: "2.8rem",
    fontWeight: "800",
    marginBottom: "15px",
    background: "linear-gradient(45deg, #9f7aea, #6b8cfe, #9f7aea)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: "0 0 15px rgba(159, 122, 234, 0.5)",
    letterSpacing: "1px",
  },
  tagline: {
    fontSize: "1.6rem",
    fontWeight: "700",
    marginBottom: "20px",
    background: "linear-gradient(45deg, #a78bfa, #7c9cff, #a78bfa)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: "0 0 10px rgba(167, 139, 250, 0.4)",
  },
  description: {
    color: "#e2e8f0",
    fontSize: "1rem",
    lineHeight: "1.7",
    marginBottom: "25px",
    fontWeight: "500",
    textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
  },
  decorativeElements: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    marginBottom: "25px",
  },
  dot: {
    width: "14px",
    height: "14px",
    borderRadius: "50%",
    background: "linear-gradient(45deg, #9f7aea, #6b8cfe)",
    boxShadow: "0 0 10px rgba(159, 122, 234, 0.7)",
  },
  socialContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginTop: "15px",
  },
  socialIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "linear-gradient(45deg, #1a1a2e, #252547)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
    cursor: "pointer",
    transition: "transform 0.3s ease",
  },
};

// Footer Contact Styles
const contactContainer = {
  backgroundColor: "#0f0f1a",
  color: "#ffffff",
  padding: "30px",
  borderRadius: "15px",
  maxWidth: "450px",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
  border: "1px solid #2d2d4d",
  flex: 1,
  minWidth: '300px'
};

const contactHeading = {
  fontSize: "1.8rem",
  fontWeight: "700",
  marginBottom: "25px",
  background: "linear-gradient(45deg, #9f7aea, #6b8cfe)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  textShadow: "0 0 10px rgba(159, 122, 234, 0.5)",
  textAlign: "center"
};

const contactList = {
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "flex",
  flexDirection: "column",
  gap: "15px"
};

const contactListItem = {
  display: "flex",
  alignItems: "flex-start",
  gap: "15px",
  padding: "15px",
  borderRadius: "10px",
  backgroundColor: "#1a1a2e",
  border: "1px solid #2d2d4d",
  transition: "all 0.3s ease",
};

const iconContainer = {
  backgroundColor: "#7b68ee",
  padding: "10px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "40px",
  height: "40px",
  boxShadow: "0 0 10px rgba(123, 104, 238, 0.5)",
};

const icon = {
  fontSize: "18px"
};

const contactText = {
  fontWeight: "600",
  color: "#e6e6ff",
  lineHeight: "1.5"
};

const hoursText = {
  fontSize: "0.9rem",
  color: "#a9a9cc",
  marginTop: "5px"
};

const ctaButton = {
  marginTop: "25px",
  width: "100%",
  background: "linear-gradient(45deg, #7b68ee, #6a5acd)",
  color: "white",
  border: "none",
  padding: "15px",
  borderRadius: "10px",
  fontWeight: "600",
  fontSize: "16px",
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow: "0 5px 15px rgba(123, 104, 238, 0.3)",
};