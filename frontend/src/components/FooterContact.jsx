import React from "react";
import {  Phone, Mail, MapPin,Clock } from "lucide-react";

export default function FooterContact() {
  return (
    <div>
      <h3 className="text-lg font-semibold text-black mb-4">Contact Us</h3>
      <ul className="space-y-2 text-sm">
        <li className="flex items-center gap-2"><Phone size={16}/> +91 8904708819</li>
        <li className="flex items-center gap-2"><Mail size={16}/> info@Benzamods12.com</li>
        <li className="flex items-center gap-2"><MapPin size={16}/> 1st cross , 2nd stage jayanagar opp to myura bakery , Bengaluru ,karnataka ,india</li>
       <li className="flex items-center gap-2">
    <Clock size={16} /> Monday - Saturday: 9:00 AM - 8:00 PM
  </li>
  <li className="flex items-center gap-2">
    <Clock size={16} /> Sunday: Closed
  </li>
      </ul>
      
    </div>
  );
}
