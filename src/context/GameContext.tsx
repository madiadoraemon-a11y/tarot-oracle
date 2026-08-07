import React, { createContext, useContext, useReducer, useCallback } from 'react';
import {
  GameState, GamePhase, TarotCard, SpreadConfig,
  DrawnCard, InteractionMode,
} from '../types';
import { createDeck } from '../data/tarotDeck';
import { shuffle, findNextPosition, allPositionsFilled } from '../engine/TarotEngine';

// ── Actions ──

type GameAction =
  | { type: 'SET_QUESTION'; question: string }
  | { type: 'SELECT_SPREAD'; spread: SpreadConfig }
  | { type: 'SELECT_MODE'; mode: InteractionMode }
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
  | { type: 'BACK_TO_MODE_SELECTION' }
  | { type: 'RESET_GAME' }
  // Gesture-specific actions
  | { type: 'CAMERA_READY' }
  | { type: 'CALIBRATION_DONE' }
  | { type: 'SET_HAND_DETECTED'; detected: boolean }
  | { type: 'ARM_READING' }
  | { type: 'CANCEL_READING_ARMED' }
  | { type: 'TRIGGER_READING' }
  | { type: 'SET_READING_STATUS'; status: GameState['readingStatus'] }
  | { type: 'SET_READING_CONTENT'; content: string }
  | { type: 'SKIP_CURRENT_STAGE' }
  | { type: 'SWITCH_MODE'; mode: InteractionMode }
  | { type: 'SET_HOVERED_CARD'; cardId: string | null }
  | { type: 'SET_FLYING_CARD'; flyingCard: GameState['flyingCard'] }
  | { type: 'CLEAR_FLYING_CARD' }
  | { type: 'REVEAL_FOR_READING' };

// ── Initial state ──

function initialState(): GameState {
  return {
    phase: 'meditation',
    interactionMode: 'classic',
    deck: createDeck(),
    selectedSpread: null,
    userQuestion: '',
    drawnCards: new Map(),
    flippedCardIds: new Set(),
    currentDrawPosition: null,
    shuffleCount: 0,
    activeCardIndex: 0,
    cameraReady: false,
    handDetected: false,
    hoveredCardId: null,
    readingArmedAt: null,
    readingTriggered: false,
    readingContent: '',
    readingStatus: 'idle',
    flyingCard: null,
  };
}

// ── Reducer ──

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_QUESTION':
      return { ...state, userQuestion: action.question };

    case 'SELECT_SPREAD': {
      const shuffledDeck = shuffle(state.deck);
      return {
        ...state,
        selectedSpread: action.spread,
        deck: shuffledDeck,
        drawnCards: new Map(),
        flippedCardIds: new Set(),
        phase: 'mode-selection',
      };
    }

    case 'SELECT_MODE':
      return {
        ...state,
        interactionMode: action.mode,
        phase: action.mode === 'gesture' ? 'camera-setup' : 'shuffling',
      };

    case 'CAMERA_READY':
      return { ...state, cameraReady: true, phase: 'calibration' };

    case 'CALIBRATION_DONE':
      return { ...state, phase: 'shuffling' };

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
      const alreadyDrawnIds = new Set(
        Array.from(state.drawnCards.values()).map(dc => dc.card.id)
      );
      // Use the card the user actually selected (not a random one)
      if (alreadyDrawnIds.has(action.card.id)) return state;
      const drawn: DrawnCard = {
        positionId: action.positionId,
        card: action.card,
        isReversed: Math.random() < 0.5,
      };

      const newDrawn = new Map(state.drawnCards);
      newDrawn.set(action.positionId, drawn);

      const nextPos = findNextPosition(
        state.selectedSpread!,
        new Set(newDrawn.keys())
      );

      const allDone = state.selectedSpread
        ? allPositionsFilled(state.selectedSpread, newDrawn.size)
        : false;

      const nextPhase = allDone ? 'revealing' : 'drawing';

      return {
        ...state,
        drawnCards: newDrawn,
        currentDrawPosition: nextPos,
        phase: nextPhase as GameState['phase'],
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

    case 'BACK_TO_MODE_SELECTION':
      return { ...state, phase: 'mode-selection' };

    case 'RESET_GAME':
      return initialState();

    // ── Gesture actions ──

    case 'SET_HAND_DETECTED':
      return { ...state, handDetected: action.detected };

    case 'ARM_READING':
      return { ...state, phase: 'reading-armed', readingArmedAt: Date.now() };

    case 'CANCEL_READING_ARMED':
      return { ...state, phase: 'reading-ready', readingArmedAt: null };

    case 'TRIGGER_READING':
      return {
        ...state,
        phase: 'reading',
        readingTriggered: true,
        readingStatus: 'generating',
      };

    case 'SET_READING_STATUS':
      return { ...state, readingStatus: action.status };

    case 'SET_READING_CONTENT':
      return { ...state, readingContent: action.content };

    case 'SKIP_CURRENT_STAGE': {
      // Skip to next logical stage based on current phase
      const skipMap: Record<string, GamePhase> = {
        'camera-setup': 'shuffling',
        'calibration': 'shuffling',
        'shuffling': 'drawing',
        'drawing': state.interactionMode === 'gesture' ? 'reading' : 'revealing',
        'reading-ready': 'reading',
        'reading-armed': 'reading',
      };
      const skipTarget = skipMap[state.phase] ?? state.phase;
      if (skipTarget === 'revealing' || skipTarget === 'result') {
        const allIds = new Set<string>();
        state.drawnCards.forEach(dc => allIds.add(dc.card.id));
        return { ...state, phase: skipTarget, flippedCardIds: allIds };
      }
      if (skipTarget === 'reading') {
        return { ...state, phase: 'reading', readingTriggered: true, readingStatus: 'generating' };
      }
      return { ...state, phase: skipTarget };
    }

    case 'SET_HOVERED_CARD':
      return { ...state, hoveredCardId: action.cardId };

    case 'SET_FLYING_CARD':
      return { ...state, flyingCard: action.flyingCard };

    case 'CLEAR_FLYING_CARD':
      return { ...state, flyingCard: null };

    case 'REVEAL_FOR_READING': {
      const allIds = new Set<string>();
      state.drawnCards.forEach(dc => allIds.add(dc.card.id));
      return { ...state, flippedCardIds: allIds, phase: 'reading-ready' };
    }

    case 'SWITCH_MODE': {
      if (action.mode === state.interactionMode) return state;
      const newPhase: GamePhase = action.mode === 'gesture'
        ? 'camera-setup'
        : (state.phase === 'reading-ready' || state.phase === 'reading-armed' || state.phase === 'reading'
          ? 'revealing' : state.phase);
      return {
        ...state,
        interactionMode: action.mode,
        phase: newPhase,
        cameraReady: false,
        readingArmedAt: null,
      };
    }

    default:
      return state;
  }
}

// ── Context ──

interface GameContextValue {
  state: GameState;
  setQuestion: (q: string) => void;
  selectSpread: (spread: SpreadConfig) => void;
  selectMode: (mode: InteractionMode) => void;
  startShuffle: () => void;
  shuffleComplete: (deck: TarotCard[]) => void;
  drawCardAction: (positionId: string, card: TarotCard) => void;
  setCurrentPosition: (id: string | null) => void;
  flipCard: (cardId: string) => void;
  setActiveIndex: (index: number) => void;
  revealAll: () => void;
  goToResult: () => void;
  backToSelect: () => void;
  backToMeditation: () => void;
  backToModeSelection: () => void;
  resetGame: () => void;
  // Gesture
  cameraReady: () => void;
  calibrationDone: () => void;
  setHandDetected: (detected: boolean) => void;
  armReading: () => void;
  cancelReadingArmed: () => void;
  triggerReading: () => void;
  setReadingStatus: (status: GameState['readingStatus']) => void;
  setReadingContent: (content: string) => void;
  skipCurrentStage: () => void;
  switchMode: (mode: InteractionMode) => void;
  setHoveredCardId: (cardId: string | null) => void;
  setFlyingCard: (flyingCard: GameState['flyingCard']) => void;
  clearFlyingCard: () => void;
  revealForReading: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, null, initialState);

  const setQuestion = useCallback((q: string) => dispatch({ type: 'SET_QUESTION', question: q }), []);
  const selectSpread = useCallback((s: SpreadConfig) => dispatch({ type: 'SELECT_SPREAD', spread: s }), []);
  const selectMode = useCallback((m: InteractionMode) => dispatch({ type: 'SELECT_MODE', mode: m }), []);
  const startShuffle = useCallback(() => dispatch({ type: 'START_SHUFFLE' }), []);
  const shuffleComplete = useCallback((d: TarotCard[]) => dispatch({ type: 'SHUFFLE_COMPLETE', deck: d }), []);
  const drawCardAction = useCallback((pos: string, card: TarotCard) => dispatch({ type: 'DRAW_CARD', positionId: pos, card }), []);
  const setCurrentPosition = useCallback((id: string | null) => dispatch({ type: 'SET_CURRENT_POSITION', positionId: id }), []);
  const flipCard = useCallback((id: string) => dispatch({ type: 'FLIP_CARD', cardId: id }), []);
  const setActiveIndex = useCallback((i: number) => dispatch({ type: 'SET_ACTIVE_INDEX', index: i }), []);
  const revealAll = useCallback(() => dispatch({ type: 'REVEAL_ALL' }), []);
  const goToResult = useCallback(() => dispatch({ type: 'GO_TO_RESULT' }), []);
  const backToSelect = useCallback(() => dispatch({ type: 'BACK_TO_SELECT' }), []);
  const backToMeditation = useCallback(() => dispatch({ type: 'BACK_TO_MEDITATION' }), []);
  const backToModeSelection = useCallback(() => dispatch({ type: 'BACK_TO_MODE_SELECTION' }), []);
  const resetGame = useCallback(() => dispatch({ type: 'RESET_GAME' }), []);
  // Gesture
  const cameraReadyFn = useCallback(() => dispatch({ type: 'CAMERA_READY' }), []);
  const calibrationDone = useCallback(() => dispatch({ type: 'CALIBRATION_DONE' }), []);
  const setHandDetected = useCallback((d: boolean) => dispatch({ type: 'SET_HAND_DETECTED', detected: d }), []);
  const armReading = useCallback(() => dispatch({ type: 'ARM_READING' }), []);
  const cancelReadingArmed = useCallback(() => dispatch({ type: 'CANCEL_READING_ARMED' }), []);
  const triggerReading = useCallback(() => dispatch({ type: 'TRIGGER_READING' }), []);
  const setReadingStatus = useCallback((s: GameState['readingStatus']) => dispatch({ type: 'SET_READING_STATUS', status: s }), []);
  const setReadingContent = useCallback((c: string) => dispatch({ type: 'SET_READING_CONTENT', content: c }), []);
  const skipCurrentStage = useCallback(() => dispatch({ type: 'SKIP_CURRENT_STAGE' }), []);
  const switchMode = useCallback((m: InteractionMode) => dispatch({ type: 'SWITCH_MODE', mode: m }), []);
  const setHoveredCardId = useCallback((id: string | null) => dispatch({ type: 'SET_HOVERED_CARD', cardId: id }), []);
  const setFlyingCard = useCallback((fc: GameState['flyingCard']) => dispatch({ type: 'SET_FLYING_CARD', flyingCard: fc }), []);
  const clearFlyingCard = useCallback(() => dispatch({ type: 'CLEAR_FLYING_CARD' }), []);
  const revealForReading = useCallback(() => dispatch({ type: 'REVEAL_FOR_READING' }), []);

  return (
    <GameContext.Provider value={{
      state, setQuestion, selectSpread, selectMode, startShuffle, shuffleComplete,
      drawCardAction, setCurrentPosition, flipCard, setActiveIndex, revealAll,
      goToResult, backToSelect, backToMeditation, backToModeSelection, resetGame,
      cameraReady: cameraReadyFn, calibrationDone, setHandDetected, armReading,
      cancelReadingArmed, triggerReading, setReadingStatus, setReadingContent,
      skipCurrentStage, switchMode, setHoveredCardId, setFlyingCard, clearFlyingCard,
      revealForReading,
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
