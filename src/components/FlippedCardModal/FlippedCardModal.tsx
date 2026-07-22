import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { TarotCard, DrawnCard } from '../../types';
import CardFront from '../TarotCard/CardFront';
import styles from './FlippedCardModal.module.css';

export default function FlippedCardModal() {
  const { state, flipCard } = useGame();
  const [selectedDrawnCard, setSelectedDrawnCard] = useState<DrawnCard | null>(null);

  // Find drawn cards that are flipped but not yet fully viewed
  const drawnFlipped = Array.from(state.drawnCards.values()).filter(
    dc => state.flippedCardIds.has(dc.card.id)
  );

  // Listen for clicks on drawn cards in DrawZone
  useEffect(() => {
    const handler = (e: Event) => {
      const target = e.target as HTMLElement;
      const cardEl = target.closest('[data-drawn-card-id]');
      if (cardEl) {
        const cardId = (cardEl as HTMLElement).dataset.drawnCardId;
        const dc = Array.from(state.drawnCards.values()).find(
          d => d.card.id === cardId
        );
        if (dc && state.flippedCardIds.has(cardId!)) {
          setSelectedDrawnCard(dc);
        } else if (dc && !state.flippedCardIds.has(cardId!)) {
          flipCard(cardId!);
        }
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [state.drawnCards, state.flippedCardIds, flipCard]);

  const close = () => setSelectedDrawnCard(null);

  if (!selectedDrawnCard) return null;

  const { card, isReversed } = selectedDrawnCard;
  const meaning = isReversed ? card.reversedMeaning : card.uprightMeaning;

  return (
    <AnimatePresence>
      <motion.div
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={close}
      >
        <motion.div
          className={styles.modal}
          initial={{ scale: 0.5, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Close button */}
          <button className={styles.closeBtn} onClick={close} aria-label="关闭">
            ✕
          </button>

          {/* Enlarged card */}
          <div className={styles.enlargedCard}>
            <div className={styles.cardInner} style={{ transform: isReversed ? 'rotate(180deg)' : 'none' }}>
              <CardFront card={card} />
            </div>
            {isReversed && <span className={styles.badge}>逆位</span>}
          </div>

          {/* Card info */}
          <div className={styles.info}>
            <h2 className={styles.cardName}>
              {card.nameZh}
              <span className={styles.cardNameEn}>{card.nameEn}</span>
            </h2>

            {isReversed && (
              <span className={styles.reversedLabel}>（逆位）</span>
            )}

            {/* Keywords */}
            <div className={styles.keywords}>
              {card.keywords.map(kw => (
                <span key={kw} className={styles.keyword}>{kw}</span>
              ))}
            </div>

            {/* Meaning */}
            <div className={styles.meaningSection}>
              <h3 className={styles.meaningTitle}>
                {isReversed ? '逆位含义' : '正位含义'}
              </h3>
              <p className={styles.meaning}>{meaning}</p>
            </div>

            {/* Description */}
            <div className={styles.meaningSection}>
              <h3 className={styles.meaningTitle}>详细解读</h3>
              <p className={styles.description}>{card.description}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
