import React from "react";

export default function NavbarMobileMenu() {
  return (
    <div className="md:hidden bg-gray-900 text-gray-300 px-6 py-4 space-y-4">
      <a href="#home" className="block hover:text-red-500">Home</a>
      <a href="#services" className="block hover:text-red-500">Services</a>
      <a href="#about" className="block hover:text-red-500">About</a>
      <a href="#contact" className="block hover:text-red-500">Contact</a>
    </div>
  );
}
