import React, { useRef } from 'react';
import { GameSettings, CardImageSource, CardBackStyle, BackgroundTheme } from '../types';
import { DEFAULT_NAVIGATOR } from '../data/navigatorPhrases';
import {
  X,
  Upload,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Check,
  Eye,
  EyeOff,
  UserCheck,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  cardImages: CardImageSource[];
  onUpdateCardImage: (index: number, newUrl: string, name?: string) => void;
  onResetCardImages: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  cardImages,
  onUpdateCardImage,
  onResetCardImages,
}) => {
  const cardFileInputRef = useRef<HTMLInputElement | null>(null);
  const navigatorFileInputRef = useRef<HTMLInputElement | null>(null);
  const activeReplaceIndexRef = useRef<number | null>(null);

  if (!isOpen) return null;

  // Card image upload
  const handleSlotClick = (index: number) => {
    activeReplaceIndexRef.current = index;
    if (cardFileInputRef.current) {
      cardFileInputRef.current.value = '';
      cardFileInputRef.current.click();
    }
  };

  const handleCardFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || activeReplaceIndexRef.current === null) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result && activeReplaceIndexRef.current !== null) {
        onUpdateCardImage(
          activeReplaceIndexRef.current,
          result,
          file.name.replace(/\.[^/.]+$/, '')
        );
      }
    };
    reader.readAsDataURL(file);
  };

  // Navigator image upload
  const handleNavigatorFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onUpdateSettings({
          navigator: {
            ...settings.navigator,
            imageUrl: result,
          },
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetNavigator = () => {
    onUpdateSettings({
      navigator: {
        ...DEFAULT_NAVIGATOR,
      },
    });
  };

  const cardBackOptions: { id: CardBackStyle; label: string; preview: string }[] = [
    { id: 'simple', label: 'シンプル (Navy)', preview: 'bg-slate-900 border-amber-400/40 text-amber-300' },
    { id: 'magic', label: '魔法のカード', preview: 'bg-indigo-950 border-indigo-400 text-indigo-300' },
    { id: 'minimal', label: 'ミニマル (Gray)', preview: 'bg-slate-100 border-slate-300 text-slate-600' },
  ];

  const bgOptions: { id: BackgroundTheme; label: string; bgClass: string }[] = [
    { id: 'cream', label: 'ウォーム', bgClass: 'bg-amber-50' },
    { id: 'magic-night', label: 'スターナイト', bgClass: 'bg-slate-900' },
    { id: 'lavender', label: 'ラベンダー', bgClass: 'bg-purple-50' },
    { id: 'slate', label: 'スレート', bgClass: 'bg-slate-100' },
  ];

  return (
    <div
      id="settings-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in"
    >
      <div
        id="settings-modal-content"
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-5 max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-800">画像・設定</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-500"
            aria-label="閉じる"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5 text-sm">
          {/* NAVIGATOR SETTINGS */}
          <div className="p-3.5 bg-amber-50/60 border border-amber-200/80 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-amber-600" />
                <span className="font-bold text-slate-800">ナビゲーター設定</span>
              </div>
              <button
                type="button"
                onClick={() =>
                  onUpdateSettings({
                    navigator: {
                      ...settings.navigator,
                      enabled: !settings.navigator.enabled,
                    },
                  })
                }
                className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  settings.navigator.enabled
                    ? 'bg-amber-500 text-white border-amber-600'
                    : 'bg-white text-slate-500 border-slate-300'
                }`}
              >
                {settings.navigator.enabled ? (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>表示中</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>非表示</span>
                  </>
                )}
              </button>
            </div>

            {/* Navigator Profile & Image Upload Controls */}
            {settings.navigator.enabled && (
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-3">
                  {/* Avatar preview */}
                  <div className="relative w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-pink-300 shadow-sm shrink-0">
                    <div className="w-full h-full rounded-full overflow-hidden bg-white border-2 border-white">
                      <img
                        src={settings.navigator.imageUrl}
                        alt={settings.navigator.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => navigatorFileInputRef.current?.click()}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-medium hover:bg-slate-50 active:scale-95 transition-all shadow-2xs"
                      >
                        <Upload className="w-3.5 h-3.5 text-amber-600" />
                        <span>画像を変更</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleResetNavigator}
                        className="px-2.5 py-1.5 rounded-lg text-xs text-slate-500 hover:text-slate-800 hover:bg-white border border-transparent hover:border-slate-200 transition-all"
                        title="パティシエにゃんに戻す"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-500 shrink-0">名前:</span>
                      <input
                        type="text"
                        value={settings.navigator.name}
                        onChange={(e) =>
                          onUpdateSettings({
                            navigator: {
                              ...settings.navigator,
                              name: e.target.value,
                            },
                          })
                        }
                        placeholder="ナビゲーター名"
                        className="flex-1 text-xs px-2 py-1 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
                        maxLength={15}
                      />
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  ゲームの展開に合わせて実況や応援をしてくれます。お好きな写真やイラストをアップロード可能です。
                </p>

                {/* Hidden navigator image input */}
                <input
                  ref={navigatorFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleNavigatorFileChange}
                />
              </div>
            )}
          </div>

          {/* Card Back Selection */}
          <div>
            <label className="block font-semibold text-slate-700 mb-2">
              カード裏面のデザイン
            </label>
            <div className="grid grid-cols-3 gap-2">
              {cardBackOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onUpdateSettings({ cardBackStyle: opt.id })}
                  className={`p-2 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                    settings.cardBackStyle === opt.id
                      ? 'border-amber-500 ring-2 ring-amber-400/30 bg-amber-50/50 text-slate-800 font-semibold'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className={`w-9 h-12 rounded-md border flex items-center justify-center ${opt.preview}`}>
                    {settings.cardBackStyle === opt.id && <Check className="w-4 h-4" />}
                  </div>
                  <span className="text-xs">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Background Theme */}
          <div>
            <label className="block font-semibold text-slate-700 mb-2">
              背景テーマ
            </label>
            <div className="grid grid-cols-4 gap-2">
              {bgOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onUpdateSettings({ bgTheme: opt.id })}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                    settings.bgTheme === opt.id
                      ? 'border-amber-500 ring-2 ring-amber-400/30 font-semibold'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-full border border-slate-300 ${opt.bgClass} flex items-center justify-center`}>
                    {settings.bgTheme === opt.id && <Check className="w-3.5 h-3.5 text-slate-700" />}
                  </div>
                  <span className="text-[11px] text-slate-600">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sound & Image Fit Controls */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">効果音</span>
              <button
                type="button"
                onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
                className={`p-1.5 rounded-lg border flex items-center gap-1 text-xs font-medium ${
                  settings.soundEnabled
                    ? 'bg-amber-500 text-white border-amber-600'
                    : 'bg-white text-slate-500 border-slate-300'
                }`}
              >
                {settings.soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{settings.soundEnabled ? 'オン' : 'オフ'}</span>
              </button>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">表示モード</span>
              <button
                type="button"
                onClick={() =>
                  onUpdateSettings({
                    cardFitMode: settings.cardFitMode === 'contain' ? 'cover' : 'contain',
                  })
                }
                className="p-1.5 rounded-lg border bg-white border-slate-300 text-slate-700 text-xs font-medium hover:bg-slate-100"
              >
                {settings.cardFitMode === 'contain' ? '比率維持 (Fit)' : '全画面 (Cover)'}
              </button>
            </div>
          </div>

          {/* Image Customizer (6 card slots) */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="font-semibold text-slate-700">カード画像（6枚）</span>
                <p className="text-[11px] text-slate-500">タップして端末から画像を差し替えできます</p>
              </div>
              <button
                type="button"
                onClick={onResetCardImages}
                className="text-xs text-amber-600 hover:text-amber-700 flex items-center gap-1 font-medium"
              >
                <RotateCcw className="w-3 h-3" />
                <span>元に戻す</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {cardImages.map((img, idx) => (
                <div
                  key={img.id}
                  onClick={() => handleSlotClick(idx)}
                  className="group relative aspect-[3/4] rounded-lg border-2 border-dashed border-slate-300 hover:border-amber-400 bg-slate-50 cursor-pointer overflow-hidden flex flex-col items-center justify-center p-1 transition-all"
                  title="画像をタップして差し替え"
                >
                  <img
                    src={img.url}
                    alt={img.name}
                    className="w-full h-full object-contain pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity">
                    <Upload className="w-4 h-4 mb-0.5" />
                    <span className="text-[10px]">変更</span>
                  </div>
                  <span className="absolute bottom-1 inset-x-1 text-[9px] text-center bg-black/60 text-white rounded px-0.5 truncate">
                    {img.name}
                  </span>
                </div>
              ))}
            </div>
            {/* Hidden card file input */}
            <input
              ref={cardFileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCardFileChange}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium text-sm shadow-sm transition-colors"
          >
            完了
          </button>
        </div>
      </div>
    </div>
  );
};
