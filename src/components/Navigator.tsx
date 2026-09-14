import React, { useState } from 'react';
import { NavigatorConfig, NavigatorMood } from '../types';
import { getRandomPhrase } from '../data/navigatorPhrases';
import { MessageCircle, Sparkles, Heart } from 'lucide-react';

interface NavigatorProps {
  config: NavigatorConfig;
  currentPhrase: string;
  mood: NavigatorMood;
  onTapNavigator?: () => void;
}

export const Navigator: React.FC<NavigatorProps> = ({
  config,
  currentPhrase,
  mood,
  onTapNavigator,
}) => {
  const [isBouncing, setIsBouncing] = useState(false);

  if (!config.enabled) return null;

  const handleAvatarClick = () => {
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 500);
    if (onTapNavigator) {
      onTapNavigator();
    }
  };

  const getMoodBadge = () => {
    switch (mood) {
      case 'streak':
        return { label: '連続正解!', bg: 'bg-rose-500 text-white' };
      case 'match':
        return { label: '正解!', bg: 'bg-amber-500 text-white' };
      case 'last_one':
        return { label: 'ラスト1組!', bg: 'bg-indigo-600 text-white animate-pulse' };
      case 'clear':
        return { label: '祝クリア!', bg: 'bg-emerald-500 text-white' };
      case 'mismatch':
        return { label: 'ファイト!', bg: 'bg-slate-500 text-white' };
      case 'start':
      default:
        return { label: '実況ナビ', bg: 'bg-amber-400 text-amber-950' };
    }
  };

  const badge = getMoodBadge();

  return (
    <div
      id="navigator-widget"
      className="w-full flex items-center gap-2.5 px-3 py-2 bg-white/90 backdrop-blur-md rounded-2xl border border-amber-200/80 shadow-sm relative select-none transition-all duration-300"
    >
      {/* Avatar Container */}
      <button
        type="button"
        onClick={handleAvatarClick}
        aria-label={`${config.name}をタップしてリアクション`}
        title="タップするとお話しするよ！"
        className={`relative shrink-0 w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-pink-300 shadow-md cursor-pointer active:scale-90 transition-transform ${
          isBouncing ? 'scale-110 -rotate-6' : ''
        }`}
      >
        <div className="w-full h-full rounded-full overflow-hidden bg-white border-2 border-white flex items-center justify-center">
          <img
            src={config.imageUrl}
            alt={config.name}
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>

        {/* Small floating reaction icon */}
        <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-white shadow-xs border border-amber-200 flex items-center justify-center text-amber-500">
          {mood === 'streak' || mood === 'clear' ? (
            <Sparkles className="w-3 h-3 text-amber-500" />
          ) : mood === 'match' ? (
            <Heart className="w-3 h-3 text-pink-500 fill-pink-500" />
          ) : (
            <MessageCircle className="w-3 h-3 text-amber-600" />
          )}
        </div>
      </button>

      {/* Speech Bubble (吹き出し) */}
      <div className="relative flex-1 min-w-0 bg-amber-50/80 border border-amber-200/90 rounded-2xl px-3 py-1.5 shadow-2xs">
        {/* Left pointing bubble arrow */}
        <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-amber-50 border-b border-l border-amber-200/90 rotate-45 pointer-events-none" />

        {/* Navigator Name & Mood Badge */}
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-[11px] font-bold text-slate-800 tracking-tight truncate max-w-[100px]">
            {config.name}
          </span>
          <span
            className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full leading-none shrink-0 ${badge.bg}`}
          >
            {badge.label}
          </span>
        </div>

        {/* Spoken phrase with subtle fade key */}
        <p
          key={currentPhrase}
          className="text-xs text-slate-700 leading-snug font-medium line-clamp-2 animate-in fade-in slide-in-from-left-1 duration-200"
        >
          {currentPhrase}
        </p>
      </div>
    </div>
  );
};
