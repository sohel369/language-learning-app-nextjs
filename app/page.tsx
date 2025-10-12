'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
import BottomNavigation from '../components/BottomNavigation';
import { useLanguage, languages } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../hooks/useTranslation';


export default function Home() {
  const { currentLanguage, setCurrentLanguage, isRTL } = useLanguage();
  const { user, loading } = useAuth();
  const t = useTranslation();
  
  console.log('Homepage current language:', currentLanguage);
  const [showPWAInstall, setShowPWAInstall] = useState(true);
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

  const handleLanguageSelect = (language: any) => {
    console.log('Homepage: Setting language to:', language);
    setCurrentLanguage(language);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" dir={isRTL ? 'rtl' : 'ltr'}>
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
        {user ? (
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                {t('welcome')}, {user.name}! 👋
              </h2>
              <p className="text-purple-100 mt-1">{t('readyToLearn')}</p>
            </div>
              <Settings className="w-6 h-6 text-purple-200" />
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-3 py-2">
                <Flame className="w-5 h-5 text-orange-400" />
                <span className="font-semibold">{user.streak || 0} {t('dayStreak')}</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-3 py-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="font-semibold">{user.total_xp || 0} {t('totalXP')}</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-3 py-2">
                <Award className="w-5 h-5 text-blue-400" />
                <span className="font-semibold">{t('level')} {user.level || 1}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">
                {t('startJourney')} 🌍
              </h2>
              <p className="text-purple-100 mb-6">
                {t('joinLearners')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/auth/signup"
                  className="bg-white text-purple-600 hover:bg-purple-50 font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <User className="w-5 h-5" />
                  <span>{t('getStarted')}</span>
                </Link>
                <Link
                  href="/auth/login"
                  className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 border border-white/30"
                >
                  <span>{t('signIn')}</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>


      {/* Language Selection */}
      <div className="px-4 md:px-6 mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Globe className="w-6 h-6 text-white" />
          <h3 className="text-xl font-bold text-white">{t('selectLanguage')}</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                currentLanguage.code === lang.code
                  ? 'border-blue-500 bg-blue-500/20'
                  : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
              }`}
              dir={lang.isRTL ? 'rtl' : 'ltr'}
            >
              <div className="text-2xl mb-2">{lang.flag}</div>
              <div className="text-sm font-medium text-white">
                {t(lang.name.toLowerCase() as any) || lang.name}
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
              <h4 className="font-semibold text-white">{t('installApp')}</h4>
              <p className="text-sm text-white/80">{t('getOfflineAccess')}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={handlePWAInstall}
                className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors"
              >
                {t('install')}
              </button>
              <button onClick={dismissPWA} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* Bottom padding for navigation */}
      <div className="h-20"></div>
      
      {/* Accessibility Settings */}
      <AccessibilitySettings />
    </div>
  );
}
