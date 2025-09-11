import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import ClientReview from "./ClientReview";

const reviews = [
  {
    name: "Jayy Arya",
    review: "Amazing service! My car looks brand new after modifications.",
    img: "https://www.shutterstock.com/image-vector/smiling-businessman-suit-happy-man-600nw-2189068043.jpg",
  },
  {
    name: "Sara Ali khan",
    review: "Loved the bike mods, very professional team!",
    img: "https://media.istockphoto.com/id/1337683229/vector/strong-woman-concept.jpg?s=612x612&w=0&k=20&c=vpTFWfqQtlY5Fy1Mkpoj9UA00PnjjUch7Dpe55cDMGQ=",
  },
  {
    name: "Mohan NTR",
    review: "Affordable and stylish accessories. Highly recommend Benzamods!",
    img: "https://img.freepik.com/premium-vector/set-young-men-women-different-colors-cartoon-character-group-silhouettes-standing-business-people-students-design-concept-flat-icon-isolated-white-background_679557-4794.jpg?w=360",
  },
];

export default function ClientCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setIndex((prev) => (prev + 1) % reviews.length),
      4000
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b white text-black">
      <h2 className="text-4xl font-bold text-center mb-12">
        What Our Clients Say
      </h2>
      <div className="relative w-full max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          <ClientReview review={reviews[index]} />
        </AnimatePresence>
      </div>
    </section>
  );
}
