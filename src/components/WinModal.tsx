import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Star } from 'lucide-react';

interface WinModalProps {
  isOpen: boolean;
  moves: number;
  elapsedSeconds: number;
  onRestart: () => void;
}

export const WinModal: React.FC<WinModalProps> = ({
  isOpen,
  moves,
  elapsedSeconds,
  onRestart,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Fire celebratory confetti bursts
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
        zIndex: 9999,
      };

      const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      };

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });
      fire(0.2, {
        spread: 60,
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Star rating calculation based on moves
  // Perfect: 6 moves (minimum theoretically possible)
  const stars = moves <= 8 ? 3 : moves <= 14 ? 2 : 1;

  return (
    <div
      id="win-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        id="win-modal-content"
        className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-amber-200 p-6 flex flex-col items-center text-center relative overflow-hidden"
      >
        {/* Glow accent */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-200/50 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-amber-300/30 rounded-full blur-2xl pointer-events-none" />

        {/* Trophy icon */}
        <div className="relative mb-3">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-white shadow-lg shadow-amber-300/50">
            <Trophy className="w-8 h-8 stroke-[2.2]" />
          </div>
        </div>

        {/* Celebration Title */}
        <h2 className="text-2xl font-bold text-slate-800 font-serif mb-1">
          Game Clear!
        </h2>
        <p className="text-sm font-medium text-amber-600 mb-4">
          おめでとうございます！すべてのペアが揃いました！
        </p>

        {/* Star Rating */}
        <div className="flex items-center gap-1 mb-5">
          {[1, 2, 3].map((starIndex) => (
            <Star
              key={starIndex}
              className={`w-7 h-7 ${
                starIndex <= stars
                  ? 'text-amber-400 fill-amber-400 drop-shadow'
                  : 'text-slate-200 fill-slate-100'
              }`}
            />
          ))}
        </div>

        {/* Score Board */}
        <div className="w-full grid grid-cols-2 gap-3 bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 mb-6">
          <div className="flex flex-col items-center">
            <span className="text-xs text-slate-500 font-medium">合計手数</span>
            <span className="text-xl font-bold text-slate-800 tabular-nums">
              {moves}
              <span className="text-xs font-normal text-slate-500 ml-1">手</span>
            </span>
          </div>

          <div className="flex flex-col items-center border-l border-slate-200">
            <span className="text-xs text-slate-500 font-medium">クリアタイム</span>
            <span className="text-xl font-bold text-slate-800 tabular-nums">
              {elapsedSeconds}
              <span className="text-xs font-normal text-slate-500 ml-1">秒</span>
            </span>
          </div>
        </div>

        {/* Restart Button */}
        <button
          id="win-restart-button"
          type="button"
          onClick={onRestart}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold text-base shadow-md shadow-amber-500/25 active:scale-95 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>もう一度遊ぶ</span>
        </button>
      </div>
    </div>
  );
};
