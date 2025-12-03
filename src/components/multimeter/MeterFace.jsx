import React from 'react';
import { useLanguage } from '../../LanguageContext.jsx';
import { ScaleArc, generateTicks } from './ScaleComponents.jsx';

export const MeterFace = ({ needleAngle }) => {
  const { t } = useLanguage();

  return (
    <div className="meter-face p-2 relative overflow-hidden">
      <svg viewBox="0 0 360 220" className="w-full">
        <defs>
          <linearGradient id="needleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1a1a1a" />
            <stop offset="50%" stopColor="#ff3333" />
            <stop offset="100%" stopColor="#cc0000" />
          </linearGradient>
          <filter id="needleShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.4" />
          </filter>
        </defs>

        <text x="180" y="20" textAnchor="middle" fontSize="8" fill="#666" fontFamily="'Oswald', sans-serif" letterSpacing="2">
          {t('brand')}
        </text>

        <ScaleArc radius={145} startAngle={-135} endAngle={-45} color="#c92a2a" width={6} />
        {generateTicks(20, 145, 12, 6, ['∞', '', '200', '', '100', '', '50', '', '30', '', '20', '', '15', '', '10', '', '6', '', '4', '', '0'], '#c92a2a')}
        <text x="50" y="85" fontSize="9" fill="#c92a2a" fontWeight="bold" fontFamily="'Courier Prime', monospace">Ω</text>

        <ScaleArc radius={125} startAngle={-135} endAngle={-45} color="#1a1a1a" width={4} />
        {generateTicks(50, 125, 10, 4, ['0', '', '', '', '', '10', '', '', '', '', '20', '', '', '', '', '30', '', '', '', '', '40', '', '', '', '', '50', '', '', '', '', '60', '', '', '', '', '70', '', '', '', '', '80', '', '', '', '', '90', '', '', '', '', '100'])}
        <text x="50" y="105" fontSize="8" fill="#1a1a1a" fontWeight="bold" fontFamily="'Courier Prime', monospace">DCV</text>

        <ScaleArc radius={105} startAngle={-135} endAngle={-45} color="#228b22" width={3} />
        {generateTicks(25, 105, 8, 4, ['0', '', '1', '', '2', '', '3', '', '4', '', '5', '', '6', '', '7', '', '8', '', '9', '', '10', '', '', '', '', ''], '#228b22')}
        <text x="50" y="125" fontSize="8" fill="#228b22" fontWeight="bold" fontFamily="'Courier Prime', monospace">ACV</text>

        <ScaleArc radius={85} startAngle={-135} endAngle={-45} color="#0066cc" width={3} />
        {generateTicks(25, 85, 8, 4, ['0', '', '', '', '', '50', '', '', '', '', '100', '', '', '', '', '150', '', '', '', '', '200', '', '', '', '', '250'], '#0066cc')}
        <text x="50" y="145" fontSize="8" fill="#0066cc" fontWeight="bold" fontFamily="'Courier Prime', monospace">DCmA</text>

        <g transform={`rotate(${needleAngle}, 180, 200)`} filter="url(#needleShadow)">
          <polygon 
            points="180,50 176,195 180,200 184,195" 
            fill="url(#needleGrad)"
          />
          <circle cx="180" cy="200" r="12" fill="#2a2a2a" stroke="#444" strokeWidth="2" />
          <circle cx="180" cy="200" r="6" fill="#666" />
        </g>

        <rect x="140" y="175" width="80" height="15" rx="2" fill="#f5f5f5" stroke="#ccc" />
        <rect x="145" y="178" width="30" height="9" fill="#87ceeb" opacity="0.6" />
        <text x="180" y="186" textAnchor="middle" fontSize="6" fill="#333" fontFamily="'Courier Prime', monospace">
          {t('mirror')}
        </text>
      </svg>

      <div className="absolute bottom-2 left-4 right-4 flex justify-between text-xs">
        <span className="text-gray-600 font-semibold" style={{ fontFamily: "'Courier Prime', monospace" }}>-</span>
        <span className="text-amber-700 font-bold" style={{ fontFamily: "'Oswald', sans-serif" }}>{t('madeIn')}</span>
        <span className="text-gray-600 font-semibold" style={{ fontFamily: "'Courier Prime', monospace" }}>+</span>
      </div>
    </div>
  );
};
