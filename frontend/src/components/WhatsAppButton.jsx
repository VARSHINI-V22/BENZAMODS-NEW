import React from "react";

export default function WhatsAppButton({ phone = "919876543210", message = "Hi Benzamods" }) {
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  return (
    <a
      className="inline-block mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-semibold"
      href={url}
      target="_blank"
      rel="noreferrer"
    >
      Chat on WhatsApp
    </a>
  );
}
