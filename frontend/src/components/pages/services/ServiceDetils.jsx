import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import vehicleApi from "../../../api/vehicleApi"; // make sure this exists
import EnquiryForm from "../../Shared/EnquiryForm";

const ServiceDetails = () => {
  const { id } = useParams(); // get service ID from URL
  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch service by ID
    vehicleApi.getServiceById(id)
      .then(res => {
        setServiceData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching service:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading service details...</p>;
  if (!serviceData) return <p>Service not found.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{serviceData.name}</h1>
      <p className="text-lg mb-2">Price: ₹{serviceData.price}</p>
      <p className="mb-4">{serviceData.description}</p>

      {serviceData.image && (
        <img
          src={serviceData.image}
          alt={serviceData.name}
          className="w-full h-auto rounded mb-6"
        />
      )}

      <h2 className="text-2xl font-semibold mb-2">Enquiry Form</h2>
      <EnquiryForm serviceId={serviceData._id} />
    </div>
  );
};

export default ServiceDetails;
