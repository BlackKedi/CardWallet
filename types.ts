export interface Card {
  id: string;
  storeName: string;
  cardNumber: string;
  colorFrom: string;
  colorTo: string;
  logoIcon?: string; // FontAwesome class
  type: 'barcode' | 'qrcode';
}

export type ViewState = 'LIST' | 'DETAIL' | 'ADD';

export interface ExtractedCardData {
  storeName: string;
  cardNumber: string;
}

// Nordic Dark / Slate Palette
export const PRESET_COLORS = [
  { from: '#475569', to: '#334155', name: 'Slate Blue' }, // 石灰藍 (Main requested color)
  { from: '#3F3F46', to: '#27272A', name: 'Zinc' },       // Dark Grey
  { from: '#334155', to: '#1E293B', name: 'Navy Slate' }, // Deep Blue Grey
  { from: '#115E59', to: '#134E4A', name: 'Deep Teal' },  // Dark Green/Teal
  { from: '#881337', to: '#4C0519', name: 'Dark Berry' }, // Deep Red
  { from: '#713F12', to: '#451A03', name: 'Bronze' },     // Dark Brown
  { from: '#171717', to: '#000000', name: 'Midnight' },   // Black
];