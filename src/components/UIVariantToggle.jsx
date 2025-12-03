import React from 'react';
import { useLanguage } from '../LanguageContext.jsx';
import { UI_VARIANTS } from '../constants/uiVariants.js';

export const UIVariantToggle = ({ variant, onVariantChange }) => {
  const { t } = useLanguage();

  return (
    <button
      onClick={() => onVariantChange(variant === UI_VARIANTS.CLASSIC ? UI_VARIANTS.MODERN : UI_VARIANTS.CLASSIC)}
      className="fixed top-4 left-4 px-4 py-2 bg-blue-500 text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 transition-colors"
      style={{ fontFamily: "'Oswald', sans-serif" }}
      title={t('uiVariant.toggle')}
    >
      {variant === UI_VARIANTS.CLASSIC ? t('uiVariant.modern') : t('uiVariant.classic')}
    </button>
  );
};
