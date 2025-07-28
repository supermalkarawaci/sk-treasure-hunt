import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { useToast } from '../hooks/useToast';
import Header from '../components/Layout/Header';
import FloorSelector from '../components/Map/FloorSelector';
import FloorMap from '../components/Map/FloorMap';
import MiniMap from '../components/Map/MiniMap';
import Button from '../components/UI/Button';
import { Location } from '../types';
import { Navigation, MapPin, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Map: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useGame();
  const { addToast } = useToast();
  
  const [selectedFloor, setSelectedFloor] = useState<'GF' | 'UG' | 'FF'>('GF');
  const [showMiniMap, setShowMiniMap] = useState(true);

  useEffect(() => {
    if (!state.player) {
      navigate('/');
      return;
    }
  }, [state.player, navigate]);

  const handleLocationClick = (location: Location) => {
    if (location.status === 'locked') {
      addToast({ 
        type: 'info', 
        message: 'Lokasi ini akan terbuka setelah menyelesaikan lokasi sebelumnya' 
      });
      return;
    }
    
    if (location.status === 'completed') {
      addToast({ 
        type: 'info', 
        message: 'Lokasi ini sudah diselesaikan' 
      });
      return;
    }
    
    // Navigate to scanner for available locations
    navigate(`/scanner/${location.id}`);
  };

  const getLocationCounts = () => {
    const counts = { GF: 0, UG: 0, FF: 0 };
    state.locations.forEach(location => {
      counts[location.floor]++;
    });
    return counts;
  };

  const getFloorStats = (floor: 'GF' | 'UG' | 'FF') => {
    const floorLocations = state.locations.filter(loc => loc.floor === floor);
    const completed = floorLocations.filter(loc => loc.status === 'completed').length;
    const available = floorLocations.filter(loc => loc.status === 'available').length;
    const locked = floorLocations.filter(loc => loc.status === 'locked').length;
    
    return { total: floorLocations.length, completed, available, locked };
  };

  const currentFloorStats = getFloorStats(selectedFloor);
  const locationCounts = getLocationCounts();

  if (!state.player) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-accent to-primary">
      <Header title="Peta Lokasi" showBackButton />
      
      <div className="px-4 py-6 space-y-6">
        {/* Floor Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-gold/10 to-yellow-400/10 backdrop-blur-lg border border-gold/20 rounded-2xl p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-text-light flex items-center">
              <Navigation className="w-5 h-5 text-gold mr-2" />
              Lantai {selectedFloor}
            </h2>
            <button
              onClick={() => setShowMiniMap(!showMiniMap)}
              className="p-2 rounded-lg bg-gold/10 hover:bg-gold/20 transition-colors"
            >
              {showMiniMap ? (
                <EyeOff className="w-4 h-4 text-gold" />
              ) : (
                <Eye className="w-4 h-4 text-gold" />
              )}
            </button>
          </div>
          
          <div className="grid grid-cols-4 gap-3 text-center">
            <div>
              <p className="text-lg font-bold text-text-light">{currentFloorStats.total}</p>
              <p className="text-xs text-text-muted">Total</p>
            </div>
            <div>
              <p className="text-lg font-bold text-green-400">{currentFloorStats.completed}</p>
              <p className="text-xs text-text-muted">Selesai</p>
            </div>
            <div>
              <p className="text-lg font-bold text-gold">{currentFloorStats.available}</p>
              <p className="text-xs text-text-muted">Tersedia</p>
            </div>
            <div>
              <p className="text-lg font-bold text-text-muted">{currentFloorStats.locked}</p>
              <p className="text-xs text-text-muted">Terkunci</p>
            </div>
          </div>
        </motion.div>

        {/* Floor Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <FloorSelector
            selectedFloor={selectedFloor}
            onFloorChange={setSelectedFloor}
            locationCounts={locationCounts}
          />
        </motion.div>

        {/* Map Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className={`${showMiniMap ? 'lg:col-span-2' : 'lg:col-span-3'} h-96 lg:h-[500px]`}
          >
            <FloorMap
              locations={state.locations}
              selectedFloor={selectedFloor}
              onLocationClick={handleLocationClick}
            />
          </motion.div>

          {/* Mini Map */}
          <AnimatePresence>
            {showMiniMap && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-1"
              >
                <MiniMap
                  locations={state.locations}
                  selectedFloor={selectedFloor}
                  onLocationClick={handleLocationClick}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Map Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-accent/50 backdrop-blur-lg border border-gold/20 rounded-2xl p-4"
        >
          <h3 className="text-sm font-semibold text-text-light mb-3 flex items-center">
            <MapPin className="w-4 h-4 text-gold mr-2" />
            Panduan Peta
          </h3>
          
          <div className="space-y-2 text-xs text-text-muted">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gold rounded-full animate-pulse" />
              <span>Lokasi tersedia - Tap untuk mulai tantangan</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-success rounded-full" />
              <span>Lokasi selesai - Tantangan sudah diselesaikan</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-600 rounded-full" />
              <span>Lokasi terkunci - Selesaikan lokasi sebelumnya</span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-gold/10 border border-gold/20 rounded-lg">
            <p className="text-xs text-gold font-medium">
              💡 Gunakan gesture pinch untuk zoom, drag untuk menggeser peta
            </p>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="secondary"
            onClick={() => navigate('/dashboard')}
            className="flex items-center justify-center"
          >
            <Navigation className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          
          <Button
            variant="secondary"
            onClick={() => navigate('/progress')}
            className="flex items-center justify-center"
          >
            <MapPin className="w-4 h-4 mr-2" />
            Progress
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Map;