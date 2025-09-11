import React from "react";
import GoogleMapComponent from "../components/shared/GoogleMapComponent";

const LocationPage = () => {
  // Example: Mumbai coordinates
  const mumbaiCenter = { lat: 19.076, lng: 72.8777 };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Our Location
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Visit our premium vehicle customization studio in the heart of Mumbai. 
            We're conveniently located with easy access and ample parking.
          </p>
        </div>

        {/* Map Section */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 mb-10 border border-gray-700">
          <GoogleMapComponent center={mumbaiCenter} />
        </div>

        {/* Info Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Address Card */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="bg-purple-900 p-3 rounded-lg mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold">Address</h2>
            </div>
            <p className="text-gray-300">
              123 Customization Avenue<br />
              Vehicle District, Mumbai<br />
              Maharashtra 400001
            </p>
          </div>

          {/* Hours Card */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="bg-blue-900 p-3 rounded-lg mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold">Business Hours</h2>
            </div>
            <div className="text-gray-300 space-y-1">
              <p className="flex justify-between"><span>Mon - Fri:</span> <span>9:00 AM - 7:00 PM</span></p>
              <p className="flex justify-between"><span>Saturday:</span> <span>10:00 AM - 6:00 PM</span></p>
              <p className="flex justify-between"><span>Sunday:</span> <span>Closed</span></p>
            </div>
          </div>

          {/* Contact Card */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-indigo-500 transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="bg-indigo-900 p-3 rounded-lg mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold">Contact Info</h2>
            </div>
            <div className="text-gray-300 space-y-2">
              <p className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +91 1234567890
              </p>
              <p className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                info@benzamods.com
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-800 to-indigo-800 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Vehicle?</h2>
          <p className="text-gray-200 mb-6 max-w-2xl mx-auto">
            Schedule a consultation with our experts to discuss your customization needs. 
            Visit our studio or contact us to book an appointment.
          </p>
          <button className="bg-white text-gray-900 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-300 transform hover:-translate-y-1">
            Book Consultation
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationPage;