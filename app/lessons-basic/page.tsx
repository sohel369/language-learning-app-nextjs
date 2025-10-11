'use client';

import { useState } from 'react';
import { ArrowLeft, Play, Pause, CheckCircle, Star } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '../../contexts/LanguageContext';

export default function BasicLessonsPage() {
  const { currentLanguage, isRTL } = useLanguage();
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [masteredWords, setMasteredWords] = useState<Set<string>>(new Set());

  const vocabularyData = [
    { id: '1', english: 'hello', arabic: 'مَرْحَبًا', arabicTransliteration: 'marhaban', category: 'greetings', difficulty: 'beginner' as const },
    { id: '2', english: 'goodbye', arabic: 'وَدَاعًا', arabicTransliteration: 'wada\'an', category: 'greetings', difficulty: 'beginner' as const },
    { id: '3', english: 'water', arabic: 'مَاءٌ', arabicTransliteration: 'ma\'un', category: 'basics', difficulty: 'beginner' as const },
  ];

  const currentWords = vocabularyData.filter(word => word.difficulty === selectedLevel);
  const currentWord = currentWords[currentWordIndex];

  const handlePlayAudio = () => {
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
  };

  const handleMasterWord = () => {
    if (!masteredWords.has(currentWord.id)) {
      setMasteredWords(prev => new Set([...prev, currentWord.id]));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="p-6">
        <Link href="/" className="flex items-center space-x-3 text-white mb-6 hover:text-purple-300">
          <ArrowLeft className="w-6 h-6" />
          <span>Back to Home</span>
        </Link>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Basic Lessons</h1>
          <p className="text-gray-400">Current Language: {currentLanguage.name}</p>
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
              <div className="text-2xl mb-2">
                {level === 'beginner' ? '🌱' : level === 'intermediate' ? '📚' : '🏆'}
              </div>
              <div className="text-sm font-medium text-white capitalize">{level}</div>
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
                onClick={() => {
                  if (currentWordIndex > 0) {
                    setCurrentWordIndex(currentWordIndex - 1);
                    setShowTranslation(false);
                  }
                }}
                disabled={currentWordIndex === 0}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                Previous
              </button>
              
              <div className="text-center">
                <div className="text-sm text-gray-400">Word {currentWordIndex + 1} of {currentWords.length}</div>
              </div>
              
              <button
                onClick={() => {
                  if (currentWordIndex < currentWords.length - 1) {
                    setCurrentWordIndex(currentWordIndex + 1);
                    setShowTranslation(false);
                  }
                }}
                disabled={currentWordIndex === currentWords.length - 1}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
