import React, { useState, useCallback } from 'react';
import { useLanguage } from '../LanguageContext.jsx';
import { ranges } from '../constants/multimeterRanges.js';
import { 
  calculateValue, 
  formatValue, 
  calculateNeedleAngle,
  parseTypedReading 
} from '../utils/multimeterCalculations.js';
import { MeterStyles } from './multimeter/MeterStyles.jsx';
import { MeterFace } from './multimeter/MeterFace.jsx';
import { FunctionButtons } from './multimeter/FunctionButtons.jsx';
import { RangeButtons } from './multimeter/RangeButtons.jsx';
import { Terminals } from './multimeter/Terminals.jsx';
import { NeedleControl } from './multimeter/NeedleControl.jsx';
import { ReadingInput } from './multimeter/ReadingInput.jsx';
import { ConversionPanel } from './multimeter/ConversionPanel.jsx';

const AnalogMultimeterSimulator = () => {
  const { t } = useLanguage();
  const [needlePosition, setNeedlePosition] = useState(50);
  const [selectedRange, setSelectedRange] = useState('DCV-50');
  const [selectedFunction, setSelectedFunction] = useState('DCV');
  const [typedReading, setTypedReading] = useState('');

  const getCurrentRange = () => {
    const allRanges = Object.values(ranges).flat();
    return allRanges.find(r => r.id === selectedRange) || ranges.DCV[3];
  };

  const currentRange = getCurrentRange();
  const currentValue = calculateValue(needlePosition, currentRange);
  const needleAngle = calculateNeedleAngle(needlePosition, currentRange);

  const handleSliderChange = (e) => {
    setNeedlePosition(Number(e.target.value));
  };

  const handleParseTypedReading = useCallback(() => {
    const result = parseTypedReading(typedReading, ranges, selectedFunction, selectedRange);
    if (result) {
      setSelectedFunction(result.function);
      setSelectedRange(result.range);
      setNeedlePosition(result.position);
    }
  }, [typedReading, selectedFunction, selectedRange]);

  const handleFunctionChange = (func) => {
    setSelectedFunction(func);
    setSelectedRange(ranges[func][0].id);
  };

  const getScaleTranslations = () => {
    const currentRanges = ranges[selectedFunction] || [];
    return currentRanges.map(range => ({
      ...range,
      value: calculateValue(needlePosition, range),
      formatted: formatValue(calculateValue(needlePosition, range), range, selectedFunction),
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

  return (
    <div className="h-screen bg-gradient-to-b from-slate-800 via-slate-900 to-black flex flex-col font-sans overflow-hidden">
      <MeterStyles />

      {/* Fixed Header and Meter Section */}
      <div className="flex-shrink-0 p-2 flex flex-col items-center">
        <h1 className="text-xl font-bold text-amber-400 mb-2 tracking-wider" style={{ fontFamily: "'Oswald', sans-serif" }}>
          {t('title')}
        </h1>

        <div className="meter-body p-3 w-full max-w-md">
          <div className="text-center mb-1">
            <span className="text-amber-500 text-xs tracking-widest font-semibold" style={{ fontFamily: "'Oswald', sans-serif" }}>
              {t('model')}
            </span>
          </div>

          <MeterFace needleAngle={needleAngle} />

          <FunctionButtons 
            selectedFunction={selectedFunction}
            onFunctionChange={handleFunctionChange}
          />

          <RangeButtons
            ranges={ranges}
            selectedFunction={selectedFunction}
            selectedRange={selectedRange}
            onRangeChange={setSelectedRange}
          />

          <Terminals />
        </div>
      </div>

      {/* Scrollable Controls Section */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <NeedleControl
          needlePosition={needlePosition}
          onPositionChange={handleSliderChange}
        />

        <ReadingInput
          typedReading={typedReading}
          onReadingChange={(e) => setTypedReading(e.target.value)}
          onSetReading={handleParseTypedReading}
          selectedFunction={selectedFunction}
          currentRangeLabel={currentRange.label}
        />

        <ConversionPanel
          currentValue={currentValue}
          currentRange={currentRange}
          selectedFunction={selectedFunction}
          formatValue={(val, range) => formatValue(val, range, selectedFunction)}
          scaleTranslations={getScaleTranslations()}
          selectedRange={selectedRange}
          versionConversions={getVersionConversions()}
        />

        <div className="w-full max-w-md mx-auto mt-4 text-center text-gray-500 text-xs pb-4" style={{ fontFamily: "'Courier Prime', monospace" }}>
          <p>{t('footer.description')}</p>
          <p>{t('footer.purpose')}</p>
        </div>
      </div>
    </div>
  );
};

export default AnalogMultimeterSimulator;