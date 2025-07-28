export interface Player {
  id: string;
  name: string;
  phone: string;
  code: string;
  registeredAt: Date;
}

export interface Location {
  id: string;
  name: string;
  floor: 'GF' | 'UG' | 'FF';
  description: string;
  coordinates: { x: number; y: number };
  status: 'locked' | 'available' | 'completed';
  qrCode: string;
  quiz: Quiz;
  decorationRequirement: string;
}

export interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface GameProgress {
  playerId: string;
  completedLocations: string[];
  currentLocation?: string;
  totalScore: number;
  photos: { [locationId: string]: string };
  quizResults: { [locationId: string]: { correct: boolean; timestamp: Date } };
  wrongAnswerCooldowns: { [locationId: string]: Date };
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
}