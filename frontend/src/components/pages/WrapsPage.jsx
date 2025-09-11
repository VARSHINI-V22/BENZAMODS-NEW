import React from "react";

export default function WrapsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Test Image</h1>
      <img 
        src="https://images.unsplash.com/photo-1610465299996-df2ec7c2e0c7?auto=format&fit=crop&w=800&q=80" 
        alt="BMW M3" 
        className="w-full h-64 object-cover"
      />
    </div>
  );
}
