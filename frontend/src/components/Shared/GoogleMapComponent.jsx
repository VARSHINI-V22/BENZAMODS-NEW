import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

// Dark map style
const darkMapStyle = [
  {
    "elementType": "geometry",
    "stylers": [{ "color": "#242f3e" }]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#746855" }]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [{ "color": "#242f3e" }]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#d59563" }]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#d59563" }]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [{ "color": "#263c3f" }]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#6b9a76" }]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [{ "color": "#38414e" }]
  },
  {
    "featureType": "road",
    "elementType": "geometry.stroke",
    "stylers": [{ "color": "#212a37" }]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#9ca5b3" }]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [{ "color": "#746855" }]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [{ "color": "#1f2835" }]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#f3d19c" }]
  },
  {
    "featureType": "transit",
    "elementType": "geometry",
    "stylers": [{ "color": "#2f3948" }]
  },
  {
    "featureType": "transit.station",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#d59563" }]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{ "color": "#17263c" }]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#515c6d" }]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.stroke",
    "stylers": [{ "color": "#17263c" }]
  }
];

// Custom marker icon (can be replaced with your own)
const customMarkerIcon = {
  url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iNDIiIHZpZXdCb3g9IjAgMCAzMCA0MiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE1IDBDNi43MTU3MyAwIDAgNi43MTU3MyAwIDE1QzAgMjUuODc1IDExLjg3NSA0MS4yNSAxNSA0MkMxOC4xMjUgNDEuMjUgMzAgMjUuODc1IDMwIDE1QzMwIDYuNzE1NzMgMjMuMjg0MyAwIDE1IDBaIiBmaWxsPSIjODg2QUZGIi8+CjxjaXJjbGUgY3g9IjE1IiBjeT0iMTMiIHI9IjUiIGZpbGw9IiNGRkZGRkYiLz4KPC9zdmc+",
  scaledSize: new window.google.maps.Size(30, 42),
  anchor: new window.google.maps.Point(15, 42)
};

const GoogleMapComponent = ({ center }) => {
  const [map, setMap] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading for better UX
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const onLoad = React.useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(() => {
    setMap(null);
  }, []);

  return (
    <div className="bg-gray-900 text-white p-6 rounded-xl shadow-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Our Location</h2>
        <p className="text-gray-400">Visit us at our premium vehicle customization center</p>
      </div>
      
      <div className="relative rounded-xl overflow-hidden shadow-lg border border-gray-700">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}
        
        <LoadScript 
          googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY"
          loadingElement={<div className="h-96 bg-gray-800 animate-pulse rounded-xl"></div>}
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={14}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={{
              styles: darkMapStyle,
              disableDefaultUI: true,
              zoomControl: true,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: true,
              clickableIcons: false,
              backgroundColor: "#0f172a"
            }}
          >
            <Marker 
              position={center} 
              icon={customMarkerIcon}
              animation={window.google && window.google.maps.Animation.DROP}
            />
          </GoogleMap>
        </LoadScript>
      </div>
      
      <div className="mt-6 p-4 bg-gray-800 rounded-lg">
        <h3 className="font-semibold text-lg mb-2">Benzamods Studio</h3>
        <p className="text-gray-400">123 Customization Avenue</p>
        <p className="text-gray-400">Vehicle District, VC 90001</p>
        <p className="text-gray-400 mt-2">📞 +1 (555) 123-4567</p>
        <p className="text-gray-400">✉️ info@benzamods.com</p>
      </div>
    </div>
  );
};

export default GoogleMapComponent;