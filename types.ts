
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

// Pantone Men's Core Colors Forecast
export const PRESET_COLORS = [
  { from: '#B7468B', to: '#903068', name: 'Rose Violet (17-2624)' },      // Magenta
  { from: '#4A8CC7', to: '#306BA0', name: 'Azure Blue (17-4139)' },       // Medium Blue
  { from: '#7C7694', to: '#5E5975', name: 'Purple Hebe (18-3718)' },      // Muted Purple
  { from: '#FBD636', to: '#D4B010', name: 'Vibrant Yellow (13-0858)' },   // Bright Yellow
  { from: '#E0C4D0', to: '#C0A0B0', name: 'Pale Lilac (13-2803)' },       // Pale Pink
  { from: '#C9A626', to: '#A08210', name: 'Mango Mojito (16-0838)' },     // Mustard Gold
  { from: '#80D0C0', to: '#5EB0A0', name: 'Spearmint (13-5714)' },        // Mint Green
  { from: '#335559', to: '#1F383B', name: 'Blue Spruce (19-4517)' },      // Dark Teal
  { from: '#91333F', to: '#6B1F28', name: 'Sun Baked (19-1655)' },        // Deep Red
  { from: '#38529D', to: '#253975', name: 'Dazzling Blue (18-3949)' },    // Deep Blue
];
