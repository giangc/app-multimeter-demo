export const UI_VARIANTS = {
  CLASSIC: 'classic',
  MODERN: 'modern'
};

export const variantConfig = {
  classic: {
    name: 'Classic',
    meterFace: {
      background: '#f8f5e8',
      scales: [
        { type: 'OHM', radius: 145, color: '#c92a2a', width: 6 },
        { type: 'DCV', radius: 125, color: '#1a1a1a', width: 4 },
        { type: 'ACV', radius: 105, color: '#228b22', width: 3 },
        { type: 'DCmA', radius: 85, color: '#0066cc', width: 3 }
      ]
    }
  },
  modern: {
    name: 'Modern',
    meterFace: {
      background: '#ffffff',
      scales: [
        { type: 'OHM', radius: 145, color: '#d92027', width: 4 },
        { type: 'DCV', radius: 125, color: '#1a1a1a', width: 3 },
        { type: 'ACV', radius: 105, color: '#2eb82e', width: 3 },
        { type: 'DCmA', radius: 85, color: '#0066cc', width: 3 }
      ]
    }
  }
};

export const getVariantConfig = (variant) => {
  return variantConfig[variant] || variantConfig.classic;
};
