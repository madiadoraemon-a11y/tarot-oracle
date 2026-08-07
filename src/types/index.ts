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

export type InteractionMode = 'classic' | 'gesture';

export type GesturePhase =
  | 'mode-selection'
  | 'camera-setup'
  | 'calibration'
  | 'reading-ready'
  | 'reading-armed'
  | 'reading'
  | 'completed';

export type GamePhase =
  | 'meditation'
  | 'selecting'
  | 'mode-selection'
  | 'shuffling'
  | 'drawing'
  | 'revealing'
  | 'result'
  | GesturePhase;

export type GestureIntent =
  | { type: 'HAND_VISIBLE'; confidence: number }
  | { type: 'SHUFFLE_PROGRESS'; progress: number; direction: -1 | 1 }
  | { type: 'CARD_HOVER'; normalizedX: number; normalizedY: number }
  | { type: 'CARD_SCROLL'; direction: -1 | 1 }
  | { type: 'SCROLL_POSITION'; normalizedX: number }
  | { type: 'CURSOR_MODE'; normalizedX: number; normalizedY: number }
  | { type: 'DRAW_ARMED'; cardId: string }
  | { type: 'DRAW_CONFIRMED'; cardId: string }
  | { type: 'REVEAL_TRIGGERED' }
  | { type: 'READING_OPEN_PALM_CONFIRMED' }
  | { type: 'READING_FIST_CONFIRMED' }
  | { type: 'GESTURE_CANCELLED'; reason: string };


export interface DrawnCard {
  positionId: string;
  card: TarotCard;
  isReversed: boolean;
}

export interface FlyingCardInfo {
  card: TarotCard;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export interface GameState {
  phase: GamePhase;
  interactionMode: InteractionMode;
  deck: TarotCard[];
  selectedSpread: SpreadConfig | null;
  userQuestion: string;
  drawnCards: Map<string, DrawnCard>;
  flippedCardIds: Set<string>;
  currentDrawPosition: string | null;
  shuffleCount: number;
  activeCardIndex: number;
  // Gesture-related
  cameraReady: boolean;
  handDetected: boolean;
  hoveredCardId: string | null;
  readingArmedAt: number | null;
  readingTriggered: boolean;
  readingContent: string;
  readingStatus: 'idle' | 'generating' | 'completed' | 'failed' | 'timeout';
  // Flying card animation
  flyingCard: FlyingCardInfo | null;
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
