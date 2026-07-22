/**
 * SVG symbol data for tarot card faces.
 * Suit emblems and geometric symbols for each Major Arcana.
 */

export type SymbolName =
  | 'wand' | 'cup' | 'sword' | 'pentacle'
  | 'the-fool' | 'the-magician' | 'the-high-priestess' | 'the-empress'
  | 'the-emperor' | 'the-hierophant' | 'the-lovers' | 'the-chariot'
  | 'strength' | 'the-hermit' | 'wheel-of-fortune' | 'justice'
  | 'the-hanged-man' | 'death' | 'temperance' | 'the-devil'
  | 'the-tower' | 'the-star' | 'the-moon' | 'the-sun'
  | 'judgement' | 'the-world';

// SVG path data — simple but distinctive geometric symbols
export const majorArcanaSymbols: Record<string, string> = {
  'the-fool': `
    <circle cx="70" cy="85" r="40" fill="none" stroke="currentColor" stroke-width="2"/>
    <path d="M40 70 Q70 35 100 70" fill="none" stroke="currentColor" stroke-width="2"/>
    <circle cx="70" cy="55" r="6" fill="currentColor" opacity="0.7"/>
    <circle cx="70" cy="140" r="3" fill="currentColor" opacity="0.5"/>
    <circle cx="55" cy="150" r="2" fill="currentColor" opacity="0.4"/>
    <circle cx="85" cy="148" r="2" fill="currentColor" opacity="0.4"/>
  `,
  'the-magician': `
    <path d="M35 100 C35 70 105 70 105 100 C105 130 35 130 35 100" fill="none" stroke="currentColor" stroke-width="2"/>
    <line x1="70" y1="50" x2="70" y2="85" stroke="currentColor" stroke-width="2"/>
    <circle cx="70" cy="42" r="7" fill="none" stroke="currentColor" stroke-width="2"/>
    <circle cx="52" cy="115" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="88" cy="115" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/>
  `,
  'the-high-priestess': `
    <circle cx="70" cy="90" r="45" fill="none" stroke="currentColor" stroke-width="2"/>
    <path d="M40 90 Q55 65 70 90 Q85 115 100 90" fill="none" stroke="currentColor" stroke-width="2"/>
    <circle cx="70" cy="75" r="5" fill="currentColor" opacity="0.6"/>
  `,
  'the-empress': `
    <circle cx="70" cy="85" r="35" fill="none" stroke="currentColor" stroke-width="2"/>
    <circle cx="70" cy="85" r="15" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <path d="M40 120 Q55 100 70 120 Q85 140 100 120" fill="none" stroke="currentColor" stroke-width="2"/>
    <circle cx="70" cy="135" r="4" fill="currentColor"/>
  `,
  'the-emperor': `
    <rect x="30" y="55" width="80" height="80" rx="4" fill="none" stroke="currentColor" stroke-width="2"/>
    <line x1="40" y1="75" x2="100" y2="75" stroke="currentColor" stroke-width="1.5"/>
    <line x1="40" y1="95" x2="100" y2="95" stroke="currentColor" stroke-width="1.5"/>
    <line x1="40" y1="115" x2="85" y2="115" stroke="currentColor" stroke-width="1.5"/>
    <polygon points="55,55 70,42 85,55" fill="none" stroke="currentColor" stroke-width="2"/>
  `,
  'the-hierophant': `
    <polygon points="70,45 45,85 95,85" fill="none" stroke="currentColor" stroke-width="2"/>
    <line x1="70" y1="85" x2="70" y2="120" stroke="currentColor" stroke-width="2"/>
    <line x1="48" y1="108" x2="92" y2="108" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="70" cy="135" r="3" fill="currentColor"/>
  `,
  'the-lovers': `
    <circle cx="50" cy="80" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
    <circle cx="90" cy="80" r="18" fill="none" stroke="currentColor" stroke-width="2"/>
    <path d="M45 60 Q70 40 95 60" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <line x1="70" y1="105" x2="70" y2="140" stroke="currentColor" stroke-width="1.5"/>
  `,
  'the-chariot': `
    <rect x="35" y="60" width="70" height="55" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
    <circle cx="50" cy="135" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
    <circle cx="90" cy="135" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
    <polygon points="55,60 70,42 85,60" fill="none" stroke="currentColor" stroke-width="2"/>
  `,
  'strength': `
    <circle cx="70" cy="95" r="35" fill="none" stroke="currentColor" stroke-width="2"/>
    <path d="M45 75 Q55 55 70 65 Q85 75 95 65" fill="none" stroke="currentColor" stroke-width="2"/>
    <circle cx="70" cy="75" r="8" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="70" cy="115" r="5" fill="currentColor" opacity="0.5"/>
  `,
  'the-hermit': `
    <polygon points="70,45 55,75 85,75" fill="none" stroke="currentColor" stroke-width="2"/>
    <line x1="70" y1="75" x2="70" y2="130" stroke="currentColor" stroke-width="2"/>
    <circle cx="70" cy="55" r="5" fill="currentColor" opacity="0.8"/>
    <line x1="50" y1="100" x2="90" y2="100" stroke="currentColor" stroke-width="1.5"/>
  `,
  'wheel-of-fortune': `
    <circle cx="70" cy="95" r="40" fill="none" stroke="currentColor" stroke-width="2"/>
    <circle cx="70" cy="95" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <line x1="70" y1="55" x2="70" y2="85" stroke="currentColor" stroke-width="2"/>
    <line x1="70" y1="105" x2="70" y2="135" stroke="currentColor" stroke-width="2"/>
    <line x1="30" y1="95" x2="60" y2="95" stroke="currentColor" stroke-width="2"/>
    <line x1="80" y1="95" x2="110" y2="95" stroke="currentColor" stroke-width="2"/>
  `,
  'justice': `
    <line x1="70" y1="50" x2="70" y2="80" stroke="currentColor" stroke-width="2"/>
    <circle cx="70" cy="50" r="6" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <rect x="40" y="80" width="60" height="50" rx="3" fill="none" stroke="currentColor" stroke-width="2"/>
    <line x1="70" y1="85" x2="70" y2="125" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="55" cy="105" r="12" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="85" cy="105" r="12" fill="none" stroke="currentColor" stroke-width="1.5"/>
  `,
  'the-hanged-man': `
    <line x1="70" y1="42" x2="70" y2="60" stroke="currentColor" stroke-width="2"/>
    <line x1="50" y1="42" x2="90" y2="42" stroke="currentColor" stroke-width="1.5"/>
    <line x1="70" y1="60" x2="70" y2="90" stroke="currentColor" stroke-width="2"/>
    <line x1="50" y1="75" x2="90" y2="75" stroke="currentColor" stroke-width="1.5"/>
    <line x1="70" y1="90" x2="70" y2="130" stroke="currentColor" stroke-width="2"/>
    <path d="M55 130 L70 118 L85 130" fill="none" stroke="currentColor" stroke-width="1.5"/>
  `,
  'death': `
    <circle cx="70" cy="80" r="20" fill="none" stroke="currentColor" stroke-width="2"/>
    <line x1="50" y1="100" x2="90" y2="100" stroke="currentColor" stroke-width="2"/>
    <line x1="70" y1="100" x2="70" y2="135" stroke="currentColor" stroke-width="2"/>
    <circle cx="55" cy="80" r="3" fill="currentColor"/>
    <circle cx="85" cy="80" r="3" fill="currentColor"/>
  `,
  'temperance': `
    <polygon points="70,45 55,85 85,85" fill="none" stroke="currentColor" stroke-width="2"/>
    <circle cx="70" cy="65" r="5" fill="currentColor" opacity="0.6"/>
    <line x1="70" y1="85" x2="70" y2="120" stroke="currentColor" stroke-width="2"/>
    <line x1="50" y1="130" x2="90" y2="130" stroke="currentColor" stroke-width="1.5"/>
    <path d="M45 105 Q60 95 70 105 Q80 115 95 105" fill="none" stroke="currentColor" stroke-width="1.5"/>
  `,
  'the-devil': `
    <polygon points="55,55 85,55 100,90 40,90" fill="none" stroke="currentColor" stroke-width="2"/>
    <circle cx="60" cy="70" r="3" fill="currentColor"/>
    <circle cx="80" cy="70" r="3" fill="currentColor"/>
    <line x1="70" y1="90" x2="70" y2="125" stroke="currentColor" stroke-width="2"/>
    <line x1="50" y1="110" x2="90" y2="110" stroke="currentColor" stroke-width="1.5"/>
  `,
  'the-tower': `
    <rect x="40" y="55" width="60" height="80" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>
    <polygon points="40,55 70,38 100,55" fill="none" stroke="currentColor" stroke-width="2"/>
    <line x1="30" y1="55" x2="110" y2="35" stroke="currentColor" stroke-width="2"/>
    <circle cx="50" cy="75" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="90" cy="70" r="3" fill="none" stroke="currentColor" stroke-width="1.5"/>
  `,
  'the-star': `
    <circle cx="70" cy="75" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="55" cy="60" r="4" fill="currentColor" opacity="0.7"/>
    <circle cx="85" cy="60" r="4" fill="currentColor" opacity="0.7"/>
    <circle cx="60" cy="48" r="3" fill="currentColor" opacity="0.5"/>
    <circle cx="80" cy="45" r="3" fill="currentColor" opacity="0.5"/>
    <circle cx="70" cy="42" r="4" fill="currentColor" opacity="0.8"/>
    <line x1="70" y1="85" x2="70" y2="130" stroke="currentColor" stroke-width="2"/>
    <line x1="50" y1="140" x2="90" y2="140" stroke="currentColor" stroke-width="1.5"/>
  `,
  'the-moon': `
    <circle cx="85" cy="75" r="25" fill="none" stroke="currentColor" stroke-width="2"/>
    <circle cx="70" cy="70" r="25" fill="var(--color-cream)" stroke="currentColor" stroke-width="2"/>
    <path d="M40 105 Q55 95 70 105 Q85 115 100 105" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="50" cy="125" r="2" fill="currentColor" opacity="0.5"/>
    <circle cx="85" cy="128" r="2" fill="currentColor" opacity="0.5"/>
  `,
  'the-sun': `
    <circle cx="70" cy="80" r="25" fill="none" stroke="currentColor" stroke-width="2"/>
    <circle cx="70" cy="80" r="8" fill="currentColor" opacity="0.6"/>
    <line x1="70" y1="48" x2="70" y2="55" stroke="currentColor" stroke-width="2"/>
    <line x1="70" y1="105" x2="70" y2="112" stroke="currentColor" stroke-width="2"/>
    <line x1="42" y1="80" x2="49" y2="80" stroke="currentColor" stroke-width="2"/>
    <line x1="91" y1="80" x2="98" y2="80" stroke="currentColor" stroke-width="2"/>
    <line x1="50" y1="60" x2="55" y2="65" stroke="currentColor" stroke-width="1.5"/>
    <line x1="85" y1="95" x2="90" y2="100" stroke="currentColor" stroke-width="1.5"/>
  `,
  'judgement': `
    <circle cx="70" cy="70" r="30" fill="none" stroke="currentColor" stroke-width="2"/>
    <circle cx="70" cy="70" r="8" fill="currentColor" opacity="0.5"/>
    <line x1="70" y1="40" x2="70" y2="48" stroke="currentColor" stroke-width="2"/>
    <path d="M45 110 L70 95 L95 110" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <line x1="50" y1="125" x2="50" y2="140" stroke="currentColor" stroke-width="1.5"/>
    <line x1="70" y1="118" x2="70" y2="142" stroke="currentColor" stroke-width="2"/>
    <line x1="90" y1="125" x2="90" y2="140" stroke="currentColor" stroke-width="1.5"/>
  `,
  'the-world': `
    <circle cx="70" cy="95" r="42" fill="none" stroke="currentColor" stroke-width="2"/>
    <ellipse cx="70" cy="95" rx="25" ry="40" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <line x1="45" y1="95" x2="95" y2="95" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="70" cy="60" r="3" fill="currentColor" opacity="0.6"/>
    <circle cx="70" cy="130" r="3" fill="currentColor" opacity="0.6"/>
    <circle cx="50" cy="95" r="3" fill="currentColor" opacity="0.6"/>
    <circle cx="90" cy="95" r="3" fill="currentColor" opacity="0.6"/>
  `,
};

// Suit emblem SVGs
export const suitEmblems: Record<string, string> = {
  wand: `<line x1="70" y1="45" x2="70" y2="120" stroke="currentColor" stroke-width="3"/><circle cx="70" cy="42" r="6" fill="none" stroke="currentColor" stroke-width="2"/><line x1="55" y1="55" x2="85" y2="55" stroke="currentColor" stroke-width="2"/><line x1="60" y1="75" x2="80" y2="75" stroke="currentColor" stroke-width="1.5"/><line x1="55" y1="95" x2="85" y2="95" stroke="currentColor" stroke-width="1.5"/>`,
  cup: `<path d="M50 65 L50 120 Q50 135 70 135 Q90 135 90 120 L90 65" fill="none" stroke="currentColor" stroke-width="2.5"/><ellipse cx="70" cy="65" rx="20" ry="6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M50 65 Q30 45 60 35" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M90 65 Q110 45 80 35" fill="none" stroke="currentColor" stroke-width="1.5"/>`,
  sword: `<line x1="70" y1="40" x2="70" y2="105" stroke="currentColor" stroke-width="2.5"/><line x1="55" y1="120" x2="85" y2="120" stroke="currentColor" stroke-width="3"/><rect x="65" y="115" width="10" height="15" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><polygon points="70,35 62,50 78,50" fill="none" stroke="currentColor" stroke-width="2"/>`,
  pentacle: `<circle cx="70" cy="85" r="35" fill="none" stroke="currentColor" stroke-width="2.5"/><polygon points="70,50 82,70 104,70 87,84 93,105 70,93 47,105 53,84 36,70 58,70" fill="none" stroke="currentColor" stroke-width="2"/>`,
};

// Get symbol SVG for a card
export function getSymbolForCard(card: { arcana: string; suit?: string; number: number }): string {
  if (card.arcana === 'major') {
    const names: Record<number, string> = {
      0: 'the-fool', 1: 'the-magician', 2: 'the-high-priestess', 3: 'the-empress',
      4: 'the-emperor', 5: 'the-hierophant', 6: 'the-lovers', 7: 'the-chariot',
      8: 'strength', 9: 'the-hermit', 10: 'wheel-of-fortune', 11: 'justice',
      12: 'the-hanged-man', 13: 'death', 14: 'temperance', 15: 'the-devil',
      16: 'the-tower', 17: 'the-star', 18: 'the-moon', 19: 'the-sun',
      20: 'judgement', 21: 'the-world',
    };
    return majorArcanaSymbols[names[card.number]] || '';
  }
  // Minor arcana
  const emblem = suitEmblems[card.suit || 'wand'] || '';
  return emblem;
}
