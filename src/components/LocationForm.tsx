import { useState } from 'react';
import { Location } from '../types';

interface LocationFormProps {
  onAddLocation: (location: Location) => void;
  onCalculateRoute: () => void;
}

export const LocationForm = ({ onAddLocation, onCalculateRoute }: LocationFormProps) => {
  const [input, setInput] = useState('');

  const handleGeocode = async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(input)}`
      );
      const data = await response.json();
      if (data.length > 0) {
        onAddLocation({
          name: input,
          coords: [parseFloat(data[0].lat), parseFloat(data[0].lon)]
        });
        setInput('');
      }
    } catch (error) {
      alert('Location not found!');
    }
  };

  return (
    <div style={{ width: 300, padding: 20, overflowY: 'auto' }}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter location"
      />
      <button onClick={handleGeocode}>Add Location</button>
      <button onClick={onCalculateRoute} style={{ marginTop: 20 }}>
        Calculate Shortest Path
      </button>
    </div>
  );
};