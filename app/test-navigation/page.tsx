'use client';

import { useLanguage } from '../../contexts/LanguageContext';
import Link from 'next/link';

export default function TestNavigationPage() {
  const { currentLanguage, setCurrentLanguage, isRTL } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gray-900 p-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <h1 className="text-2xl font-bold text-white mb-4">Navigation Test</h1>
      
      <div className="bg-gray-800 p-4 rounded-lg mb-4">
        <h2 className="text-lg font-semibold text-white mb-2">Current Language Context:</h2>
        <p className="text-gray-300">Language: {currentLanguage.name}</p>
        <p className="text-gray-300">Code: {currentLanguage.code}</p>
        <p className="text-gray-300">RTL: {isRTL ? 'Yes' : 'No'}</p>
        <p className="text-gray-300">Direction: {isRTL ? 'rtl' : 'ltr'}</p>
      </div>
      
      <div className="space-y-4">
        <Link href="/" className="block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Go to Homepage
        </Link>
        
        <Link href="/lessons" className="block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Go to Lessons
        </Link>
        
        <Link href="/test" className="block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          Go to Test Page
        </Link>
      </div>
    </div>
  );
}
