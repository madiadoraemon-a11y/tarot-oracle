import { TarotCard as TarotCardType } from '../../types';
import { getSymbolForCard } from '../../data/cardSymbols';
import { romanNumeral } from '../../data/tarotDeck';
import styles from './TarotCard.module.css';

interface CardFrontProps {
  card: TarotCardType;
}

export default function CardFront({ card }: CardFrontProps) {
  const symbol = getSymbolForCard(card);

  return (
    <div className={styles.cardFront}>
      <svg viewBox="0 0 140 217" className={styles.cardFrontSvg}>
        {/* Card background */}
        <rect x="3" y="3" width="134" height="211" rx="5"
              fill="var(--color-cream)" stroke="var(--color-gold-dim)" strokeWidth="1.5" />

        {/* Inner border */}
        <rect x="8" y="8" width="124" height="201" rx="3"
              fill="none" stroke="var(--color-gold-dim)" strokeWidth="0.5" opacity="0.5" />

        {/* Suit color tint for minor arcana */}
        {card.arcana === 'minor' && (
          <rect x="8" y="8" width="124" height="201" rx="3"
                fill={suitTintColor(card.suit)} opacity="0.06" />
        )}

        {/* Top corner: number */}
        <text x="16" y="26" fontSize="14" fill="var(--color-dark)"
              fontFamily="var(--font-display)" fontWeight="600">
          {card.number === 0 ? '0' : romanNumeral(card.number)}
        </text>

        {/* Top: card name */}
        <text x="70" y="36" textAnchor="middle" fontSize="8"
              fill="var(--color-gold-dim)" fontFamily="var(--font-display)"
              letterSpacing="1">
          {card.nameZh}
        </text>

        {/* Central symbol area */}
        <g transform="translate(0, 0)" color={
          card.arcana === 'major' ? 'var(--color-dark)' :
          card.suit === 'cups' ? '#2B6CB0' :
          card.suit === 'swords' ? '#4A5568' :
          card.suit === 'wands' ? '#C05621' :
          card.suit === 'pentacles' ? '#276749' : 'var(--color-dark)'
        }>
          {symbol ? (
            <g dangerouslySetInnerHTML={{ __html: symbol }}
               transform="translate(0, 18)" />
          ) : (
            <text x="70" y="125" textAnchor="middle" fontSize="48"
                  fontFamily="var(--font-display)" fill="var(--color-dark)" opacity="0.3">
              {card.suitNameZh ? suitIcon(card.suit) : '✦'}
            </text>
          )}
        </g>

        {/* Bottom: card name in English */}
        <text x="70" y="200" textAnchor="middle" fontSize="7"
              fill="var(--color-gold-dim)" fontFamily="var(--font-display)"
              letterSpacing="0.5" opacity="0.8">
          {card.nameEn.toUpperCase()}
        </text>

        {/* Bottom corner: number (inverted) */}
        <text x="124" y="204" fontSize="14" fill="var(--color-dark)"
              fontFamily="var(--font-display)" fontWeight="600"
              textAnchor="end" transform="rotate(180, 124, 204)">
          {card.number === 0 ? '0' : romanNumeral(card.number)}
        </text>
      </svg>
    </div>
  );
}

function suitIcon(suit?: string): string {
  switch (suit) {
    case 'wands': return '🜂';
    case 'cups': return '🜄';
    case 'swords': return '🜁';
    case 'pentacles': return '🜃';
    default: return '✦';
  }
}

function suitTintColor(suit?: string): string {
  switch (suit) {
    case 'cups': return '#2B6CB0';
    case 'swords': return '#4A5568';
    case 'wands': return '#C05621';
    case 'pentacles': return '#276749';
    default: return 'transparent';
  }
}
