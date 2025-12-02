import AnalogMultimeterSimulator from './components/AnalogMultimeterSimulator.jsx';
import { LanguageProvider, useLanguage } from './LanguageContext.jsx';

function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="fixed top-4 right-4 px-4 py-2 bg-amber-500 text-black font-bold rounded-lg shadow-lg hover:bg-amber-600 transition-colors"
      style={{ fontFamily: "'Oswald', sans-serif" }}
    >
      {language === 'en' ? 'VI' : 'EN'}
    </button>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <main className="relative">
        <LanguageToggle />
        <AnalogMultimeterSimulator />
      </main>
    </LanguageProvider>
  );
}