import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { useToast } from '../hooks/useToast';
import Button from '../components/UI/Button';
import Header from '../components/Layout/Header';
import { ChevronRight, User, Phone, KeyRound } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Registration: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { dispatch } = useGame();
  const { addToast } = useToast();

  const validateCode = (code: string) => {
    // Simulate code validation
    const validCodes = ['TREAS1', 'TREAS2', 'TREAS3', 'HUNT01', 'HUNT02'];
    return validCodes.includes(code.toUpperCase());
  };

  const validatePhone = (phone: string) => {
    return /^08\d{8,11}$/.test(phone);
  };

  const handleCodeChange = (value: string) => {
    const upperCode = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    setFormData(prev => ({ ...prev, code: upperCode }));
  };

  const handleNext = async () => {
    setIsLoading(true);
    
    try {
      if (currentStep === 1) {
        if (formData.code.length !== 6) {
          addToast({ type: 'error', message: 'Kode harus 6 karakter' });
          return;
        }
        if (!validateCode(formData.code)) {
          addToast({ type: 'error', message: 'Kode tidak valid' });
          return;
        }
        setCurrentStep(2);
      } else if (currentStep === 2) {
        if (formData.name.length < 2) {
          addToast({ type: 'error', message: 'Nama harus minimal 2 karakter' });
          return;
        }
        setCurrentStep(3);
      } else if (currentStep === 3) {
        if (!validatePhone(formData.phone)) {
          addToast({ type: 'error', message: 'Format nomor HP tidak valid (08xxxxxxxxx)' });
          return;
        }
        
        // Simulate registration
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const player = {
          id: Math.random().toString(36).substr(2, 9),
          name: formData.name,
          phone: formData.phone,
          code: formData.code,
          registeredAt: new Date(),
        };
        
        dispatch({ type: 'SET_PLAYER', payload: player });
        addToast({ type: 'success', message: 'Registrasi berhasil! Selamat bermain!' });
        navigate('/dashboard');
      }
    } catch (error) {
      addToast({ type: 'error', message: 'Terjadi kesalahan, silakan coba lagi' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <KeyRound className="w-16 h-16 text-gold mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-text-light mb-2">
                Masukkan Kode
              </h2>
              <p className="text-text-muted">
                Masukkan kode 6 karakter yang Anda terima
              </p>
            </div>
            
            <div>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => handleCodeChange(e.target.value)}
                placeholder="XXXXXX"
                className="w-full p-4 text-center text-2xl font-mono bg-accent border border-gold/20 rounded-xl text-text-light placeholder-text-muted focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                maxLength={6}
                autoFocus
              />
              <p className="text-xs text-text-muted mt-2 text-center">
                Otomatis diubah ke huruf kapital
              </p>
            </div>
          </motion.div>
        );
        
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <User className="w-16 h-16 text-gold mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-text-light mb-2">
                Nama Lengkap
              </h2>
              <p className="text-text-muted">
                Masukkan nama lengkap Anda
              </p>
            </div>
            
            <div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nama lengkap Anda"
                className="w-full p-4 bg-accent border border-gold/20 rounded-xl text-text-light placeholder-text-muted focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                autoFocus
              />
            </div>
          </motion.div>
        );
        
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <Phone className="w-16 h-16 text-gold mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-text-light mb-2">
                Nomor HP
              </h2>
              <p className="text-text-muted">
                Masukkan nomor HP yang bisa dihubungi
              </p>
            </div>
            
            <div>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="08xxxxxxxxx"
                className="w-full p-4 bg-accent border border-gold/20 rounded-xl text-text-light placeholder-text-muted focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                autoFocus
              />
              <p className="text-xs text-text-muted mt-2">
                Format: 08xxxxxxxxx (8-12 digit)
              </p>
            </div>
          </motion.div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-accent to-primary">
      <Header title="Registrasi Peserta" />
      
      <div className="px-4 py-8">
        {/* Progress Indicators */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  step <= currentStep
                    ? 'bg-gold text-primary'
                    : 'bg-accent text-text-muted border border-gold/20'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-8 h-0.5 transition-all duration-300 ${
                    step < currentStep ? 'bg-gold' : 'bg-accent'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        {/* Form Content */}
        <div className="max-w-md mx-auto">
          <div className="bg-gradient-to-br from-accent/50 to-primary/50 backdrop-blur-lg border border-gold/20 rounded-2xl p-6">
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>
            
            <div className="mt-8 space-y-4">
              <Button
                onClick={handleNext}
                isLoading={isLoading}
                className="w-full"
                size="lg"
              >
                {currentStep === 3 ? 'Mulai Bermain' : 'Lanjutkan'}
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              
              {currentStep > 1 && (
                <Button
                  variant="secondary"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="w-full"
                >
                  Kembali
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;