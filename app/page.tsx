'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Trophy,
  Users,
  Globe,
  Star,
  ArrowRight,
  Play,
  Volume2,
  Bell,
  Target,
  CheckCircle,
  Brain,
  Zap,
  Shield,
  Smartphone,
  Award,
  Clock,
  Heart,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';
import NotificationBell from '../components/NotificationBell';
import BottomNavigation from '../components/BottomNavigation';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user, loading } = useAuth();
  const { currentLanguage, isRTL } = useLanguage();
  const t = useTranslation();
  const router = useRouter();
  const [showPWAInstall, setShowPWAInstall] = useState(true);
  const [pwaInstall, setPwaInstall] = useState<any>(null);

  // Handle redirect to dashboard when user is authenticated
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  // Show loading while authentication is being checked
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
          <div className="mt-4 text-sm text-white/70">
            <p>If this takes too long, try:</p>
            <div className="mt-2 space-y-1">
              <a href="/force-loading-fix" className="text-purple-400 hover:text-purple-300 block">
                Fix Loading Issue
              </a>
              <a href="/debug-loading" className="text-blue-400 hover:text-blue-300 block">
                Debug Loading
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If authenticated, show loading while redirecting
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show landing page
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Header */}
        <header className="p-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">LinguaAI</h1>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href="/auth/login"
                className="text-white/70 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-purple-500/20 border border-purple-500/30 rounded-full px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-sm font-medium">AI-Powered Language Learning</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Master Languages with
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
                {" "}AI Power
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/70 mb-8 max-w-4xl mx-auto leading-relaxed">
              Learn 7 languages with AI-powered lessons, interactive quizzes, and personalized learning paths.
              Join thousands of learners worldwide and achieve fluency faster than ever.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/getting-started"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span>Start Learning Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/auth/login"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 border border-white/20 hover:border-white/40"
              >
                Sign In
              </Link>
            </div>

            {/* Language Flags */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {[
                { code: 'en', name: 'English', flag: '🇺🇸' },
                { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
                { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
                { code: 'id', name: 'Indonesian', flag: '🇮🇩' },
                { code: 'ms', name: 'Malay', flag: '🇲🇾' },
                { code: 'th', name: 'Thai', flag: '🇹🇭' },
                { code: 'km', name: 'Khmer', flag: '🇰🇭' }
              ].map((lang) => (
                <div key={lang.code} className="flex items-center space-x-2 bg-white/10 backdrop-blur-lg rounded-lg px-4 py-2 border border-white/20 hover:bg-white/20 transition-all duration-200">
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="text-white font-medium">{lang.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Our App Section */}
        <section className="py-20 px-6 bg-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Why Choose LinguaAI?
              </h2>
              <p className="text-xl text-white/70 max-w-3xl mx-auto">
                Experience the future of language learning with our cutting-edge AI technology and personalized approach.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Brain className="w-8 h-8 text-purple-400" />,
                  title: "AI-Powered Learning",
                  description: "Advanced AI adapts to your learning style and pace, creating personalized lessons that maximize your progress."
                },
                {
                  icon: <Zap className="w-8 h-8 text-yellow-400" />,
                  title: "Lightning Fast Progress",
                  description: "Learn 3x faster with our scientifically-proven methods and intelligent spaced repetition system."
                },
                {
                  icon: <Globe className="w-8 h-8 text-blue-400" />,
                  title: "7 Languages Supported",
                  description: "Master English, Arabic, Dutch, Indonesian, Malay, Thai, and Khmer with native speaker audio."
                },
                {
                  icon: <Trophy className="w-8 h-8 text-green-400" />,
                  title: "Gamified Experience",
                  description: "Earn XP, unlock achievements, and compete on the global leaderboard while learning."
                },
                {
                  icon: <Shield className="w-8 h-8 text-red-400" />,
                  title: "Privacy First",
                  description: "Your data is secure with enterprise-grade encryption and privacy protection."
                },
                {
                  icon: <Smartphone className="w-8 h-8 text-cyan-400" />,
                  title: "Learn Anywhere",
                  description: "Access your lessons offline, sync across devices, and learn on your schedule."
                }
              ].map((feature, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200 hover:transform hover:scale-105">
                  <div className="flex items-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Our Service Section */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  About Our Service
                </h2>
                <p className="text-xl text-white/70 mb-8 leading-relaxed">
                  LinguaAI revolutionizes language learning by combining artificial intelligence with proven pedagogical methods.
                  Our platform adapts to each learner's unique needs, providing personalized content that accelerates fluency.
                </p>

                <div className="space-y-6">
                  {[
                    {
                      icon: <CheckCircle className="w-6 h-6 text-green-400" />,
                      text: "Personalized learning paths based on your goals and preferences"
                    },
                    {
                      icon: <CheckCircle className="w-6 h-6 text-green-400" />,
                      text: "Real-time progress tracking with detailed analytics and insights"
                    },
                    {
                      icon: <CheckCircle className="w-6 h-6 text-green-400" />,
                      text: "Interactive AI coach available 24/7 for practice and guidance"
                    },
                    {
                      icon: <CheckCircle className="w-6 h-6 text-green-400" />,
                      text: "Community features including leaderboards and social learning"
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      {item.icon}
                      <span className="text-white/80">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-2xl p-8 border border-white/20">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">10K+</div>
                      <div className="text-white/70">Active Learners</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">95%</div>
                      <div className="text-white/70">Success Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">7</div>
                      <div className="text-white/70">Languages</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">24/7</div>
                      <div className="text-white/70">AI Support</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Getting Started Section */}
        <section className="py-20 px-6 bg-gradient-to-r from-purple-600/20 to-blue-600/20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              Join thousands of learners who are already mastering new languages with LinguaAI.
              Start your free trial today and experience the future of language learning.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                href="/getting-started"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/auth/login"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 border border-white/20 hover:border-white/40 flex items-center justify-center space-x-2"
              >
                <span>Sign In</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="flex items-center justify-center space-x-8 text-white/60">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">5 min setup</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4" />
                <span className="text-sm">Free forever</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4" />
                <span className="text-sm">No credit card</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-white/20">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white font-semibold text-lg">LinguaAI</span>
                </div>
                <p className="text-white/70 text-sm leading-relaxed">
                  The future of language learning powered by artificial intelligence.
                </p>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4">Product</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/lessons" className="text-white/70 hover:text-white transition-colors">Lessons</Link></li>
                  <li><Link href="/quiz" className="text-white/70 hover:text-white transition-colors">Quizzes</Link></li>
                  <li><Link href="/leaderboard" className="text-white/70 hover:text-white transition-colors">Leaderboard</Link></li>
                  <li><Link href="/ai-coach" className="text-white/70 hover:text-white transition-colors">AI Coach</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/getting-started" className="text-white/70 hover:text-white transition-colors">Getting Started</Link></li>
                  <li><Link href="/test-complete-system" className="text-white/70 hover:text-white transition-colors">Help Center</Link></li>
                  <li><Link href="/test-auth-flow" className="text-white/70 hover:text-white transition-colors">Contact Us</Link></li>
                  <li><Link href="/test-loading" className="text-white/70 hover:text-white transition-colors">Status</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4">Company</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/landing" className="text-white/70 hover:text-white transition-colors">About</Link></li>
                  <li><Link href="/auth/signup" className="text-white/70 hover:text-white transition-colors">Careers</Link></li>
                  <li><Link href="/auth/login" className="text-white/70 hover:text-white transition-colors">Privacy</Link></li>
                  <li><Link href="/test-complete-system" className="text-white/70 hover:text-white transition-colors">Terms</Link></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-white/20 pt-8">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <p className="text-white/50 text-sm">
                  © 2024 LinguaAI. All rights reserved.
                </p>
                <div className="flex items-center space-x-4 mt-4 md:mt-0">
                  <span className="text-white/50 text-sm">Made with ❤️ for language learners</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Authenticated user - show full app interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="flex items-center justify-between p-4 md:px-6 bg-gradient-to-r from-slate-800/80 to-purple-800/80 backdrop-blur-md fixed top-0 left-0 right-0 z-40">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">LinguaAI</h1>
        </div>

        <div className="flex items-center space-x-4">
          <NotificationBell />
          <Link
            href="/profile"
            className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
            title="Go to Profile"
          >
            <Users className="w-4 h-4 text-white" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-24">
        {/* Welcome Section */}
        <section className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {t('welcome')}, {(user as any)?.name || 'Learner'}! 👋
              </h2>
              <p className="text-xl text-white/70 mb-8">
                {t('readyToLearn')}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-orange-400" />
                  </div>
                  <span className="text-2xl font-bold text-white">7</span>
                </div>
                <h3 className="text-white font-semibold mb-1">{t('dayStreak')}</h3>
                <p className="text-white/70 text-sm">Keep it up!</p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-green-400" />
                  </div>
                  <span className="text-2xl font-bold text-white">1,250</span>
                </div>
                <h3 className="text-white font-semibold mb-1">{t('totalXP')}</h3>
                <p className="text-white/70 text-sm">Level 5</p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Star className="w-6 h-6 text-blue-400" />
                  </div>
                  <span className="text-2xl font-bold text-white">12</span>
                </div>
                <h3 className="text-white font-semibold mb-1">{t('level')}</h3>
                <p className="text-white/70 text-sm">Advanced</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              <Link
                href="/lessons"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <BookOpen className="w-5 h-5" />
                <span>{t('lessons')}</span>
              </Link>

              <Link
                href="/quiz"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <Trophy className="w-5 h-5" />
                <span>{t('quiz')}</span>
              </Link>

              <Link
                href="/leaderboard"
                className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <Users className="w-5 h-5" />
                <span>{t('leaderboard')}</span>
              </Link>

              <Link
                href="/ai-coach"
                className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <Brain className="w-5 h-5" />
                <span>{t('aiCoach')}</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}