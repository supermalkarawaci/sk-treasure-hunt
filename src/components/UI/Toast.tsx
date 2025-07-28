import React, { useEffect } from 'react';
import { useGame } from '../../contexts/GameContext';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Toast: React.FC = () => {
  const { state, dispatch } = useGame();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-400" />;
      default: return <Info className="w-5 h-5 text-gold" />;
    }
  };

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case 'success': return 'from-green-900/90 to-green-800/90 border-green-400/20';
      case 'error': return 'from-red-900/90 to-red-800/90 border-red-400/20';
      default: return 'from-accent/90 to-primary/90 border-gold/20';
    }
  };

  return (
    <div className="fixed top-20 left-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {state.toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            className={`bg-gradient-to-r ${getBackgroundColor(toast.type)} backdrop-blur-lg border rounded-lg p-4 shadow-xl`}
          >
            <div className="flex items-start gap-3">
              {getIcon(toast.type)}
              <div className="flex-1">
                <p className="text-text-light text-sm font-medium">
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => dispatch({ type: 'REMOVE_TOAST', payload: toast.id })}
                className="text-text-muted hover:text-text-light transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;