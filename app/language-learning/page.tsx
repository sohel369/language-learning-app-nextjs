'use client';

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSupport from '../../components/LanguageSupport';
import SocialQuizzes from '../../components/SocialQuizzes';
import { 
  Globe, 
  Users, 
  BookOpen, 
  MessageCircle, 
  Settings,
  Brain,
  Target,
  Award,
  Star,
  Zap,
  Crown,
  Flame
} from 'lucide-react';

export default function LanguageLearningPage() {
  const { user } = useAuth();
  const { selectedLanguages, currentLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState('language-support');
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);

  const tabs = [
    {
      id: 'language-support',
      name: 'Language Support',
      icon: Globe,
      description: 'Choose and configure your languages'
    },
    {
      id: 'social-quizzes',
      name: 'Social Quizzes',
      icon: Users,
      description: 'Interactive social learning quizzes'
    }
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'language-support':
        return (
          <LanguageSupport
            onLanguageChange={(language) => {
              setSelectedLanguage(language);
            }}
          />
        );
      case 'social-quizzes':
        return (
          <SocialQuizzes
            language={selectedLanguage}
            onQuizComplete={(quiz, score) => {
              console.log('Quiz completed:', quiz, score);
            }}
          />
        );
      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Please log in to access language learning</h1>
          <a
            href="/auth/login"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Brain className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl font-bold text-white">Language Learning Hub</h1>
          </div>
          <p className="text-white/70 text-lg">
            Master languages with interactive quizzes and comprehensive support
          </p>
        </div>

        {/* Language Status */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Your Learning Languages</h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">Active</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <Globe className="w-6 h-6 text-blue-400" />
                <span className="text-white font-semibold">Current Language</span>
              </div>
              <p className="text-white/70">
                {currentLanguage === 'en' ? 'English' : 
                 currentLanguage === 'ar' ? 'العربية' : 
                 currentLanguage === 'nl' ? 'Nederlands' : 
                 currentLanguage === 'id' ? 'Bahasa Indonesia' : 
                 currentLanguage === 'ms' ? 'Bahasa Melayu' : 
                 currentLanguage === 'th' ? 'ไทย' : 
                 currentLanguage === 'km' ? 'ខ្មែរ' : currentLanguage}
              </p>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <Users className="w-6 h-6 text-green-400" />
                <span className="text-white font-semibold">Learning Languages</span>
              </div>
              <p className="text-white/70">{selectedLanguages.length} languages selected</p>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <Target className="w-6 h-6 text-purple-400" />
                <span className="text-white font-semibold">Progress</span>
              </div>
              <p className="text-white/70">Track your learning journey</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`p-6 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                      : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-3">
                    <Icon className="w-8 h-8" />
                    <div className="text-center">
                      <div className="font-semibold text-lg">{tab.name}</div>
                      <div className="text-sm opacity-75">{tab.description}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Tab Content */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          {renderActiveTab()}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
            <div className="flex items-center space-x-3">
              <Globe className="w-8 h-8 text-blue-400" />
              <div>
                <div className="text-white font-semibold">Languages</div>
                <div className="text-white/70 text-sm">{selectedLanguages.length} Active</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-green-400" />
              <div>
                <div className="text-white font-semibold">Social Quizzes</div>
                <div className="text-white/70 text-sm">10+ Available</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-8 h-8 text-purple-400" />
              <div>
                <div className="text-white font-semibold">Learning Content</div>
                <div className="text-white/70 text-sm">Unlimited</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
            <div className="flex items-center space-x-3">
              <Award className="w-8 h-8 text-yellow-400" />
              <div>
                <div className="text-white font-semibold">Achievements</div>
                <div className="text-white/70 text-sm">Track Progress</div>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Tips */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mt-8">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-400" />
            <span>Learning Tips</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-5 h-5 text-blue-400" />
                <span className="text-white font-semibold">Practice Daily</span>
              </div>
              <p className="text-white/70 text-sm">
                Consistent daily practice is more effective than long study sessions.
              </p>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <MessageCircle className="w-5 h-5 text-green-400" />
                <span className="text-white font-semibold">Speak Out Loud</span>
              </div>
              <p className="text-white/70 text-sm">
                Practice pronunciation by speaking aloud, even if you're alone.
              </p>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Crown className="w-5 h-5 text-purple-400" />
                <span className="text-white font-semibold">Set Goals</span>
              </div>
              <p className="text-white/70 text-sm">
                Set achievable goals and track your progress to stay motivated.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
