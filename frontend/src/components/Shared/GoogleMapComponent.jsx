import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const GoogleMapComponent = ({ center }) => {
  return (
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;
