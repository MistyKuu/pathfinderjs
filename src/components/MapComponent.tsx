// src/components/MapComponent.tsx
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import { Location } from "../types";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

interface MapProps {
  locations: Location[];
  route: L.LatLngTuple[] | null;
}

const MapContent = ({ locations, route }: MapProps) => {
  const map = useMap();

  // Automatically adjust view to show all locations and route
  useEffect(() => {
    if (locations.length > 0 || route) {
      const bounds = new L.LatLngBounds([]);

      // Add location markers to bounds
      locations.forEach((location) => {
        bounds.extend(location.coords);
      });

      // Add route path to bounds
      if (route) {
        route.forEach((coord) => {
          bounds.extend(coord);
        });
      }

      // Only fit bounds if we have valid coordinates
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] }); // Add 50px padding
      }
    }
  }, [locations, route, map]);

  return (
    <>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {locations.map((location, index) => (
        <Marker
          key={index}
          position={location.coords}
          icon={L.divIcon({
            className: "custom-marker",
            html: `<div style="background: blue; color: white; padding: 5px; border-radius: 50%">${index + 1}</div>`,
          })}
        />
      ))}
      {route && <Polyline positions={route} color="blue" />}
    </>
  );
};

export const MapComponent = ({ locations, route }: MapProps) => {
  console.log("test");
  return (
    <MapContainer
      center={[51.505, -0.09]} // Default center (will be overridden by bounds)
      zoom={13} // Default zoom (will be overridden by bounds)
      style={{ height: "100vh", width: "100%" }}
    >
      <MapContent locations={locations} route={route} />
    </MapContainer>
  );
};
