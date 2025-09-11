import React from "react";

const carMods = [
  {
    id: 1,
    title: "engine",
    img: "https://images.pexels.com/photos/1792236/pexels-photo-1792236.jpeg?cs=srgb&dl=automotive-car-engine-1792236.jpg&fm=jpg",
  },
  {
    id: 2,
    title: " Exhaust",
    img: "https://azblogsingle.wpengine.com/wp-content/uploads/2021/08/exhaust-smoke.jpg",
  },
  {
    id: 3,
    title: " seats",
    img: "https://article.images.consumerreports.org/f_auto/prod/content/dam/CRO%20Images%202019/Cars/October/CR-Cars-InlineHero-Honda-CR-V-Drivers-Seat-10-19.jpg",
  },
  {
    id: 4,
    title: "suspension",
    img: "https://tse2.mm.bing.net/th/id/OIP.Ph1-EisJ5Qf_ksZZYwHmCAHaE8?pid=Api&P=0&h=220",
  },
  {
    id: 5,
    title: " Interiors",
    img: "https://www.shutterstock.com/shutterstock/photos/565415494/display_1500/stock-photo-brussels-jan-interor-of-the-mercedes-amg-gt-coupe-on-display-at-the-brussels-motor-show-565415494.jpg",
  },
];

export default function CarModifications() {
  return (
    <section className="py-16 px-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
          Car <span className="text-red-500">Modifications</span>
        </h2>

        {/* Grid of Mods */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {carMods.map((mod) => (
            <div
              key={mod.id}
              className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition"
            >
              <img
                src={mod.img}
                alt={mod.title}
                className="w-full h-56 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {mod.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        
        
      </div>
    </section>
  );
}
