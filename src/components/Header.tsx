import React from 'react';
import { RotateCcw, Volume2, VolumeX, Settings, Sparkles } from 'lucide-react';

interface HeaderProps {
  moves: number;
  matchedPairs: number;
  totalPairs: number;
  onRestart: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  moves,
  matchedPairs,
  totalPairs,
  onRestart,
  soundEnabled,
  onToggleSound,
  onOpenSettings,
}) => {
  return (
    <header className="w-full flex flex-col gap-2.5 select-none pt-1">
      {/* Top row: Title and quick action icons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800 font-serif">
              Memory Game
            </h1>
            <p className="text-[11px] text-slate-500">6組のペアを見つけよう</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            id="sound-toggle-btn"
            type="button"
            onClick={onToggleSound}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 active:scale-95 transition-all"
            aria-label={soundEnabled ? '効果音をミュート' : '効果音をオン'}
            title={soundEnabled ? '効果音: オン' : '効果音: オフ'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-slate-700" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          <button
            id="settings-btn"
            type="button"
            onClick={onOpenSettings}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 active:scale-95 transition-all"
            aria-label="設定と画像変更"
            title="デザイン設定・画像変更"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Status Bar: Moves, Matches & Restart Button */}
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              手数
            </span>
            <span className="text-base font-bold text-slate-800 tabular-nums">
              {moves}
              <span className="text-xs font-normal text-slate-500 ml-0.5">手</span>
            </span>
          </div>

          <div className="h-6 w-px bg-slate-200" />

          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              揃ったペア
            </span>
            <span className="text-base font-bold text-amber-600 tabular-nums">
              {matchedPairs}
              <span className="text-xs font-normal text-slate-400"> / {totalPairs}</span>
            </span>
          </div>
        </div>

        {/* Primary restart button requested in user prompt */}
        <button
          id="restart-game-btn"
          type="button"
          onClick={onRestart}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium shadow-sm active:scale-95 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>もう一度遊ぶ</span>
        </button>
      </div>
    </header>
  );
};
