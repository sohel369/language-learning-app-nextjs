'use client';

import { useState } from 'react';
import AICoach from '../../components/AICoach';
import { useLanguage } from '../../contexts/LanguageContext';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AICoachPage() {
  const { currentLanguage, isRTL } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="p-6 pb-24">
        <Link href="/" className="inline-flex items-center space-x-2 text-white mb-6 hover:text-purple-300">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>
        
        <AICoach language={currentLanguage.code} isRTL={isRTL} />
      </div>
    </div>
  );
}
