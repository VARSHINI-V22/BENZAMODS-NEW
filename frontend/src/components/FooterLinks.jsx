import React from "react";

export default function FooterLinks() {
  const links = [""];
  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
      <ul className="space-y-2 text-sm">
        {links.map((link, idx) => (
          <li key={idx}>
            <a href="#" className="hover:text-red-500 transition">{link}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
