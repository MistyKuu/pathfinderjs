import { MapContainer, TileLayer, Marker, Polyline, useMap, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { Location } from '../types';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  locations: Location[];
  route: L.LatLngTuple[] | null;
}

const MapContent = ({ locations, route }: MapProps) => {
  const map = useMap();

  useEffect(() => {
    const adjustMapView = () => {
      if (locations.length > 0 || route) {
        const bounds = new L.LatLngBounds([]);
        
        locations.forEach(location => bounds.extend(location.coords));
        route?.forEach(coord => bounds.extend(coord));

        if (bounds.isValid()) {
          map.fitBounds(bounds, { 
            padding: [50, 50],
            maxZoom: 15
          });
        }
      }
    };

    adjustMapView();
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
            className: 'custom-marker',
            html: `
              <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                position: relative;
              ">
                <div style="
                  background: #007bff;
                  color: white;
                  width: 28px;
                  height: 28px;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: bold;
                  font-size: 14px;
                  border: 2px solid white;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                ">
                  ${index + 1}
                </div>
              </div>
            `
          })}
        >
          <Tooltip 
            permanent 
            direction="top"
            offset={[0, -10]}
            opacity={1}
            className="custom-tooltip"
          >
            <div style={{ 
              padding: '6px 10px',
              backgroundColor: 'white',
              borderRadius: '4px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              fontSize: '14px',
              fontWeight: '500',
              color: '#333'
            }}>
              {location.name.split(',').slice(0, 2).join(', ')}
            </div>
          </Tooltip>
        </Marker>
      ))}

      {route && <Polyline 
        positions={route} 
        color="#007bff" 
        weight={4}
        opacity={0.8}
      />}
    </>
  );
};

export const MapComponent = ({ locations, route }: MapProps) => {
  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={3}
      style={{ height: '100vh', width: '100%' }}
      attributionControl={false}
    >
      <MapContent locations={locations} route={route} />
    </MapContainer>
  );
};