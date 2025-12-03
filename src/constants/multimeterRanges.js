export const ranges = {
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

export const ohmScaleValues = [0, 1, 2, 3, 4, 5, 6, 8, 10, 15, 20, 30, 50, 100, 200, '∞'];
