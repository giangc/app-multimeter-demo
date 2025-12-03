export const calculateValue = (position, range) => {
  if (range.scale === 'ohm') {
    const normalizedPos = 100 - position;
    const ohmValue = Math.pow(normalizedPos / 100, 2) * 200;
    return ohmValue * (range.multiplier || 1);
  }
  return (position / 100) * range.max;
};

export const formatValue = (value, range, selectedFunction) => {
  if (range.scale === 'ohm') {
    if (value >= 1000000) return `${(value / 1000000).toFixed(2)} MΩ`;
    if (value >= 1000) return `${(value / 1000).toFixed(2)} kΩ`;
    return `${value.toFixed(1)} Ω`;
  }
  if (range.id?.includes('µA')) return `${value.toFixed(3)} µA`;
  if (range.id?.includes('mA') || range.max < 1) return `${value.toFixed(3)} mA`;
  return `${value.toFixed(3)} ${selectedFunction === 'ACV' ? 'V AC' : selectedFunction === 'DCV' ? 'V DC' : 'mA'}`;
};

export const calculateNeedleAngle = (needlePosition, currentRange) => {
  if (currentRange.scale === 'ohm') {
    return -45 + ((100 - needlePosition) / 100) * 90;
  }
  return -45 + (needlePosition / 100) * 90;
};

export const parseTypedReading = (text, ranges, selectedFunction, selectedRange) => {
  if (!text) return null;
  const s = text.trim();
  const re = /^\s*(?<num>[-+]?\d+(?:[.,]\d+)?)\s*(?<unit>kΩ|MΩ|Ω|mA|µA|V)?\s*(?<acdc>AC|DC)?\s*$/i;
  const m = s.match(re);
  if (!m || !m.groups) return null;
  
  const rawNum = m.groups.num.replace(',', '.');
  let value = parseFloat(rawNum);
  const unit = (m.groups.unit || '').toUpperCase();
  const acdc = (m.groups.acdc || '').toUpperCase();

  let func = selectedFunction;
  let rangeList = ranges[func];

  if (unit) {
    if (unit === 'V') {
      func = acdc === 'AC' ? 'ACV' : 'DCV';
      rangeList = ranges[func];
    } else if (unit === 'MA' || unit === 'µA') {
      func = 'DCmA';
      if (unit === 'µA') value = value / 1000;
      rangeList = ranges.DCmA;
    } else if (unit === 'Ω' || unit === 'KΩ' || unit === 'MΩ') {
      func = 'OHM';
      if (unit === 'KΩ') value = value * 1000;
      if (unit === 'MΩ') value = value * 1000000;
      rangeList = ranges.OHM;
    }
  }

  let targetRange = rangeList.find(r => r.id === selectedRange) || rangeList[0];
  
  if (func === 'OHM') {
    const fitsCurrent = value <= 200 * (targetRange.multiplier || 1);
    const candidates = fitsCurrent ? [targetRange] : rangeList.filter(r => value <= 200 * (r.multiplier || 1));
    targetRange = (candidates[0] || rangeList[rangeList.length - 1]);
    
    const localValue = value / (targetRange.multiplier || 1);
    const clampedLocal = Math.max(0, Math.min(200, localValue));
    const t = Math.sqrt(clampedLocal / 200);
    const pos = 100 - Math.max(0, Math.min(100, t * 100));
    
    return {
      function: func,
      range: targetRange.id,
      position: Number(pos.toFixed(1))
    };
  } else {
    const fitsCurrent = value <= (targetRange.max || Infinity);
    const candidates = fitsCurrent ? [targetRange] : rangeList.filter(r => value <= r.max);
    targetRange = (candidates[0] || rangeList[rangeList.length - 1]);
    const pos = Math.max(0, Math.min(100, (value / targetRange.max) * 100));
    
    return {
      function: func,
      range: targetRange.id,
      position: Number(pos.toFixed(1))
    };
  }
};
