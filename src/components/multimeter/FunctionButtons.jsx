import React from 'react';
import { useLanguage } from '../../LanguageContext.jsx';

export const FunctionButtons = ({ selectedFunction, onFunctionChange }) => {
  const { t } = useLanguage();

  return (
    <div className="mt-2 flex justify-center gap-2 flex-wrap">
      {['DCV', 'ACV', 'DCmA', 'OHM'].map(func => (
        <button
          key={func}
          onClick={() => onFunctionChange(func)}
          className={`button-func px-3 py-1.5 rounded-lg text-white font-bold text-xs ${selectedFunction === func ? 'active' : ''}`}
          style={{ fontFamily: "'Oswald', sans-serif" }}
        >
          {t(`functions.${func}`)}
        </button>
      ))}
    </div>
  );
};
