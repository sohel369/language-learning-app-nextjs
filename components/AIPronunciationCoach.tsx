'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, RotateCcw, CheckCircle, XCircle, Brain, Zap } from 'lucide-react';

interface PronunciationResult {
  word: string;
  accuracy: number;
  feedback: string;
  suggestions: string[];
  phonemes: string[];
  stress: number;
  rhythm: number;
}

interface AIPronunciationCoachProps {
  targetWord: string;
  targetLanguage: string;
  onComplete?: (result: PronunciationResult) => void;
  onProgress?: (progress: number) => void;
}

export default function AIPronunciationCoach({ 
  targetWord, 
  targetLanguage, 
  onComplete, 
  onProgress 
}: AIPronunciationCoachProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<PronunciationResult | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Set up audio analysis for visual feedback
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);
      
      // Start audio level monitoring
      monitorAudioLevel();
      
      // Set up media recorder
      mediaRecorderRef.current = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setAttempts(prev => prev + 1);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Microphone access is required for pronunciation practice.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  const monitorAudioLevel = () => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    const updateLevel = () => {
      if (analyserRef.current && isRecording) {
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setAudioLevel(average);
        animationRef.current = requestAnimationFrame(updateLevel);
      }
    };
    
    updateLevel();
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      // Simulate AI processing (in real implementation, this would call an AI service)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock pronunciation analysis
      const mockResult: PronunciationResult = {
        word: targetWord,
        accuracy: Math.random() * 40 + 60, // 60-100% accuracy
        feedback: generateFeedback(targetWord, targetLanguage),
        suggestions: generateSuggestions(targetWord, targetLanguage),
        phonemes: generatePhonemes(targetWord, targetLanguage),
        stress: Math.random() * 0.4 + 0.6, // 60-100% stress accuracy
        rhythm: Math.random() * 0.3 + 0.7  // 70-100% rhythm accuracy
      };
      
      setResult(mockResult);
      setIsProcessing(false);
      
      if (mockResult.accuracy > bestScore) {
        setBestScore(mockResult.accuracy);
      }
      
      onComplete?.(mockResult);
      onProgress?.(mockResult.accuracy);
      
    } catch (error) {
      console.error('Error processing audio:', error);
      setIsProcessing(false);
    }
  };

  const generateFeedback = (word: string, language: string): string => {
    const feedbacks = {
      en: [
        "Good attempt! Try to emphasize the first syllable more.",
        "Nice pronunciation! Work on the vowel sounds.",
        "Great job! Your rhythm is improving.",
        "Good effort! Focus on the consonant sounds."
      ],
      ar: [
        "ممتاز! حاول التركيز على الحروف الصحيحة.",
        "جيد جداً! اعمل على النطق الصحيح للحركات.",
        "مجهود رائع! ركز على مخارج الحروف.",
        "جيد! استمر في التدريب على النطق."
      ]
    };
    
    return feedbacks[language as keyof typeof feedbacks]?.[Math.floor(Math.random() * 4)] || "Good attempt!";
  };

  const generateSuggestions = (word: string, language: string): string[] => {
    const suggestions = {
      en: [
        "Slow down and pronounce each syllable clearly",
        "Focus on the stressed syllable",
        "Practice the vowel sounds",
        "Listen to native speakers"
      ],
      ar: [
        "ركز على مخارج الحروف",
        "تدرب على الحركات",
        "استمع للنطق الصحيح",
        "كرر الكلمة ببطء"
      ]
    };
    
    return suggestions[language as keyof typeof suggestions] || suggestions.en;
  };

  const generatePhonemes = (word: string, language: string): string[] => {
    // Mock phoneme breakdown
    return word.split('').map(char => `/ə/`); // Simplified phoneme representation
  };

  const playTargetAudio = async () => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      // Use Web Speech API for text-to-speech
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(targetWord);
        utterance.lang = targetLanguage === 'ar' ? 'ar-SA' : 'en-US';
        utterance.rate = 0.7;
        utterance.pitch = 1;
        
        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        
        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const resetPractice = () => {
    setResult(null);
    setAttempts(0);
    setBestScore(0);
    setIsProcessing(false);
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return 'text-green-400';
    if (accuracy >= 70) return 'text-yellow-400';
    if (accuracy >= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  const getAccuracyIcon = (accuracy: number) => {
    if (accuracy >= 90) return <CheckCircle className="w-6 h-6 text-green-400" />;
    if (accuracy >= 70) return <CheckCircle className="w-6 h-6 text-yellow-400" />;
    return <XCircle className="w-6 h-6 text-red-400" />;
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Brain className="w-8 h-8 text-purple-400" />
          <h3 className="text-2xl font-bold text-white">AI Pronunciation Coach</h3>
        </div>
        <p className="text-white/70">Practice pronouncing: <span className="font-semibold text-white">{targetWord}</span></p>
      </div>

      {/* Target Word Display */}
      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-white mb-4">{targetWord}</div>
        <button
          onClick={playTargetAudio}
          disabled={isPlaying}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
        >
          {isPlaying ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          <span>{isPlaying ? 'Playing...' : 'Listen'}</span>
        </button>
      </div>

      {/* Recording Interface */}
      <div className="text-center mb-6">
        {!isRecording && !isProcessing && (
          <button
            onClick={startRecording}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full transition-all duration-200 transform hover:scale-105 flex items-center space-x-3 mx-auto"
          >
            <Mic className="w-6 h-6" />
            <span className="text-lg font-semibold">Start Recording</span>
          </button>
        )}

        {isRecording && (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-white font-semibold">Recording...</span>
            </div>
            
            {/* Audio Level Visualization */}
            <div className="flex items-center justify-center space-x-1">
              {Array.from({ length: 10 }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-8 rounded transition-all duration-100 ${
                    audioLevel > i * 25 ? 'bg-red-500' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={stopRecording}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
            >
              <MicOff className="w-5 h-5" />
              <span>Stop Recording</span>
            </button>
          </div>
        )}

        {isProcessing && (
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400"></div>
            <span className="text-white font-semibold">AI is analyzing your pronunciation...</span>
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold text-white">Pronunciation Analysis</h4>
              {getAccuracyIcon(result.accuracy)}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className={`text-2xl font-bold ${getAccuracyColor(result.accuracy)}`}>
                  {Math.round(result.accuracy)}%
                </div>
                <div className="text-white/70 text-sm">Overall Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {Math.round(result.stress * 100)}%
                </div>
                <div className="text-white/70 text-sm">Stress Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {Math.round(result.rhythm * 100)}%
                </div>
                <div className="text-white/70 text-sm">Rhythm Accuracy</div>
              </div>
            </div>
            
            <div className="mb-4">
              <h5 className="text-white font-semibold mb-2">Feedback:</h5>
              <p className="text-white/80">{result.feedback}</p>
            </div>
            
            <div className="mb-4">
              <h5 className="text-white font-semibold mb-2">Suggestions:</h5>
              <ul className="space-y-1">
                {result.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-white/80 text-sm flex items-start space-x-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-white/70 text-sm">
              Attempts: {attempts} | Best Score: {Math.round(bestScore)}%
            </div>
            <button
              onClick={resetPractice}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
