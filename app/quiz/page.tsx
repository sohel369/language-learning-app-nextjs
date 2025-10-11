'use client';

import { useState } from 'react';
import QuizComponent from '../../components/QuizComponent';
import { ArrowLeft, Trophy } from 'lucide-react';
import Link from 'next/link';

const sampleQuestions = [
  {
    id: '1',
    question: 'What does "hello" mean in Spanish?',
    options: ['Hola', 'Adiós', 'Gracias', 'Por favor'],
    correct_answer: 0,
    explanation: '"Hola" is the Spanish word for "hello" or "hi".'
  },
  {
    id: '2',
    question: 'Which word means "thank you" in French?',
    options: ['Bonjour', 'Merci', 'Au revoir', 'Excusez-moi'],
    correct_answer: 1,
    explanation: '"Merci" is the French word for "thank you".'
  },
  {
    id: '3',
    question: 'How do you say "good morning" in German?',
    options: ['Guten Tag', 'Guten Morgen', 'Gute Nacht', 'Auf Wiedersehen'],
    correct_answer: 1,
    explanation: '"Guten Morgen" means "good morning" in German.'
  }
];

export default function QuizPage() {
  const [isCompleted, setIsCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);

  const handleQuizComplete = (score: number, time: number) => {
    setFinalScore(score);
    setTimeSpent(time);
    setIsCompleted(true);
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-2xl mx-auto">
          <Link href="/" className="inline-flex items-center space-x-2 text-white mb-6">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          
          <div className="bg-gray-800/50 rounded-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-4">Quiz Complete!</h1>
            <p className="text-gray-400 mb-6">Great job on completing the quiz!</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-white">{finalScore}/{sampleQuestions.length}</div>
                <div className="text-sm text-gray-400">Score</div>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-white">{Math.floor(timeSpent / 60)}m {timeSpent % 60}s</div>
                <div className="text-sm text-gray-400">Time</div>
              </div>
            </div>
            
            <div className="bg-purple-600/20 border border-purple-500 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-bold text-white mb-2">Performance</h3>
              <div className="text-2xl font-bold text-purple-400">
                {Math.round((finalScore / sampleQuestions.length) * 100)}%
              </div>
              <p className="text-sm text-purple-200 mt-2">
                {finalScore === sampleQuestions.length 
                  ? 'Perfect score! You\'re a language master!' 
                  : finalScore >= sampleQuestions.length * 0.8 
                    ? 'Excellent work! You\'re doing great!' 
                    : 'Good effort! Keep practicing to improve.'}
              </p>
            </div>
            
            <div className="flex space-x-4">
              <Link 
                href="/quiz" 
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Retake Quiz
              </Link>
              <Link 
                href="/" 
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center space-x-2 text-white mb-6">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Language Quiz</h1>
          <p className="text-gray-400">Test your language knowledge with interactive questions</p>
        </div>
        
        <QuizComponent 
          questions={sampleQuestions}
          onComplete={handleQuizComplete}
        />
      </div>
    </div>
  );
}
