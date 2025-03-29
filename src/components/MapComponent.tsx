import React, { JSX, ReactNode, useState } from "react";
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
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { Infrastructure, infrastructures } from "@/data/infracstrucure";

const bbox = {
  bottomLeft: [3.713963443114351, 11.545413171234246] as [number, number],
  topRight: [3.731440461243255, 11.56450188258589] as [number, number],
};
const center: [number, number] = [
  (bbox.bottomLeft[0] + bbox.topRight[0]) / 2,
  (bbox.bottomLeft[1] + bbox.topRight[1]) / 2,
];
const initialZoom = 15;

const icons: Record<string, JSX.Element | ReactNode> = {
  Piste: <FaPlane className="text-blue-600 text-xl" />,
  Parking: <FaParking className="text-orange-600 text-xl" />,
  Toilettes: <FaToilet className="text-gray-600 text-xl" />,
  Hôtel: <FaHotel className="text-red-600 text-xl" />,
  Bus: <FaBus className="text-green-600 text-xl" />,
  Boutique: <FaShoppingBag className="text-purple-600 text-xl" />,
  Restaurant: <FaUtensilSpoon className="text-sky-500 text-xl" />,
  Hospital: <FaHospitalAlt className="text-sky-600 text-xl" />,
};

const iconsUnicode: Record<string, string> = {
  Piste: "✈️",
  Parking: "🅿️",
  Toilettes: "🚻",
  Hôtel: "🏨",
  Bus: "🚌",
  Boutique: "🛍️",
  Restaurant: "🍽️",
  Hospital: "🏥",
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
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [selectedTileLayer, setSelectedTileLayer] = useState<string>("osm");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedInfrastructure, setSelectedInfrastructure] = useState<Infrastructure | null>(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const changeTileLayer = (layer: string) => {
    setSelectedTileLayer(layer);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleMarkerClick = (infra: Infrastructure) => {
    setSelectedInfrastructure(infra);
  };

  const filteredInfrastructures = infrastructures.filter((infra) => {
    const matchesCategory = !selectedCategory || infra.category === selectedCategory;
    const matchesSearch = infra.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="relative h-screen w-full bg-gray-100 flex">
      {/* Bouton de menu mobile */}
      <button
        className="absolute top-5 left-5 z-50 p-3 bg-indigo-900 text-white rounded-full md:hidden"
        onClick={toggleMenu}
      >
        {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Menu latéral */}
      <div
        className={`absolute md:relative top-0 left-0 h-full w-[280px] bg-white shadow-md transform transition-transform duration-300 ease-in-out z-40 p-4 overflow-y-auto md:block ${menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="bg-gray-900 p-4 rounded-lg flex items-center gap-2">
          <FaSearch className="text-white text-lg" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="flex-1 rounded-md bg-transparent text-white outline-none placeholder-gray-300"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <FaLocationArrow className="text-white text-lg" />
        </div>
        <ul className="text-sm space-y-2 py-4">
          {/* Ajouter l'option "Tout afficher" */}
          <li className="w-full">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`flex items-center gap-2 p-2 rounded cursor-pointer w-full ${selectedCategory === null ? "bg-gray-200" : ""}`}
            >
              <span className="text-xl p-3 rounded-md bg-gray-200">
                <FaSearch className="text-black text-xl" />
              </span>
              <span className="font-medium">Tout afficher</span>
            </button>
          </li>
          {/* Liste des catégories */}
          {Object.entries(icons).map(([category, icon]) => (
            <li key={category} className="w-full">
              <button
                onClick={() => setSelectedCategory(category)}
                className={`flex items-center gap-2 p-2 rounded cursor-pointer w-full ${selectedCategory === category ? "bg-gray-200" : ""}`}
              >
                <span className={`text-xl p-3 rounded-md ${categoryStyles[category]}`}>{icon}</span>
                <span className="font-medium">{category}</span>
              </button>
            </li>
          ))}
          {/* Changer de fond de carte */}
          <div className="mt-4">
            <h4 className="font-medium mb-2">Fonds de carte</h4>
            <button
              onClick={() => changeTileLayer("osm")}
              className={`p-2 rounded ${selectedTileLayer === "osm" ? "bg-gray-200" : ""}`}
            >
              OpenStreetMap
            </button>
            <button
              onClick={() => changeTileLayer("satellite")}
              className={`p-2 mt-2 rounded ${selectedTileLayer === "satellite" ? "bg-gray-200" : ""}`}
            >
              Satellite
            </button>
          </div>
        </ul>
      </div>

      {/* Carte Leaflet */}
      <div className="flex-1 z-0">
        <MapContainer
          center={center}
          zoom={initialZoom}
          style={{ height: "100vh", width: "100%", zIndex: 0 }}
        >
          {/* Changer le fond de carte en fonction de la sélection */}
          {selectedTileLayer === "osm" && (
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          )}
          {selectedTileLayer === "satellite" && (
            <TileLayer url="https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png" />
          )}
          {filteredInfrastructures.map((infra) => (
            <Marker
              key={infra.id}
              position={infra.coordinates}
              icon={L.divIcon({
                html: `<div class='text-2xl'>${iconsUnicode[infra.category] || "❓"}</div>`,
                className: "",
                iconSize: [25, 25],
              })}
              eventHandlers={{
                click: () => handleMarkerClick(infra),
              }}
            >
              <Popup>{infra.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Panneau latéral droit */}
      {selectedInfrastructure && (
        <div className="absolute top-0 right-0 h-full w-[320px] bg-white shadow-md p-4 z-50 transform transition-transform duration-300 ease-in-out">
          <button
            className="absolute top-5 right-5 text-2xl text-gray-600"
            onClick={() => setSelectedInfrastructure(null)}
          >
            <FaTimes />
          </button>
          <div className="flex items-center gap-4">
            <div className="text-3xl">{iconsUnicode[selectedInfrastructure.category] || "❓"}</div>
            <div className="font-semibold text-xl">{selectedInfrastructure.name}</div>
          </div>
          <div className="mt-4">
            <p className="font-medium">Category: {selectedInfrastructure.category}</p>
            <p>Location: {selectedInfrastructure.coordinates.join(", ")}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeoportailAeroport;
