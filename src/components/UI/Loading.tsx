import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ 
  message = 'Memuat...', 
  fullScreen = false 
}) => {
  const containerClass = fullScreen 
    ? 'fixed inset-0 bg-primary/90 backdrop-blur-sm z-50' 
    : 'w-full py-8';

  return (
    <div className={`${containerClass} flex items-center justify-center`}>
      <div className="text-center">
        <div className="relative">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-gold to-yellow-400 animate-pulse" />
          <Loader2 className="w-8 h-8 text-primary animate-spin absolute top-2 left-1/2 transform -translate-x-1/2" />
        </div>
        <p className="text-text-light font-medium">{message}</p>
      </div>
    </div>
  );
};

export default Loading;