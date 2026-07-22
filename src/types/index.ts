// ── Card types ──

export type ArcanaType = 'major' | 'minor';
export type Suit = 'wands' | 'cups' | 'swords' | 'pentacles';
export type CourtRank = 'page' | 'knight' | 'queen' | 'king';

export interface TarotCard {
  id: string;
  arcana: ArcanaType;
  number: number;
  nameZh: string;
  nameEn: string;
  suit?: Suit;
  suitNameZh?: string;
  keywords: string[];
  uprightMeaning: string;
  reversedMeaning: string;
  description: string;
}

// ── Spread types ──

export type LayoutShape = 'single' | 'line' | 'cross' | 'tree' | 'pentagram' | 'grid';

export interface SpreadPosition {
  id: string;
  label: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
}

export interface SpreadConfig {
  id: string;
  name: string;
  description: string;
  cardCount: number;
  positions: SpreadPosition[];
  layoutShape: LayoutShape;
}

// ── Game state ──

export type GamePhase =
  | 'meditation'
  | 'selecting'
  | 'shuffling'
  | 'drawing'
  | 'revealing'
  | 'result';

export interface DrawnCard {
  positionId: string;
  card: TarotCard;
  isReversed: boolean;
}

export interface GameState {
  phase: GamePhase;
  deck: TarotCard[];
  selectedSpread: SpreadConfig | null;
  userQuestion: string;
  drawnCards: Map<string, DrawnCard>;
  flippedCardIds: Set<string>;
  currentDrawPosition: string | null;
  shuffleCount: number;
  activeCardIndex: number;
}

// ── History ──

export interface ReadingCard {
  positionId: string;
  positionLabel: string;
  cardId: string;
  cardNameEn: string;
  cardNameZh: string;
  isReversed: boolean;
}

export interface ReadingRecord {
  id: string;
  timestamp: number;
  spreadType: string;
  spreadName: string;
  question: string;
  cards: ReadingCard[];
}
