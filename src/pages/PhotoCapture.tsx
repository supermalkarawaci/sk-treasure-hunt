import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { useToast } from '../hooks/useToast';
import { useCamera } from '../hooks/useCamera';
import Header from '../components/Layout/Header';
import Button from '../components/UI/Button';
import Loading from '../components/UI/Loading';
import { Camera, CameraOff, RotateCcw, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PhotoCapture: React.FC = () => {
  const { locationId } = useParams<{ locationId: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const { addToast } = useToast();
  const { 
    stream, 
    isLoading: cameraLoading, 
    error: cameraError, 
    videoRef, 
    startCamera, 
    stopCamera, 
    capturePhoto, 
    switchCamera, 
    facingMode 
  } = useCamera();

  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const location = state.locations.find(loc => loc.id === locationId);

  useEffect(() => {
    if (!location) {
      addToast({ type: 'error', message: 'Lokasi tidak ditemukan' });
      navigate('/dashboard');
      return;
    }

    if (location.status !== 'available') {
      addToast({ type: 'error', message: 'Lokasi tidak dapat diakses saat ini' });
      navigate('/dashboard');
      return;
    }

    // Auto-start camera when component mounts
    startCamera();

    return () => {
      stopCamera();
    };
  }, [location, navigate, addToast, startCamera, stopCamera]);

  const handleCapture = () => {
    const photo = capturePhoto();
    if (photo) {
      setCapturedPhoto(photo);
      stopCamera();
    } else {
      addToast({ type: 'error', message: 'Gagal mengambil foto' });
    }
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    startCamera();
  };

  const handleSubmit = async () => {
    if (!capturedPhoto || !location) return;

    setIsSubmitting(true);
    try {
      // Simulate photo upload
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update progress with photo
      if (state.progress) {
        const updatedProgress = {
          ...state.progress,
          photos: { ...state.progress.photos, [locationId!]: capturedPhoto }
        };
        dispatch({ type: 'SET_PROGRESS', payload: updatedProgress });
      }

      addToast({ type: 'success', message: 'Foto berhasil diunggah!' });
      navigate(`/quiz/${locationId}`);
    } catch (error) {
      addToast({ type: 'error', message: 'Gagal mengunggah foto' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!location) {
    return <Loading fullScreen message="Memuat lokasi..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-accent to-primary">
      <Header title={`Foto - ${location.name}`} showBackButton />
      
      <div className="px-4 py-6">
        {/* Location Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-gold/10 to-yellow-400/10 backdrop-blur-lg border border-gold/20 rounded-2xl p-4 mb-6"
        >
          <h2 className="text-lg font-bold text-text-light mb-2">
            Ambil Foto Selfie
          </h2>
          <p className="text-text-muted text-sm mb-2">
            {location.decorationRequirement}
          </p>
          <div className="bg-gold/10 border border-gold/20 rounded-lg p-3">
            <p className="text-gold font-medium text-xs">
              💡 Pastikan ornamen kemerdekaan terlihat jelas dalam foto
            </p>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {!capturedPhoto ? (
            /* Camera View */
            <motion.div
              key="camera"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4"
            >
              <div className="relative bg-black rounded-2xl overflow-hidden aspect-square">
                {cameraLoading && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <Loading message="Membuka kamera..." />
                  </div>
                )}
                
                {cameraError && (
                  <div className="absolute inset-0 flex items-center justify-center p-6 z-10">
                    <div className="text-center">
                      <CameraOff className="w-12 h-12 text-text-muted mx-auto mb-3" />
                      <p className="text-text-light font-medium mb-2">Tidak dapat mengakses kamera</p>
                      <p className="text-text-muted text-sm mb-4">{cameraError}</p>
                      <Button onClick={startCamera} size="sm">
                        Coba Lagi
                      </Button>
                    </div>
                  </div>
                )}
                
                {stream && (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Photo Frame Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <div className="relative">
                        <div className="w-72 h-72 border-2 border-gold rounded-full bg-transparent">
                          <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-gold rounded-tl-full" />
                          <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-gold rounded-tr-full" />
                          <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-gold rounded-bl-full" />
                          <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-gold rounded-br-full" />
                        </div>
                        <p className="text-text-light text-center mt-4 text-sm">
                          Posisikan wajah dalam lingkaran
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              {/* Camera Controls */}
              <div className="flex justify-center items-center space-x-6">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={switchCamera}
                  className="flex items-center"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  {facingMode === 'user' ? 'Belakang' : 'Depan'}
                </Button>
                
                {stream && (
                  <button
                    onClick={handleCapture}
                    className="w-16 h-16 bg-gold rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors shadow-lg"
                  >
                    <Camera className="w-8 h-8 text-primary" />
                  </button>
                )}
                
                <div className="w-20" /> {/* Spacer for symmetry */}
              </div>
              
              {/* Start Camera Button */}
              {!stream && !cameraLoading && (
                <Button
                  onClick={startCamera}
                  className="w-full flex items-center justify-center"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Buka Kamera
                </Button>
              )}
            </motion.div>
          ) : (
            /* Photo Preview */
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4"
            >
              <div className="relative bg-black rounded-2xl overflow-hidden aspect-square">
                <img
                  src={capturedPhoto}
                  alt="Captured selfie"
                  className="w-full h-full object-cover"
                />
                
                {/* Photo Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-text-light font-medium text-center">
                    Foto berhasil diambil!
                  </p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="secondary"
                  onClick={handleRetake}
                  className="flex items-center justify-center"
                >
                  <X className="w-5 h-5 mr-2" />
                  Ambil Ulang
                </Button>
                
                <Button
                  onClick={handleSubmit}
                  isLoading={isSubmitting}
                  className="flex items-center justify-center"
                >
                  <Check className="w-5 h-5 mr-2" />
                  Lanjutkan
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PhotoCapture;