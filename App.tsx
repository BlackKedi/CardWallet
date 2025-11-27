
import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'react-qr-code';
import Barcode from 'react-barcode';
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
  
  // Reorder Mode State
  const [isReordering, setIsReordering] = useState(false);
  
  // Add/Edit Card State
  const [newCardStore, setNewCardStore] = useState('');
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardColor, setNewCardColor] = useState(PRESET_COLORS[0]);
  const [newCardType, setNewCardType] = useState<'barcode' | 'qrcode'>('barcode');
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem('wallet_cards', JSON.stringify(cards));
  }, [cards]);

  // --- Handlers ---
  const handleCardClick = (card: Card) => {
    if (isReordering) return; // Disable click when reordering
    setActiveCard(card);
    setView('DETAIL');
  };

  const handleBack = () => {
    setView('LIST');
    setActiveCard(null);
    resetForm();
    setIsReordering(false);
  };

  const resetForm = () => {
    setNewCardStore('');
    setNewCardNumber('');
    setNewCardColor(PRESET_COLORS[0]);
    setNewCardType('barcode');
    setIsProcessingAI(false);
  };

  const initEditMode = () => {
    if (!activeCard) return;
    setNewCardStore(activeCard.storeName);
    setNewCardNumber(activeCard.cardNumber);
    setNewCardType(activeCard.type);
    
    // Find matching color object or default
    const matchingColor = PRESET_COLORS.find(c => c.from === activeCard.colorFrom) || PRESET_COLORS[0];
    setNewCardColor(matchingColor);
    
    setView('EDIT');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardStore || !newCardNumber) return;

    if (view === 'EDIT' && activeCard) {
      // Update existing
      const updatedCards = cards.map(c => 
        c.id === activeCard.id 
          ? {
              ...c,
              storeName: newCardStore,
              cardNumber: newCardNumber,
              colorFrom: newCardColor.from,
              colorTo: newCardColor.to,
              type: newCardType
            }
          : c
      );
      setCards(updatedCards);
      setActiveCard({ ...activeCard, storeName: newCardStore, cardNumber: newCardNumber, colorFrom: newCardColor.from, colorTo: newCardColor.to, type: newCardType });
      setView('DETAIL');
    } else {
      // Create new
      const newCard: Card = {
        id: Date.now().toString(),
        storeName: newCardStore,
        cardNumber: newCardNumber,
        colorFrom: newCardColor.from,
        colorTo: newCardColor.to,
        type: newCardType, 
        logoIcon: 'fa-credit-card'
      };
      setCards([newCard, ...cards]);
      handleBack();
    }
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
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const deleteCard = (id: string) => {
    if (confirm('Are you sure you want to remove this card?')) {
      setCards(cards.filter(c => c.id !== id));
      handleBack();
    }
  };

  // Reorder Logic
  const moveCard = (index: number, direction: 'left' | 'right', e: React.MouseEvent) => {
    e.stopPropagation();
    const newIndex = direction === 'left' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= cards.length) return;

    const newCards = [...cards];
    const [movedCard] = newCards.splice(index, 1);
    newCards.splice(newIndex, 0, movedCard);
    setCards(newCards);
  };

  // --- Render Helpers ---
  const filteredCards = cards.filter(c => 
    c.storeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 1. Detail View (Clean, Focus Mode)
  if (view === 'DETAIL' && activeCard) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center relative animate-fade-in">
        {/* Minimalist Navbar */}
        <div className="w-full p-6 flex items-center justify-between z-10">
          <button 
            onClick={handleBack} 
            className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-600 hover:text-slate-900 transition"
          >
            <i className="fa fa-arrow-left"></i>
          </button>
          
          <div className="flex space-x-3">
            <button 
              onClick={initEditMode}
              className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-600 hover:text-indigo-600 transition"
            >
              <i className="fa fa-pen text-sm"></i>
            </button>
            <button 
              onClick={() => deleteCard(activeCard.id)}
              className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-red-400 hover:text-red-600 transition"
            >
              <i className="fa fa-trash-alt text-sm"></i>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 w-full max-w-md px-8 flex flex-col items-center pt-4 space-y-10">
          
          {/* Card Representation */}
          <div className="w-full transform transition-all duration-500 hover:scale-105">
            <CardComponent card={activeCard} onClick={() => {}} variant="large" />
          </div>

          {/* Code Display Area - Ticket Style */}
          <div className="w-full bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center relative border border-slate-100">
             {/* Ticket Punch Circles */}
             <div className="absolute -left-3 top-1/2 w-6 h-6 bg-zinc-50 rounded-full"></div>
             <div className="absolute -right-3 top-1/2 w-6 h-6 bg-zinc-50 rounded-full"></div>

             <div className="w-full min-h-[180px] flex items-center justify-center p-2 bg-white rounded-xl overflow-hidden">
                {activeCard.type === 'barcode' ? (
                   <Barcode 
                     value={activeCard.cardNumber} 
                     width={2.5}
                     height={120}
                     fontSize={20}
                     background="transparent"
                     lineColor="#1e293b"
                     displayValue={false} // Hidden as requested
                   />
                ) : (
                  <QRCode 
                      value={activeCard.cardNumber} 
                      size={200}
                      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                      viewBox={`0 0 256 256`}
                      fgColor="#1e293b" // slate-800
                  />
                )}
             </div>
          </div>
          
          <div className="flex items-center space-x-2 text-slate-400 text-sm">
            <i className="fa fa-sun"></i>
            <span>Set brightness to max for best results</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. Add / Edit Card View (Clean Form)
  if (view === 'ADD' || view === 'EDIT') {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col">
        {/* Navbar */}
        <div className="p-6 flex items-center">
          <button 
            onClick={() => {
              if (view === 'EDIT' && activeCard) setView('DETAIL');
              else handleBack();
            }} 
            className="text-slate-500 hover:text-slate-800 transition mr-4"
          >
            <i className="fa fa-times text-xl"></i>
          </button>
          <h1 className="text-2xl font-light text-slate-800">
            {view === 'EDIT' ? 'Edit Card' : 'Add Card'}
          </h1>
        </div>

        <div className="flex-1 px-6 max-w-md mx-auto w-full space-y-8 pb-10">
          
          {/* AI Scan Option - Only show on ADD */}
          {view === 'ADD' && (
            <>
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                    <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-1">
                      <i className="fa fa-magic"></i>
                    </div>
                    <h3 className="font-medium text-slate-800">Auto-Scan with AI</h3>
                    <p className="text-slate-400 text-sm max-w-[200px]">Upload a photo of your card and we'll extract the details.</p>
                    
                    <label className="mt-2 inline-flex items-center justify-center w-full py-3 bg-indigo-600 text-white rounded-xl font-medium text-sm cursor-pointer hover:bg-indigo-700 transition active:scale-95 shadow-md shadow-indigo-200">
                      {isProcessingAI ? (
                        <><i className="fa fa-circle-notch fa-spin mr-2"></i> Analyzing...</>
                      ) : (
                        <><i className="fa fa-camera mr-2"></i> Snap Photo</>
                      )}
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
              </div>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink-0 mx-4 text-slate-400 text-xs uppercase tracking-widest">Or Manual Entry</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>
            </>
          )}

          {/* Manual Form - Clean Inputs */}
          <form onSubmit={handleFormSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="group">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 group-focus-within:text-indigo-600 transition-colors">Store Name</label>
                <input 
                  type="text" 
                  required
                  value={newCardStore}
                  onChange={(e) => setNewCardStore(e.target.value)}
                  placeholder="e.g. IKEA Family"
                  className="w-full px-0 py-3 bg-transparent border-b-2 border-slate-200 focus:border-indigo-600 outline-none transition-colors text-lg text-slate-800 placeholder-slate-300"
                />
              </div>

              <div className="group">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 group-focus-within:text-indigo-600 transition-colors">Card Number</label>
                <div className="flex items-center">
                  <input 
                    type="text" 
                    required
                    value={newCardNumber}
                    onChange={(e) => setNewCardNumber(e.target.value)}
                    placeholder="e.g. 123456789"
                    className="w-full px-0 py-3 bg-transparent border-b-2 border-slate-200 focus:border-indigo-600 outline-none transition-colors text-lg text-slate-800 placeholder-slate-300 font-mono"
                  />
                  {newCardType === 'barcode' ? (
                     <i className="fa fa-barcode text-slate-300 ml-2"></i>
                  ) : (
                     <i className="fa fa-qrcode text-slate-300 ml-2"></i>
                  )}
                </div>
              </div>

              {/* Code Type Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Code Type</label>
                <div className="grid grid-cols-2 gap-4">
                   <button
                     type="button"
                     onClick={() => setNewCardType('barcode')}
                     className={`py-3 px-4 rounded-xl border flex items-center justify-center space-x-2 transition-all ${
                       newCardType === 'barcode' 
                       ? 'bg-slate-800 text-white border-slate-800 shadow-md' 
                       : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                     }`}
                   >
                     <i className="fa fa-barcode"></i>
                     <span className="text-sm font-medium">Barcode</span>
                   </button>
                   <button
                     type="button"
                     onClick={() => setNewCardType('qrcode')}
                     className={`py-3 px-4 rounded-xl border flex items-center justify-center space-x-2 transition-all ${
                       newCardType === 'qrcode' 
                       ? 'bg-slate-800 text-white border-slate-800 shadow-md' 
                       : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                     }`}
                   >
                     <i className="fa fa-qrcode"></i>
                     <span className="text-sm font-medium">QR Code</span>
                   </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Card Color</label>
                <div className="flex flex-wrap gap-3">
                  {PRESET_COLORS.map((color, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewCardColor(color)}
                      className={`w-10 h-10 rounded-full transition-all duration-300 ${newCardColor.name === color.name ? 'ring-4 ring-slate-100 scale-110 shadow-md' : 'hover:scale-110'}`}
                      style={{ background: `linear-gradient(135deg, ${color.from}, ${color.to})` }}
                    ></button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-slate-900 text-white font-medium py-4 rounded-2xl shadow-lg shadow-slate-200 hover:bg-black transition active:scale-[0.98]"
            >
              {view === 'EDIT' ? 'Update Card' : 'Save Card'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 3. List View (Nordic Dashboard)
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col max-w-lg mx-auto">
      {/* Header */}
      <div className="bg-zinc-50 p-6 pt-10 sticky top-0 z-20">
        <div className="flex justify-between items-end mb-6">
          <div>
            <p className="text-slate-400 text-sm font-medium tracking-wider mb-1">Welcome back</p>
            <h1 className="text-3xl font-light text-slate-800 tracking-tight">My Wallet</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsReordering(!isReordering)}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isReordering ? 'bg-indigo-100 text-indigo-600' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
              title="Reorder Cards"
            >
              <i className="fa fa-sort text-lg"></i>
            </button>
            <button 
              onClick={() => setView('ADD')}
              disabled={isReordering}
              className={`bg-slate-900 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-300 hover:bg-black transition-all hover:scale-105 active:scale-95 ${isReordering ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <i className="fa fa-plus text-lg"></i>
            </button>
          </div>
        </div>
        
        {/* Search - Pill Shape */}
        <div className={`relative group transition-opacity duration-300 ${isReordering ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
          <i className="fa fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"></i>
          <input 
            type="text" 
            placeholder="Search your cards..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl text-slate-700 placeholder-slate-400 shadow-[0_2px_15px_rgb(0,0,0,0.03)] focus:shadow-[0_8px_20px_rgb(0,0,0,0.06)] focus:outline-none transition-all duration-300"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="px-6 pb-24 flex-1 overflow-y-auto no-scrollbar">
        {filteredCards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 opacity-40">
            <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-4">
              <i className="fa fa-wallet text-3xl text-slate-400"></i>
            </div>
            <p className="text-slate-500 font-light">No cards found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredCards.map((card, index) => (
              <CardComponent 
                key={card.id} 
                card={card} 
                onClick={handleCardClick} 
                isReordering={isReordering}
                onMoveLeft={(e) => moveCard(index, 'left', e)}
                onMoveRight={(e) => moveCard(index, 'right', e)}
                isFirst={index === 0}
                isLast={index === filteredCards.length - 1}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .animate-fade-in {
          animation: fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); scale: 0.98; }
          to { opacity: 1; transform: translateY(0); scale: 1; }
        }
      `}</style>
    </div>
  );
}
