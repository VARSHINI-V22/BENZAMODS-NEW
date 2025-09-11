// src/pages/LocationPage.jsx
import React from "react";
import GoogleMapComponent from "../components/shared/GoogleMapComponent";

const LocationPage = () => {
  // Example: Mumbai coordinates
  const mumbaiCenter = { lat: 19.076, lng: 72.8777 };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Our Location</h1>
      <GoogleMapComponent center={mumbaiCenter} />
    </div>
  );
};

export default LocationPage;
