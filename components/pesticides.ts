import type { Pesticide } from '../types';

export const pesticides: readonly Pesticide[] = [
  { id: 'neem_oil', nameKey: 'pesticide_neem_oil', price: 15.99, trend: 'up', unit: 'per liter' },
  { id: 'spinosad', nameKey: 'pesticide_spinosad', price: 25.50, trend: 'stable', unit: 'per kg' },
  { id: 'bacillus_thuringiensis', nameKey: 'pesticide_bacillus_thuringiensis', price: 32.75, trend: 'down', unit: 'per kg' },
  { id: 'copper_fungicide', nameKey: 'pesticide_copper_fungicide', price: 19.20, trend: 'up', unit: 'per kg' },
  { id: 'horticultural_oil', nameKey: 'pesticide_horticultural_oil', price: 12.00, trend: 'down', unit: 'per liter' },
] as const;