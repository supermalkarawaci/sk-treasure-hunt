import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import Header from '../components/Layout/Header';
import Button from '../components/UI/Button';
import { 
  Trophy, 
  MapPin, 
  Camera, 
  Brain, 
  Clock, 
  CheckCircle, 
  Star,
  Award,
  Calendar,
  Target,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Progress: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useGame();

  useEffect(() => {
    if (!state.player) {
      navigate('/');
      return;
    }
  }, [state.player, navigate]);

  const completedCount = state.progress?.completedLocations.length || 0;
  const totalLocations = state.locations.length;
  const completionPercentage = totalLocations > 0 ? (completedCount / totalLocations) * 100 : 0;
  const totalScore = state.progress?.totalScore || 0;

  const getLocationStatus = (locationId: string) => {
    const location = state.locations.find(loc => loc.id === locationId);
    const isCompleted = state.progress?.completedLocations.includes(locationId);
    const hasPhoto = state.progress?.photos[locationId];
    const quizResult = state.progress?.quizResults[locationId];
    
    return {
      location,
      isCompleted,
      hasPhoto,
      quizResult,
      timestamp: quizResult?.timestamp
    };
  };

  const getAchievements = () => {
    const achievements = [];
    
    if (completedCount >= 1) {
      achievements.push({
        id: 'first-location',
        title: 'Penjelajah Pemula',
        description: 'Menyelesaikan lokasi pertama',
        icon: <MapPin className="w-6 h-6" />,
        unlocked: true
      });
    }
    
    if (completedCount >= 2) {
      achievements.push({
        id: 'photographer',
        title: 'Fotografer Handal',
        description: 'Mengambil 2 foto selfie',
        icon: <Camera className="w-6 h-6" />,
        unlocked: true
      });
    }
    
    if (completedCount >= totalLocations / 2) {
      achievements.push({
        id: 'halfway',
        title: 'Setengah Perjalanan',
        description: 'Menyelesaikan 50% lokasi',
        icon: <Target className="w-6 h-6" />,
        unlocked: true
      });
    }
    
    if (completedCount === totalLocations) {
      achievements.push({
        id: 'master-hunter',
        title: 'Master Treasure Hunter',
        description: 'Menyelesaikan semua lokasi',
        icon: <Trophy className="w-6 h-6" />,
        unlocked: true
      });
    }

    // Add locked achievements
    const lockedAchievements = [
      {
        id: 'speed-runner',
        title: 'Pelari Cepat',
        description: 'Selesaikan dalam 2 jam',
        icon: <Zap className="w-6 h-6" />,
        unlocked: false
      },
      {
        id: 'perfect-score',
        title: 'Nilai Sempurna',
        description: 'Jawab semua kuis dengan benar',
        icon: <Star className="w-6 h-6" />,
        unlocked: false
      }
    ];

    return [...achievements, ...lockedAchievements];
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (!state.player) {
    return null;
  }

  const achievements = getAchievements();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-accent to-primary">
      <Header title="Progress Anda" showBackButton />
      
      <div className="px-4 py-6 space-y-6">
        {/* Overall Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-gold/10 to-yellow-400/10 backdrop-blur-lg border border-gold/20 rounded-2xl p-6"
        >
          <div className="text-center mb-6">
            <div className="relative inline-block">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-gold to-yellow-400 flex items-center justify-center">
                <Trophy className="w-12 h-12 text-primary" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-success rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">{completedCount}</span>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-text-light mb-2">
              {completionPercentage === 100 ? 'Selamat!' : 'Terus Semangat!'}
            </h2>
            <p className="text-text-muted">
              {completionPercentage === 100 
                ? 'Anda telah menyelesaikan semua tantangan!'
                : `${completedCount} dari ${totalLocations} lokasi selesai`
              }
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gold">{Math.round(completionPercentage)}%</p>
              <p className="text-sm text-text-muted">Selesai</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-text-light">{totalScore}</p>
              <p className="text-sm text-text-muted">Poin</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400">{achievements.filter(a => a.unlocked).length}</p>
              <p className="text-sm text-text-muted">Prestasi</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-text-muted mb-2">
              <span>Progress Keseluruhan</span>
              <span>{completedCount}/{totalLocations}</span>
            </div>
            <div className="w-full bg-accent rounded-full h-3 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-gradient-to-r from-gold to-yellow-400 h-full rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Location Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-accent/50 backdrop-blur-lg border border-gold/20 rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold text-text-light mb-4 flex items-center">
            <MapPin className="w-6 h-6 text-gold mr-2" />
            Perjalanan Anda
          </h3>
          
          <div className="space-y-4">
            {state.locations.map((location, index) => {
              const status = getLocationStatus(location.id);
              
              return (
                <motion.div
                  key={location.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex items-start space-x-4 p-4 rounded-xl border ${
                    status.isCompleted
                      ? 'bg-green-900/20 border-green-400/30'
                      : location.status === 'available'
                      ? 'bg-gold/10 border-gold/30'
                      : 'bg-gray-800/20 border-gray-600/30'
                  }`}
                >
                  {/* Timeline Line */}
                  {index < state.locations.length - 1 && (
                    <div className="absolute left-8 top-16 w-0.5 h-8 bg-gold/30" />
                  )}
                  
                  {/* Status Icon */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    status.isCompleted
                      ? 'bg-green-success'
                      : location.status === 'available'
                      ? 'bg-gold'
                      : 'bg-gray-600'
                  }`}>
                    {status.isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : location.status === 'available' ? (
                      <MapPin className="w-5 h-5 text-primary" />
                    ) : (
                      <Clock className="w-5 h-5 text-white" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-text-light">{location.name}</h4>
                      <span className="text-xs text-text-muted">Lantai {location.floor}</span>
                    </div>
                    
                    <p className="text-sm text-text-muted mb-3">{location.description}</p>
                    
                    {status.isCompleted && (
                      <div className="space-y-2">
                        {/* Photo */}
                        {status.hasPhoto && (
                          <div className="flex items-center space-x-2 text-sm text-green-400">
                            <Camera className="w-4 h-4" />
                            <span>Foto berhasil diambil</span>
                          </div>
                        )}
                        
                        {/* Quiz Result */}
                        {status.quizResult && (
                          <div className="flex items-center space-x-2 text-sm text-green-400">
                            <Brain className="w-4 h-4" />
                            <span>Kuis dijawab dengan benar</span>
                          </div>
                        )}
                        
                        {/* Timestamp */}
                        {status.timestamp && (
                          <div className="flex items-center space-x-2 text-xs text-text-muted">
                            <Calendar className="w-3 h-3" />
                            <span>Selesai: {formatDate(status.timestamp)}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-accent/50 backdrop-blur-lg border border-gold/20 rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold text-text-light mb-4 flex items-center">
            <Award className="w-6 h-6 text-gold mr-2" />
            Prestasi
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <AnimatePresence>
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-xl border text-center ${
                    achievement.unlocked
                      ? 'bg-gold/10 border-gold/30'
                      : 'bg-gray-800/20 border-gray-600/30 opacity-50'
                  }`}
                >
                  <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
                    achievement.unlocked ? 'bg-gold text-primary' : 'bg-gray-600 text-gray-400'
                  }`}>
                    {achievement.icon}
                  </div>
                  
                  <h4 className={`font-bold text-sm mb-1 ${
                    achievement.unlocked ? 'text-text-light' : 'text-text-muted'
                  }`}>
                    {achievement.title}
                  </h4>
                  
                  <p className="text-xs text-text-muted">
                    {achievement.description}
                  </p>
                  
                  {achievement.unlocked && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 }}
                      className="absolute -top-1 -right-1 w-6 h-6 bg-green-success rounded-full flex items-center justify-center"
                    >
                      <CheckCircle className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Photo Gallery */}
        {state.progress?.photos && Object.keys(state.progress.photos).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-accent/50 backdrop-blur-lg border border-gold/20 rounded-2xl p-6"
          >
            <h3 className="text-xl font-bold text-text-light mb-4 flex items-center">
              <Camera className="w-6 h-6 text-gold mr-2" />
              Galeri Foto
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(state.progress.photos).map(([locationId, photo], index) => {
                const location = state.locations.find(loc => loc.id === locationId);
                
                return (
                  <motion.div
                    key={locationId}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group"
                  >
                    <img
                      src={photo}
                      alt={`Foto di ${location?.name}`}
                      className="w-full aspect-square object-cover rounded-xl border border-gold/20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-white font-medium text-sm">{location?.name}</p>
                        <p className="text-white/70 text-xs">Lantai {location?.floor}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="secondary"
            onClick={() => navigate('/dashboard')}
            className="flex items-center justify-center"
          >
            <MapPin className="w-5 h-5 mr-2" />
            Dashboard
          </Button>
          
          <Button
            variant="secondary"
            onClick={() => navigate('/map')}
            className="flex items-center justify-center"
          >
            <Trophy className="w-5 h-5 mr-2" />
            Lihat Peta
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Progress;