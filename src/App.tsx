import { useState } from "react";
import { MapComponent } from "./components/MapComponent";
import { LocationForm } from "./components/LocationForm";
import { Location } from "./types";
import L from "leaflet";
import "./index.css";

function App() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [route, setRoute] = useState<L.LatLngTuple[] | null>(null);

  const handleCalculateRoute = async () => {
    if (locations.length < 2) {
      alert("Add at least 2 locations!");
      return;
    }
 
    try {
      const coordinates = locations.map((l) => `${l.coords[1]},${l.coords[0]}`).join(";");

      const response = await fetch(`https://router.project-osrm.org/trip/v1/driving/${coordinates}?geometries=geojson`);
      const data = await response.json();

      if (data.code === "Ok") {
        const routeCoords = data.trips[0].geometry.coordinates.map(([lng, lat]: [number, number]) => [lat, lng]);
        setRoute(routeCoords);
      }
    } catch (error) {
      console.error(error);
      alert("Error calculating route!");
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <LocationForm
        onAddLocation={(location) => setLocations([...locations, location])}
        onCalculateRoute={handleCalculateRoute}
      />
      <MapComponent locations={locations} route={route} />
    </div>
  );
}

export default App;
