import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Vite me default marker icon toot jata hai, isliye ye fix zaroori hai
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

function FitMap({ pickup, destination, route }) {
  const map = useMap();

  useEffect(() => {
    if (route.length > 1) {
      map.fitBounds(route, { padding: [40, 40] });
    } else if (pickup) {
      map.setView([pickup.lat, pickup.lng], 15);
    } else if (destination) {
      map.setView([destination.lat, destination.lng], 15);
    }
  }, [pickup, destination, route, map]);

  return null;
}

function RouteMap({ pickup, destination, route }) {
  return (
    <MapContainer
      center={[28.367, 79.43]} // Bareilly, default
      zoom={12}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {pickup && <Marker position={[pickup.lat, pickup.lng]} />}
      {destination && <Marker position={[destination.lat, destination.lng]} />}
      {route.length > 0 && (
        <Polyline positions={route} pathOptions={{ color: "#f97316", weight: 5 }} />
      )}
      <FitMap pickup={pickup} destination={destination} route={route} />
    </MapContainer>
  );
}

export default RouteMap;