import React from 'react';
import { useLanguage } from '../../LanguageContext.jsx';

export const ReadingInput = ({ typedReading, onReadingChange, onSetReading, selectedFunction, currentRangeLabel }) => {
  const { t } = useLanguage();

  return (
    <div className="mt-4 w-full max-w-md mx-auto">
      <label className="block text-amber-400 text-sm font-semibold mb-2" style={{ fontFamily: "'Oswald', sans-serif" }}>
        {t('controls.typeReading')}
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={typedReading}
          onChange={onReadingChange}
          placeholder={`vd: 5.000 (${t(`functions.${selectedFunction}`)}, ${currentRangeLabel})`}
          className="flex-1 rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-slate-200"
          style={{ fontFamily: "'Courier Prime', monospace" }}
        />
        <button
          onClick={onSetReading}
          className="px-3 py-2 rounded-md bg-amber-500 text-black font-bold whitespace-nowrap"
          style={{ fontFamily: "'Oswald', sans-serif" }}
        >
          {t('controls.set')}
        </button>
      </div>
    </div>
  );
};
