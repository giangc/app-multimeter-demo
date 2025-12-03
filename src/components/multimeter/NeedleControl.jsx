import React from 'react';
import { useLanguage } from '../../LanguageContext.jsx';

export const NeedleControl = ({ needlePosition, onPositionChange }) => {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-md mx-auto">
      <label className="block text-amber-400 text-sm font-semibold mb-2" style={{ fontFamily: "'Oswald', sans-serif" }}>
        {t('controls.needlePosition')}
      </label>
      <input
        type="range"
        min="0"
        max="100"
        step="0.1"
        value={needlePosition}
        onChange={onPositionChange}
        className="slider-track w-full cursor-pointer"
      />
      <div className="flex justify-between text-xs text-gray-400 mt-1" style={{ fontFamily: "'Courier Prime', monospace" }}>
        <span>0%</span>
        <span className="text-amber-400 font-bold text-lg">{needlePosition.toFixed(1)}%</span>
        <span>100%</span>
      </div>
    </div>
  );
};
