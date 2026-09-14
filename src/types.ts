export interface CardItem {
  id: string; // unique card instance ID (e.g. 'c1-1', 'c1-2')
  pairId: string; // ID of the pair (e.g. 'img-1')
  imageUrl: string;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
  isShaking?: boolean;
}

export interface CardImageSource {
  id: string;
  name: string;
  url: string;
}

export type CardBackStyle = 'simple' | 'magic' | 'minimal' | 'indigo';

export type BackgroundTheme = 'cream' | 'magic-night' | 'slate' | 'lavender';

export interface NavigatorConfig {
  enabled: boolean;
  imageUrl: string;
  name: string;
}

export type NavigatorMood = 'start' | 'match' | 'streak' | 'mismatch' | 'last_one' | 'clear' | 'tap';

export interface GameSettings {
  soundEnabled: boolean;
  cardBackStyle: CardBackStyle;
  bgTheme: BackgroundTheme;
  cardFitMode: 'contain' | 'cover';
  navigator: NavigatorConfig;
}
