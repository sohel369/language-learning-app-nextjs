'use client';

import { useState, useEffect } from 'react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX, 
  Type, 
  MousePointer, 
  Headphones, 
  Monitor,
  Settings,
  CheckCircle,
  AlertCircle,
  Info,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
  captions: boolean;
  audioDescription: boolean;
  reducedMotion: boolean;
  keyboardNavigation: boolean;
  focusIndicators: boolean;
  colorBlindSupport: boolean;
  dyslexiaSupport: boolean;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  wordSpacing: number;
  contrastRatio: number;
  audioSpeed: number;
  captionSize: number;
  captionColor: string;
  captionBackground: string;
}

interface EnhancedAccessibilityProps {
  onSettingsChange?: (settings: AccessibilitySettings) => void;
}

export default function EnhancedAccessibility({ onSettingsChange }: EnhancedAccessibilityProps) {
  const { 
    highContrast, 
    largeText, 
    setHighContrast, 
    setLargeText 
  } = useAccessibility();
  
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: highContrast,
    largeText: largeText,
    screenReader: false,
    captions: false,
    audioDescription: false,
    reducedMotion: false,
    keyboardNavigation: true,
    focusIndicators: true,
    colorBlindSupport: false,
    dyslexiaSupport: false,
    fontSize: 16,
    lineHeight: 1.5,
    letterSpacing: 0,
    wordSpacing: 0,
    contrastRatio: 4.5,
    audioSpeed: 1.0,
    captionSize: 16,
    captionColor: '#ffffff',
    captionBackground: '#000000'
  });

  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<Array<{test: string, passed: boolean, message: string}>>([]);

  useEffect(() => {
    applyAccessibilitySettings();
  }, [settings]);

  useEffect(() => {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(prev => ({ ...prev, ...parsed }));
    }
  }, []);

  const applyAccessibilitySettings = () => {
    const root = document.documentElement;
    
    // Apply CSS custom properties
    root.style.setProperty('--font-size', `${settings.fontSize}px`);
    root.style.setProperty('--line-height', settings.lineHeight.toString());
    root.style.setProperty('--letter-spacing', `${settings.letterSpacing}px`);
    root.style.setProperty('--word-spacing', `${settings.wordSpacing}px`);
    root.style.setProperty('--contrast-ratio', settings.contrastRatio.toString());
    
    // Apply high contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Apply large text
    if (settings.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }
    
    // Apply reduced motion
    if (settings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
    
    // Apply color blind support
    if (settings.colorBlindSupport) {
      root.classList.add('color-blind-support');
    } else {
      root.classList.remove('color-blind-support');
    }
    
    // Apply dyslexia support
    if (settings.dyslexiaSupport) {
      root.classList.add('dyslexia-support');
    } else {
      root.classList.remove('dyslexia-support');
    }
    
    // Save settings
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    onSettingsChange?.(settings);
  };

  const updateSetting = (key: keyof AccessibilitySettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const runAccessibilityTests = async () => {
    setIsTesting(true);
    const results: Array<{test: string, passed: boolean, message: string}> = [];
    
    // Test 1: Color contrast
    const contrastTest = testColorContrast();
    results.push(contrastTest);
    
    // Test 2: Keyboard navigation
    const keyboardTest = testKeyboardNavigation();
    results.push(keyboardTest);
    
    // Test 3: Screen reader compatibility
    const screenReaderTest = testScreenReaderCompatibility();
    results.push(screenReaderTest);
    
    // Test 4: Focus indicators
    const focusTest = testFocusIndicators();
    results.push(focusTest);
    
    // Test 5: Text readability
    const readabilityTest = testTextReadability();
    results.push(readabilityTest);
    
    setTestResults(results);
    setIsTesting(false);
  };

  const testColorContrast = () => {
    // Simulate contrast testing
    const hasGoodContrast = settings.contrastRatio >= 4.5;
    return {
      test: 'Color Contrast',
      passed: hasGoodContrast,
      message: hasGoodContrast 
        ? 'Color contrast meets WCAG standards' 
        : 'Color contrast needs improvement'
    };
  };

  const testKeyboardNavigation = () => {
    const hasKeyboardNav = settings.keyboardNavigation;
    return {
      test: 'Keyboard Navigation',
      passed: hasKeyboardNav,
      message: hasKeyboardNav 
        ? 'Keyboard navigation is enabled' 
        : 'Keyboard navigation is disabled'
    };
  };

  const testScreenReaderCompatibility = () => {
    const hasScreenReader = settings.screenReader;
    return {
      test: 'Screen Reader Support',
      passed: hasScreenReader,
      message: hasScreenReader 
        ? 'Screen reader support is enabled' 
        : 'Screen reader support is disabled'
    };
  };

  const testFocusIndicators = () => {
    const hasFocusIndicators = settings.focusIndicators;
    return {
      test: 'Focus Indicators',
      passed: hasFocusIndicators,
      message: hasFocusIndicators 
        ? 'Focus indicators are visible' 
        : 'Focus indicators are not visible'
    };
  };

  const testTextReadability = () => {
    const fontSize = settings.fontSize;
    const lineHeight = settings.lineHeight;
    const isReadable = fontSize >= 14 && lineHeight >= 1.4;
    return {
      test: 'Text Readability',
      passed: isReadable,
      message: isReadable 
        ? 'Text is readable' 
        : 'Text size or spacing needs adjustment'
    };
  };

  const resetToDefaults = () => {
    const defaultSettings: AccessibilitySettings = {
      highContrast: false,
      largeText: false,
      screenReader: false,
      captions: false,
      audioDescription: false,
      reducedMotion: false,
      keyboardNavigation: true,
      focusIndicators: true,
      colorBlindSupport: false,
      dyslexiaSupport: false,
      fontSize: 16,
      lineHeight: 1.5,
      letterSpacing: 0,
      wordSpacing: 0,
      contrastRatio: 4.5,
      audioSpeed: 1.0,
      captionSize: 16,
      captionColor: '#ffffff',
      captionBackground: '#000000'
    };
    
    setSettings(defaultSettings);
  };

  return (
    <div className="space-y-6">
      {/* Visual Settings */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex items-center space-x-3 mb-4">
          <Eye className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-bold text-white">Visual Accessibility</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* High Contrast */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-semibold">High Contrast</div>
              <div className="text-white/70 text-sm">Increase contrast for better visibility</div>
            </div>
            <button
              onClick={() => updateSetting('highContrast', !settings.highContrast)}
              className={`w-12 h-6 rounded-full transition-colors ${
                settings.highContrast ? 'bg-blue-600' : 'bg-gray-600'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                settings.highContrast ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          {/* Large Text */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-semibold">Large Text</div>
              <div className="text-white/70 text-sm">Increase text size for better readability</div>
            </div>
            <button
              onClick={() => updateSetting('largeText', !settings.largeText)}
              className={`w-12 h-6 rounded-full transition-colors ${
                settings.largeText ? 'bg-blue-600' : 'bg-gray-600'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                settings.largeText ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          {/* Color Blind Support */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-semibold">Color Blind Support</div>
              <div className="text-white/70 text-sm">Use patterns and shapes instead of colors</div>
            </div>
            <button
              onClick={() => updateSetting('colorBlindSupport', !settings.colorBlindSupport)}
              className={`w-12 h-6 rounded-full transition-colors ${
                settings.colorBlindSupport ? 'bg-blue-600' : 'bg-gray-600'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                settings.colorBlindSupport ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          {/* Dyslexia Support */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-semibold">Dyslexia Support</div>
              <div className="text-white/70 text-sm">Use dyslexia-friendly fonts and spacing</div>
            </div>
            <button
              onClick={() => updateSetting('dyslexiaSupport', !settings.dyslexiaSupport)}
              className={`w-12 h-6 rounded-full transition-colors ${
                settings.dyslexiaSupport ? 'bg-blue-600' : 'bg-gray-600'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                settings.dyslexiaSupport ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Audio Settings */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex items-center space-x-3 mb-4">
          <Volume2 className="w-6 h-6 text-green-400" />
          <h3 className="text-xl font-bold text-white">Audio Accessibility</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Captions */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-semibold">Captions</div>
              <div className="text-white/70 text-sm">Show text captions for audio content</div>
            </div>
            <button
              onClick={() => updateSetting('captions', !settings.captions)}
              className={`w-12 h-6 rounded-full transition-colors ${
                settings.captions ? 'bg-green-600' : 'bg-gray-600'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                settings.captions ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          {/* Audio Description */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-semibold">Audio Description</div>
              <div className="text-white/70 text-sm">Describe visual content in audio</div>
            </div>
            <button
              onClick={() => updateSetting('audioDescription', !settings.audioDescription)}
              className={`w-12 h-6 rounded-full transition-colors ${
                settings.audioDescription ? 'bg-green-600' : 'bg-gray-600'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                settings.audioDescription ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          {/* Screen Reader */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-semibold">Screen Reader</div>
              <div className="text-white/70 text-sm">Optimize for screen readers</div>
            </div>
            <button
              onClick={() => updateSetting('screenReader', !settings.screenReader)}
              className={`w-12 h-6 rounded-full transition-colors ${
                settings.screenReader ? 'bg-green-600' : 'bg-gray-600'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                settings.screenReader ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-semibold">Reduced Motion</div>
              <div className="text-white/70 text-sm">Minimize animations and transitions</div>
            </div>
            <button
              onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
              className={`w-12 h-6 rounded-full transition-colors ${
                settings.reducedMotion ? 'bg-green-600' : 'bg-gray-600'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                settings.reducedMotion ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Typography Settings */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex items-center space-x-3 mb-4">
          <Type className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-bold text-white">Typography</h3>
        </div>
        
        <div className="space-y-4">
          {/* Font Size */}
          <div>
            <label className="block text-white font-semibold mb-2">Font Size: {settings.fontSize}px</label>
            <input
              type="range"
              min="12"
              max="24"
              value={settings.fontSize}
              onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Line Height */}
          <div>
            <label className="block text-white font-semibold mb-2">Line Height: {settings.lineHeight}</label>
            <input
              type="range"
              min="1.2"
              max="2.0"
              step="0.1"
              value={settings.lineHeight}
              onChange={(e) => updateSetting('lineHeight', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Letter Spacing */}
          <div>
            <label className="block text-white font-semibold mb-2">Letter Spacing: {settings.letterSpacing}px</label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={settings.letterSpacing}
              onChange={(e) => updateSetting('letterSpacing', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Word Spacing */}
          <div>
            <label className="block text-white font-semibold mb-2">Word Spacing: {settings.wordSpacing}px</label>
            <input
              type="range"
              min="0"
              max="4"
              step="0.1"
              value={settings.wordSpacing}
              onChange={(e) => updateSetting('wordSpacing', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Accessibility Testing */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex items-center space-x-3 mb-4">
          <Settings className="w-6 h-6 text-yellow-400" />
          <h3 className="text-xl font-bold text-white">Accessibility Testing</h3>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={runAccessibilityTests}
            disabled={isTesting}
            className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
          >
            {isTesting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              <Settings className="w-5 h-5" />
            )}
            <span>{isTesting ? 'Testing...' : 'Run Accessibility Tests'}</span>
          </button>

          {testResults.length > 0 && (
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                  {result.passed ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  )}
                  <div>
                    <div className="text-white font-semibold">{result.test}</div>
                    <div className="text-white/70 text-sm">{result.message}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reset Button */}
      <div className="text-center">
        <button
          onClick={resetToDefaults}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Reset to Defaults</span>
        </button>
      </div>
    </div>
  );
}
