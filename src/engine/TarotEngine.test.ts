import { describe, it, expect } from 'vitest';
import { TarotCard, DrawnCard } from '../types';
import { createDeck } from '../data/tarotDeck';
import { shuffle, drawCard, findNextPosition, allPositionsFilled } from './TarotEngine';

// Build a minimal spread for testing
const testSpread = {
  id: 'test',
  name: 'Test',
  description: '',
  cardCount: 3,
  layoutShape: 'line' as const,
  positions: [
    { id: 'pos1', label: 'Pos 1', x: 20, y: 50 },
    { id: 'pos2', label: 'Pos 2', x: 50, y: 50 },
    { id: 'pos3', label: 'Pos 3', x: 80, y: 50 },
  ],
};

describe('TarotEngine', () => {
  describe('shuffle', () => {
    it('returns a new array (does not mutate original)', () => {
      const deck = createDeck();
      const original = [...deck];
      const shuffled = shuffle(deck);
      expect(shuffled).not.toBe(deck);
      expect(deck).toEqual(original); // original unchanged
    });

    it('contains all the same cards', () => {
      const deck = createDeck();
      const shuffled = shuffle(deck);
      expect(shuffled).toHaveLength(78);
      const ids = shuffled.map(c => c.id).sort();
      const originalIds = deck.map(c => c.id).sort();
      expect(ids).toEqual(originalIds);
    });

    it('usually produces a different order', () => {
      const deck = createDeck();
      // Run multiple shuffles; at least one should differ
      let anyDifferent = false;
      for (let i = 0; i < 10; i++) {
        const shuffled = shuffle(deck);
        if (shuffled[0].id !== deck[0].id) {
          anyDifferent = true;
          break;
        }
      }
      expect(anyDifferent).toBe(true);
    });
  });

  describe('drawCard', () => {
    it('draws the first available card when no specific card given', () => {
      const deck = createDeck();
      const result = drawCard(deck, new Set(), 'pos1');
      expect(result).not.toBeNull();
      expect(result!.positionId).toBe('pos1');
      expect(result!.card.id).toBe(deck[0].id);
    });

    it('skips already drawn cards', () => {
      const deck = createDeck();
      const drawn = new Set([deck[0].id]);
      const result = drawCard(deck, drawn, 'pos2');
      expect(result).not.toBeNull();
      expect(result!.card.id).toBe(deck[1].id);
    });

    it('respects selectedCard parameter', () => {
      const deck = createDeck();
      const target = deck[5];
      const result = drawCard(deck, new Set(), 'pos1', target);
      expect(result).not.toBeNull();
      expect(result!.card.id).toBe(target.id);
    });

    it('returns null when selectedCard is already drawn', () => {
      const deck = createDeck();
      const target = deck[3];
      const drawn = new Set([target.id]);
      const result = drawCard(deck, drawn, 'pos1', target);
      expect(result).toBeNull();
    });

    it('returns null when all cards are drawn', () => {
      const deck = createDeck();
      const allIds = new Set(deck.map(c => c.id));
      const result = drawCard(deck, allIds, 'pos1');
      expect(result).toBeNull();
    });

    it('assigns isReversed randomly (boolean)', () => {
      const deck = createDeck();
      // Run many draws and check both true/false appear
      let trueCount = 0;
      let falseCount = 0;
      for (let i = 0; i < 100; i++) {
        const result = drawCard(deck, new Set(), 'pos1');
        if (result!.isReversed) trueCount++;
        else falseCount++;
      }
      expect(trueCount).toBeGreaterThan(0);
      expect(falseCount).toBeGreaterThan(0);
    });
  });

  describe('findNextPosition', () => {
    it('returns first empty position', () => {
      const next = findNextPosition(testSpread, new Set());
      expect(next).toBe('pos1');
    });

    it('returns next empty after some filled', () => {
      const next = findNextPosition(testSpread, new Set(['pos1']));
      expect(next).toBe('pos2');
    });

    it('returns null when all filled', () => {
      const next = findNextPosition(testSpread, new Set(['pos1', 'pos2', 'pos3']));
      expect(next).toBeNull();
    });
  });

  describe('allPositionsFilled', () => {
    it('returns false when not enough cards', () => {
      expect(allPositionsFilled(testSpread, 2)).toBe(false);
    });

    it('returns true when all drawn', () => {
      expect(allPositionsFilled(testSpread, 3)).toBe(true);
      expect(allPositionsFilled(testSpread, 4)).toBe(true);
    });
  });
});
