'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, VolumeX, Play, Pause, CheckCircle, Star, Trophy, Target, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '../../contexts/LanguageContext';
import BottomNavigation from '../../components/BottomNavigation';
import confetti from 'canvas-confetti';

interface VocabularyWord {
  id: string;
  english: string;
  arabic: string;
  arabicTransliteration: string;
  audioUrl?: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  mastered: boolean;
}

interface LessonProgress {
  beginner: number;
  intermediate: number;
  advanced: number;
  totalProgress: number;
}

export default function LessonsPage() {
  const { currentLanguage, isRTL } = useLanguage();
  
  console.log('Lessons page current language:', currentLanguage);
  console.log('Lessons page isRTL:', isRTL);
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [masteredWords, setMasteredWords] = useState<Set<string>>(new Set());
  const [lessonProgress, setLessonProgress] = useState<LessonProgress>({
    beginner: 0,
    intermediate: 0,
    advanced: 0,
    totalProgress: 65
  });

  const vocabularyData: VocabularyWord[] = [
    // Beginner Level
    { id: '1', english: 'hello', arabic: 'مَرْحَبًا', arabicTransliteration: 'marhaban', category: 'greetings', difficulty: 'beginner', mastered: false },
    { id: '2', english: 'goodbye', arabic: 'وَدَاعًا', arabicTransliteration: 'wada\'an', category: 'greetings', difficulty: 'beginner', mastered: false },
    { id: '3', english: 'water', arabic: 'مَاءٌ', arabicTransliteration: 'ma\'un', category: 'basics', difficulty: 'beginner', mastered: false },
    { id: '4', english: 'food', arabic: 'طَعَامٌ', arabicTransliteration: 'ta\'amun', category: 'basics', difficulty: 'beginner', mastered: false },
    
    // Intermediate Level
    { id: '5', english: 'beautiful', arabic: 'جَمِيلٌ', arabicTransliteration: 'jameelun', category: 'adjectives', difficulty: 'intermediate', mastered: false },
    { id: '6', english: 'difficult', arabic: 'صَعْبٌ', arabicTransliteration: 'sa\'bun', category: 'adjectives', difficulty: 'intermediate', mastered: false },
    
    // Advanced Level
    { id: '7', english: 'sophisticated', arabic: 'مُعَقَّدٌ', arabicTransliteration: 'mu\'aqqadun', category: 'adjectives', difficulty: 'advanced', mastered: false },
    { id: '8', english: 'magnificent', arabic: 'رَائِعٌ', arabicTransliteration: 'ra\'i\'un', category: 'adjectives', difficulty: 'advanced', mastered: false },
  ];

  const currentWords = vocabularyData.filter(word => word.difficulty === selectedLevel);
  const currentWord = currentWords[currentWordIndex];

  const handlePlayAudio = () => {
    if (currentWord.audioUrl) {
      const audio = new Audio(currentWord.audioUrl);
      setIsPlaying(true);
      audio.play();
      audio.onended = () => setIsPlaying(false);
    } else {
      // Use Web Speech API for text-to-speech
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(
          currentLanguage.code === 'ar' ? currentWord.arabic : currentWord.english
        );
        utterance.lang = currentLanguage.code === 'ar' ? 'ar-SA' : 'en-US';
        utterance.rate = 0.8;
        speechSynthesis.speak(utterance);
        setIsPlaying(true);
        setTimeout(() => setIsPlaying(false), 2000);
      }
    }
  };

  const handleMasterWord = () => {
    if (!masteredWords.has(currentWord.id)) {
      setMasteredWords(prev => new Set([...prev, currentWord.id]));
      
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Update progress
      setLessonProgress(prev => ({
        ...prev,
        [selectedLevel]: prev[selectedLevel] + 1,
        totalProgress: Math.min(prev.totalProgress + 1, 100)
      }));
    }
  };

  const handleNextWord = () => {
    if (currentWordIndex < currentWords.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setShowTranslation(false);
    }
  };

  const handlePrevWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1);
      setShowTranslation(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'from-green-500 to-emerald-600';
      case 'intermediate': return 'from-yellow-500 to-orange-600';
      case 'advanced': return 'from-red-500 to-pink-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'beginner': return '🌱';
      case 'intermediate': return '📚';
      case 'advanced': return '🏆';
      default: return '📖';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="flex items-center space-x-3 text-white hover:text-purple-300 transition-colors">
            <ArrowLeft className="w-6 h-6" />
            <span className="text-lg font-medium">Back to Home</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{currentLanguage.flag}</div>
              <div className="text-sm text-gray-300">{currentLanguage.native}</div>
            </div>
          </div>
        </div>

        {/* Course Progress */}
        <div className="bg-gray-800/50 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white">Course Progress</h1>
            <div className="text-3xl font-bold text-purple-400">{lessonProgress.totalProgress}%</div>
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${lessonProgress.totalProgress}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-300">
            <span>Beginner Level</span>
            <span>{currentWords.length} words</span>
          </div>
        </div>

        {/* Level Selector */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
            <button
              key={level}
              onClick={() => {
                setSelectedLevel(level);
                setCurrentWordIndex(0);
                setShowTranslation(false);
              }}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                selectedLevel === level
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
              }`}
            >
              <div className="text-2xl mb-2">{getLevelIcon(level)}</div>
              <div className="text-sm font-medium text-white capitalize">{level}</div>
              <div className="text-xs text-gray-400">
                {vocabularyData.filter(word => word.difficulty === level).length} words
              </div>
            </button>
          ))}
        </div>

        {/* Current Word */}
        {currentWord && (
          <div className="bg-gray-800/50 rounded-2xl p-8 mb-6">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <button
                  onClick={handlePlayAudio}
                  disabled={isPlaying}
                  className="p-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 rounded-full transition-colors"
                >
                  {isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white" />}
                </button>
                
                <div className="text-4xl font-bold text-white">
                  {currentLanguage.code === 'ar' ? currentWord.arabic : currentWord.english}
                </div>
              </div>
              
              <div className="text-lg text-gray-300 mb-2">
                {currentLanguage.code === 'ar' ? currentWord.arabicTransliteration : currentWord.english}
              </div>
              
              <div className="text-sm text-gray-400 capitalize">{currentWord.category}</div>
            </div>

            {/* Translation Toggle */}
            <div className="text-center mb-6">
              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                {showTranslation ? 'Hide Translation' : 'Show Translation'}
              </button>
            </div>

            {/* Translation */}
            {showTranslation && (
              <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    {currentLanguage.code === 'ar' ? currentWord.english : currentWord.arabic}
                  </div>
                  <div className="text-lg text-gray-300">
                    {currentLanguage.code === 'ar' ? currentWord.arabicTransliteration : currentWord.arabic}
                  </div>
                </div>
              </div>
            )}

            {/* Master Button */}
            <div className="text-center mb-6">
              <button
                onClick={handleMasterWord}
                disabled={masteredWords.has(currentWord.id)}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
                  masteredWords.has(currentWord.id)
                    ? 'bg-green-600 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                {masteredWords.has(currentWord.id) ? (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-6 h-6" />
                    <span>Mastered!</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Star className="w-6 h-6" />
                    <span>Master This Word</span>
                  </div>
                )}
              </button>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevWord}
                disabled={currentWordIndex === 0}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                Previous
              </button>
              
              <div className="text-center">
                <div className="text-sm text-gray-400">Word {currentWordIndex + 1} of {currentWords.length}</div>
                <div className="w-32 bg-gray-700 rounded-full h-2 mt-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentWordIndex + 1) / currentWords.length) * 100}%` }}
                  />
                </div>
              </div>
              
              <button
                onClick={handleNextWord}
                disabled={currentWordIndex === currentWords.length - 1}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Level Progress */}
        <div className="grid grid-cols-3 gap-4">
          {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
            <div key={level} className="bg-gray-800/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white capitalize">{level}</span>
                <span className="text-sm text-gray-400">
                  {lessonProgress[level]}/{vocabularyData.filter(word => word.difficulty === level).length}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 bg-gradient-to-r ${getLevelColor(level)}`}
                  style={{ 
                    width: `${(lessonProgress[level] / vocabularyData.filter(word => word.difficulty === level).length) * 100}%` 
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
