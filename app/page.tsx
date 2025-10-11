'use client';

import { useState, useEffect } from 'react';
import { 
  Globe, 
  Settings, 
  Target, 
  Users, 
  Bell, 
  Home as HomeIcon, 
  BookOpen, 
  Trophy, 
  Bot, 
  User,
  Flame,
  Star,
  Award,
  X,
  Download
} from 'lucide-react';
import { registerSW, installPWA } from '../lib/pwa';
import AccessibilitySettings from '../components/AccessibilitySettings';

const languages = [
  { code: 'en', name: 'US English', native: 'English', flag: '🇺🇸', isRTL: false },
  { code: 'ar', name: 'SA العربية', native: 'العربية', flag: '🇸🇦', isRTL: true },
  { code: 'nl', name: 'NL Nederlands', native: 'Nederlands', flag: '🇳🇱', isRTL: false },
  { code: 'id', name: 'ID Bahasa Indonesia', native: 'Bahasa Indonesia', flag: '🇮🇩', isRTL: false },
  { code: 'ms', name: 'MY Bahasa Melayu', native: 'Bahasa Melayu', flag: '🇲🇾', isRTL: false },
  { code: 'th', name: 'TH ไทย', native: 'ไทย', flag: '🇹🇭', isRTL: false },
  { code: 'km', name: 'KH ខ្មែរ', native: 'ខ្មែរ', flag: '🇰🇭', isRTL: false },
];

export default function Home() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showPWAInstall, setShowPWAInstall] = useState(true);
  const [user, setUser] = useState({
    streak: 7,
    xp: 1250,
    level: 3
  });
  const [pwaInstall, setPwaInstall] = useState<any>(null);

  useEffect(() => {
    // Register service worker
    registerSW();
    
    // Setup PWA install
    const pwa = installPWA();
    setPwaInstall(pwa);
    
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowPWAInstall(false);
    }
  }, []);

  const handleLanguageSelect = (code: string) => {
    setSelectedLanguage(code);
  };

  const dismissPWA = () => {
    setShowPWAInstall(false);
  };

  const handlePWAInstall = () => {
    if (pwaInstall) {
      pwaInstall.showInstallPrompt();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="flex items-center justify-between p-4 md:p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">L</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">LinguaAI</h1>
            <p className="text-sm text-gray-300">Smart Language Learning</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <Target className="w-4 h-4 text-white" />
          </div>
          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
            <Users className="w-4 h-4 text-white" />
          </div>
          <div className="relative">
            <Bell className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">7</span>
            </span>
          </div>
        </div>
      </header>

      {/* Welcome Section */}
      <div className="px-4 md:px-6 mb-6">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                Welcome back! 👋
              </h2>
              <p className="text-purple-100 mt-1">Ready to continue learning?</p>
            </div>
            <Settings className="w-6 h-6 text-purple-200" />
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-3 py-2">
              <Flame className="w-5 h-5 text-orange-400" />
              <span className="font-semibold">{user.streak} Day Streak</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-3 py-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="font-semibold">{user.xp} Total XP</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-3 py-2">
              <Award className="w-5 h-5 text-blue-400" />
              <span className="font-semibold">Level {user.level}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Language Selection */}
      <div className="px-4 md:px-6 mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Globe className="w-6 h-6 text-white" />
          <h3 className="text-xl font-bold text-white">Select Language</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                selectedLanguage === lang.code
                  ? 'border-blue-500 bg-blue-500/20'
                  : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
              }`}
              dir={lang.isRTL ? 'rtl' : 'ltr'}
            >
              <div className="text-2xl mb-2">{lang.flag}</div>
              <div className="text-sm font-medium text-white">
                {lang.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* PWA Install Banner */}
      {showPWAInstall && (
        <div className="px-4 md:px-6 mb-6">
          <div className="bg-gradient-to-r from-purple-600 to-green-500 rounded-xl p-4 flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-white">Install LinguaAI</h4>
              <p className="text-sm text-white/80">Get offline access & notifications.</p>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={handlePWAInstall}
                className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors"
              >
                Install
              </button>
              <button onClick={dismissPWA} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700">
        <div className="flex items-center justify-around py-2">
          <button className="flex flex-col items-center space-y-1 p-3 text-blue-400">
            <HomeIcon className="w-6 h-6" />
            <span className="text-xs font-medium">Home</span>
          </button>
          <button className="flex flex-col items-center space-y-1 p-3 text-gray-400 hover:text-white">
            <BookOpen className="w-6 h-6" />
            <span className="text-xs font-medium">Lessons</span>
          </button>
          <button className="flex flex-col items-center space-y-1 p-3 text-gray-400 hover:text-white">
            <Target className="w-6 h-6" />
            <span className="text-xs font-medium">Quiz</span>
          </button>
          <button className="flex flex-col items-center space-y-1 p-3 text-gray-400 hover:text-white">
            <Bot className="w-6 h-6" />
            <span className="text-xs font-medium">AI Coach</span>
          </button>
          <button className="flex flex-col items-center space-y-1 p-3 text-gray-400 hover:text-white">
            <User className="w-6 h-6" />
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </nav>

      {/* Bottom padding for navigation */}
      <div className="h-20"></div>
      
      {/* Accessibility Settings */}
      <AccessibilitySettings />
    </div>
  );
}
