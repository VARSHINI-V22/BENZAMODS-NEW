import React from "react";
import { motion } from "framer-motion";

export default function ServiceCard({ service }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className="rounded-2xl shadow-lg overflow-hidden bg-gray-50 group"
    >
      {/* Image */}
      <div className="relative">
        <img
          src={service.img} 
          alt={service.title}
          className="h-56 w-full object-cover group-hover:scale-110 transition duration-500"
        />
        <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md p-3 rounded-full shadow">
          {service.icon}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">{service.title}</h3>
        <p className="text-gray-600 text-sm">{service.desc}</p>
      </div>
    </motion.div>
  );
}
