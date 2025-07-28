import React from 'react';
import { Location } from '../../types';
import { Lock, MapPin, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface LocationCardProps {
  location: Location;
  onClick: () => void;
}

const LocationCard: React.FC<LocationCardProps> = ({ location, onClick }) => {
  const getStatusIcon = () => {
    switch (location.status) {
      case 'locked':
        return <Lock className="w-6 h-6 text-text-muted" />;
      case 'available':
        return <MapPin className="w-6 h-6 text-gold" />;
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-success" />;
    }
  };

  const getStatusColor = () => {
    switch (location.status) {
      case 'locked':
        return 'from-gray-800 to-gray-900 border-gray-600';
      case 'available':
        return 'from-gold/20 to-yellow-400/20 border-gold animate-pulse';
      case 'completed':
        return 'from-green-900/50 to-green-800/50 border-green-400';
    }
  };

  const isDisabled = location.status === 'locked';

  return (
    <motion.div
      whileTap={!isDisabled ? { scale: 0.95 } : {}}
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${getStatusColor()} border backdrop-blur-lg`}
    >
      <button
        onClick={onClick}
        disabled={isDisabled}
        className="w-full p-4 text-left transition-all duration-200 hover:bg-white/5 disabled:cursor-not-allowed"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-bold text-text-light text-lg mb-1">
              {location.name}
            </h3>
            <p className="text-text-muted text-sm">
              Lantai {location.floor}
            </p>
          </div>
          {getStatusIcon()}
        </div>
        
        <p className="text-text-muted text-sm mb-3">
          {location.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            location.status === 'completed' 
              ? 'bg-green-success/20 text-green-400'
              : location.status === 'available'
              ? 'bg-gold/20 text-gold'
              : 'bg-gray-600/20 text-text-muted'
          }`}>
            {location.status === 'completed' ? 'Selesai' : 
             location.status === 'available' ? 'Tersedia' : 'Terkunci'}
          </span>
          
          {location.status === 'available' && (
            <div className="w-2 h-2 bg-gold rounded-full animate-ping" />
          )}
        </div>
      </button>
      
      {isDisabled && (
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] flex items-center justify-center">
          <Lock className="w-8 h-8 text-text-muted" />
        </div>
      )}
    </motion.div>
  );
};

export default LocationCard;