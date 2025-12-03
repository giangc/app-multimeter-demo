import React from 'react';

export const ScaleArc = ({ radius, startAngle, endAngle, color, width = 3 }) => {
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

export const ScaleTick = ({ angle, length, radius, label, labelOffset = 15, color = '#1a1a1a', thickness = 2 }) => {
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

export const generateTicks = (count, radius, majorLength, minorLength, labels = [], color = '#1a1a1a') => {
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
