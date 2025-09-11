import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function SingleServiceCard({ service, index }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (service.title === "Car Modifications") {
      navigate("/car-modifications");
    }
    // later you can add conditions for Bike, Detailing etc
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
      className="p-6 bg-gray-100 rounded-2xl shadow-lg cursor-pointer hover:shadow-xl"
      onClick={handleClick}
    >
      <div className="flex justify-center">{service.icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 mt-4 text-center">
        {service.title}
      </h3>
      <p className="text-gray-600 mt-2 text-center">{service.description}</p>
    </motion.div>
  );
}
