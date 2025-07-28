import React, { useState, useRef, useCallback } from 'react';
import { Location } from '../../types';
import { ZoomIn, ZoomOut, RotateCcw, MapPin, CheckCircle, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

interface FloorMapProps {
  locations: Location[];
  selectedFloor: 'GF' | 'UG' | 'FF';
  onLocationClick: (location: Location) => void;
}

const FloorMap: React.FC<FloorMapProps> = ({ locations, selectedFloor, onLocationClick }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);

  const floorLocations = locations.filter(loc => loc.floor === selectedFloor);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev / 1.2, 0.5));
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  }, [position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y
    });
  }, [position]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y
    });
  }, [isDragging, dragStart]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const getLocationIcon = (location: Location) => {
    switch (location.status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-success" />;
      case 'available':
        return <MapPin className="w-6 h-6 text-gold" />;
      case 'locked':
        return <Lock className="w-6 h-6 text-text-muted" />;
    }
  };

  const getLocationColor = (location: Location) => {
    switch (location.status) {
      case 'completed':
        return 'bg-green-success/20 border-green-success';
      case 'available':
        return 'bg-gold/20 border-gold animate-pulse';
      case 'locked':
        return 'bg-gray-600/20 border-gray-600';
    }
  };

  return (
    <div className="relative w-full h-full bg-accent rounded-2xl overflow-hidden">
      {/* Map Container */}
      <div
        ref={mapRef}
        className="w-full h-full cursor-grab active:cursor-grabbing overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="relative w-full h-full transition-transform duration-200 ease-out"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center center'
          }}
        >
          {/* Floor Plan SVG */}
          <svg
            viewBox="0 0 400 300"
            className="w-full h-full"
            style={{ minWidth: '400px', minHeight: '300px' }}
          >
            {/* Floor Background */}
            <rect
              x="0"
              y="0"
              width="400"
              height="300"
              fill="url(#floorGradient)"
              stroke="#D4AF37"
              strokeWidth="2"
              rx="8"
            />
            
            {/* Gradient Definition */}
            <defs>
              <linearGradient id="floorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1F2937" />
                <stop offset="100%" stopColor="#121421" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Floor-specific Layout */}
            {selectedFloor === 'GF' && (
              <>
                {/* Ground Floor Layout */}
                <rect x="50" y="50" width="120" height="80" fill="#2A2F3A" stroke="#D4AF37" strokeWidth="1" rx="4" />
                <text x="110" y="95" textAnchor="middle" fill="#F8FAFC" fontSize="12" fontWeight="bold">Atrium</text>
                
                <rect x="200" y="50" width="120" height="80" fill="#2A2F3A" stroke="#D4AF37" strokeWidth="1" rx="4" />
                <text x="260" y="95" textAnchor="middle" fill="#F8FAFC" fontSize="12" fontWeight="bold">Hypermart</text>
                
                <rect x="50" y="150" width="270" height="100" fill="#2A2F3A" stroke="#D4AF37" strokeWidth="1" rx="4" />
                <text x="185" y="205" textAnchor="middle" fill="#F8FAFC" fontSize="12" fontWeight="bold">Main Corridor</text>
              </>
            )}

            {selectedFloor === 'UG' && (
              <>
                {/* Underground Floor Layout */}
                <rect x="100" y="100" width="200" height="100" fill="#2A2F3A" stroke="#D4AF37" strokeWidth="1" rx="4" />
                <text x="200" y="155" textAnchor="middle" fill="#F8FAFC" fontSize="12" fontWeight="bold">Food Court</text>
                
                <rect x="50" y="50" width="80" height="40" fill="#2A2F3A" stroke="#D4AF37" strokeWidth="1" rx="4" />
                <text x="90" y="75" textAnchor="middle" fill="#F8FAFC" fontSize="10">Parking</text>
                
                <rect x="270" y="50" width="80" height="40" fill="#2A2F3A" stroke="#D4AF37" strokeWidth="1" rx="4" />
                <text x="310" y="75" textAnchor="middle" fill="#F8FAFC" fontSize="10">Storage</text>
              </>
            )}

            {selectedFloor === 'FF' && (
              <>
                {/* First Floor Layout */}
                <rect x="80" y="80" width="100" height="60" fill="#2A2F3A" stroke="#D4AF37" strokeWidth="1" rx="4" />
                <text x="130" y="115" textAnchor="middle" fill="#F8FAFC" fontSize="12" fontWeight="bold">XXI Cinema</text>
                
                <rect x="200" y="80" width="120" height="60" fill="#2A2F3A" stroke="#D4AF37" strokeWidth="1" rx="4" />
                <text x="260" y="115" textAnchor="middle" fill="#F8FAFC" fontSize="12" fontWeight="bold">Restaurants</text>
                
                <rect x="80" y="160" width="240" height="80" fill="#2A2F3A" stroke="#D4AF37" strokeWidth="1" rx="4" />
                <text x="200" y="205" textAnchor="middle" fill="#F8FAFC" fontSize="12" fontWeight="bold">Entertainment Zone</text>
              </>
            )}
          </svg>

          {/* Location Markers */}
          {floorLocations.map((location) => (
            <motion.div
              key={location.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute"
              style={{
                left: `${location.coordinates.x}px`,
                top: `${location.coordinates.y}px`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <button
                onClick={() => onLocationClick(location)}
                className={`relative p-3 rounded-full border-2 backdrop-blur-lg transition-all duration-300 hover:scale-110 ${getLocationColor(location)}`}
                disabled={location.status === 'locked'}
              >
                {getLocationIcon(location)}
                
                {/* Location Label */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <div className="bg-primary/90 backdrop-blur-lg border border-gold/20 rounded-lg px-2 py-1">
                    <p className="text-xs font-medium text-text-light">{location.name}</p>
                  </div>
                </div>
                
                {/* Pulse Animation for Available Locations */}
                {location.status === 'available' && (
                  <div className="absolute inset-0 rounded-full border-2 border-gold animate-ping" />
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <button
          onClick={handleZoomIn}
          className="p-2 bg-accent/80 backdrop-blur-lg border border-gold/20 rounded-lg text-gold hover:bg-gold/10 transition-colors"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 bg-accent/80 backdrop-blur-lg border border-gold/20 rounded-lg text-gold hover:bg-gold/10 transition-colors"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={handleReset}
          className="p-2 bg-accent/80 backdrop-blur-lg border border-gold/20 rounded-lg text-gold hover:bg-gold/10 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Scale Indicator */}
      <div className="absolute bottom-4 left-4 bg-accent/80 backdrop-blur-lg border border-gold/20 rounded-lg px-3 py-1">
        <p className="text-xs text-text-light font-medium">
          {Math.round(scale * 100)}%
        </p>
      </div>
    </div>
  );
};

export default FloorMap;