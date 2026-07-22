import { TarotCard } from '../types';
import { majorArcana } from './majorArcana';
import { minorArcana } from './minorArcana';

/** Create a fresh deck of all 78 tarot cards */
export function createDeck(): TarotCard[] {
  return [...majorArcana, ...minorArcana];
}

/** Fisher-Yates shuffle — returns a new array */
export function shuffleDeck(deck: TarotCard[]): TarotCard[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/** Get Roman numeral for a number (for card display) */
export function romanNumeral(n: number): string {
  if (n === 0) return '0';
  const lookup: [number, string][] = [
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
  ];
  let result = '';
  let remaining = n;
  for (const [value, numeral] of lookup) {
    while (remaining >= value) {
      result += numeral;
      remaining -= value;
    }
  }
  return result;
}

/** Get the suit emoji character for display */
export function suitSymbol(suit?: string): string {
  switch (suit) {
    case 'wands': return '🜂';
    case 'cups': return '🜄';
    case 'swords': return '🜁';
    case 'pentacles': return '🜃';
    default: return '';
  }
}

/** Chinese number to word */
export function chineseNumber(n: number): string {
  if (n === 1) return '王牌';
  const map: Record<number, string> = {
    1: '一', 2: '二', 3: '三', 4: '四', 5: '五',
    6: '六', 7: '七', 8: '八', 9: '九', 10: '十',
  };
  return map[n] || String(n);
}

/** Determine if a drawn card is reversed (50% chance) */
export function isReversed(): boolean {
  return Math.random() < 0.5;
}
