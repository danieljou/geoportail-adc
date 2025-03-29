import React, { JSX, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  FaPlane,
  FaBus,
  FaParking,
  FaToilet,
  FaHotel,
  FaShoppingBag,
  FaSearch,
  FaLocationArrow,
  FaUtensilSpoon,
  FaHospitalAlt,
} from "react-icons/fa";

interface Infrastructure {
  id: number;
  category: string;
  name: string;
  coordinates: [number, number];
  description?: string;
}

const bbox = {
  bottomLeft: [3.713963443114351, 11.545413171234246] as [number, number],
  topRight: [3.731440461243255, 11.56450188258589] as [number, number],
};
const center: [number, number] = [
  (bbox.bottomLeft[0] + bbox.topRight[0]) / 2,
  (bbox.bottomLeft[1] + bbox.topRight[1]) / 2,
];
const initialZoom = 15;

const infrastructures: Infrastructure[] = [
  {
    id: 1,
    category: "Piste",
    name: "Piste Principale",
    coordinates: [3.72, 11.55],
  },
  {
    id: 2,
    category: "Parking",
    name: "Parking P1",
    coordinates: [3.722, 11.552],
  },
  {
    id: 3,
    category: "Toilettes",
    name: "Toilettes Terminal 1",
    coordinates: [3.718, 11.551],
  },
  {
    id: 4,
    category: "Hôtel",
    name: "Aeroport Hotel",
    coordinates: [3.719, 11.548],
  },
  {
    id: 5,
    category: "Bus",
    name: "Arrêt Bus Navette",
    coordinates: [3.721, 11.553],
  },
  {
    id: 6,
    category: "Boutique",
    name: "Duty-Free Shop",
    coordinates: [3.717, 11.55],
  },
];

const icons: Record<string, JSX.Element> = {
  Piste: <FaPlane className="text-blue-600 text-xl" />,
  Parking: <FaParking className="text-orange-600 text-xl" />,
  Toilettes: <FaToilet className="text-gray-600 text-xl" />,
  Hôtel: <FaHotel className="text-red-600 text-xl" />,
  Bus: <FaBus className="text-green-600 text-xl" />,
  Boutique: <FaShoppingBag className="text-purple-600 text-xl" />,
  Restaurant: <FaUtensilSpoon className="text-sky-500 text-xl" />,
  Hospital: <FaHospitalAlt className="text-sky-600 text-xl" />,
};

const categoryStyles: Record<string, string> = {
  Piste: "bg-blue-200",
  Parking: "bg-orange-200",
  Toilettes: "bg-yellow-200",
  Hôtel: "bg-red-200",
  Bus: "bg-green-200",
  Boutique: "bg-purple-200",
  Restaurant: "bg-sky-200",
  Hospital: "bg-orange-200",
};

const GeoportailAeroport: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="p-10 flex justify-center items-center h-screen bg-gray-100 w-full">
      <MapContainer
        center={center}
        zoom={initialZoom}
        style={{
          height: "90vh",
          width: "90%",
          position: "relative",
          margin: "auto",
          zIndex: 999,
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {infrastructures
          .filter((i) => !selectedCategory || i.category === selectedCategory)
          .map((infra) => (
            <Marker
              key={infra.id}
              position={infra.coordinates}
              icon={L.divIcon({
                html: icons[infra.category]?.props?.children || "",
                className: "text-2xl",
                iconSize: [25, 25],
              })}
            >
              <Popup>{infra.name}</Popup>
            </Marker>
          ))}

        <div className="space-y-2 absolute top-3 left-3 w-[400px] z-[1000] bg-white h-fit overflow-y-auto">
          <div className="bg-gray-900 p-4 h-40 flex justify-center items-center ">
            <div className="w-full top-5 left-5 right-5 bg-indigo-900 p-4 rounded-lg shadow-lg flex items-center gap-2">
              <FaSearch className="text-white text-lg" />
              <input
                type="text"
                placeholder="Rechercher..."
                // value={searchTerm}
                // onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 rounded-md bg-transparent text-white outline-none placeholder-gray-300"
              />
              <FaLocationArrow className="text-white text-lg" />
            </div>
          </div>
          <ul className="text-sm space-y-2 p-4 overflow-y-scroll h-[600px] py-10">
            {Object.entries(icons).map(([category, icon]) => (
              <li key={category} className="w-full">
                <button
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer w-full `}
                >
                  <span
                    className={`text-xl p-4 rounded-md ${categoryStyles[category]}`}
                  >
                    {icon}
                  </span>
                  <span className="font-medium">{category}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </MapContainer>
    </div>
  );
};
export default GeoportailAeroport;
