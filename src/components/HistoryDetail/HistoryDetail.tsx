import { motion } from 'framer-motion';
import { ReadingRecord } from '../../types';
import { createDeck } from '../../data/tarotDeck';
import { getSpreadById } from '../../data/spreads';
import TarotCardComponent from '../TarotCard/TarotCard';
import styles from './HistoryDetail.module.css';

interface Props {
  record: ReadingRecord;
  onClose: () => void;
}

export default function HistoryDetail({ record, onClose }: Props) {
  const deck = createDeck();
  const spread = getSpreadById(record.spreadType);

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.modal}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <button className={styles.closeBtn} onClick={onClose}>✕</button>

        <h2 className={styles.title}>{record.spreadName}</h2>
        <p className={styles.date}>{formatDate(record.timestamp)}</p>
        {record.question && (
          <p className={styles.question}>「{record.question}」</p>
        )}

        {/* Cards grid */}
        <div className={styles.cardsGrid}>
          {record.cards.map(dc => {
            const card = deck.find(c => c.id === dc.cardId);
            if (!card) return null;
            return (
              <div key={dc.positionId} className={styles.cardItem}>
                <TarotCardComponent
                  card={card}
                  isFlipped
                  isReversed={dc.isReversed}
                  small
                />
                <span className={styles.posLabel}>{dc.positionLabel}</span>
                <span className={styles.cardNameText}>
                  {dc.cardNameZh}
                  {dc.isReversed && ' (逆)'}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
