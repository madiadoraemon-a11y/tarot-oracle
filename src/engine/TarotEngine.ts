/**
 * TarotEngine — Shared business logic for card operations.
 * Both classic and gesture modes use these functions.
 * Pure functions only; no camera, DOM, or React dependencies.
 */

import { TarotCard, DrawnCard, SpreadConfig } from '../types';
import { createDeck } from '../data/tarotDeck';

// ── Types ──

export interface SessionState {
  deck: TarotCard[];
  drawnCards: Map<string, DrawnCard>;
  drawOrder: string[]; // card IDs in order drawn
}

// ── Session ──

export function createSession(): SessionState {
  const deck = createDeck();
  return {
    deck: [...deck],
    drawnCards: new Map(),
    drawOrder: [],
  };
}

// ── Shuffle ──

export function shuffle(deck: TarotCard[]): TarotCard[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ── Draw ──
// If selectedCard is provided, use it (classic mode click).
// Otherwise, draw the next available card from the deck (gesture / skip mode).

export function drawCard(
  shuffledDeck: TarotCard[],
  alreadyDrawnIds: Set<string>,
  positionId: string,
  selectedCard?: TarotCard,
): DrawnCard | null {
  if (selectedCard) {
    if (alreadyDrawnIds.has(selectedCard.id)) return null;
    return {
      positionId,
      card: selectedCard,
      isReversed: Math.random() < 0.5,
    };
  }
  // Auto-draw: first available from shuffled deck
  for (const card of shuffledDeck) {
    if (!alreadyDrawnIds.has(card.id)) {
      return {
        positionId,
        card,
        isReversed: Math.random() < 0.5,
      };
    }
  }
  return null;
}

// ── Find next empty position ──

export function findNextPosition(
  spread: SpreadConfig,
  drawnPositions: Set<string>,
): string | null {
  for (const pos of spread.positions) {
    if (!drawnPositions.has(pos.id)) return pos.id;
  }
  return null;
}

// ── Check if all positions filled ──

export function allPositionsFilled(
  spread: SpreadConfig,
  drawnCount: number,
): boolean {
  return drawnCount >= spread.cardCount;
}
