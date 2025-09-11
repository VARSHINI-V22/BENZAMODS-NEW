import bmwBefore from "../images/bmw-before.jpg";
import bmwAfter from "../images/bmw-after.jpg";
import yamahaBefore from "../images/yamaha-before.jpg";
import yamahaAfter from "../images/yamaha-after.jpg";

const projects = [
  {
    id: 1,
    title: "Luxury Car Wrap",
    type: "car",
    brand: "BMW",
    service: "Wrap",
    description: "Full body wrap for a BMW X5, giving it a matte black finish.",
    beforeAfter: [bmwBefore, bmwAfter],
    clientReview: "Amazing transformation! Highly recommended."
  },
  {
    id: 2,
    title: "Custom Bike Paint",
    type: "bike",
    brand: "Yamaha",
    service: "Paint",
    description: "Custom flame paint job for Yamaha R15.",
    beforeAfter: [yamahaBefore, yamahaAfter],
    clientReview: "The bike looks stunning! Perfect work."
  },
];

export default projects;
