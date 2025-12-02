import React, { useState, useCallback, useMemo } from 'react';
import { useLanguage } from '../LanguageContext.jsx';

const AnalogMultimeterSimulator = () => {
  const { t } = useLanguage();
  const [needlePosition, setNeedlePosition] = useState(50);
  const [selectedRange, setSelectedRange] = useState('DCV-50');
  const [selectedFunction, setSelectedFunction] = useState('DCV');

  const ranges = {
    DCV: [
      { id: 'DCV-0.25', label: '0.25V', max: 0.25, scale: 'low' },
      { id: 'DCV-2.5', label: '2.5V', max: 2.5, scale: 'low' },
      { id: 'DCV-10', label: '10V', max: 10, scale: 'mid' },
      { id: 'DCV-50', label: '50V', max: 50, scale: 'mid' },
      { id: 'DCV-250', label: '250V', max: 250, scale: 'high' },
      { id: 'DCV-1000', label: '1000V', max: 1000, scale: 'high' },
    ],
    ACV: [
      { id: 'ACV-10', label: '10V', max: 10, scale: 'mid' },
      { id: 'ACV-50', label: '50V', max: 50, scale: 'mid' },
      { id: 'ACV-250', label: '250V', max: 250, scale: 'high' },
      { id: 'ACV-1000', label: '1000V', max: 1000, scale: 'high' },
    ],
    DCmA: [
      { id: 'DCmA-0.05', label: '50µA', max: 0.05, scale: 'low' },
      { id: 'DCmA-2.5', label: '2.5mA', max: 2.5, scale: 'low' },
      { id: 'DCmA-25', label: '25mA', max: 25, scale: 'mid' },
      { id: 'DCmA-250', label: '250mA', max: 250, scale: 'high' },
    ],
    OHM: [
      { id: 'OHM-x1', label: 'Ω×1', multiplier: 1, scale: 'ohm' },
      { id: 'OHM-x10', label: 'Ω×10', multiplier: 10, scale: 'ohm' },
      { id: 'OHM-x100', label: 'Ω×100', multiplier: 100, scale: 'ohm' },
      { id: 'OHM-x1k', label: 'Ω×1K', multiplier: 1000, scale: 'ohm' },
    ],
  };

  const ohmScaleValues = [0, 1, 2, 3, 4, 5, 6, 8, 10, 15, 20, 30, 50, 100, 200, '∞'];

  const getCurrentRange = () => {
    const allRanges = Object.values(ranges).flat();
    return allRanges.find(r => r.id === selectedRange) || ranges.DCV[3];
  };

  const calculateValue = useCallback((position, range) => {
    if (range.scale === 'ohm') {
      const normalizedPos = 100 - position;
      const ohmValue = Math.pow(normalizedPos / 100, 2) * 200;
      return ohmValue * (range.multiplier || 1);
    }
    return (position / 100) * range.max;
  }, []);

  const formatValue = (value, range) => {
    if (range.scale === 'ohm') {
      if (value >= 1000000) return `${(value / 1000000).toFixed(2)} MΩ`;
      if (value >= 1000) return `${(value / 1000).toFixed(2)} kΩ`;
      return `${value.toFixed(1)} Ω`;
    }
    if (range.id?.includes('µA')) return `${value.toFixed(3)} µA`;
    if (range.id?.includes('mA') || range.max < 1) return `${value.toFixed(3)} mA`;
    return `${value.toFixed(3)} ${selectedFunction === 'ACV' ? 'V AC' : selectedFunction === 'DCV' ? 'V DC' : 'mA'}`;
  };

  const currentRange = getCurrentRange();
  const currentValue = calculateValue(needlePosition, currentRange);

  const needleAngle = useMemo(() => {
    if (currentRange.scale === 'ohm') {
      return -45 + ((100 - needlePosition) / 100) * 90;
    }
    return -45 + (needlePosition / 100) * 90;
  }, [needlePosition, currentRange]);

  const handleSliderChange = (e) => {
    setNeedlePosition(Number(e.target.value));
  };

  // Allow typing a reading like "5.000 V AC" or "250 mA" or "2.2 kΩ"
  const [typedReading, setTypedReading] = useState('');

  const parseTypedReading = useCallback((text) => {
    if (!text) return;
    const s = text.trim();
    // Match patterns like: 5, 5.000, 250 mA, 10 V AC, 2.2 kΩ
    const re = /^\s*(?<num>[-+]?\d+(?:[.,]\d+)?)\s*(?<unit>kΩ|MΩ|Ω|mA|µA|V)?\s*(?<acdc>AC|DC)?\s*$/i;
    const m = s.match(re);
    if (!m || !m.groups) return;
    const rawNum = m.groups.num.replace(',', '.');
    let value = parseFloat(rawNum);
    const unit = (m.groups.unit || '').toUpperCase();
    const acdc = (m.groups.acdc || '').toUpperCase();

    // Determine function and normalize value based on unit multipliers
    let func = selectedFunction;
    let rangeList = ranges[func];

    if (unit) {
      // If unit provided, override function accordingly
      if (unit === 'V') {
        func = acdc === 'AC' ? 'ACV' : 'DCV';
        rangeList = ranges[func];
      } else if (unit === 'MA' || unit === 'µA') {
        func = 'DCmA';
        if (unit === 'µA') value = value / 1000; // µA to mA
        rangeList = ranges.DCmA;
      } else if (unit === 'Ω' || unit === 'KΩ' || unit === 'MΩ') {
        func = 'OHM';
        if (unit === 'KΩ') value = value * 1000;
        if (unit === 'MΩ') value = value * 1000000;
        rangeList = ranges.OHM;
      }
    }

    // If no unit given: treat as value in currently selected function's units
    // Use currently selected range if it fits; otherwise choose the smallest fitting range
    let targetRange = rangeList.find(r => r.id === selectedRange) || rangeList[0];
    if (func === 'OHM') {
      // For OHM, we pick multiplier so that value is within 0..200*multiplier
      const fitsCurrent = value <= 200 * (targetRange.multiplier || 1);
      const candidates = fitsCurrent ? [targetRange] : rangeList.filter(r => value <= 200 * (r.multiplier || 1));
      targetRange = (candidates[0] || rangeList[rangeList.length - 1]);
      // Compute needle position for OHM scale (inverse, nonlinear)
      const localValue = value / (targetRange.multiplier || 1);
      const clampedLocal = Math.max(0, Math.min(200, localValue));
      // Inverse quadratic mapping from value back to position: value ≈ ((100-pos)/100)^2 * 200
      // Solve for pos: (100 - pos)/100 = sqrt(value/200)
      const t = Math.sqrt(clampedLocal / 200);
      const pos = 100 - Math.max(0, Math.min(100, t * 100));
      setSelectedFunction(func);
      setSelectedRange(targetRange.id);
      setNeedlePosition(Number(pos.toFixed(1)));
      return;
    } else {
      // Voltage/current: pick smallest range max >= value
      const fitsCurrent = value <= (targetRange.max || Infinity);
      const candidates = fitsCurrent ? [targetRange] : rangeList.filter(r => value <= r.max);
      targetRange = (candidates[0] || rangeList[rangeList.length - 1]);
      const pos = Math.max(0, Math.min(100, (value / targetRange.max) * 100));
      setSelectedFunction(func);
      setSelectedRange(targetRange.id);
      setNeedlePosition(Number(pos.toFixed(1)));
      return;
    }
  }, [ranges, selectedFunction]);

  const handleFunctionChange = (func) => {
    setSelectedFunction(func);
    setSelectedRange(ranges[func][0].id);
  };

  const getScaleTranslations = () => {
    const currentRanges = ranges[selectedFunction] || [];
    return currentRanges.map(range => ({
      ...range,
      value: calculateValue(needlePosition, range),
      formatted: formatValue(calculateValue(needlePosition, range), range),
    }));
  };

  const getVersionConversions = () => {
    const value = currentValue;
    const tolerance = 0.03;
    return [
      { label: t('conversions.digitalDisplay'), value: value.toFixed(4), unit: currentRange.scale === 'ohm' ? 'Ω' : selectedFunction === 'DCmA' ? 'mA' : 'V' },
      { label: t('conversions.minTolerance'), value: (value * (1 - tolerance)).toFixed(4), unit: '' },
      { label: t('conversions.maxTolerance'), value: (value * (1 + tolerance)).toFixed(4), unit: '' },
      { label: t('conversions.scaleReading'), value: `${needlePosition.toFixed(1)}%`, unit: t('controls.ofScale') },
      { label: t('conversions.accuracyClass'), value: currentRange.scale === 'high' ? '1.5' : '2.5', unit: '' },
    ];
  };

  const ScaleArc = ({ radius, startAngle, endAngle, color, width = 3 }) => {
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    const cx = 180, cy = 200;
    
    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);
    
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    
    return (
      <path
        d={`M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
      />
    );
  };

  const ScaleTick = ({ angle, length, radius, label, labelOffset = 15, color = '#1a1a1a', thickness = 2 }) => {
    const rad = (angle * Math.PI) / 180;
    const cx = 180, cy = 200;
    
    const x1 = cx + radius * Math.cos(rad);
    const y1 = cy + radius * Math.sin(rad);
    const x2 = cx + (radius - length) * Math.cos(rad);
    const y2 = cy + (radius - length) * Math.sin(rad);
    const labelX = cx + (radius - length - labelOffset) * Math.cos(rad);
    const labelY = cy + (radius - length - labelOffset) * Math.sin(rad);
    
    return (
      <g>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={thickness} />
        {label && (
          <text x={labelX} y={labelY} textAnchor="middle" dominantBaseline="middle" 
                fontSize="10" fontWeight="600" fill={color} fontFamily="'Courier Prime', monospace">
            {label}
          </text>
        )}
      </g>
    );
  };

  const generateTicks = (count, radius, majorLength, minorLength, labels = [], color = '#1a1a1a') => {
    const ticks = [];
    for (let i = 0; i <= count; i++) {
      const angle = -135 + (i / count) * 90;
      const isMajor = labels[i] !== undefined;
      ticks.push(
        <ScaleTick
          key={`tick-${radius}-${i}`}
          angle={angle}
          length={isMajor ? majorLength : minorLength}
          radius={radius}
          label={labels[i]}
          color={color}
          thickness={isMajor ? 2 : 1}
        />
      );
    }
    return ticks;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 via-slate-900 to-black p-4 flex flex-col items-center font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&family=Oswald:wght@400;500;600&display=swap');
        
        .meter-body {
          background: linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 50%, #0d0d0d 100%);
          border: 4px solid #333;
          border-radius: 16px;
          box-shadow: 
            0 20px 60px rgba(0,0,0,0.8),
            inset 0 2px 4px rgba(255,255,255,0.1),
            inset 0 -2px 4px rgba(0,0,0,0.5);
        }
        
        .meter-face {
          background: linear-gradient(180deg, #f5f0e6 0%, #e8e0d0 50%, #d8d0c0 100%);
          border: 3px solid #444;
          border-radius: 12px;
          box-shadow: 
            inset 0 4px 20px rgba(0,0,0,0.3),
            inset 0 -2px 10px rgba(255,255,255,0.5),
            0 2px 8px rgba(0,0,0,0.4);
        }
        
        .range-selector {
          background: radial-gradient(circle, #4a4a4a 0%, #2a2a2a 70%, #1a1a1a 100%);
          border: 3px solid #555;
          box-shadow: 
            0 4px 15px rgba(0,0,0,0.6),
            inset 0 2px 4px rgba(255,255,255,0.2),
            inset 0 -2px 4px rgba(0,0,0,0.4);
        }
        
        .range-indicator {
          background: linear-gradient(180deg, #ff6b6b 0%, #c92a2a 100%);
          box-shadow: 0 0 10px rgba(255,107,107,0.5);
        }
        
        .terminal {
          background: radial-gradient(circle at 30% 30%, #d4a574 0%, #8b6914 50%, #5c4a0a 100%);
          border: 2px solid #3d3d3d;
          box-shadow: 
            0 3px 8px rgba(0,0,0,0.5),
            inset 0 1px 2px rgba(255,255,255,0.3);
        }
        
        .button-func {
          background: linear-gradient(180deg, #4a4a4a 0%, #2a2a2a 100%);
          border: 2px solid #555;
          transition: all 0.15s ease;
        }
        
        .button-func:active, .button-func.active {
          background: linear-gradient(180deg, #ff9500 0%, #cc7700 100%);
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .conversion-panel {
          background: linear-gradient(145deg, #1e293b 0%, #0f172a 100%);
          border: 2px solid #334155;
          border-radius: 12px;
        }
        
        .slider-track {
          -webkit-appearance: none;
          appearance: none;
          background: linear-gradient(90deg, #22c55e 0%, #eab308 50%, #ef4444 100%);
          height: 8px;
          border-radius: 4px;
        }
        
        .slider-track::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 28px;
          height: 28px;
          background: linear-gradient(145deg, #f8fafc 0%, #cbd5e1 100%);
          border: 3px solid #64748b;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
        
        .slider-track::-moz-range-thumb {
          width: 28px;
          height: 28px;
          background: linear-gradient(145deg, #f8fafc 0%, #cbd5e1 100%);
          border: 3px solid #64748b;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
      `}</style>

      <h1 className="text-2xl font-bold text-amber-400 mb-4 tracking-wider" style={{ fontFamily: "'Oswald', sans-serif" }}>
        {t('title')}
      </h1>

      <div className="meter-body p-4 w-full max-w-md">
        <div className="text-center mb-2">
          <span className="text-amber-500 text-xs tracking-widest font-semibold" style={{ fontFamily: "'Oswald', sans-serif" }}>
            {t('model')}
          </span>
        </div>

        <div className="meter-face p-4 relative overflow-hidden">
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

        <div className="mt-4 flex justify-center gap-2 flex-wrap">
          {['DCV', 'ACV', 'DCmA', 'OHM'].map(func => (
            <button
              key={func}
              onClick={() => handleFunctionChange(func)}
              className={`button-func px-4 py-2 rounded-lg text-white font-bold text-sm ${selectedFunction === func ? 'active' : ''}`}
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              {t(`functions.${func}`)}
            </button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {ranges[selectedFunction]?.map(range => (
            <button
              key={range.id}
              onClick={() => setSelectedRange(range.id)}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedRange === range.id
                  ? 'bg-amber-500 text-black shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              style={{ fontFamily: "'Courier Prime', monospace" }}
            >
              {range.label}
            </button>
          ))}
        </div>

        <div className="mt-4 flex justify-around">
          {[
            { key: 'com', label: t('terminals.com') },
            { key: 'positive', label: t('terminals.positive') },
            { key: 'tenA', label: t('terminals.tenA') }
          ].map(({ key, label }) => (
            <div key={key} className="flex flex-col items-center">
              <div className="terminal w-8 h-8 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-black rounded-full" />
              </div>
              <span className="text-xs text-gray-400 mt-1 font-semibold" style={{ fontFamily: "'Courier Prime', monospace" }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-md mt-4 px-4">
        <label className="block text-amber-400 text-sm font-semibold mb-2" style={{ fontFamily: "'Oswald', sans-serif" }}>
          {t('controls.needlePosition')}
        </label>
        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={needlePosition}
          onChange={handleSliderChange}
          className="slider-track w-full cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1" style={{ fontFamily: "'Courier Prime', monospace" }}>
          <span>0%</span>
          <span className="text-amber-400 font-bold text-lg">{needlePosition.toFixed(1)}%</span>
          <span>100%</span>
        </div>

        <div className="mt-4">
          <label className="block text-amber-400 text-sm font-semibold mb-2" style={{ fontFamily: "'Oswald', sans-serif" }}>
            {t('controls.typeReading')}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={typedReading}
              onChange={(e) => setTypedReading(e.target.value)}
              placeholder={`vd: 5.000 (${t(`functions.${selectedFunction}`)}, ${getCurrentRange().label})`}
              className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-slate-200"
              style={{ fontFamily: "'Courier Prime', monospace" }}
            />
            <button
              onClick={() => parseTypedReading(typedReading)}
              className="px-3 py-2 rounded-md bg-amber-500 text-black font-bold"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              {t('controls.set')}
            </button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md mt-4 conversion-panel p-4">
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
          {getScaleTranslations().map(item => (
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
          {getVersionConversions().map((item, i) => (
            <div key={i} className="flex justify-between items-center bg-slate-700/30 px-3 py-2 rounded-lg">
              <span className="text-gray-400 text-sm">{item.label}</span>
              <span className="text-cyan-400 font-bold" style={{ fontFamily: "'Courier Prime', monospace" }}>
                {item.value} {item.unit}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-md mt-4 text-center text-gray-500 text-xs pb-4" style={{ fontFamily: "'Courier Prime', monospace" }}>
        <p>{t('footer.description')}</p>
        <p>{t('footer.purpose')}</p>
      </div>
    </div>
  );
};

export default AnalogMultimeterSimulator;