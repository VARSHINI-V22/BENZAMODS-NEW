import { useState, useEffect } from "react";

function CustomerReviews() {
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Load reviews from localStorage
  useEffect(() => {
    const loadReviews = () => {
      try {
        const storedReviews = JSON.parse(localStorage.getItem("reviews")) || [];
        // Only show approved reviews
        const approvedReviews = storedReviews.filter(review => review.status === "approved");
        setReviews(approvedReviews);
      } catch (error) {
        console.error("Error loading reviews:", error);
        // Fallback to static reviews if there's an error
        setReviews([
          { userName: "Varshini", comment: "Great platform!" },
          { userName: "Deepa", comment: "Bike accessories are awesome." },
          { userName: "Ashwini", comment: "Quick delivery and great service." },
        ]);
      }
    };

    loadReviews();
    
    // Set up interval to cycle through reviews
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % (reviews.length || 1));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [reviews.length]);

  // Handle next button click
  const handleNext = () => {
    setCurrentIndex((currentIndex + 1) % (reviews.length || 1));
  };

  if (reviews.length === 0) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "white",
          fontFamily: "Poppins, sans-serif",
          color: "#333",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "36px",
            fontWeight: "700",
            marginBottom: "40px",
            color: "#222",
          }}
        >
          Customer Reviews
        </h2>
        <p>No reviews available yet.</p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "white",
        fontFamily: "Poppins, sans-serif",
        color: "#333",
        textAlign: "center",
      }}
    >
      
      <h2
        style={{
          fontSize: "36px",
          fontWeight: "700",
          marginBottom: "40px",
          color: "#222",
        }}
      >
        Customer Reviews
      </h2>

      
      <div
        style={{
          width: "400px",
          minHeight: "200px",
          background: "#FFF8F0", // cream color
          borderRadius: "15px",
          padding: "30px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
          overflow: "hidden",
          position: "relative",
          border: "1px solid #E0E0E0",
        }}
      >
        <div
          key={currentIndex}
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            animation: "fadeSlide 0.8s ease-in-out",
          }}
        >
          <h3
            style={{
              fontSize: "22px",
              fontWeight: "600",
              color: "#1E40AF", // blue color
              marginBottom: "15px",
            }}
          >
            {reviews[currentIndex].userName}
          </h3>
          
          {/* Star rating */}
          <div style={{ marginBottom: "15px" }}>
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                style={{
                  color: i < (reviews[currentIndex].rating || 5) ? "#F59E0B" : "#D1D5DB",
                  fontSize: "20px",
                }}
              >
                {i < (reviews[currentIndex].rating || 5) ? "★" : "☆"}
              </span>
            ))}
          </div>
          
          <p
            style={{
              fontSize: "18px",
              fontStyle: "italic",
              lineHeight: "1.5",
              color: "black",
            }}
          >
            "{reviews[currentIndex].comment}"
          </p>
        </div>
      </div>

      
      <button
        onClick={handleNext}
        style={{
          marginTop: "40px",
          padding: "12px 30px",
          fontSize: "16px",
          fontWeight: "600",
          color: "white",
          background: "#1E40AF", // blue color
          border: "none",
          borderRadius: "30px",
          cursor: "pointer",
          transition: "all 0.3s ease-in-out",
          boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
        }}
        onMouseOver={(e) => {
          e.target.style.background = "#1D4ED8";
          e.target.style.transform = "scale(1.05)";
        }}
        onMouseOut={(e) => {
          e.target.style.background = "#1E40AF";
          e.target.style.transform = "scale(1)";
        }}
      >
        Next Review
      </button>

      
      <style>
        {`
          @keyframes fadeSlide {
            0% {
              opacity: 0;
              transform: translate(-50%, -60%);
            }
            100% {
              opacity: 1;
              transform: translate(-50%, -50%);
            }
          }
        `}
      </style>
    </div>
  );
}

export default CustomerReviews;