import React from 'react';
import { Card as CardType } from '../types';

interface CardProps {
  card: CardType;
  onClick: (card: CardType) => void;
  variant?: 'small' | 'large';
}

const Card: React.FC<CardProps> = ({ card, onClick, variant = 'small' }) => {
  return (
    <div 
      onClick={() => onClick(card)}
      className={`
        relative w-full rounded-2xl overflow-hidden cursor-pointer group
        transition-all duration-300 ease-out
        ${variant === 'small' ? 'aspect-[1.586/1] hover:-translate-y-1 hover:shadow-xl shadow-md' : 'aspect-[1.586/1] shadow-2xl'}
      `}
      style={{
        background: `linear-gradient(135deg, ${card.colorFrom}, ${card.colorTo})`
      }}
    >
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