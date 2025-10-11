'use client';

import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageDebugger() {
  const { currentLanguage, isRTL } = useLanguage();
  
  return (
    <div className="fixed top-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs z-50">
      <div>Current Language: {currentLanguage.name}</div>
      <div>Code: {currentLanguage.code}</div>
      <div>RTL: {isRTL ? 'Yes' : 'No'}</div>
      <div>Direction: {isRTL ? 'rtl' : 'ltr'}</div>
    </div>
  );
}
