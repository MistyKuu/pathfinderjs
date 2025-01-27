import { useState } from 'react';
import { Location } from '../types';

interface LocationFormProps {
  locations: Location[];
  onAddLocation: (location: Location) => void;
  onRemoveLocation: (index: number) => void;
  onCalculateRoute: () => void;
}

export const LocationForm = ({
  locations,
  onAddLocation,
  onRemoveLocation,
  onCalculateRoute,
}: LocationFormProps) => {
  const [input, setInput] = useState('');

  const handleGeocode = async () => {
    if (!input.trim()) return;
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(input)}`
      );
      const data = await response.json();
      
      if (data.length > 0) {
        onAddLocation({
          name: data[0].display_name,
          coords: [parseFloat(data[0].lat), parseFloat(data[0].lon)]
        });
        setInput('');
      } else {
        alert('Location not found!');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      alert('Error searching location!');
    }
  };

  return (
    <div style={{
      width: '300px',
      padding: '20px',
      borderRight: '1px solid #ddd',
      height: '100vh',
      overflowY: 'auto',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter location"
            style={{
              flex: 1,
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleGeocode()}
          />
          <button
            onClick={handleGeocode}
            style={{
              padding: '8px 15px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Add
          </button>
        </div>

        <div style={{ 
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          padding: '15px'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>Locations List</h3>
          {locations.length === 0 ? (
            <div style={{ color: '#666', textAlign: 'center' }}>No locations added yet</div>
          ) : (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {locations.map((location, index) => (
                <div 
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px',
                    marginBottom: '8px',
                    backgroundColor: '#fff',
                    border: '1px solid #eee',
                    borderRadius: '4px'
                  }}
                >
                  <div style={{ marginRight: '10px' }}>
                    <div style={{ 
                      display: 'inline-block',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#007bff',
                      color: 'white',
                      textAlign: 'center',
                      lineHeight: '24px',
                      marginRight: '10px'
                    }}>
                      {index + 1}
                    </div>
                    <span style={{ color: '#333' }}>
                      {location.name.split(',').slice(0, 2).join(', ')}
                    </span>
                  </div>
                  <button 
                    onClick={() => onRemoveLocation(index)}
                    style={{ 
                      background: 'none',
                      border: 'none',
                      color: '#dc3545',
                      cursor: 'pointer',
                      padding: '5px'
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button 
        onClick={onCalculateRoute}
        disabled={locations.length < 2}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: locations.length < 2 ? '#6c757d' : '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        {locations.length < 2 ? 'Add 2+ locations' : 'Calculate Route'}
      </button>
    </div>
  );
};