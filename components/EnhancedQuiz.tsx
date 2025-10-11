'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RotateCcw, Volume2, VolumeX, Image, Type, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { createTTS } from '../lib/tts';

interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'audio' | 'image' | 'translation';
  question: string;
  options?: string[];
  correct_answer: number | string | boolean;
  explanation?: string;
  audio_url?: string;
  image_url?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  language: string;
}

interface EnhancedQuizProps {
  questions: QuizQuestion[];
  onComplete: (score: number, timeSpent: number) => void;
  isRTL?: boolean;
  language?: string;
}

export default function EnhancedQuiz({ questions, onComplete, isRTL = false, language = 'en' }: EnhancedQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [isPlaying, setIsPlaying] = useState(false);
  const [fillBlankText, setFillBlankText] = useState('');
  const [tts] = useState(() => createTTS());

  const question = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;

  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [currentQuestion]);

  const handleAnswerSelect = (answer: any) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const isCorrect = checkAnswer(answer);
    if (isCorrect) {
      setScore(score + 1);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const checkAnswer = (answer: any): boolean => {
    switch (question.type) {
      case 'multiple-choice':
        return answer === question.correct_answer;
      case 'true-false':
        return answer === question.correct_answer;
      case 'fill-blank':
        return answer.toLowerCase().trim() === (question.correct_answer as string).toLowerCase().trim();
      case 'translation':
        return answer.toLowerCase().trim() === (question.correct_answer as string).toLowerCase().trim();
      default:
        return false;
    }
  };

  const handlePlayAudio = async () => {
    if (question.audio_url) {
      try {
        setIsPlaying(true);
        const audio = new Audio(question.audio_url);
        audio.play();
        audio.onended = () => setIsPlaying(false);
      } catch (error) {
        console.error('Audio playback error:', error);
        setIsPlaying(false);
      }
    } else if (question.question) {
      // Use TTS for text-to-speech
      try {
        setIsPlaying(true);
        await tts.speak(question.question, language, { rate: 0.8 });
        setTimeout(() => setIsPlaying(false), 2000);
      } catch (error) {
        console.error('TTS error:', error);
        setIsPlaying(false);
      }
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      const totalTime = Math.floor((Date.now() - startTime) / 1000);
      onComplete(score, totalTime);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setFillBlankText('');
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setFillBlankText('');
    setStartTime(Date.now());
  };

  const getQuestionIcon = (type: string) => {
    switch (type) {
      case 'audio': return <Volume2 className="w-5 h-5" />;
      case 'image': return <Image className="w-5 h-5" />;
      case 'translation': return <Type className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const renderQuestion = () => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                  !showResult
                    ? selectedAnswer === index
                      ? 'bg-purple-600 border-purple-500'
                      : 'bg-gray-700 border-gray-600 hover:border-gray-500'
                    : index === question.correct_answer
                    ? 'bg-green-600 border-green-500'
                    : selectedAnswer === index && index !== question.correct_answer
                    ? 'bg-red-600 border-red-500'
                    : 'bg-gray-700 border-gray-600'
                }`}
                disabled={showResult}
              >
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">{option}</span>
                  {showResult && index === question.correct_answer && (
                    <CheckCircle className="w-5 h-5 text-white" />
                  )}
                  {showResult && selectedAnswer === index && index !== question.correct_answer && (
                    <XCircle className="w-5 h-5 text-white" />
                  )}
                </div>
              </button>
            ))}
          </div>
        );

      case 'true-false':
        return (
          <div className="grid grid-cols-2 gap-4">
            {['True', 'False'].map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index === 0)}
                className={`p-6 rounded-lg border-2 text-center transition-all duration-200 ${
                  !showResult
                    ? selectedAnswer === (index === 0)
                      ? 'bg-purple-600 border-purple-500'
                      : 'bg-gray-700 border-gray-600 hover:border-gray-500'
                    : (index === 0) === question.correct_answer
                    ? 'bg-green-600 border-green-500'
                    : selectedAnswer === (index === 0) && (index === 0) !== question.correct_answer
                    ? 'bg-red-600 border-red-500'
                    : 'bg-gray-700 border-gray-600'
                }`}
                disabled={showResult}
              >
                <div className="text-2xl font-bold text-white">{option}</div>
              </button>
            ))}
          </div>
        );

      case 'fill-blank':
        return (
          <div className="space-y-4">
            <input
              type="text"
              value={fillBlankText}
              onChange={(e) => setFillBlankText(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full p-4 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
              disabled={showResult}
            />
            {!showResult && (
              <button
                onClick={() => handleAnswerSelect(fillBlankText)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Submit Answer
              </button>
            )}
          </div>
        );

      case 'translation':
        return (
          <div className="space-y-4">
            <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4">
              <p className="text-blue-200 text-lg">{question.question}</p>
            </div>
            <input
              type="text"
              value={fillBlankText}
              onChange={(e) => setFillBlankText(e.target.value)}
              placeholder="Translate to English..."
              className="w-full p-4 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
              disabled={showResult}
            />
            {!showResult && (
              <button
                onClick={() => handleAnswerSelect(fillBlankText)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Submit Translation
              </button>
            )}
          </div>
        );

      case 'audio':
        return (
          <div className="text-center space-y-6">
            <button
              onClick={handlePlayAudio}
              disabled={isPlaying}
              className="p-6 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 rounded-full transition-colors"
            >
              {isPlaying ? <VolumeX className="w-8 h-8 text-white" /> : <Volume2 className="w-8 h-8 text-white" />}
            </button>
            <p className="text-gray-300">Listen to the audio and select the correct answer</p>
            {question.options && (
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                      !showResult
                        ? selectedAnswer === index
                          ? 'bg-purple-600 border-purple-500'
                          : 'bg-gray-700 border-gray-600 hover:border-gray-500'
                        : index === question.correct_answer
                        ? 'bg-green-600 border-green-500'
                        : selectedAnswer === index && index !== question.correct_answer
                        ? 'bg-red-600 border-red-500'
                        : 'bg-gray-700 border-gray-600'
                    }`}
                    disabled={showResult}
                  >
                    <span className="text-white font-medium">{option}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        );

      case 'image':
        return (
          <div className="space-y-6">
            {question.image_url && (
              <div className="text-center">
                <img 
                  src={question.image_url} 
                  alt="Quiz image"
                  className="max-w-full h-64 object-contain rounded-lg mx-auto"
                />
              </div>
            )}
            {question.options && (
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                      !showResult
                        ? selectedAnswer === index
                          ? 'bg-purple-600 border-purple-500'
                          : 'bg-gray-700 border-gray-600 hover:border-gray-500'
                        : index === question.correct_answer
                        ? 'bg-green-600 border-green-500'
                        : selectedAnswer === index && index !== question.correct_answer
                        ? 'bg-red-600 border-red-500'
                        : 'bg-gray-700 border-gray-600'
                    }`}
                    disabled={showResult}
                  >
                    <span className="text-white font-medium">{option}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return <div>Unsupported question type</div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getDifficultyColor(question.difficulty)}`}>
              {question.difficulty}
            </span>
            <span className="text-sm text-gray-400">{question.category}</span>
          </div>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
        <div className="flex items-center space-x-2 mb-4">
          {getQuestionIcon(question.type)}
          <span className="text-sm text-gray-400 capitalize">{question.type.replace('-', ' ')}</span>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-4">{question.question}</h3>
        
        {question.audio_url && (
          <button 
            onClick={handlePlayAudio}
            disabled={isPlaying}
            className="mb-4 p-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 rounded-lg transition-colors"
          >
            <span className="text-white">
              {isPlaying ? '🔊 Playing...' : '🔊 Play Audio'}
            </span>
          </button>
        )}
      </div>

      {/* Question Content */}
      {renderQuestion()}

      {/* Explanation */}
      {showResult && question.explanation && (
        <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-blue-300 mb-2">Explanation:</h4>
          <p className="text-blue-100">{question.explanation}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-4">
        {showResult && (
          <button
            onClick={handleNext}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
          </button>
        )}
        
        <button
          onClick={handleRestart}
          className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
