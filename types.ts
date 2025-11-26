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

export const PRESET_COLORS = [
  { from: '#F48120', to: '#D65A00', name: 'Orange' },
  { from: '#003399', to: '#001A4D', name: 'Blue' },
  { from: '#EF4444', to: '#991B1B', name: 'Red' },
  { from: '#10B981', to: '#047857', name: 'Green' },
  { from: '#8B5CF6', to: '#5B21B6', name: 'Purple' },
  { from: '#1F2937', to: '#000000', name: 'Black' },
];