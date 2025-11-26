import { Card } from './types';

export const DEFAULT_CARDS: Card[] = [
  {
    id: 'happy-go-demo',
    storeName: 'HappyGo',
    cardNumber: '1234-5678',
    colorFrom: '#D97706', // Keep one accent color (Amber/Orange) for HappyGo as it is their brand
    colorTo: '#B45309',
    logoIcon: 'fa-smile',
    type: 'barcode',
  },
  {
    id: 'carrefour-demo',
    storeName: 'Carrefour',
    cardNumber: '987654321',
    colorFrom: '#475569', // Slate Blue (石灰藍)
    colorTo: '#334155',
    logoIcon: 'fa-shopping-cart',
    type: 'barcode',
  },
  {
    id: 'starbucks-demo',
    storeName: 'Starbucks',
    cardNumber: '6000-1234',
    colorFrom: '#115E59', // Deep Teal
    colorTo: '#134E4A',
    logoIcon: 'fa-coffee',
    type: 'qrcode',
  }
];