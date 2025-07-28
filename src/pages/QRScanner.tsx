import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { useToast } from '../hooks/useToast';
import { useCamera } from '../hooks/useCamera';
import Header from '../components/Layout/Header';
import Button from '../components/UI/Button';
import Loading from '../components/UI/Loading';
import { BrowserMultiFormatReader } from '@zxing/library';
import { Camera, CameraOff, Flashlight, FlashlightOff, RotateCcw, Keyboard } from 'lucide-react';
import { motion } from 'framer-motion';

const QRScanner: React.FC = () => {
  const { locationId } = useParams<{ locationId: string }>();
  const navigate = useNavigate();
  const { state } = useGame();
  const { addToast } = useToast();
  const { 
    stream, 
    isLoading: cameraLoading, 
    error: cameraError, 
    videoRef, 
    startCamera, 
    stopCamera, 
    switchCamera, 
    facingMode 
  } = useCamera();

  const [isScanning, setIsScanning] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [reader, setReader] = useState<BrowserMultiFormatReader | null>(null);

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

    const qrReader = new BrowserMultiFormatReader();
    setReader(qrReader);

    return () => {
      qrReader.reset();
      stopCamera();
    };
  }, [location, navigate, addToast, stopCamera]);

  useEffect(() => {
    if (stream && reader && videoRef.current && !isScanning) {
      setIsScanning(true);
      
      reader.decodeFromVideoDevice(undefined, videoRef.current, (result, error) => {
        if (result) {
          const scannedCode = result.getText();
          handleQRCodeDetected(scannedCode);
        }
      });
    }
  }, [stream, reader, isScanning]);

  const handleQRCodeDetected = useCallback((code: string) => {
    if (!location) return;

    if (code === location.qrCode) {
      addToast({ type: 'success', message: 'QR Code berhasil dipindai!' });
      navigate(`/photo/${locationId}`);
    } else {
      addToast({ type: 'error', message: 'QR Code tidak valid untuk lokasi ini' });
    }
  }, [location, locationId, navigate, addToast]);

  const handleManualSubmit = () => {
    if (!location) return;

    const upperCode = manualCode.toUpperCase().trim();
    if (upperCode === location.qrCode) {
      addToast({ type: 'success', message: 'Kode berhasil diverifikasi!' });
      navigate(`/photo/${locationId}`);
    } else {
      addToast({ type: 'error', message: 'Kode tidak valid untuk lokasi ini' });
    }
  };

  const toggleFlash = async () => {
    if (!stream) return;

    try {
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities();
      
      if (capabilities.torch) {
        await track.applyConstraints({
          advanced: [{ torch: !flashEnabled }]
        });
        setFlashEnabled(!flashEnabled);
      } else {
        addToast({ type: 'info', message: 'Flash tidak didukung pada perangkat ini' });
      }
    } catch (error) {
      console.error('Flash toggle error:', error);
      addToast({ type: 'error', message: 'Gagal mengaktifkan flash' });
    }
  };

  if (!location) {
    return <Loading fullScreen message="Memuat lokasi..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-accent to-primary">
      <Header title={`Scan QR - ${location.name}`} showBackButton />
      
      <div className="px-4 py-6">
        {/* Location Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-gold/10 to-yellow-400/10 backdrop-blur-lg border border-gold/20 rounded-2xl p-4 mb-6"
        >
          <h2 className="text-lg font-bold text-text-light mb-2">
            {location.name} - Lantai {location.floor}
          </h2>
          <p className="text-text-muted text-sm">
            Pindai QR Code yang tersedia di lokasi ini untuk melanjutkan tantangan
          </p>
        </motion.div>

        {/* Camera View */}
        {!showManualInput ? (
          <div className="space-y-4">
            <div className="relative bg-black rounded-2xl overflow-hidden aspect-square">
              {cameraLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loading message="Membuka kamera..." />
                </div>
              )}
              
              {cameraError && (
                <div className="absolute inset-0 flex items-center justify-center p-6">
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
                  
                  {/* QR Code Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="w-64 h-64 border-2 border-gold rounded-2xl bg-transparent">
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-gold rounded-tl-lg" />
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-gold rounded-tr-lg" />
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-gold rounded-bl-lg" />
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-gold rounded-br-lg" />
                      </div>
                      <p className="text-text-light text-center mt-4 text-sm">
                        Arahkan kamera ke QR Code
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {/* Camera Controls */}
            {stream && (
              <div className="flex justify-center space-x-4">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={toggleFlash}
                  className="flex items-center"
                >
                  {flashEnabled ? (
                    <FlashlightOff className="w-4 h-4 mr-1" />
                  ) : (
                    <Flashlight className="w-4 h-4 mr-1" />
                  )}
                  Flash
                </Button>
                
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={switchCamera}
                  className="flex items-center"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  {facingMode === 'user' ? 'Belakang' : 'Depan'}
                </Button>
              </div>
            )}
            
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
          </div>
        ) : (
          /* Manual Input */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-accent/50 backdrop-blur-lg border border-gold/20 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-text-light mb-4">
                Masukkan Kode Manual
              </h3>
              <p className="text-text-muted text-sm mb-4">
                Jika tidak dapat memindai QR Code, masukkan kode yang tertera di lokasi
              </p>
              
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                placeholder="Masukkan kode lokasi"
                className="w-full p-4 bg-primary border border-gold/20 rounded-xl text-text-light placeholder-text-muted focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 mb-4"
              />
              
              <Button
                onClick={handleManualSubmit}
                disabled={!manualCode.trim()}
                className="w-full"
              >
                Verifikasi Kode
              </Button>
            </div>
          </motion.div>
        )}
        
        {/* Toggle Manual Input */}
        <div className="flex justify-center mt-6">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowManualInput(!showManualInput)}
            className="flex items-center"
          >
            <Keyboard className="w-4 h-4 mr-2" />
            {showManualInput ? 'Kembali ke Scanner' : 'Input Manual'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;