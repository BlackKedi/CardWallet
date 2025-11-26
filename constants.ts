import { Card } from './types';

export const DEFAULT_CARDS: Card[] = [
  {
    id: 'happy-go-demo',
    storeName: 'HappyGo',
    cardNumber: '1234-5678-9012',
    colorFrom: '#F48120',
    colorTo: '#D65A00',
    logoIcon: 'fa-smile',
    type: 'barcode',
  },
  {
    id: 'carrefour-demo',
    storeName: 'Carrefour',
    cardNumber: '987654321',
    colorFrom: '#003399',
    colorTo: '#002266',
    logoIcon: 'fa-shopping-cart',
    type: 'barcode',
  },
  {
    id: 'starbucks-demo',
    storeName: 'Starbucks',
    cardNumber: '6000-1234-5678',
    colorFrom: '#10B981',
    colorTo: '#064E3B',
    logoIcon: 'fa-coffee',
    type: 'qrcode',
  }
];