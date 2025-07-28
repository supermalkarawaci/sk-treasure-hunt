import React from 'react';
import { Location } from '../../types';
import { MapPin, CheckCircle, Lock } from 'lucide-react';

interface MiniMapProps {
  locations: Location[];
  selectedFloor: 'GF' | 'UG' | 'FF';
  onLocationClick: (location: Location) => void;
}

const MiniMap: React.FC<MiniMapProps> = ({ locations, selectedFloor, onLocationClick }) => {
  const floorLocations = locations.filter(loc => loc.floor === selectedFloor);

  const getLocationIcon = (location: Location) => {
    switch (location.status) {
      case 'completed':
        return <CheckCircle className="w-3 h-3 text-green-success" />;
      case 'available':
        return <MapPin className="w-3 h-3 text-gold" />;
      case 'locked':
        return <Lock className="w-3 h-3 text-text-muted" />;
    }
  };

  return (
    <div className="bg-accent/80 backdrop-blur-lg border border-gold/20 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-text-light mb-3 flex items-center">
        <MapPin className="w-4 h-4 text-gold mr-2" />
        Lokasi Lantai {selectedFloor}
      </h3>
      
      <div className="space-y-2">
        {floorLocations.map((location) => (
          <button
            key={location.id}
            onClick={() => onLocationClick(location)}
            disabled={location.status === 'locked'}
            className="w-full flex items-center justify-between p-2 rounded-lg bg-primary/50 hover:bg-primary/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center space-x-2">
              {getLocationIcon(location)}
              <span className="text-sm text-text-light font-medium">
                {location.name}
              </span>
            </div>
            
            <span className={`text-xs px-2 py-1 rounded-full ${
              location.status === 'completed' 
                ? 'bg-green-success/20 text-green-400'
                : location.status === 'available'
                ? 'bg-gold/20 text-gold'
                : 'bg-gray-600/20 text-text-muted'
            }`}>
              {location.status === 'completed' ? 'Selesai' : 
               location.status === 'available' ? 'Tersedia' : 'Terkunci'}
            </span>
          </button>
        ))}
        
        {floorLocations.length === 0 && (
          <p className="text-text-muted text-sm text-center py-4">
            Tidak ada lokasi di lantai ini
          </p>
        )}
      </div>
    </div>
  );
};

export default MiniMap;