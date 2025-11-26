
export interface Card {
  id: string;
  storeName: string;
  cardNumber: string;
  colorFrom: string;
  colorTo: string;
  logoIcon?: string; // FontAwesome class
  type: 'barcode' | 'qrcode';
}

export type ViewState = 'LIST' | 'DETAIL' | 'ADD' | 'EDIT';

export interface ExtractedCardData {
  storeName: string;
  cardNumber: string;
}

// Nordic Dark / Slate Palette + Pantone Colors of the Year
export const PRESET_COLORS = [
  // --- Current Nordic/Slate Theme ---
  { from: '#475569', to: '#334155', name: 'Slate Blue' }, // 石灰藍
  { from: '#3F3F46', to: '#27272A', name: 'Zinc' },       // Dark Grey
  { from: '#334155', to: '#1E293B', name: 'Navy Slate' }, // Deep Blue Grey
  { from: '#115E59', to: '#134E4A', name: 'Deep Teal' },  // Dark Green/Teal
  { from: '#881337', to: '#4C0519', name: 'Dark Berry' }, // Deep Red
  { from: '#713F12', to: '#451A03', name: 'Bronze' },     // Dark Brown
  { from: '#171717', to: '#000000', name: 'Midnight' },   // Black

  // --- Pantone Colors of the Year (2015-2024) ---
  { from: '#FFBE98', to: '#FEA375', name: 'Peach Fuzz (2024)' },      // Soft Peach
  { from: '#BB2649', to: '#8F1E38', name: 'Viva Magenta (2023)' },     // Crimson Red
  { from: '#6667AB', to: '#4F5086', name: 'Very Peri (2022)' },        // Periwinkle
  { from: '#F5DF4D', to: '#D4C030', name: 'Illuminating (2021)' },     // Bright Yellow
  { from: '#939597', to: '#707274', name: 'Ultimate Gray (2021)' },    // Neutral Gray
  { from: '#0F4C81', to: '#0A365C', name: 'Classic Blue (2020)' },     // Deep Blue
  { from: '#FF6F61', to: '#E05043', name: 'Living Coral (2019)' },     // Coral
  { from: '#5F4B8B', to: '#453666', name: 'Ultra Violet (2018)' },     // Purple
  { from: '#88B04B', to: '#688936', name: 'Greenery (2017)' },         // Fresh Green
  { from: '#F7CAC9', to: '#E3A6A4', name: 'Rose Quartz (2016)' },      // Soft Pink
  { from: '#92A8D1', to: '#6C85B5', name: 'Serenity (2016)' },         // Soft Blue
  { from: '#955251', to: '#733D3C', name: 'Marsala (2015)' },          // Wine Red
];
