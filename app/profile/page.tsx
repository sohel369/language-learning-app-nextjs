'use client';

import { useState } from 'react';
import { ArrowLeft, User, Settings, Trophy, Star, Flame, Award, Globe, Bell, Shield, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import BottomNavigation from '../../components/BottomNavigation';

export default function ProfilePage() {
  const { currentLanguage, setCurrentLanguage, isRTL } = useLanguage();
  const { settings, updateSetting } = useAccessibility();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const userStats = {
    streak: 7,
    totalXP: 1250,
    level: 3,
    wordsLearned: 45,
    lessonsCompleted: 12,
    quizzesPassed: 8,
    timeSpent: 24, // hours
    rank: 156
  };

  const achievements = [
    { id: '1', name: 'First Steps', description: 'Complete your first lesson', icon: '🎯', earned: true, date: '2024-01-15' },
    { id: '2', name: 'Streak Master', description: 'Maintain a 7-day streak', icon: '🔥', earned: true, date: '2024-01-20' },
    { id: '3', name: 'Quiz Champion', description: 'Score 100% on a quiz', icon: '🏆', earned: true, date: '2024-01-18' },
    { id: '4', name: 'Vocabulary Builder', description: 'Learn 100 words', icon: '📚', earned: false, date: null },
    { id: '5', name: 'Language Explorer', description: 'Study for 10 hours', icon: '⏰', earned: false, date: null },
  ];

  const languages = [
    { code: 'en', name: 'English', native: 'English', flag: '🇺🇸', isRTL: false },
    { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦', isRTL: true },
    { code: 'nl', name: 'Dutch', native: 'Nederlands', flag: '🇳🇱', isRTL: false },
    { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia', flag: '🇮🇩', isRTL: false },
    { code: 'ms', name: 'Malay', native: 'Bahasa Melayu', flag: '🇲🇾', isRTL: false },
    { code: 'th', name: 'Thai', native: 'ไทย', flag: '🇹🇭', isRTL: false },
    { code: 'km', name: 'Khmer', native: 'ខ្មែរ', flag: '🇰🇭', isRTL: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="p-6 pb-24">
        <Link href="/" className="flex items-center space-x-3 text-white mb-6 hover:text-purple-300">
          <ArrowLeft className="w-6 h-6" />
          <span className="text-lg font-medium">Back to Home</span>
        </Link>

        {/* Profile Header */}
        <div className="bg-gray-800/50 rounded-2xl p-6 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Language Learner</h1>
              <p className="text-gray-400">Level {userStats.level} • {userStats.totalXP} XP</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-sm text-gray-400">Streak</span>
              </div>
              <div className="text-xl font-bold text-white">{userStats.streak}</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-400">Words</span>
              </div>
              <div className="text-xl font-bold text-white">{userStats.wordsLearned}</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <Award className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-400">Lessons</span>
              </div>
              <div className="text-xl font-bold text-white">{userStats.lessonsCompleted}</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <Trophy className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-400">Rank</span>
              </div>
              <div className="text-xl font-bold text-white">#{userStats.rank}</div>
            </div>
          </div>
        </div>

        {/* Language Settings */}
        <div className="bg-gray-800/50 rounded-2xl p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Globe className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">Learning Language</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setCurrentLanguage(lang)}
                className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                  currentLanguage.code === lang.code
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                }`}
                dir={lang.isRTL ? 'rtl' : 'ltr'}
              >
                <div className="text-2xl mb-2">{lang.flag}</div>
                <div className="text-sm font-medium text-white">{lang.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Accessibility Settings */}
        <div className="bg-gray-800/50 rounded-2xl p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">Accessibility</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">High Contrast</div>
                <div className="text-sm text-gray-400">Improve visibility</div>
              </div>
              <button
                onClick={() => updateSetting('highContrast', !settings.highContrast)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.highContrast ? 'bg-purple-600' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.highContrast ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Screen Reader</div>
                <div className="text-sm text-gray-400">Voice navigation support</div>
              </div>
              <button
                onClick={() => updateSetting('screenReader', !settings.screenReader)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.screenReader ? 'bg-purple-600' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.screenReader ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Audio Captions</div>
                <div className="text-sm text-gray-400">Text for audio content</div>
              </div>
              <button
                onClick={() => updateSetting('captions', !settings.captions)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.captions ? 'bg-purple-600' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.captions ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-gray-800/50 rounded-2xl p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Trophy className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">Achievements</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  achievement.earned
                    ? 'border-yellow-500 bg-yellow-500/10'
                    : 'border-gray-600 bg-gray-700/30'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium text-white">{achievement.name}</div>
                    <div className="text-sm text-gray-400">{achievement.description}</div>
                    {achievement.earned && achievement.date && (
                      <div className="text-xs text-yellow-400 mt-1">
                        Earned: {new Date(achievement.date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  {achievement.earned && (
                    <div className="text-green-400">✓</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="bg-gray-800/50 rounded-2xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Settings className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Dark Mode</div>
                <div className="text-sm text-gray-400">Toggle dark/light theme</div>
              </div>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  isDarkMode ? 'bg-purple-600' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    isDarkMode ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Notifications</div>
                <div className="text-sm text-gray-400">Daily reminders and updates</div>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  notifications ? 'bg-purple-600' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    notifications ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
