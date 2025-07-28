import { useGame } from '../contexts/GameContext';
import { Toast } from '../types';

export const useToast = () => {
  const { dispatch } = useGame();

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { ...toast, id };
    
    dispatch({ type: 'ADD_TOAST', payload: newToast });
    
    setTimeout(() => {
      dispatch({ type: 'REMOVE_TOAST', payload: id });
    }, toast.duration || 3000);
  };

  const removeToast = (id: string) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  };

  return { addToast, removeToast };
};