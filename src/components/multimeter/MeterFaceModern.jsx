import React from 'react';
import { useLanguage } from '../../LanguageContext.jsx';
import { ScaleArc, generateTicks } from './ScaleComponents.jsx';

export const MeterFaceModern = ({ needleAngle }) => {
  const { t } = useLanguage();

  return (
    <div className="meter-face-modern p-2 relative overflow-hidden bg-white rounded-lg border-2 border-gray-300">
      <svg viewBox="0 0 360 220" className="w-full">
        <defs>
          <linearGradient id="needleGradModern" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1a1a1a" />
            <stop offset="50%" stopColor="#222" />
            <stop offset="100%" stopColor="#000" />
          </linearGradient>
          <filter id="needleShadowModern" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="1" dy="1" stdDeviation="1.5" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* CE marking in top right */}
        <text x="320" y="20" textAnchor="middle" fontSize="10" fill="#333" fontWeight="bold" fontFamily="'Arial', sans-serif">
          CE
        </text>

        {/* Brand name on left in red */}
        <text x="35" y="90" textAnchor="middle" fontSize="7" fill="#d92027" fontWeight="bold" fontFamily="'Arial', sans-serif" letterSpacing="0.5">
          MULTIMETER
        </text>
        <text x="35" y="100" textAnchor="middle" fontSize="7" fill="#d92027" fontWeight="bold" fontFamily="'Arial', sans-serif" letterSpacing="0.5">
          YX-360TR
        </text>

        {/* Ohm Scale - Outermost (Red) */}
        <ScaleArc radius={145} startAngle={-135} endAngle={-45} color="#d92027" width={3} />
        {generateTicks(20, 145, 12, 6, ['∞', '', '200', '', '100', '', '50', '', '30', '', '20', '', '15', '', '10', '', '6', '', '4', '', '0'], '#d92027')}
        <text x="310" y="85" fontSize="8" fill="#d92027" fontWeight="bold" fontFamily="'Arial', sans-serif">Ω×1K</text>

        {/* DCV Scale - Second from outside (Black) */}
        <ScaleArc radius={125} startAngle={-135} endAngle={-45} color="#1a1a1a" width={2.5} />
        {generateTicks(50, 125, 10, 4, ['0', '', '', '', '', '10', '', '', '', '', '20', '', '', '', '', '30', '', '', '', '', '40', '', '', '', '', '50', '', '', '', '', '60', '', '', '', '', '70', '', '', '', '', '80', '', '', '', '', '90', '', '', '', '', '100'], '#1a1a1a')}
        <text x="310" y="105" fontSize="8" fill="#1a1a1a" fontWeight="bold" fontFamily="'Arial', sans-serif">DCV</text>

        {/* ACV Scale - Third from outside (Green) */}
        <ScaleArc radius={105} startAngle={-135} endAngle={-45} color="#2eb82e" width={2.5} />
        {generateTicks(25, 105, 8, 4, ['0', '', '1', '', '2', '', '3', '', '4', '', '5', '', '6', '', '7', '', '8', '', '9', '', '10', '', '', '', '', ''], '#2eb82e')}
        <text x="310" y="125" fontSize="8" fill="#2eb82e" fontWeight="bold" fontFamily="'Arial', sans-serif">ACV</text>

        {/* DCmA Scale - Innermost (Blue) */}
        <ScaleArc radius={85} startAngle={-135} endAngle={-45} color="#0066cc" width={2.5} />
        {generateTicks(25, 85, 8, 4, ['0', '', '', '', '', '50', '', '', '', '', '100', '', '', '', '', '150', '', '', '', '', '200', '', '', '', '', '250'], '#0066cc')}
        <text x="310" y="145" fontSize="8" fill="#0066cc" fontWeight="bold" fontFamily="'Arial', sans-serif">DCmA</text>

        {/* Needle */}
        <g transform={`rotate(${needleAngle}, 180, 200)`} filter="url(#needleShadowModern)">
          <polygon 
            points="180,50 177,195 180,200 183,195" 
            fill="url(#needleGradModern)"
            stroke="#000"
            strokeWidth="0.5"
          />
          <circle cx="180" cy="200" r="10" fill="#333" stroke="#555" strokeWidth="1.5" />
          <circle cx="180" cy="200" r="5" fill="#666" />
          <circle cx="180" cy="200" r="2" fill="#999" />
        </g>

        {/* Mirror strip at bottom */}
        <rect x="130" y="175" width="100" height="12" rx="1" fill="#e8f4f8" stroke="#999" strokeWidth="0.5" />
        <rect x="135" y="178" width="35" height="6" fill="#b8dce8" opacity="0.5" />
        <text x="180" y="184" textAnchor="middle" fontSize="5" fill="#555" fontFamily="'Arial', sans-serif">
          {t('mirror')}
        </text>

        {/* Center dot indicator */}
        <circle cx="180" cy="200" r="1" fill="#d92027" />
      </svg>

      {/* Bottom labels */}
      <div className="absolute bottom-1 left-4 right-4 flex justify-between text-xs">
        <span className="text-gray-700 font-semibold" style={{ fontFamily: "'Arial', sans-serif", fontSize: '10px' }}>-</span>
        <span className="text-gray-500 font-normal" style={{ fontFamily: "'Arial', sans-serif", fontSize: '8px' }}>ANALOG MULTIMETER</span>
        <span className="text-gray-700 font-semibold" style={{ fontFamily: "'Arial', sans-serif", fontSize: '10px' }}>+</span>
      </div>
    </div>
  );
};
