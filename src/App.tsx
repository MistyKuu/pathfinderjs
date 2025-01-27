import { useState } from 'react';
import { MapComponent } from './components/MapComponent';
import { LocationForm } from './components/LocationForm';
import { Location } from './types';
import L from 'leaflet';
import './App.css';

function App() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [route, setRoute] = useState<L.LatLngTuple[] | null>(null);
  const [totalDistance, setTotalDistance] = useState<number | null>(null);

  const handleRemoveLocation = (index: number) => {
    const newLocations = locations.filter((_, i) => i !== index);
    setLocations(newLocations);
    setRoute(null);
    setTotalDistance(null);
  };

  const handleCalculateRoute = async () => {
    try {
      const coordinates = locations
        .map(l => `${l.coords[1]},${l.coords[0]}`)
        .join(';');

      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`
      );
      
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      
      if (data.code === 'Ok') {
        const routeCoords = data.routes[0].geometry.coordinates
          .map(([lng, lat]: [number, number]) => [lat, lng]);
        
        setRoute(routeCoords as L.LatLngTuple[]);
        setTotalDistance(data.routes[0].distance);
      } else {
        throw new Error(data.message || 'Failed to calculate route');
      }
    } catch (error) {
      console.error('Routing error:', error);
      alert('Error calculating route! Check console for details');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <LocationForm
        locations={locations}
        totalDistance={totalDistance}
        onAddLocation={(location) => setLocations([...locations, location])}
        onRemoveLocation={handleRemoveLocation}
        onCalculateRoute={handleCalculateRoute}
      />
      <MapComponent 
        locations={locations} 
        route={route} 
        totalDistance={totalDistance} 
      />
    </div>
  );
}

export default App;