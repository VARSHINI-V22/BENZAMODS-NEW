import React from "react";
import { motion } from "framer-motion";

export default function QuickNavCard({ category }) {
  return (
    <motion.a
      href={category.link}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className="group relative rounded-2xl overflow-hidden shadow-xl cursor-pointer"
    >
      {/* Background Image */}
      <img
        src={category.img}
        alt={category.title}
        className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition"></div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
        {category.icon}
        <h3 className="mt-4 text-2xl font-semibold">{category.title}</h3>
      </div>
    </motion.a>
  );
}
