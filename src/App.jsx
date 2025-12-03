import { useState, useEffect } from 'react';
import AnalogMultimeterSimulator from './components/AnalogMultimeterSimulator.jsx';
import { LanguageProvider, useLanguage } from './LanguageContext.jsx';
import { UIVariantToggle } from './components/UIVariantToggle.jsx';
import { UI_VARIANTS } from './constants/uiVariants.js';

function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="fixed top-4 right-4 px-4 py-2 bg-amber-500 text-black font-bold rounded-lg shadow-lg hover:bg-amber-600 transition-colors z-50"
      style={{ fontFamily: "'Oswald', sans-serif" }}
    >
      {language === 'en' ? 'VI' : 'EN'}
    </button>
  );
}

function AppContent() {
  const [uiVariant, setUiVariant] = useState(() => {
    const saved = localStorage.getItem('uiVariant');
    return saved || UI_VARIANTS.CLASSIC;
  });

  useEffect(() => {
    localStorage.setItem('uiVariant', uiVariant);
  }, [uiVariant]);

  return (
    <main className="relative">
      <LanguageToggle />
      <UIVariantToggle variant={uiVariant} onVariantChange={setUiVariant} />
      <AnalogMultimeterSimulator variant={uiVariant} />
    </main>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}