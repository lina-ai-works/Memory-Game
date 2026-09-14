import React from 'react';
import { CardItem, CardBackStyle } from '../types';
import { Sparkles, Check } from 'lucide-react';

interface CardProps {
  card: CardItem;
  onClick: () => void;
  disabled: boolean;
  cardBackStyle: CardBackStyle;
  cardFitMode?: 'contain' | 'cover';
}

export const Card: React.FC<CardProps> = ({
  card,
  onClick,
  disabled,
  cardBackStyle,
  cardFitMode = 'contain',
}) => {
  const isFlippedOrMatched = card.isFlipped || card.isMatched;

  return (
    <button
      id={`card-${card.id}`}
      type="button"
      onClick={onClick}
      disabled={disabled || isFlippedOrMatched}
      aria-label={`カード ${card.isFlipped ? card.name : '裏面'}`}
      className={`group relative w-full aspect-[3/4] cursor-pointer perspective-1000 select-none outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-xl transition-transform duration-150 ${
        disabled || isFlippedOrMatched ? 'cursor-default' : 'active:scale-95 hover:scale-[1.02]'
      }`}
    >
      <div
        className={`w-full h-full transition-transform duration-500 transform-style-3d relative rounded-xl shadow-sm ${
          isFlippedOrMatched ? 'rotate-y-180' : ''
        } ${card.isShaking ? 'animate-mismatch-shake' : ''} ${
          card.isMatched ? 'animate-pop-match' : ''
        }`}
      >
        {/* CARD BACK (shown when face-down) */}
        <div className="absolute inset-0 w-full h-full backface-hidden rounded-xl overflow-hidden shadow-md">
          {cardBackStyle === 'magic' ? (
            <div className="w-full h-full relative bg-slate-900 flex items-center justify-center">
              <img
                src="/cards/card_back.jpg"
                alt="カード裏面"
                className="w-full h-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 border border-amber-300/30 rounded-xl pointer-events-none" />
            </div>
          ) : cardBackStyle === 'minimal' ? (
            <div className="w-full h-full bg-slate-100 border-2 border-slate-300 rounded-xl flex flex-col items-center justify-center p-2 relative">
              <div className="w-full h-full border border-dashed border-slate-300 rounded-lg flex items-center justify-center bg-white/70">
                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 font-serif text-xs">
                  ?
                </div>
              </div>
            </div>
          ) : (
            // Simple default (Clean Navy & Gold Geometric pattern)
            <div className="w-full h-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-amber-200 border-2 border-amber-300/40 rounded-xl flex flex-col items-center justify-center p-2 relative overflow-hidden">
              {/* Subtle geometric inner frame */}
              <div className="absolute inset-1.5 border border-amber-400/30 rounded-lg flex items-center justify-center pointer-events-none">
                <div className="absolute inset-1 border border-amber-400/15 rounded-md" />
              </div>

              {/* Center emblem */}
              <div className="relative z-10 flex flex-col items-center justify-center">
                <div className="w-9 h-9 rounded-full bg-amber-400/10 border border-amber-400/40 flex items-center justify-center shadow-inner">
                  <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                </div>
                <span className="text-[10px] tracking-widest text-amber-200/70 font-serif mt-1">
                  MAGIC
                </span>
              </div>

              {/* Corner accents */}
              <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-amber-300/60" />
              <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-amber-300/60" />
              <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-amber-300/60" />
              <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-amber-300/60" />
            </div>
          )}
        </div>

        {/* CARD FRONT (shown when face-up) */}
        <div
          className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-xl overflow-hidden bg-white border-2 transition-colors duration-300 flex flex-col ${
            card.isMatched
              ? 'border-amber-400 ring-2 ring-amber-400/50 shadow-lg'
              : 'border-slate-300 shadow-md'
          }`}
        >
          {/* Card Image Container with Aspect Ratio Protection */}
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-slate-50">
            {/* Ambient blurred backdrop so portrait/landscape images integrate softly without harsh voids */}
            <div
              className="absolute inset-0 bg-cover bg-center blur-sm opacity-20 scale-110 pointer-events-none"
              style={{ backgroundImage: `url(${card.imageUrl})` }}
            />

            {/* Natural image rendering: object-contain prevents ANY stretching or distortion */}
            <img
              src={card.imageUrl}
              alt={card.name}
              className={`relative z-10 w-full h-full p-1 transition-transform duration-200 ${
                cardFitMode === 'cover' ? 'object-cover p-0' : 'object-contain'
              }`}
              loading="eager"
            />

            {/* Matched Overlay Indicator */}
            {card.isMatched && (
              <div className="absolute top-1.5 right-1.5 z-20 bg-amber-500 text-white rounded-full p-1 shadow-md animate-bounce">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            )}

            {/* Subtle bottom caption */}
            <div className="absolute bottom-0 inset-x-0 z-20 bg-gradient-to-t from-black/60 via-black/30 to-transparent py-1 px-1.5 text-center">
              <span className="text-[10px] sm:text-xs font-medium text-white drop-shadow truncate block">
                {card.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
};
