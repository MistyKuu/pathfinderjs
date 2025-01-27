import { useState } from 'react';
import { MapComponent } from './components/MapComponent';
import { LocationForm } from './components/LocationForm';
import { Location } from './types';
import L from 'leaflet';
import './App.css';

function App() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [route, setRoute] = useState<L.LatLngTuple[] | null>(null);

  const handleRemoveLocation = (index: number) => {
    const newLocations = locations.filter((_, i) => i !== index);
    setLocations(newLocations);
    if (newLocations.length < 2) setRoute(null);
  };

  const handleCalculateRoute = async () => {
    try {
      const coordinates = locations
        .map(l => `${l.coords[1]},${l.coords[0]}`)
        .join(';');

      const response = await fetch(
        `https://router.project-osrm.org/trip/v1/driving/${coordinates}?geometries=geojson`
      );
      const data = await response.json();

      if (data.code === 'Ok') {
        const routeCoords = data.trips[0].geometry.coordinates
          .map(([lng, lat]: [number, number]) => [lat, lng]);
        setRoute(routeCoords as L.LatLngTuple[]);
      }
    } catch (error) {
      console.error('Routing error:', error);
      alert('Error calculating route!');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <LocationForm
        locations={locations}
        onAddLocation={(location) => setLocations([...locations, location])}
        onRemoveLocation={handleRemoveLocation}
        onCalculateRoute={handleCalculateRoute}
      />
      <MapComponent locations={locations} route={route} />
    </div>
  );
}

export default App;