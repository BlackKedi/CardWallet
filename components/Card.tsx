
import React from 'react';
import { Card as CardType } from '../types';

interface CardProps {
  card: CardType;
  onClick: (card: CardType) => void;
  variant?: 'small' | 'large';
  isReordering?: boolean;
  onMoveLeft?: (e: React.MouseEvent) => void;
  onMoveRight?: (e: React.MouseEvent) => void;
  isFirst?: boolean;
  isLast?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  card, 
  onClick, 
  variant = 'small',
  isReordering = false,
  onMoveLeft,
  onMoveRight,
  isFirst,
  isLast
}) => {
  return (
    <div 
      onClick={() => !isReordering && onClick(card)}
      className={`
        relative w-full rounded-2xl overflow-hidden group
        transition-all duration-300 ease-out
        ${variant === 'small' ? 'aspect-[1.586/1] shadow-md' : 'aspect-[1.586/1] shadow-2xl'}
        ${!isReordering && variant === 'small' ? 'cursor-pointer hover:-translate-y-1 hover:shadow-xl' : ''}
        ${isReordering ? 'ring-4 ring-indigo-400/50 scale-95' : ''}
      `}
      style={{
        background: `linear-gradient(135deg, ${card.colorFrom}, ${card.colorTo})`
      }}
    >
      {/* Reordering Controls Overlay */}
      {isReordering && variant === 'small' && (
        <div className="absolute inset-0 z-20 bg-black/20 backdrop-blur-[1px] flex items-center justify-center gap-4 animate-fade-in">
          <button 
            onClick={onMoveLeft}
            disabled={isFirst}
            className={`w-10 h-10 rounded-full bg-white text-slate-800 flex items-center justify-center shadow-lg transition-transform active:scale-90 ${isFirst ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
          >
            <i className="fa fa-chevron-left"></i>
          </button>
          <button 
            onClick={onMoveRight}
            disabled={isLast}
            className={`w-10 h-10 rounded-full bg-white text-slate-800 flex items-center justify-center shadow-lg transition-transform active:scale-90 ${isLast ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
          >
            <i className="fa fa-chevron-right"></i>
          </button>
        </div>
      )}

      {/* Matte texture overlay */}
      <div className="absolute inset-0 bg-white opacity-5 mix-blend-overlay"></div>

      <div className={`absolute inset-0 flex flex-col justify-between text-white ${variant === 'small' ? 'p-4' : 'p-6'}`}>
        <div className="flex justify-between items-start">
          <h3 className={`font-bold tracking-tight leading-tight truncate pr-2 ${variant === 'large' ? 'text-3xl' : 'text-xl'}`}>
            {card.storeName}
          </h3>
          {card.logoIcon && (
            <div className={`
              bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0
              ${variant === 'large' ? 'w-12 h-12' : 'w-8 h-8'}
            `}>
              <i className={`fa ${card.logoIcon} ${variant === 'large' ? 'text-xl' : 'text-sm'} opacity-90`}></i>
            </div>
          )}
        </div>

        <div className="space-y-0.5">
          {variant === 'large' && (
             <div className="flex justify-between items-end opacity-70">
                <span className="text-[10px] uppercase tracking-[0.2em]">Card ID</span>
             </div>
          )}
          <p className={`font-mono tracking-wider truncate opacity-95 font-medium ${variant === 'large' ? 'text-2xl' : 'text-lg'}`}>
            {card.cardNumber}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Card;
