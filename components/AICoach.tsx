'use client';

import { useState, useRef } from 'react';
import { Mic, MicOff, Volume2, Bot, Send, Loader2 } from 'lucide-react';

interface AICoachProps {
  language: string;
  isRTL?: boolean;
}

export default function AICoach({ language, isRTL = false }: AICoachProps) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Array<{
    id: string;
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
  }>>([
    {
      id: '1',
      type: 'ai',
      content: `Hello! I'm your AI language coach. I can help you practice ${language}, correct your pronunciation, and provide personalized learning tips. What would you like to work on today?`,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language === 'ar' ? 'ar-SA' : language === 'nl' ? 'nl-NL' : 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      handleSendMessage(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputText;
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsProcessing(true);

    // Simulate AI response (replace with actual AI API call)
    setTimeout(() => {
      const aiResponse = generateAIResponse(messageText, language);
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai' as const,
        content: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsProcessing(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string, lang: string): string => {
    const responses = {
      pronunciation: [
        "Great pronunciation! Your accent is improving. Try to emphasize the 'th' sound more clearly.",
        "Good attempt! The word should be pronounced with more emphasis on the second syllable.",
        "Excellent! Your pronunciation is very clear. Keep practicing to maintain this level."
      ],
      grammar: [
        "That's a good sentence structure! Remember to use the correct tense for past events.",
        "Almost perfect! Just remember to add the article 'the' before the noun.",
        "Great grammar! You're using the conditional tense correctly."
      ],
      vocabulary: [
        "Excellent word choice! That's a more advanced vocabulary word. Well done!",
        "Good use of vocabulary! You could also use 'magnificent' as a synonym for 'great'.",
        "Perfect! You're expanding your vocabulary nicely. Keep learning new words!"
      ],
      general: [
        "That's a great question! Let me help you understand this concept better.",
        "I can see you're making good progress! Keep up the excellent work.",
        "Wonderful! You're showing real improvement in your language skills."
      ]
    };

    const categories = Object.keys(responses);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const categoryResponses = responses[randomCategory as keyof typeof responses];
    return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
  };

  return (
    <div className="max-w-4xl mx-auto p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">AI Language Coach</h2>
            <p className="text-sm text-gray-400">Practice {language} with personalized feedback</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="bg-gray-800/50 rounded-xl p-6 mb-6 h-96 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-white'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-gray-700 text-white px-4 py-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-gray-800/50 rounded-xl p-4">
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={`Type your message in ${language}...`}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
              disabled={isProcessing}
            />
          </div>
          <button
            onClick={handleVoiceInput}
            disabled={isListening || isProcessing}
            className={`p-3 rounded-lg transition-colors ${
              isListening
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isProcessing}
            className="p-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-gray-400">
            {isListening ? 'Listening...' : 'Click microphone to speak'}
          </p>
          <div className="flex items-center space-x-2">
            <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg">
              <Volume2 className="w-4 h-4 text-white" />
            </button>
            <span className="text-xs text-gray-400">Voice feedback</span>
          </div>
        </div>
      </div>
    </div>
  );
}
