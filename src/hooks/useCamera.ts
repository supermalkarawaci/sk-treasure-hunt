import { useState, useRef, useCallback } from 'react';

export const useCamera = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Request camera permissions first
      const permissions = await navigator.permissions.query({ name: 'camera' as PermissionName });
      if (permissions.state === 'denied') {
        throw new Error('Akses kamera ditolak. Silakan aktifkan di pengaturan browser.');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          aspectRatio: 1.0
        }
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        // Ensure video plays
        await videoRef.current.play();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Tidak dapat mengakses kamera';
      setError(errorMessage);
      console.error('Camera access error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [stream]);

  const capturePhoto = useCallback((): string | null => {
    if (!videoRef.current) return null;

    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    ctx.drawImage(video, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.8);
  }, []);

  const switchCamera = useCallback(() => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    if (stream) {
      stopCamera();
      // Restart camera with new facing mode after a short delay
      setTimeout(() => {
        startCamera();
      }, 100);
    }
  }, [stopCamera]);

  return {
    stream,
    isLoading,
    error,
    facingMode,
    videoRef,
    startCamera,
    stopCamera,
    capturePhoto,
    switchCamera
  };
};