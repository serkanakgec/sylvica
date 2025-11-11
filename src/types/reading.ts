export type ReadingType =
  | 'daily'
  | '3-card'
  | 'celtic-cross'
  | 'relationship'
  | 'career'
  | 'soulmate'
  | 'year'
  | 'divination'
  | 'psychological'
  | 'spiritual'
  | 'meditation'
  | 'decision'
  | 'turkish-coffee'
  | 'face-reading'
  | 'palm-reading';

export interface ReadingTypeConfig {
  id: ReadingType;
  cardCount: number;
  icon: string;
  category: 'classic' | 'thematic' | 'special';
  inputType: 'card' | 'image';
}

export interface SelectedCard {
  cardId: string;
  position: number;
  orientation: 'upright' | 'reversed';
}

export interface ReadingData {
  readingType: ReadingType;
  selectedCards: SelectedCard[];
  question: string;
  userName?: string;
}

// İsim ve açıklamalar artık translations.ts dosyasından gelecek, buradan kaldırıldı.
export const readingTypes: ReadingTypeConfig[] = [
  {
    id: 'daily',
    cardCount: 1,
    icon: '☀️',
    category: 'classic',
    inputType: 'card'
  },
  {
    id: '3-card',
    cardCount: 3,
    icon: '🔮',
    category: 'classic',
    inputType: 'card'
  },
  {
    id: 'celtic-cross',
    cardCount: 10,
    icon: '✨',
    category: 'classic',
    inputType: 'card'
  },
  {
    id: 'relationship',
    cardCount: 7,
    icon: '❤️',
    category: 'classic',
    inputType: 'card'
  },
  {
    id: 'career',
    cardCount: 6,
    icon: '💼',
    category: 'classic',
    inputType: 'card'
  },
  {
    id: 'soulmate',
    cardCount: 7,
    icon: '💫',
    category: 'classic',
    inputType: 'card'
  },
  {
    id: 'year',
    cardCount: 12,
    icon: '📅',
    category: 'classic',
    inputType: 'card'
  },
  {
    id: 'divination',
    cardCount: 5,
    icon: '🔭',
    category: 'thematic',
    inputType: 'card'
  },
  {
    id: 'psychological',
    cardCount: 6,
    icon: '🧠',
    category: 'thematic',
    inputType: 'card'
  },
  {
    id: 'spiritual',
    cardCount: 5,
    icon: '🕉️',
    category: 'thematic',
    inputType: 'card'
  },
  {
    id: 'meditation',
    cardCount: 4,
    icon: '🧘',
    category: 'thematic',
    inputType: 'card'
  },
  {
    id: 'decision',
    cardCount: 5,
    icon: '⚖️',
    category: 'thematic',
    inputType: 'card'
  },
  {
    id: 'turkish-coffee',
    cardCount: 0,
    icon: '☕',
    category: 'special',
    inputType: 'image'
  },
  {
    id: 'face-reading',
    cardCount: 0,
    icon: '😊',
    category: 'special',
    inputType: 'image'
  },
  {
    id: 'palm-reading',
    cardCount: 0,
    icon: '✋',
    category: 'special',
    inputType: 'image'
  }
];
