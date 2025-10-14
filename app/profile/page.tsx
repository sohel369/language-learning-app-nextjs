'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Award, 
  Star, 
  Flame, 
  Settings, 
  LogOut, 
  Edit3,
  Trophy,
  Users,
  Target,
  Crown,
  Zap,
  Globe,
  ChevronDown,
  Check,
  Bell,
  Volume2,
  Type,
  Sun,
  Moon,
  Monitor,
  Play
} from 'lucide-react';
import LiveLeaderboard from '../../components/LiveLeaderboard';
import UserSettings from '../../components/UserSettings';
import ProfileSettings from '../../components/ProfileSettings';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import { supabase } from '../../lib/supabase';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸', native: 'US English' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', native: 'SA العربية' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱', native: 'NL Nederlands' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭', native: 'TH ไทย' },
  { code: 'km', name: 'ខ្មែរ', flag: '🇰🇭', native: 'KH ខ្មែរ' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩', native: 'ID Bahasa Indonesia' },
  { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾', native: 'MY Bahasa Melayu' }
];

const achievements = [
  {
    id: 1,
    name: 'Quick Learner',
    description: 'Complete 10 lessons in one day',
    icon: Zap,
    unlocked: false,
    color: 'text-yellow-400'
  },
  {
    id: 2,
    name: 'Streak Master',
    description: 'Maintain a 7-day streak',
    icon: Flame,
    unlocked: false,
    color: 'text-orange-400'
  },
  {
    id: 3,
    name: 'Vocabulary Champion',
    description: 'Learn 300+ words',
    icon: Crown,
    unlocked: false,
    color: 'text-purple-400'
  },
  {
    id: 4,
    name: 'Perfect Score',
    description: 'Get 100% in 5 lessons',
    icon: Star,
    unlocked: false,
    color: 'text-blue-400'
  },
  {
    id: 5,
    name: 'Social Butterfly',
    description: 'Join the leaderboard',
    icon: Users,
    unlocked: false,
    color: 'text-green-400'
  }
];

const leaderboardData = [
  { rank: 1, name: 'Ahmed', xp: 2500, streak: 15, avatar: 'A' },
  { rank: 2, name: 'Sarah', xp: 2200, streak: 12, avatar: 'S' },
  { rank: 3, name: 'Muhammad', xp: 1800, streak: 8, avatar: 'M' },
  { rank: 4, name: 'Fatima', xp: 1600, streak: 7, avatar: 'F' },
  { rank: 5, name: 'Ali', xp: 1400, streak: 6, avatar: 'A' }
];

export default function ProfilePage() {
  const { user, signOut, refreshUser, loading } = useAuth();
  const { currentLanguage, setCurrentLanguage, isRTL } = useLanguage();
  const { settings, updateSetting } = useAccessibility();

  const [currentTab, setCurrentTab] = useState('stats');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  
  // Update editName when user changes
  useEffect(() => {
    setEditName(user?.name || '');
  }, [user?.name]);

  // Auto-create profile if user exists but has no name
  useEffect(() => {
    if (user && user.id && user.email && (!user.name || user.name === 'Guest')) {
      console.log('User has no name, attempting to create profile...');
      createUserProfile();
    }
  }, [user]);
  const [selectedLanguage, setSelectedLanguage] = useState('ar');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showInterfaceLanguage, setShowInterfaceLanguage] = useState(false);
  

  const handleSaveName = async () => {
    if (!user || !editName.trim()) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ name: editName.trim() })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating name:', error);
        return;
      }

      // Update local user state
      await refreshUser();
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving name:', error);
    }
  };

  const createUserProfile = async () => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/create-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          name: user.email?.split('@')[0] || 'User',
          email: user.email || ''
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('Profile created successfully:', result);
        await refreshUser();
        alert('Profile created successfully!');
      } else {
        console.error('Error creating profile:', result.error);
        alert('Error creating profile: ' + result.error);
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      alert('Error creating profile: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const updateUserLanguages = async (nativeLang: string, learningLang: string) => {
    if (!user) return;
    
    try {
      // Use public.profiles table (correct approach)
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: user.name || user.email?.split('@')[0] || 'User',
          email: user.email,
          native_language: nativeLang,
          learning_language: learningLang
        })
        .select();

      if (error) {
        console.error('Error updating languages in profiles table:', error);
        alert('Error updating languages: ' + error.message);
        return;
      }

      console.log('Languages updated successfully in profiles table:', data);
      await refreshUser();
      alert('Languages updated successfully!');
    } catch (error) {
      console.error('Error updating languages:', error);
      alert('Error updating languages: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleLanguageChange = (langCode: string) => {
    setSelectedLanguage(langCode);
    setShowLanguageDropdown(false);
  };

  const handleInterfaceLanguageChange = (langCode: string) => {
    setShowInterfaceLanguage(false);
    // Handle interface language change
  };


  const testNotification = (type: string) => {
    // Handle test notification
    console.log(`Testing ${type} notification`);
    // You would implement actual notification testing here
  };

  // Show loading state while user data is being fetched
  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white">Loading your profile...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-20">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
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
            <div className="flex items-center space-x-2">
              <Flame className="w-5 h-5 text-orange-400" />
              <span className="text-white font-semibold">{user?.streak || 0}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
              </div>
              <div className="text-right">
                <div className="text-white font-semibold text-sm">{user?.name || 'User'}</div>
                <div className="text-white/70 text-xs">{user?.email || 'user@example.com'}</div>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="text-red-400 hover:text-red-300 transition-colors text-sm"
            >
              Logout
            </button>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowInterfaceLanguage(!showInterfaceLanguage)}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                US English
              </button>
              <button
                onClick={() => setShowInterfaceLanguage(!showInterfaceLanguage)}
                className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
              >
                SA العربية
              </button>
            </div>
          </div>
        </div>

        {/* Profile Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
          <p className="text-white/70">Track your progress and customize your experience</p>
          {/* Debug info - hidden by default, can be toggled */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-4 bg-slate-800/50 border border-slate-600/50 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="text-slate-300 text-sm">
                  Debug: User Name = "{user?.name || 'Not loaded'}" | 
                  User ID = "{user?.id || 'Not loaded'}" | 
                  Email = "{user?.email || 'Not loaded'}"
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={refreshUser}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition-colors"
                  >
                    Refresh
                  </button>
                  <button
                    onClick={createUserProfile}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs transition-colors"
                  >
                    Create Profile
                  </button>
                  <button
                    onClick={() => updateUserLanguages('Bengali', 'English')}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs transition-colors"
                  >
                    Set Languages
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-white/10 rounded-xl p-1">
          <button
            onClick={() => setCurrentTab('stats')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all ${
              currentTab === 'stats' 
                ? 'bg-purple-600 text-white' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Target className="w-5 h-5" />
            <span>Stats</span>
          </button>
          <button
            onClick={() => setCurrentTab('settings')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all ${
              currentTab === 'settings' 
                ? 'bg-purple-600 text-white' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
          <button
            onClick={() => setCurrentTab('leaderboard')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all ${
              currentTab === 'leaderboard' 
                ? 'bg-purple-600 text-white' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Trophy className="w-5 h-5" />
            <span>Leaderboard</span>
          </button>
        </div>

        {/* Stats Tab */}
        {currentTab === 'stats' && (
          <div className="space-y-6">
            {/* Profile Summary Card */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
              <div className="flex items-center space-x-6 mb-6">
                <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-3xl">{user?.name?.charAt(0) || 'U'}</span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    {user?.name || 'Loading...'}
                  </h2>
                  <p className="text-blue-100 text-lg">{user?.email || 'user@example.com'}</p>
                  <div className="mt-3">
                    <span className="inline-flex items-center px-4 py-2 bg-white/25 rounded-full text-sm font-medium">
                      {languages.find(l => l.code === user?.learning_language || selectedLanguage)?.flag} {languages.find(l => l.code === user?.learning_language || selectedLanguage)?.native}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">{user?.total_xp || 0}</div>
                  <div className="text-blue-100 text-sm font-medium">Total XP</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{user?.streak || 0}</div>
                  <div className="text-blue-100 text-sm font-medium">Day Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{user?.level || 1}</div>
                  <div className="text-blue-100 text-sm font-medium">Level</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">0</div>
                  <div className="text-blue-100 text-sm font-medium">Badges</div>
                </div>
              </div>
            </div>

            {/* Learning Stats */}
            <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-8 border-2 border-white/30 shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-6">Learning Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-white/10 rounded-xl">
                  <div className="text-3xl font-bold text-white">{user?.total_xp || 0}</div>
                  <div className="text-white/80 text-sm font-medium">Total XP</div>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-xl">
                  <div className="text-3xl font-bold text-white">{user?.streak || 0}</div>
                  <div className="text-white/80 text-sm font-medium">Day Streak</div>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-xl">
                  <div className="text-3xl font-bold text-white">0</div>
                  <div className="text-white/80 text-sm font-medium">Words Learned</div>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-xl">
                  <div className="text-3xl font-bold text-white">{user?.level || 1}</div>
                  <div className="text-white/80 text-sm font-medium">Level</div>
                </div>
              </div>
            </div>

            {/* Learning Progress */}
            <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-8 border-2 border-white/30 shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-6">Learning Progress</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-white font-semibold text-lg">Current Level Progress</span>
                    <span className="text-white/80 text-sm font-medium">0 / 200 XP</span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-4 shadow-inner">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full shadow-lg" style={{ width: '0%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-white font-semibold text-lg">Weekly Goal</span>
                    <span className="text-white/80 text-sm font-medium">0 / 7 days</span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-4 shadow-inner">
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full shadow-lg" style={{ width: '0%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 border-2 border-white/30 shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Trophy className="w-7 h-7 mr-3 text-yellow-400" />
                Achievements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className={`p-5 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                    achievement.unlocked 
                      ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-400/50 shadow-lg shadow-green-500/20' 
                      : 'bg-white/10 border-white/20 hover:bg-white/15'
                  }`}>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`p-2 rounded-lg ${achievement.unlocked ? 'bg-green-500/20' : 'bg-white/10'}`}>
                      <achievement.icon className={`w-6 h-6 ${achievement.color}`} />
                    </div>
                      <span className="text-white font-semibold text-lg">{achievement.name}</span>
                    </div>
                    <p className="text-white/80 text-sm mb-2">{achievement.description}</p>
                    {achievement.unlocked ? (
                      <div className="flex items-center space-x-1 text-green-400 text-sm font-medium">
                        <Check className="w-4 h-4" />
                        <span>Unlocked!</span>
                      </div>
                    ) : (
                      <div className="text-white/60 text-sm">Not unlocked yet</div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-6 p-5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-400/50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Award className="w-6 h-6 text-yellow-400" />
                  <span className="text-yellow-300 font-semibold text-lg">No achievements yet</span>
                </div>
                <p className="text-yellow-200 text-sm mt-2">Keep learning to unlock them! Complete lessons and quizzes to earn your first achievement.</p>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {currentTab === 'settings' && (
          <div className="space-y-6">
            {/* Basic Profile Information */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <User className="w-6 h-6 mr-2" />
                Profile Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Display Name</label>
                  {isEditing ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter your name"
                      />
                      <button
                        onClick={handleSaveName}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-white">{user?.name || 'User'}</span>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Email Address</label>
                  <span className="text-white">{user?.email || 'user@example.com'}</span>
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Learning Language</label>
                  <span className="text-white">
                    {languages.find(l => l.code === user?.learning_language)?.native || 'Arabic'}
                  </span>
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Native Language</label>
                  <span className="text-white">
                    {languages.find(l => l.code === user?.native_language)?.native || 'English'}
                  </span>
                </div>
              </div>
            </div>
            
            <ProfileSettings />
            <UserSettings />
          </div>
        )}

        {/* Legacy Settings Tab - keeping for reference */}
        {false && currentTab === 'settings' && (
          <div className="space-y-6">
            {/* Account Information */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <User className="w-6 h-6 mr-2" />
                Account Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Display Name</label>
                  {isEditing ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        onClick={handleSaveName}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-white">{user?.name || 'User'}</span>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Email Address</label>
                  <span className="text-white">{user?.email || 'user@example.com'}</span>
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Learning Language</label>
                  <span className="text-white">
                    {languages.find(l => l.code === user?.learning_language)?.native || 'Arabic'}
                  </span>
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Native Language</label>
                  <span className="text-white">
                    {languages.find(l => l.code === user?.native_language)?.native || 'English'}
                  </span>
                </div>
          </div>
        </div>

            {/* App Settings */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Settings className="w-6 h-6 mr-2" />
                App Settings
              </h3>
              
              <div className="space-y-6">
                {/* Theme */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-3">Theme</label>
                  <div className="flex space-x-3">
                    {[
                      { value: 'light', label: 'Light', icon: Sun },
                      { value: 'dark', label: 'Dark', icon: Moon },
                      { value: 'system', label: 'System', icon: Monitor }
                    ].map(theme => (
              <button
                        key={theme.value}
                        onClick={() => updateSetting('theme', theme.value as 'light' | 'dark' | 'system')}
                        className={`flex items-center space-x-2 px-4 py-3 rounded-lg border-2 transition-all ${
                          settings.theme === theme.value
                            ? 'border-purple-500 bg-purple-500/20 text-white'
                            : 'border-white/20 text-white/70 hover:border-white/40 hover:text-white'
                        }`}
                      >
                        <theme.icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{theme.label}</span>
              </button>
            ))}
          </div>
        </div>

                {/* Notifications */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-3">Notifications</label>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Enable push notifications</span>
                    <button
                      onClick={() => updateSetting('notificationsEnabled', !settings.notificationsEnabled)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        settings.notificationsEnabled ? 'bg-purple-600' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.notificationsEnabled ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
          </div>
          
                {/* Sound */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-3">Sound</label>
            <div className="flex items-center justify-between">
                    <span className="text-white">Enable audio feedback</span>
                    <button
                      onClick={() => updateSetting('soundEnabled', !settings.soundEnabled)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        settings.soundEnabled ? 'bg-purple-600' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.soundEnabled ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                </div>

                {/* Font Size */}
              <div>
                  <label className="block text-white/80 text-sm font-medium mb-3">Font Size</label>
                  <div className="flex space-x-3">
                    {[
                      { value: 'small', label: 'Small' },
                      { value: 'medium', label: 'Medium' },
                      { value: 'large', label: 'Large' }
                    ].map(size => (
                      <button
                        key={size.value}
                        onClick={() => updateSetting('fontSize', size.value as 'small' | 'medium' | 'large' | 'xl')}
                        className={`px-4 py-3 rounded-lg border-2 transition-all ${
                          settings.fontSize === size.value
                            ? 'border-purple-500 bg-purple-500/20 text-white'
                            : 'border-white/20 text-white/70 hover:border-white/40 hover:text-white'
                        }`}
                      >
                        <span className="text-sm font-medium">{size.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Bell className="w-6 h-6 mr-2" />
                Notification Settings
              </h3>
              
              <div className="space-y-4">
                {/* Learning Reminders */}
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-white font-medium">Learning Reminders</div>
                    <div className="text-white/70 text-sm">Daily learning session reminders</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => testNotification('learning-reminders')}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                    >
                      Test
                    </button>
              <button
                      onClick={() => updateSetting('learningReminders', !settings.learningReminders)}
                className={`w-12 h-6 rounded-full transition-colors ${
                        settings.learningReminders ? 'bg-purple-600' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.learningReminders ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
              </button>
                  </div>
            </div>

                {/* Live Session Alerts */}
            <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-white font-medium">Live Session Alerts</div>
                    <div className="text-white/70 text-sm">Notifications for live learning sessions</div>
              </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => testNotification('live-sessions')}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                    >
                      Test
                    </button>
              <button
                      onClick={() => updateSetting('liveSessionAlerts', !settings.liveSessionAlerts)}
                className={`w-12 h-6 rounded-full transition-colors ${
                        settings.liveSessionAlerts ? 'bg-purple-600' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.liveSessionAlerts ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
              </button>
                  </div>
            </div>

                {/* Achievement Notifications */}
            <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-white font-medium">Achievement Notifications</div>
                    <div className="text-white/70 text-sm">Celebrate your learning milestones</div>
              </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => testNotification('achievements')}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                    >
                      Test
                    </button>
              <button
                      onClick={() => updateSetting('achievementNotifications', !settings.achievementNotifications)}
                className={`w-12 h-6 rounded-full transition-colors ${
                        settings.achievementNotifications ? 'bg-purple-600' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.achievementNotifications ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
              </button>
            </div>
          </div>
        </div>

              {/* Notification Statistics */}
              <div className="mt-6 pt-4 border-t border-white/20">
                <h4 className="text-white font-medium mb-4">Notification Statistics</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">0</div>
                    <div className="text-white/70 text-sm">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">0</div>
                    <div className="text-white/70 text-sm">Learning Reminders</div>
          </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">0</div>
                    <div className="text-white/70 text-sm">Live Sessions</div>
                      </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">0</div>
                    <div className="text-white/70 text-sm">Achievements</div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <div className="text-2xl font-bold text-white">0</div>
                  <div className="text-white/70 text-sm">Progress Updates</div>
          </div>
        </div>

              {/* Permission Status */}
              <div className="mt-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-green-400" />
                      <span className="text-green-400 font-medium">Permission Status</span>
                    </div>
                    <div className="text-green-300 text-sm mt-1">
                      Enabled
                    </div>
                    <div className="text-green-200 text-xs mt-1">
                      Notifications are enabled. You'll receive learning reminders and updates.
                    </div>
              </div>
                  <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors">
                    Enabled
              </button>
            </div>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard Tab */}
        {currentTab === 'leaderboard' && (
          <LiveLeaderboard 
            userId={user?.id}
            limit={10}
            autoRefresh={true}
            refreshInterval={30000}
          />
        )}
      </div>
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-lg border-t border-white/20">
        <div className="flex items-center justify-around py-3">
          <Link href="/" className="flex flex-col items-center space-y-1 text-white/70 hover:text-white transition-colors">
            <div className="w-6 h-6 bg-gray-600 rounded-lg"></div>
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/lessons" className="flex flex-col items-center space-y-1 text-white/70 hover:text-white transition-colors">
            <div className="w-6 h-6 bg-gray-600 rounded-lg"></div>
            <span className="text-xs">Lessons</span>
          </Link>
          <Link href="/quiz" className="flex flex-col items-center space-y-1 text-white/70 hover:text-white transition-colors">
            <div className="w-6 h-6 bg-gray-600 rounded-lg"></div>
            <span className="text-xs">Quiz</span>
          </Link>
          <Link href="/ai-coach" className="flex flex-col items-center space-y-1 text-white/70 hover:text-white transition-colors">
            <div className="w-6 h-6 bg-gray-600 rounded-lg"></div>
            <span className="text-xs">AI Coach</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center space-y-1 text-purple-400">
            <div className="w-6 h-6 bg-purple-600 rounded-lg"></div>
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}