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
          { 
            userName: "Varshini", 
            comment: "Great platform! The customization options are amazing.",
            rating: 5
          },
          { 
            userName: "Deepa", 
            comment: "Bike accessories are awesome. Quality is top-notch!",
            rating: 4
          },
          { 
            userName: "Ashwini", 
            comment: "Quick delivery and great service. Will definitely order again!",
            rating: 5
          },
          { 
            userName: "Rahul", 
            comment: "Professional service and excellent results on my car wrap.",
            rating: 5
          },
          { 
            userName: "Priya", 
            comment: "Love the attention to detail. My bike looks brand new!",
            rating: 4
          },
        ]);
      }
    };

    loadReviews();
  }, []);

  // Set up interval to cycle through reviews
  useEffect(() => {
    if (reviews.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % reviews.length);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [reviews.length]);

  // Handle next button click
  const handleNext = () => {
    setCurrentIndex((currentIndex + 1) % reviews.length);
  };

  // Handle previous button click
  const handlePrev = () => {
    setCurrentIndex((currentIndex - 1 + reviews.length) % reviews.length);
  };

  if (reviews.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6">
        <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Customer Reviews
        </h2>
        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700 max-w-md text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <p className="text-gray-400 text-lg">No reviews available yet.</p>
          <p className="text-gray-500 mt-2">Be the first to share your experience!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6">
      {/* Header */}
      <h2 className="text-4xl font-bold mb-12 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
        Customer Reviews
      </h2>

      {/* Review Card */}
      <div className="relative w-full max-w-2xl">
        {/* Navigation Arrows */}
        {reviews.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-12 bg-gray-800 hover:bg-gray-700 p-3 rounded-full shadow-lg border border-gray-700 transition-all duration-300 z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-12 bg-gray-800 hover:bg-gray-700 p-3 rounded-full shadow-lg border border-gray-700 transition-all duration-300 z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Review Content */}
        <div 
          key={currentIndex}
          className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700 transition-all duration-500 transform hover:scale-[1.02]"
        >
          {/* Quote Icon */}
          <div className="text-purple-500 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 opacity-50" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
          </div>

          {/* Star Rating */}
          <div className="flex justify-center mb-6">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                className={`h-7 w-7 mx-1 ${i < (reviews[currentIndex].rating || 5) ? 'text-yellow-400' : 'text-gray-600'}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>

          {/* Review Text */}
          <p className="text-xl italic text-gray-200 text-center mb-8 leading-relaxed">
            "{reviews[currentIndex].comment}"
          </p>

          {/* Reviewer Name */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl font-bold">
                {reviews[currentIndex].userName.charAt(0)}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-purple-300">
              {reviews[currentIndex].userName}
            </h3>
          </div>
        </div>
      </div>

      {/* Dots Indicator */}
      {reviews.length > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-purple-500' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      )}

      {/* Next Button */}
      {reviews.length > 1 && (
        <button
          onClick={handleNext}
          className="mt-10 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
        >
          Next Review
        </button>
      )}
    </div>
  );
}

export default CustomerReviews;