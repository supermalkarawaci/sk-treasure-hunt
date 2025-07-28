import React from 'react';
import { motion } from 'framer-motion';

interface FloorSelectorProps {
  selectedFloor: 'GF' | 'UG' | 'FF';
  onFloorChange: (floor: 'GF' | 'UG' | 'FF') => void;
  locationCounts: { [key: string]: number };
}

const FloorSelector: React.FC<FloorSelectorProps> = ({ 
  selectedFloor, 
  onFloorChange, 
  locationCounts 
}) => {
  const floors = [
    { id: 'GF' as const, name: 'Ground Floor', label: 'GF' },
    { id: 'UG' as const, name: 'Underground', label: 'UG' },
    { id: 'FF' as const, name: 'First Floor', label: 'FF' }
  ];

  return (
    <div className="flex bg-accent/50 backdrop-blur-lg border border-gold/20 rounded-xl p-1">
      {floors.map((floor) => (
        <button
          key={floor.id}
          onClick={() => onFloorChange(floor.id)}
          className={`relative flex-1 px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
            selectedFloor === floor.id
              ? 'text-primary'
              : 'text-text-light hover:text-gold'
          }`}
        >
          {selectedFloor === floor.id && (
            <motion.div
              layoutId="activeFloor"
              className="absolute inset-0 bg-gradient-to-r from-gold to-yellow-400 rounded-lg"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          
          <div className="relative z-10 text-center">
            <div className="font-bold text-lg">{floor.label}</div>
            <div className="text-xs opacity-80">{floor.name}</div>
            {locationCounts[floor.id] > 0 && (
              <div className={`text-xs mt-1 ${
                selectedFloor === floor.id ? 'text-primary/70' : 'text-gold'
              }`}>
                {locationCounts[floor.id]} lokasi
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

export default FloorSelector;