import { useParams, Link } from "react-router-dom";

export default function ModificationsPage() {
  const { id } = useParams(); 

  const modifications = {
    cars: ["Wraps", "Body Kits", "Exhausts", "Lights", "Suspension"],
    bikes: ["Exhausts", "Tyres", "Lights", "Seats"],
    accessories: ["Steering Covers", "Floor Mats", "Seat Covers", "Audio Systems"],
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">All {id} Modifications</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {modifications[id]?.map((mod, idx) => (
          <Link to={`/modification/${mod.toLowerCase()}`} key={idx}>
            <div className="bg-white rounded-xl shadow p-4 cursor-pointer hover:scale-105 transition">
              <h3 className="text-lg font-semibold">{mod}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
