import { TarotCard as TarotCardType } from '../../types';
import styles from './TarotCard.module.css';

// Major Arcana: number → filename suffix
const majorNameMap: Record<number, string> = {
  0: 'fool',
  1: 'magician',
  2: 'highpriestess',
  3: 'empress',
  4: 'emperor',
  5: 'hierophant',
  6: 'lovers',
  7: 'chariot',
  8: 'strength',
  9: 'hermit',
  10: 'fortune',
  11: 'justice',
  12: 'hangedman',
  13: 'death',
  14: 'temperance',
  15: 'devil',
  16: 'tower',
  17: 'star',
  18: 'moon',
  19: 'sun',
  20: 'judgement',
  21: 'world',
};

// Minor Arcana: number → filename suffix
function minorNumberName(n: number): string {
  if (n === 1) return 'ace';
  if (n <= 10) return String(n);
  const court: Record<number, string> = { 11: 'page', 12: 'knight', 13: 'queen', 14: 'king' };
  return court[n] || String(n);
}

function getWaiteImagePath(card: TarotCardType): string {
  const base = import.meta.env.BASE_URL + 'waite/';
  if (card.arcana === 'major') {
    const name = majorNameMap[card.number] || `unknown${card.number}`;
    return `${base}major_${String(card.number).padStart(2, '0')}_${name}.jpg`;
  }
  const suit = card.suit || 'wands';
  const num = minorNumberName(card.number);
  return `${base}${suit}_${num}.jpg`;
}

interface CardFrontProps {
  card: TarotCardType;
}

export default function CardFront({ card }: CardFrontProps) {
  const imgPath = getWaiteImagePath(card);

  return (
    <div className={styles.cardFront}>
      <img
        src={imgPath}
        alt={`${card.nameZh} - ${card.nameEn}`}
        className={styles.cardFrontImg}
        loading="lazy"
      />
    </div>
  );
}
