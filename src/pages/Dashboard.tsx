import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { useToast } from '../hooks/useToast';
import Header from '../components/Layout/Header';
import LocationCard from '../components/Game/LocationCard';
import Button from '../components/UI/Button';
import { Map, Trophy, HelpCircle, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Location } from '../types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const { addToast } = useToast();

  useEffect(() => {
    if (!state.player) {
      navigate('/');
      return;
    }

    // Initialize locations and progress
    const mockLocations: Location[] = [
      {
        id: 'food-court',
        name: 'Food Court',
        floor: 'UG',
        description: 'Area makan utama dengan berbagai pilihan kuliner',
        coordinates: { x: 100, y: 150 },
        status: 'available',
        qrCode: 'FOODCOURT001',
        decorationRequirement: 'Foto selfie dengan ornamen merah putih',
        quiz: {
          id: 'fc-quiz',
          question: 'Tahun berapa Indonesia merdeka?',
          options: ['1944', '1945', '1946', '1947'],
          correctAnswer: 1,
          explanation: 'Indonesia merdeka pada tanggal 17 Agustus 1945'
        }
      },
      {
        id: 'cinema',
        name: 'XXI Cinema',
        floor: 'FF',
        description: 'Bioskop dengan teknologi terdepan',
        coordinates: { x: 200, y: 100 },
        status: 'locked',
        qrCode: 'CINEMA001',
        decorationRequirement: 'Foto dengan poster film bertema kemerdekaan',
        quiz: {
          id: 'cinema-quiz',
          question: 'Siapa proklamator kemerdekaan Indonesia?',
          options: ['Soekarno dan Hatta', 'Sjahrir dan Hatta', 'Soekarno dan Sjahrir', 'Tan Malaka dan Soekarno'],
          correctAnswer: 0,
          explanation: 'Proklamator kemerdekaan Indonesia adalah Ir. Soekarno dan Drs. Mohammad Hatta'
        }
      },
      {
        id: 'hypermart',
        name: 'Hypermart',
        floor: 'GF',
        description: 'Supermarket dengan produk lengkap',
        coordinates: { x: 150, y: 200 },
        status: 'locked',
        qrCode: 'HYPERMART001',
        decorationRequirement: 'Foto dengan produk bertema Indonesia',
        quiz: {
          id: 'hypermart-quiz',
          question: 'Apa bunyi sila pertama Pancasila?',
          options: [
            'Kemanusiaan yang adil dan beradab',
            'Ketuhanan Yang Maha Esa',
            'Persatuan Indonesia',
            'Keadilan sosial bagi seluruh rakyat Indonesia'
          ],
          correctAnswer: 1,
          explanation: 'Sila pertama Pancasila adalah "Ketuhanan Yang Maha Esa"'
        }
      },
      {
        id: 'atrium',
        name: 'Atrium Central',
        floor: 'GF',
        description: 'Area pusat dengan dekorasi kemerdekaan',
        coordinates: { x: 175, y: 125 },
        status: 'locked',
        qrCode: 'ATRIUM001',
        decorationRequirement: 'Foto dengan backdrop bendera merah putih',
        quiz: {
          id: 'atrium-quiz',
          question: 'Lagu kebangsaan Indonesia adalah?',
          options: ['Garuda Pancasila', 'Indonesia Raya', 'Bagimu Negeri', 'Hari Merdeka'],
          correctAnswer: 1,
          explanation: 'Lagu kebangsaan Indonesia adalah "Indonesia Raya" yang diciptakan oleh W.R. Supratman'
        }
      }
    ];

    dispatch({ type: 'SET_LOCATIONS', payload: mockLocations });
    
    if (!state.progress) {
      const initialProgress = {
        playerId: state.player.id,
        completedLocations: [],
        totalScore: 0,
        photos: {},
        quizResults: {},
        wrongAnswerCooldowns: {}
      };
      dispatch({ type: 'SET_PROGRESS', payload: initialProgress });
    }
  }, [state.player, dispatch, navigate]);

  const handleLocationClick = (location: Location) => {
    if (location.status === 'locked') {
      addToast({ 
        type: 'info', 
        message: 'Lokasi ini akan terbuka setelah menyelesaikan lokasi sebelumnya' 
      });
      return;
    }
    
    if (location.status === 'completed') {
      addToast({ 
        type: 'info', 
        message: 'Lokasi ini sudah diselesaikan' 
      });
      return;
    }
    
    navigate(`/scanner/${location.id}`);
  };

  const completedCount = state.progress?.completedLocations.length || 0;
  const totalLocations = state.locations.length;
  const completionPercentage = totalLocations > 0 ? (completedCount / totalLocations) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-accent to-primary">
      <Header />
      
      <div className="px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-gold/10 to-yellow-400/10 backdrop-blur-lg border border-gold/20 rounded-2xl p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-text-light mb-2">
                Selamat Datang, {state.player?.name}!
              </h2>
              <p className="text-text-muted">
                Jelajahi lokasi di Supermal Karawaci dan selesaikan tantangan kemerdekaan
              </p>
            </div>
            <Trophy className="w-8 h-8 text-gold" />
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gold">{completedCount}</p>
              <p className="text-sm text-text-muted">Selesai</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-text-light">{totalLocations - completedCount}</p>
              <p className="text-sm text-text-muted">Tersisa</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400">{Math.round(completionPercentage)}%</p>
              <p className="text-sm text-text-muted">Progress</p>
            </div>
          </div>
        </motion.div>

        {/* Locations Grid */}
        <div>
          <h3 className="text-xl font-bold text-text-light mb-4 flex items-center">
            <Map className="w-6 h-6 text-gold mr-2" />
            Lokasi Treasure Hunt
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            {state.locations.map((location, index) => (
              <motion.div
                key={location.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <LocationCard
                  location={location}
                  onClick={() => handleLocationClick(location)}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="secondary"
            onClick={() => navigate('/map')}
            className="flex items-center justify-center"
          >
            <Map className="w-5 h-5 mr-2" />
            Lihat Peta
          </Button>
          
          <Button
            variant="secondary"
            onClick={() => navigate('/progress')}
            className="flex items-center justify-center"
          >
            <Trophy className="w-5 h-5 mr-2" />
            Progress
          </Button>
        </div>

        {/* Game Instructions */}
        <motion.details
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-accent/50 backdrop-blur-lg border border-gold/20 rounded-2xl p-6"
        >
          <summary className="cursor-pointer text-text-light font-semibold flex items-center">
            <HelpCircle className="w-5 h-5 text-gold mr-2" />
            Cara Bermain
          </summary>
          
          <div className="mt-4 space-y-3 text-text-muted text-sm">
            <p>1. <strong className="text-gold">Scan QR Code</strong> di setiap lokasi untuk memulai tantangan</p>
            <p>2. <strong className="text-gold">Ambil foto selfie</strong> dengan ornamen kemerdekaan yang tersedia</p>
            <p>3. <strong className="text-gold">Jawab kuis</strong> tentang sejarah kemerdekaan Indonesia</p>
            <p>4. <strong className="text-gold">Selesaikan semua lokasi</strong> untuk mendapatkan hadiah menarik!</p>
            
            <div className="bg-gold/10 border border-gold/20 rounded-lg p-3 mt-4">
              <p className="text-gold font-medium text-xs">
                💡 Tips: Jawaban kuis yang salah akan mengaktifkan cooldown 3 jam sebelum bisa mencoba lagi
              </p>
            </div>
          </div>
        </motion.details>
      </div>
    </div>
  );
};

export default Dashboard;