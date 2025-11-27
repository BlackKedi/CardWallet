
import React from 'react';
import { Card as CardType } from '../types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface CardProps {
  card: CardType;
  onClick: (card: CardType) => void;
  variant?: 'small' | 'large';
  isReordering?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  card, 
  onClick, 
  variant = 'small',
  isReordering = false
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    disabled: !isReordering || variant === 'large',
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => {
        // Prevent click when reordering to avoid accidental navigation
        if (!isReordering) onClick(card);
      }}
      className={`
        relative w-full rounded-2xl overflow-hidden group
        ${variant === 'small' ? 'aspect-[1.586/1] shadow-md' : 'aspect-[1.586/1] shadow-2xl'}
        ${!isReordering && variant === 'small' ? 'cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ease-out' : ''}
        ${isReordering && variant === 'small' ? 'cursor-grab active:cursor-grabbing touch-none' : ''}
        ${isReordering && !isDragging ? 'animate-wiggle' : ''}
        ${isDragging ? 'opacity-80 scale-105 shadow-2xl ring-4 ring-indigo-400/50 z-50' : ''}
      `}
    >
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: `linear-gradient(135deg, ${card.colorFrom}, ${card.colorTo})`
        }}
      >
        {/* Reordering Grip Overlay */}
        {isReordering && variant === 'small' && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/10">
             <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-inner">
                <i className="fa fa-hand-rock text-xl"></i>
             </div>
          </div>
        )}

        {/* Matte texture overlay */}
        <div className="absolute inset-0 bg-white opacity-5 mix-blend-overlay pointer-events-none"></div>

        <div className={`absolute inset-0 flex flex-col justify-between text-white ${variant === 'small' ? 'p-4' : 'p-6'}`}>
          <div className="flex justify-between items-start">
            <h3 className={`font-bold tracking-tight leading-tight truncate pr-2 pointer-events-none ${variant === 'large' ? 'text-3xl' : 'text-xl'}`}>
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

          <div className="space-y-0.5 pointer-events-none">
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
      
      <style>{`
        @keyframes wiggle {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(-1deg); }
          75% { transform: rotate(1deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-wiggle {
          animation: wiggle 0.3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Card;
