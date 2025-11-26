import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'react-qr-code';
import { Card, ViewState, PRESET_COLORS } from './types';
import { DEFAULT_CARDS } from './constants';
import CardComponent from './components/Card';
import { fileToGenerativePart, extractCardInfo } from './services/geminiService';

export default function App() {
  // --- State ---
  const [cards, setCards] = useState<Card[]>(() => {
    const saved = localStorage.getItem('wallet_cards');
    return saved ? JSON.parse(saved) : DEFAULT_CARDS;
  });
  const [view, setView] = useState<ViewState>('LIST');
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Add Card State
  const [newCardStore, setNewCardStore] = useState('');
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardColor, setNewCardColor] = useState(PRESET_COLORS[0]);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem('wallet_cards', JSON.stringify(cards));
  }, [cards]);

  // --- Handlers ---
  const handleCardClick = (card: Card) => {
    setActiveCard(card);
    setView('DETAIL');
  };

  const handleBack = () => {
    setView('LIST');
    setActiveCard(null);
    resetForm();
  };

  const resetForm = () => {
    setNewCardStore('');
    setNewCardNumber('');
    setNewCardColor(PRESET_COLORS[0]);
    setIsProcessingAI(false);
  };

  const handleAddCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardStore || !newCardNumber) return;

    const newCard: Card = {
      id: Date.now().toString(),
      storeName: newCardStore,
      cardNumber: newCardNumber,
      colorFrom: newCardColor.from,
      colorTo: newCardColor.to,
      type: 'qrcode', // Defaulting to QR for generic display logic
      logoIcon: 'fa-credit-card'
    };

    setCards([newCard, ...cards]);
    handleBack();
  };

  const handleAIUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingAI(true);
    try {
      const base64Data = await fileToGenerativePart(file);
      const result = await extractCardInfo(base64Data, file.type);
      
      if (result) {
        setNewCardStore(result.storeName);
        setNewCardNumber(result.cardNumber);
      }
    } catch (err) {
      alert("Could not analyze card. Please try again or enter manually.");
    } finally {
      setIsProcessingAI(false);
      // Reset input so same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const deleteCard = (id: string) => {
    if (confirm('Are you sure you want to remove this card?')) {
      setCards(cards.filter(c => c.id !== id));
      handleBack();
    }
  };

  // --- Render Helpers ---
  const filteredCards = cards.filter(c => 
    c.storeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Views ---

  // 1. Detail View (Large Card for Scanning)
  if (view === 'DETAIL' && activeCard) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center relative">
        {/* Navbar */}
        <div className="w-full bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-10">
          <button onClick={handleBack} className="p-2 text-gray-600 hover:text-gray-900">
            <i className="fa fa-arrow-left text-xl"></i>
          </button>
          <h1 className="font-bold text-lg">{activeCard.storeName}</h1>
          <button 
            onClick={() => deleteCard(activeCard.id)}
            className="p-2 text-red-500 hover:text-red-700"
          >
            <i className="fa fa-trash"></i>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 w-full max-w-md p-6 flex flex-col items-center justify-center space-y-8 animate-fade-in-up">
          
          {/* Card Representation */}
          <div 
            className="w-full aspect-[1.586/1] rounded-xl shadow-2xl relative overflow-hidden flex flex-col justify-between p-6 text-white"
            style={{ background: `linear-gradient(135deg, ${activeCard.colorFrom}, ${activeCard.colorTo})` }}
          >
            <div className="flex justify-between items-start">
               <span className="font-bold text-2xl drop-shadow-md">{activeCard.storeName}</span>
               <i className={`fa ${activeCard.logoIcon || 'fa-credit-card'} text-3xl opacity-80`}></i>
            </div>
            <p className="text-right font-mono text-xl tracking-widest drop-shadow-sm">{activeCard.cardNumber}</p>
          </div>

          {/* Code Display Area - High Brightness Logic */}
          <div className="w-full bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center justify-center space-y-4">
             <div className="w-full aspect-square max-w-[250px] flex items-center justify-center bg-white">
                <QRCode 
                    value={activeCard.cardNumber} 
                    size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    viewBox={`0 0 256 256`}
                />
             </div>
             <p className="text-gray-500 text-sm font-mono tracking-widest uppercase">Scan this code</p>
             <p className="text-gray-900 text-2xl font-bold font-mono text-center break-all">{activeCard.cardNumber}</p>
          </div>
          
          <p className="text-gray-400 text-sm text-center">
            Max brightness recommended for scanners.
          </p>
        </div>
      </div>
    );
  }

  // 2. Add Card View
  if (view === 'ADD') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Navbar */}
        <div className="bg-white p-4 shadow-sm flex items-center sticky top-0 z-10">
          <button onClick={handleBack} className="mr-4 text-gray-600">
            <i className="fa fa-times text-xl"></i>
          </button>
          <h1 className="font-bold text-xl">Add New Card</h1>
        </div>

        <div className="p-6 max-w-md mx-auto w-full space-y-8">
          
          {/* AI Scan Option */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
             <div className="relative z-10">
                <h3 className="font-bold text-lg mb-2">Auto-Scan with Gemini</h3>
                <p className="text-blue-100 text-sm mb-4">Take a photo of your card. AI will fill the details.</p>
                <label className="inline-flex items-center bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold text-sm cursor-pointer hover:bg-blue-50 transition">
                  <i className="fa fa-camera mr-2"></i>
                  {isProcessingAI ? 'Analyzing...' : 'Snap Photo'}
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept="image/*" 
                    capture="environment"
                    className="hidden" 
                    onChange={handleAIUpload}
                    disabled={isProcessingAI}
                  />
                </label>
             </div>
             <i className="fa fa-magic absolute -bottom-4 -right-4 text-8xl text-white opacity-20"></i>
          </div>

          {/* Manual Form */}
          <form onSubmit={handleAddCardSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
              <input 
                type="text" 
                required
                value={newCardStore}
                onChange={(e) => setNewCardStore(e.target.value)}
                placeholder="e.g. IKEA Family"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
              <div className="flex">
                <input 
                  type="text" 
                  required
                  value={newCardNumber}
                  onChange={(e) => setNewCardNumber(e.target.value)}
                  placeholder="e.g. 123456789"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition font-mono"
                />
                <button type="button" className="ml-2 bg-gray-200 px-3 rounded-lg text-gray-600">
                   <i className="fa fa-barcode"></i>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Card Color</label>
              <div className="flex space-x-3 overflow-x-auto pb-2 no-scrollbar">
                {PRESET_COLORS.map((color, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setNewCardColor(color)}
                    className={`w-10 h-10 rounded-full flex-shrink-0 border-2 ${newCardColor.name === color.name ? 'border-gray-800 scale-110' : 'border-transparent'}`}
                    style={{ background: `linear-gradient(135deg, ${color.from}, ${color.to})` }}
                  ></button>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-black transition active:scale-[0.98]"
            >
              Save Card
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 3. List View (Dashboard)
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-lg mx-auto shadow-2xl">
      {/* Header */}
      <div className="bg-white p-5 pt-8 sticky top-0 z-20 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">My Cards</h1>
          <button 
            onClick={() => setView('ADD')}
            className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition transform hover:rotate-90"
          >
            <i className="fa fa-plus"></i>
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <i className="fa fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input 
            type="text" 
            placeholder="Search cards..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="p-4 flex-1 overflow-y-auto">
        {filteredCards.length === 0 ? (
          <div className="text-center py-20 opacity-50">
            <i className="fa fa-wallet text-6xl text-gray-300 mb-4"></i>
            <p className="text-gray-500">No cards found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-20">
            {filteredCards.map(card => (
              <CardComponent key={card.id} card={card} onClick={handleCardClick} />
            ))}
          </div>
        )}
      </div>

      {/* Quick Action Hints (Mobile App Feel) */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-2 rounded-full shadow-xl text-sm font-medium opacity-0 animate-fade-in-delayed pointer-events-none">
        Tap a card to scan
      </div>
      
      <style>{`
        @keyframes fade-in-delayed {
          0% { opacity: 0; transform: translate(-50%, 10px); }
          80% { opacity: 0; transform: translate(-50%, 10px); }
          100% { opacity: 0.9; transform: translate(-50%, 0); }
        }
        .animate-fade-in-delayed {
          animation: fade-in-delayed 2s ease-out forwards;
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}