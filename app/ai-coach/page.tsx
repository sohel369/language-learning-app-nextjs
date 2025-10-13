'use client';

import { useState } from 'react';
import AICoach from '../../components/AICoach';
import AICoachLanguageSelector from '../../components/AICoachLanguageSelector';
import { useLanguage } from '../../contexts/LanguageContext';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AICoachPage() {
  const { currentLanguage, isRTL } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'ar' | null>(null);
  const [showLanguageSelector, setShowLanguageSelector] = useState(true);

  const handleLanguageSelect = (language: 'en' | 'ar') => {
    setSelectedLanguage(language);
    setShowLanguageSelector(false);
  };

  const handleBackToSelector = () => {
    setShowLanguageSelector(true);
    setSelectedLanguage(null);
  };

  if (showLanguageSelector) {
    return <AICoachLanguageSelector onLanguageSelect={handleLanguageSelect} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="p-6 pb-24">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="inline-flex items-center space-x-2 text-white hover:text-purple-300">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          
          <button
            onClick={handleBackToSelector}
            className="inline-flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
          >
            <span>Change Language</span>
          </button>
        </div>
        
        <AICoach language={selectedLanguage || 'en'} isRTL={selectedLanguage === 'ar'} />
      </div>
    </div>
  );
}
