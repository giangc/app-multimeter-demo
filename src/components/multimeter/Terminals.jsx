import React from 'react';
import { useLanguage } from '../../LanguageContext.jsx';

export const Terminals = () => {
  const { t } = useLanguage();

  return (
    <div className="mt-2 flex justify-around">
      {[
        { key: 'com', label: t('terminals.com') },
        { key: 'positive', label: t('terminals.positive') },
        { key: 'tenA', label: t('terminals.tenA') }
      ].map(({ key, label }) => (
        <div key={key} className="flex flex-col items-center">
          <div className="terminal w-6 h-6 rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-black rounded-full" />
          </div>
          <span className="text-xs text-gray-400 mt-0.5 font-semibold" style={{ fontFamily: "'Courier Prime', monospace" }}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
};
