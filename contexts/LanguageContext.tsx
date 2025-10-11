'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Language {
  code: string;
  name: string;
  native: string;
  flag: string;
  isRTL: boolean;
}

interface LanguageContextType {
  currentLanguage: Language;
  setCurrentLanguage: (language: Language) => void;
  isRTL: boolean;
}

const languages: Language[] = [
  { code: 'en', name: 'English', native: 'English', flag: '🇺🇸', isRTL: false },
  { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦', isRTL: true },
  { code: 'nl', name: 'Dutch', native: 'Nederlands', flag: '🇳🇱', isRTL: false },
  { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia', flag: '🇮🇩', isRTL: false },
  { code: 'ms', name: 'Malay', native: 'Bahasa Melayu', flag: '🇲🇾', isRTL: false },
  { code: 'th', name: 'Thai', native: 'ไทย', flag: '🇹🇭', isRTL: false },
  { code: 'km', name: 'Khmer', native: 'ខ្មែរ', flag: '🇰🇭', isRTL: false },
];

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('selected-language');
    if (savedLanguage) {
      const language = languages.find(lang => lang.code === savedLanguage);
      if (language) {
        setCurrentLanguage(language);
      }
    }
  }, []);

  useEffect(() => {
    // Save language to localStorage
    localStorage.setItem('selected-language', currentLanguage.code);
    
    // Update document direction
    document.documentElement.dir = currentLanguage.isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage.code;
  }, [currentLanguage]);

  const handleSetLanguage = (language: Language) => {
    console.log('Context: Setting language to:', language);
    setCurrentLanguage(language);
    // Force a re-render by updating localStorage immediately
    localStorage.setItem('selected-language', language.code);
    document.documentElement.dir = language.isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language.code;
  };

  return (
    <LanguageContext.Provider 
      value={{ 
        currentLanguage, 
        setCurrentLanguage: handleSetLanguage,
        isRTL: currentLanguage.isRTL 
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export { languages };
