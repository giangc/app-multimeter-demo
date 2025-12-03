import React from 'react';

export const RangeButtons = ({ ranges, selectedFunction, selectedRange, onRangeChange }) => {
  return (
    <div className="mt-2 grid grid-cols-3 gap-1.5">
      {ranges[selectedFunction]?.map(range => (
        <button
          key={range.id}
          onClick={() => onRangeChange(range.id)}
          className={`px-2 py-1.5 rounded-lg text-xs font-bold transition-all ${
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
  );
};
