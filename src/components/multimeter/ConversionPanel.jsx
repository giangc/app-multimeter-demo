import React from 'react';
import { useLanguage } from '../../LanguageContext.jsx';

export const ConversionPanel = ({ 
  currentValue, 
  currentRange, 
  selectedFunction,
  formatValue,
  scaleTranslations,
  selectedRange,
  versionConversions
}) => {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-md mx-auto mt-4 conversion-panel p-4">
      <h2 className="text-amber-400 font-bold text-lg mb-3 tracking-wider" style={{ fontFamily: "'Oswald', sans-serif" }}>
        {t('panels.currentReading')}
      </h2>
      <div className="bg-black/50 rounded-lg p-4 mb-4 border border-amber-500/30">
        <div className="text-3xl font-bold text-green-400 text-center" style={{ fontFamily: "'Courier Prime', monospace" }}>
          {formatValue(currentValue, currentRange)}
        </div>
        <div className="text-center text-gray-400 text-sm mt-1">
          {t('controls.range')} {currentRange.label}
        </div>
      </div>

      <h3 className="text-amber-400 font-semibold text-sm mb-2 tracking-wider" style={{ fontFamily: "'Oswald', sans-serif" }}>
        {t('panels.scaleTranslation')}
      </h3>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {scaleTranslations.map(item => (
          <div
            key={item.id}
            className={`p-2 rounded-lg text-center transition-all ${
              item.id === selectedRange
                ? 'bg-amber-500/20 border-2 border-amber-500'
                : 'bg-slate-700/50 border border-slate-600'
            }`}
          >
            <div className="text-xs text-gray-400" style={{ fontFamily: "'Oswald', sans-serif" }}>{item.label}</div>
            <div className={`text-sm font-bold ${item.id === selectedRange ? 'text-amber-400' : 'text-gray-200'}`} 
                 style={{ fontFamily: "'Courier Prime', monospace" }}>
              {item.formatted}
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-amber-400 font-semibold text-sm mb-2 tracking-wider" style={{ fontFamily: "'Oswald', sans-serif" }}>
        {t('panels.versionConversion')}
      </h3>
      <div className="space-y-2">
        {versionConversions.map((item, i) => (
          <div key={i} className="flex justify-between items-center bg-slate-700/30 px-3 py-2 rounded-lg">
            <span className="text-gray-400 text-sm">{item.label}</span>
            <span className="text-cyan-400 font-bold" style={{ fontFamily: "'Courier Prime', monospace" }}>
              {item.value} {item.unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
