import React from 'react';
import { Card as CardType } from '../types';

interface CardProps {
  card: CardType;
  onClick: (card: CardType) => void;
}

const Card: React.FC<CardProps> = ({ card, onClick }) => {
  return (
    <div 
      onClick={() => onClick(card)}
      className="relative w-full aspect-[1.586/1] rounded-xl shadow-lg transform transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer overflow-hidden group"
      style={{
        background: `linear-gradient(135deg, ${card.colorFrom}, ${card.colorTo})`
      }}
    >
      {/* Decorative background circles */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-black opacity-10 rounded-full blur-2xl"></div>

      <div className="absolute inset-0 p-5 flex flex-col justify-between text-white">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg md:text-xl tracking-wide shadow-black drop-shadow-md">
            {card.storeName}
          </h3>
          {card.logoIcon && (
            <i className={`fa ${card.logoIcon} text-2xl opacity-80`}></i>
          )}
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-end opacity-90">
             <span className="text-xs uppercase tracking-wider opacity-70">Card No.</span>
             {card.type === 'qrcode' && <i className="fa fa-qrcode opacity-50"></i>}
             {card.type === 'barcode' && <i className="fa fa-barcode opacity-50"></i>}
          </div>
          <p className="font-mono text-sm md:text-lg tracking-widest truncate shadow-black drop-shadow-sm">
            {card.cardNumber}
          </p>
        </div>
      </div>
      
      {/* Shine effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500 w-[200%] -translate-x-full group-hover:translate-x-full transform skew-x-12"></div>
    </div>
  );
};

export default Card;