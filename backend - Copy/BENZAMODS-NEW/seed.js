const mongoose = require("mongoose");
const connectDB = require("./config/db");

const Category = require("./models/Category");
const Modification = require("./models/Modification");
const Detail = require("./models/Detail");

async function seed() {
  await connectDB();

  await Category.deleteMany();
  await Modification.deleteMany();
  await Detail.deleteMany();

  const carsCategory = await Category.create({
    name: "Cars",
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a",
  });

  const carMods = await Modification.insertMany([
    {
      categoryId: carsCategory._id,
     
      id: "wraps",
      title: "Car Wraps",
      description: "High quality vinyl wraps to customize your car's look and protect the paint.",
      image: "https://www.customwraps.ca/images/wrap_faq.jpg",
      gallery: [
        "https://www.customwraps.ca/images/wrap_faq.jpg",
        "https://tse3.mm.bing.net/th/id/OIP.isbM2AGjeKjz9hQnpTC93gHaEK?pid=Api&P=0&h=220",
        "https://yeahmotor.com/wp-content/uploads/2019/05/carwrap13.jpg"
      ]
    },
    {
      categoryId: carsCategory._id,
      id: "lights",
      title: "Car Lights",
      description: "LED, halogen, and custom lighting options for enhanced visibility and style.",
      image: "https://wallpapercave.com/wp/wp5325623.jpg",
      gallery: [
        "https://wallpapercave.com/wp/wp5325623.jpg",
        "https://www.totalzparts.com/wp-content/uploads/2020/09/Image-1.jpg",
        "https://tse3.mm.bing.net/th/id/OIP.-RawoNaX7nEoONB_0s8rwgHaEK?pid=Api&P=0&h=220"
      ]
    },
    {
      categoryId: carsCategory._id,
      name: "ppf",
      image: "https://www.fastcar.co.uk/wp-content/uploads/sites/2/2018/08/FAST-CAR-PERFORMANCE-EXHAUST-SYSTEM-COMPONENTS-GUIDE.jpg",
    },
    {
      categoryId: carsCategory._id,
      id: "suspension",
      title: "Car Suspension",
      description: "Performance suspension kits for a smooth ride and better handling.",
      image: "https://tse2.mm.bing.net/th/id/OIP.Ph1-EisJ5Qf_ksZZYwHmCAHaE8?pid=Api&P=0&h=220",
      gallery: [
        "https://tse2.mm.bing.net/th/id/OIP.bQNAZ2NAOTAOTYcenzXeYQHaEo?pid=Api&P=0&h=220",
        "https://tse4.mm.bing.net/th/id/OIP.wPKCPZURvfGc4HIisBJ5-wHaE7?pid=Api&P=0&h=220",
        "https://tse2.mm.bing.net/th/id/OIP.0mxugC6IMMA2Z-kW5dzMeAHaE8?pid=Api&P=0&h=220"
      ]
    },
    {
      categoryId: carsCategory._id,
       id: "ppf",
      title: "Car PPF",
      description: "Paint Protection Film to safeguard your car's exterior from scratches and wear.",
      image: "https://tse3.mm.bing.net/th/id/OIP.69XayhTFPh2d9--o0QY80QHaE8?pid=Api&P=0&h=220",
      gallery: [
        "https://tse2.mm.bing.net/th/id/OIP.jm8bAOBnZxnBMAp9wy-B0AHaEm?pid=Api&P=0&h=220",
        "https://tse1.mm.bing.net/th/id/OIP.7CFQDCXPrQ9a4Zxlw8eqcAHaE8?pid=Api&P=0&h=220"
      ]
    },
  ]);

  const wrapsMod = carMods.find(m => m.name === "Wraps");

  await Detail.insertMany([
    {
      modificationId: wrapsMod._id,
      title: " Wrap",
      image: "https://www.speedpro.com/tampa-east/wp-content/uploads/sites/122/2020/07/Best-Vinyl-Car-Wrap-For-Your-Car.jpg",
      description: "Sleek and stealthy matte black car wrap.",
    },
    {
      modificationId: wrapsMod._id,
      title: "body kits",
      image: "https://www.creativecolorstudio.com/wp-content/uploads/2019/07/BWL0686-1920x1277.jpg",
      description: "Shiny red wrap for a sporty look.",
    },
    {
      modificationId: wrapsMod._id,
      title: "suspension",
      image: "https://i0.wp.com/www.customvehiclewraps.com/wp-content/uploads/2018/01/chrome-aston-martin-wrap-01.jpg?fit=1200%2C782&ssl=1",
      description: "Mirror-like chrome finish for standout style.",
    },
  ]);

  const bikesCategory = await Category.create({
    name: "Bikes",
    image: "https://backiee.com/static/wallpapers/1000x563/390493.jpg",
  });

  const bikeMods = await Modification.insertMany([
    {
      categoryId: bikesCategory._id,
      name: "bodykits",
      image: "https://www.motovationusa.com/images/product/1515755513-kawasaki_z900_z_900_scproject_SC1R_SC1-R_carbon_titane_pot_Abe_silencieux_echappement_z900_sc-project.jpg",
    },
    {
      categoryId: bikesCategory._id,
      name: "Stickers",
      image: "https://static.vecteezy.com/system/resources/thumbnails/000/962/862/small_2x/motorcycle-vinyl-sticker.jpg",
    },
    {
      categoryId: bikesCategory._id,
      name: "Seats",
      image: "https://tse1.mm.bing.net/th/id/OIP.lcbh5owdkP_8cuBNU7H_xAHaE8?cb=thfc1&rs=1&pid=ImgDetMain&o=7&rm=3",
    },
  ]);

  
  const accessoriesCategory = await Category.create({
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1523961131990-5ea7c61b2107",
  });

  const accessoriesMods = await Modification.insertMany([
    {
      categoryId: accessoriesCategory._id,
      name: "Car Covers",
      image: "https://i5.walmartimages.com/seo/Kayme-Heavy-Duty-Car-Cover-Custom-Fit-Porsche-911-991-992-997-996-Carrera-S-4S-GTS-Coupe-Convertible-Targa-Waterproof-All-Weather-Automobiles-Full-Ex_80914670-b8a5-46b0-8909-b801e5d86c63.b80ea230423965659d60000888f20ccf.jpeg",
    },
    {
      categoryId: accessoriesCategory._id,
      name: "Floor Mats",
      image: "https://m.media-amazon.com/images/I/81wZnPJP9eL._AC_SL1500_.jpg",
    },
    {
      categoryId: accessoriesCategory._id,
      name: "Phone Holders",
      image: "https://m.media-amazon.com/images/I/716tH1xGrdL._AC_SL1500_.jpg",
    },
  ]);

  console.log("Database seeded successfully with Cars, Bikes & Accessories!");
  process.exit();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
