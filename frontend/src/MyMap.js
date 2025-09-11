import React from "react";

function MyMap() {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Our Location</h2>
      <div style={styles.mapWrapper}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.940301644487!2d77.59373481483469!3d12.97159889085882!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670f8e5bb33%3A0x1b5cf33ef3d3b6f4!2sBangalore%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1693540450000!5m2!1sen!2sin"
          style={styles.iframe}
          allowFullScreen=""
          loading="lazy"
          title="Google Map"
        ></iframe>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#f5f5f5",
  },
  heading: {
    marginBottom: "20px",
    color: "#1b1919ff",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
  },
  mapWrapper: {
    width: "100%",
    maxWidth: "1200px", // optional: limits max width
    height: "0",
    paddingBottom: "56.25%", // 16:9 aspect ratio
    position: "relative",
  },
  iframe: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    border: 0,
    borderRadius: "10px", // optional rounded corners
  },
};

export default MyMap;
