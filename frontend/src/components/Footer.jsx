import React from "react";
import FooterInfo from "./FooterInfo";
import FooterLinks from "./FooterLinks";
import FooterContact from "./FooterContact";

export default function Footer() {
  return (
    <footer className="bg-black-900 text-white-300 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-6 grid md:whitw-cols-3 gap-10">
        <FooterInfo />
        <FooterLinks />
        <FooterContact />
      </div>

      {/* Bottom Note */}
      <div className="border-t border-black-700 mt-8 pt-4 text-center text-sm text-white-500">
        © {new Date().getFullYear()} BenzaMods. All Rights Reserved.
      </div>
    </footer>
  );
}
