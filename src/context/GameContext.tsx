import React, { createContext, useContext, useReducer, useCallback } from 'react';
import {
  GameState, GamePhase, TarotCard, SpreadConfig,
  DrawnCard,
} from '../types';
import { createDeck, shuffleDeck } from '../data/tarotDeck';

// ── Actions ──

type GameAction =
  | { type: 'SET_QUESTION'; question: string }
  | { type: 'SELECT_SPREAD'; spread: SpreadConfig }
  | { type: 'START_SHUFFLE' }
  | { type: 'SHUFFLE_COMPLETE'; deck: TarotCard[] }
  | { type: 'DRAW_CARD'; positionId: string; card: TarotCard }
  | { type: 'SET_CURRENT_POSITION'; positionId: string | null }
  | { type: 'FLIP_CARD'; cardId: string }
  | { type: 'SET_ACTIVE_INDEX'; index: number }
  | { type: 'REVEAL_ALL' }
  | { type: 'GO_TO_RESULT' }
  | { type: 'BACK_TO_SELECT' }
  | { type: 'BACK_TO_MEDITATION' }
  | { type: 'RESET_GAME' };

// ── Initial state ──

function initialState(): GameState {
  return {
    phase: 'meditation',
    deck: createDeck(),
    selectedSpread: null,
    userQuestion: '',
    drawnCards: new Map(),
    flippedCardIds: new Set(),
    currentDrawPosition: null,
    shuffleCount: 0,
    activeCardIndex: 0,
  };
}

// ── Reducer ──

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_QUESTION':
      return { ...state, userQuestion: action.question };

    case 'SELECT_SPREAD':
      return { ...state, selectedSpread: action.spread, phase: 'shuffling' };

    case 'START_SHUFFLE':
      return { ...state, phase: 'shuffling', shuffleCount: state.shuffleCount + 1 };

    case 'SHUFFLE_COMPLETE': {
      const firstPos = state.selectedSpread?.positions[0]?.id ?? null;
      return {
        ...state,
        deck: action.deck,
        phase: 'drawing',
        drawnCards: new Map(),
        flippedCardIds: new Set(),
        currentDrawPosition: firstPos,
      };
    }

    case 'DRAW_CARD': {
      const newDrawn = new Map(state.drawnCards);
      newDrawn.set(action.positionId, {
        positionId: action.positionId,
        card: action.card,
        isReversed: Math.random() < 0.5,
      });
      // Auto-advance to next empty position
      const spread = state.selectedSpread;
      let nextPos: string | null = null;
      if (spread) {
        for (const pos of spread.positions) {
          if (!newDrawn.has(pos.id)) {
            nextPos = pos.id;
            break;
          }
        }
      }
      const allDrawn = spread ? newDrawn.size >= spread.cardCount : false;
      return {
        ...state,
        drawnCards: newDrawn,
        currentDrawPosition: nextPos,
        phase: allDrawn ? 'revealing' : 'drawing',
      };
    }

    case 'SET_CURRENT_POSITION':
      return { ...state, currentDrawPosition: action.positionId };

    case 'FLIP_CARD': {
      const newFlipped = new Set(state.flippedCardIds);
      newFlipped.add(action.cardId);
      return { ...state, flippedCardIds: newFlipped };
    }

    case 'SET_ACTIVE_INDEX':
      return { ...state, activeCardIndex: action.index };

    case 'REVEAL_ALL': {
      const allIds = new Set<string>();
      state.drawnCards.forEach(dc => allIds.add(dc.card.id));
      return { ...state, flippedCardIds: allIds, phase: 'result' };
    }

    case 'GO_TO_RESULT':
      return { ...state, phase: 'result' };

    case 'BACK_TO_SELECT':
      return { ...state, phase: 'selecting', selectedSpread: null };

    case 'BACK_TO_MEDITATION':
      return { ...state, phase: 'meditation', selectedSpread: null, userQuestion: '' };

    case 'RESET_GAME':
      return initialState();

    default:
      return state;
  }
}

// ── Context ──

interface GameContextValue {
  state: GameState;
  setQuestion: (q: string) => void;
  selectSpread: (spread: SpreadConfig) => void;
  startShuffle: () => void;
  shuffleComplete: (deck: TarotCard[]) => void;
  drawCard: (positionId: string, card: TarotCard) => void;
  setCurrentPosition: (id: string | null) => void;
  flipCard: (cardId: string) => void;
  setActiveIndex: (index: number) => void;
  revealAll: () => void;
  goToResult: () => void;
  backToSelect: () => void;
  backToMeditation: () => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, null, initialState);

  const setQuestion = useCallback((q: string) => dispatch({ type: 'SET_QUESTION', question: q }), []);
  const selectSpread = useCallback((s: SpreadConfig) => dispatch({ type: 'SELECT_SPREAD', spread: s }), []);
  const startShuffle = useCallback(() => dispatch({ type: 'START_SHUFFLE' }), []);
  const shuffleComplete = useCallback((d: TarotCard[]) => dispatch({ type: 'SHUFFLE_COMPLETE', deck: d }), []);
  const drawCard = useCallback((pos: string, card: TarotCard) => dispatch({ type: 'DRAW_CARD', positionId: pos, card }), []);
  const setCurrentPosition = useCallback((id: string | null) => dispatch({ type: 'SET_CURRENT_POSITION', positionId: id }), []);
  const flipCard = useCallback((id: string) => dispatch({ type: 'FLIP_CARD', cardId: id }), []);
  const setActiveIndex = useCallback((i: number) => dispatch({ type: 'SET_ACTIVE_INDEX', index: i }), []);
  const revealAll = useCallback(() => dispatch({ type: 'REVEAL_ALL' }), []);
  const goToResult = useCallback(() => dispatch({ type: 'GO_TO_RESULT' }), []);
  const backToSelect = useCallback(() => dispatch({ type: 'BACK_TO_SELECT' }), []);
  const backToMeditation = useCallback(() => dispatch({ type: 'BACK_TO_MEDITATION' }), []);
  const resetGame = useCallback(() => dispatch({ type: 'RESET_GAME' }), []);

  return (
    <GameContext.Provider value={{
      state, setQuestion, selectSpread, startShuffle, shuffleComplete,
      drawCard, setCurrentPosition, flipCard, setActiveIndex, revealAll,
      goToResult, backToSelect, backToMeditation, resetGame,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
