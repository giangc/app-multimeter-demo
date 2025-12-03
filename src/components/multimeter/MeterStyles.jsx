import React from 'react';

export const MeterStyles = () => (
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
);
