import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getServicesByType } from "../../../api/vehicleApi"; // ✅ correct path

const BikeExplore = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);

  useEffect(() => {
    getServicesByType("bike") // fetch only bike services
      .then(res => setServices(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h1>Explore Bikes</h1>
      <ul>
        {services.map(service => (
          <li key={service._id}>
            <button onClick={() => navigate(`/service/${service.name}/${service._id}`)}>
              {service.name.charAt(0).toUpperCase() + service.name.slice(1)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BikeExplore;
