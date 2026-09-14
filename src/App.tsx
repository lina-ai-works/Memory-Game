/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CardItem, CardImageSource, GameSettings, NavigatorMood } from './types';
import { DEFAULT_CARD_IMAGES } from './data/defaultCards';
import { DEFAULT_NAVIGATOR, getRandomPhrase } from './data/navigatorPhrases';
import { Card } from './components/Card';
import { Header } from './components/Header';
import { Navigator } from './components/Navigator';
import { WinModal } from './components/WinModal';
import { SettingsModal } from './components/SettingsModal';
import { soundEffects } from './utils/sound';

export default function App() {
  // 6 Active card images
  const [cardImages, setCardImages] = useState<CardImageSource[]>(() => {
    try {
      const saved = localStorage.getItem('memory_game_card_images');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_CARD_IMAGES;
  });

  // Settings
  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem('memory_game_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          navigator: parsed.navigator || DEFAULT_NAVIGATOR,
        };
      }
    } catch {
      // ignore
    }
    return {
      soundEnabled: true,
      cardBackStyle: 'simple',
      bgTheme: 'cream',
      cardFitMode: 'contain',
      navigator: DEFAULT_NAVIGATOR,
    };
  });

  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [moves, setMoves] = useState<number>(0);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [isGameCleared, setIsGameCleared] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Navigator Live Commentary State
  const [navigatorMood, setNavigatorMood] = useState<NavigatorMood>('start');
  const [navigatorPhrase, setNavigatorPhrase] = useState<string>(() => getRandomPhrase('start'));
  const [consecutiveMatches, setConsecutiveMatches] = useState<number>(0);

  // Timer
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const timerRef = useRef<number | null>(null);

  // Initialize and shuffle cards
  const initializeGame = useCallback(() => {
    // 6 images duplicated into 12 cards
    const newCards: CardItem[] = [];
    cardImages.forEach((img) => {
      newCards.push({
        id: `${img.id}-a`,
        pairId: img.id,
        imageUrl: img.url,
        name: img.name,
        isFlipped: false,
        isMatched: false,
      });
      newCards.push({
        id: `${img.id}-b`,
        pairId: img.id,
        imageUrl: img.url,
        name: img.name,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Fisher-Yates Shuffle
    for (let i = newCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newCards[i], newCards[j]] = [newCards[j], newCards[i]];
    }

    setCards(newCards);
    setFlippedIds([]);
    setIsProcessing(false);
    setMoves(0);
    setMatchedPairs(0);
    setIsGameCleared(false);
    setStartTime(null);
    setElapsedSeconds(0);
    setConsecutiveMatches(0);
    setNavigatorMood('start');
    setNavigatorPhrase(getRandomPhrase('start'));

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [cardImages]);

  // Initial setup
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Save settings
  const handleUpdateSettings = (newSettings: Partial<GameSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('memory_game_settings', JSON.stringify(updated));
      return updated;
    });
  };

  // Custom card image update
  const handleUpdateCardImage = (index: number, newUrl: string, name?: string) => {
    setCardImages((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        url: newUrl,
        name: name || updated[index].name,
      };
      localStorage.setItem('memory_game_card_images', JSON.stringify(updated));
      return updated;
    });
  };

  // Reset to default cards
  const handleResetCardImages = () => {
    setCardImages(DEFAULT_CARD_IMAGES);
    localStorage.removeItem('memory_game_card_images');
  };

  // Timer tick
  useEffect(() => {
    if (startTime && !isGameCleared) {
      timerRef.current = window.setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } else if (isGameCleared && timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTime, isGameCleared]);

  // Handle card click
  const handleCardClick = (cardId: string) => {
    if (isProcessing) return;

    const targetCard = cards.find((c) => c.id === cardId);
    if (!targetCard || targetCard.isFlipped || targetCard.isMatched) return;

    // Start timer on first move
    if (!startTime) {
      setStartTime(Date.now());
    }

    // Play flip sound
    if (settings.soundEnabled) {
      soundEffects.playFlip();
    }

    // Flip target card
    const updatedCards = cards.map((c) =>
      c.id === cardId ? { ...c, isFlipped: true } : c
    );
    setCards(updatedCards);

    const newFlipped = [...flippedIds, cardId];
    setFlippedIds(newFlipped);

    // If this is the second card flipped
    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find((c) => c.id === firstId)!;
      const secondCard = targetCard;

      if (firstCard.pairId === secondCard.pairId) {
        // MATCH!
        setTimeout(() => {
          if (settings.soundEnabled) {
            soundEffects.playMatch();
          }

          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, isMatched: true, isFlipped: true }
                : c
            )
          );

          setFlippedIds([]);

          // Update consecutive streak
          const nextStreak = consecutiveMatches + 1;
          setConsecutiveMatches(nextStreak);

          setMatchedPairs((mp) => {
            const nextMatches = mp + 1;

            if (nextMatches === 6) {
              // Game Clear!
              setNavigatorMood('clear');
              setNavigatorPhrase(getRandomPhrase('clear'));
              setTimeout(() => {
                if (settings.soundEnabled) {
                  soundEffects.playWin();
                }
                setIsGameCleared(true);
              }, 400);
            } else if (nextMatches === 5) {
              // Only 1 pair remaining!
              setNavigatorMood('last_one');
              setNavigatorPhrase(getRandomPhrase('last_one'));
            } else if (nextStreak >= 2) {
              // Consecutive streak (2 or more in a row)!
              setNavigatorMood('streak');
              setNavigatorPhrase(getRandomPhrase('streak'));
            } else {
              // Standard match
              setNavigatorMood('match');
              setNavigatorPhrase(getRandomPhrase('match'));
            }

            return nextMatches;
          });
        }, 300);
      } else {
        // MISMATCH!
        setIsProcessing(true);
        setConsecutiveMatches(0);
        setNavigatorMood('mismatch');
        setNavigatorPhrase(getRandomPhrase('mismatch'));

        setTimeout(() => {
          if (settings.soundEnabled) {
            soundEffects.playMismatch();
          }

          // Trigger shake animation
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, isShaking: true }
                : c
            )
          );

          // Wait moment then flip back
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c) =>
                c.id === firstId || c.id === secondId
                  ? { ...c, isFlipped: false, isShaking: false }
                  : c
              )
            );
            setFlippedIds([]);
            setIsProcessing(false);
          }, 600);
        }, 400);
      }
    }
  };

  // Navigator Avatar tap reaction
  const handleTapNavigator = () => {
    setNavigatorMood('tap');
    setNavigatorPhrase(getRandomPhrase('tap'));
  };

  // Theme styling
  const getBgThemeClass = () => {
    switch (settings.bgTheme) {
      case 'magic-night':
        return 'bg-slate-900 text-slate-100';
      case 'lavender':
        return 'bg-gradient-to-b from-purple-50 via-pink-50 to-purple-100 text-slate-800';
      case 'slate':
        return 'bg-slate-100 text-slate-800';
      case 'cream':
      default:
        return 'bg-gradient-to-b from-amber-50/70 via-orange-50/40 to-amber-100/50 text-slate-800';
    }
  };

  return (
    <div
      id="memory-game-root"
      className={`min-h-screen w-full transition-colors duration-300 flex flex-col justify-between py-2 sm:py-4 px-3 sm:px-4 ${getBgThemeClass()}`}
    >
      <div className="w-full max-w-md mx-auto flex flex-col flex-1 gap-2.5 justify-between">
        {/* Header with Title, Moves & Reset Button */}
        <Header
          moves={moves}
          matchedPairs={matchedPairs}
          totalPairs={6}
          onRestart={initializeGame}
          soundEnabled={settings.soundEnabled}
          onToggleSound={() =>
            handleUpdateSettings({ soundEnabled: !settings.soundEnabled })
          }
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Live Navigator Commentary Widget (when enabled) */}
        {settings.navigator.enabled && (
          <Navigator
            config={settings.navigator}
            currentPhrase={navigatorPhrase}
            mood={navigatorMood}
            onTapNavigator={handleTapNavigator}
          />
        )}

        {/* 3 Columns x 4 Rows Card Grid (Exactly 12 cards for smartphone display) */}
        <main
          id="card-board-grid"
          className="w-full grid grid-cols-3 gap-2.5 sm:gap-3 py-1 my-auto"
          aria-label="神経衰弱カード盤面"
        >
          {cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              onClick={() => handleCardClick(card.id)}
              disabled={isProcessing}
              cardBackStyle={settings.cardBackStyle}
              cardFitMode={settings.cardFitMode}
            />
          ))}
        </main>

        {/* Mobile-friendly bottom bar with status hint and reset button */}
        <footer className="w-full flex items-center justify-between text-xs text-slate-500 select-none px-1 py-1">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              {isGameCleared
                ? '全ペア制覇！'
                : flippedIds.length === 1
                ? 'もう1枚めくってください'
                : 'カードをタップしてめくろう'}
            </span>
          </div>

          <button
            id="footer-reset-btn"
            type="button"
            onClick={initializeGame}
            className="text-amber-700 hover:text-amber-800 font-medium underline underline-offset-2 active:opacity-75"
          >
            シャッフルして最初から
          </button>
        </footer>
      </div>

      {/* Win Celebration Modal */}
      <WinModal
        isOpen={isGameCleared}
        moves={moves}
        elapsedSeconds={elapsedSeconds}
        onRestart={initializeGame}
      />

      {/* Customizer and Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        cardImages={cardImages}
        onUpdateCardImage={handleUpdateCardImage}
        onResetCardImages={handleResetCardImages}
      />
    </div>
  );
}
