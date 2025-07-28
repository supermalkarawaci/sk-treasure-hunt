import React from 'react';
import { useGame } from '../../contexts/GameContext';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton = false }) => {
  const { state } = useGame();
  const navigate = useNavigate();
  const location = useLocation();

  const getDefaultTitle = () => {
    switch (location.pathname) {
      case '/': return 'Registrasi';
      case '/dashboard': return 'Treasure Hunt';
      case '/map': return 'Peta Lokasi';
      case '/progress': return 'Progress';
      default: return 'Treasure Hunt';
    }
  };

  const progressPercentage = state.progress 
    ? (state.progress.completedLocations.length / state.locations.length) * 100 
    : 0;

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-primary via-accent to-primary backdrop-blur-lg border-b border-gold/20">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg bg-gold/10 hover:bg-gold/20 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gold" />
              </button>
            )}
            <div>
              <h1 className="text-lg font-bold text-text-light">
                {title || getDefaultTitle()}
              </h1>
              <p className="text-sm text-gold font-medium">Supermal Karawaci</p>
            </div>
          </div>
          
          {state.player && (
            <div className="text-right">
              <p className="text-sm font-medium text-text-light">
                {state.player.name}
              </p>
              <p className="text-xs text-text-muted">
                {state.progress?.completedLocations.length || 0}/4 selesai
              </p>
            </div>
          )}
        </div>
        
        {state.player && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-text-muted mb-1">
              <span>Progress Game</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-accent rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-gold to-yellow-400 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;