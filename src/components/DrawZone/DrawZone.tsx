import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { DrawnCard, SpreadPosition } from '../../types';
import TarotCardComponent from '../TarotCard/TarotCard';
import styles from './DrawZone.module.css';

export default function DrawZone() {
  const { state, revealAll, goToResult } = useGame();
  const {
    selectedSpread,
    drawnCards,
    flippedCardIds,
    phase,
    currentDrawPosition,
  } = state;

  // Build a quick lookup: positionId -> DrawnCard
  const positionCardMap = useMemo<Record<string, DrawnCard>>(() => {
    const map: Record<string, DrawnCard> = {};
    drawnCards.forEach((dc) => {
      map[dc.positionId] = dc;
    });
    return map;
  }, [drawnCards]);

  if (!selectedSpread) return null;

  const { positions, cardCount } = selectedSpread;
  const drawnCount = drawnCards.size;
  const allDrawn = drawnCount >= cardCount;
  const flippedCount = flippedCardIds.size;
  const allFlipped = allDrawn && flippedCount >= drawnCount;

  return (
    <div className={styles.container} data-draw-zone>
      {/* ── Ornate header ── */}
      <header className={styles.header}>
        <h2 className={styles.title}>抽牌区</h2>
        <span className={styles.progress}>
          已抽 {drawnCount}/{cardCount} 张
        </span>
      </header>

      {/* ── Spread layout ── */}
      <div className={styles.spreadWrapper}>
        <div className={styles.spreadArea}>
          {positions.map((pos: SpreadPosition) => {
            const card = positionCardMap[pos.id];
            const isFlipped = card ? flippedCardIds.has(card.card.id) : false;
            const isCurrentTarget = currentDrawPosition === pos.id && phase === 'drawing';
            const isEmpty = !card;
            const isFaceDown = !!card && !isFlipped;

            return (
              <div
                key={pos.id}
                className={styles.position}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              >
                {isEmpty ? (
                  /* ── Empty slot ── */
                  <motion.div
                    className={`${styles.emptySlot} ${isCurrentTarget ? styles.emptySlotActive : ''}`}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      boxShadow: isCurrentTarget
                        ? '0 0 24px rgba(201, 169, 110, 0.5), inset 0 0 12px rgba(201, 169, 110, 0.15)'
                        : '0 0 0 rgba(201, 169, 110, 0)',
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    <span className={styles.positionLabel}>{pos.label}</span>
                    {isCurrentTarget && (
                      <motion.span
                        className={styles.drawHint}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        选择一张牌
                      </motion.span>
                    )}
                  </motion.div>
                ) : (
                  /* ── Filled slot ── */
                  <motion.div
                    className={`${styles.filledSlot} ${isFlipped ? styles.filledSlotFlipped : ''}`}
                    data-drawn-card-id={card.card.id}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  >
                    <AnimatePresence mode="wait">
                      {isFaceDown ? (
                        /* Face-down: CardBack visible, click to flip */
                        <motion.div
                          key={`back-${card.card.id}`}
                          className={styles.cardContainer}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <TarotCardComponent
                            card={card.card}
                            small
                            isDrawn
                            isFlipped={false}
                            isReversed={false}
                            onClick={() => {}}
                          />
                          <motion.div
                            className={styles.flipHint}
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            点击翻牌
                          </motion.div>
                        </motion.div>
                      ) : (
                        /* Face-up: CardFront visible, click to open modal */
                        <motion.div
                          key={`front-${card.card.id}`}
                          className={styles.cardContainer}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <TarotCardComponent
                            card={card.card}
                            small
                            isDrawn
                            isFlipped
                            isReversed={card.isReversed}
                            onClick={() => {}}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Action buttons ── */}
      <div className={styles.actions}>
        <AnimatePresence>
          {allDrawn && !allFlipped && (
            <motion.button
              className={styles.revealAllBtn}
              onClick={revealAll}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <span className={styles.btnIcon}>✦</span>
              全部翻牌
              <span className={styles.btnIcon}>✦</span>
            </motion.button>
          )}

          {allFlipped && (
            <motion.button
              className={styles.viewResultBtn}
              onClick={goToResult}
              initial={{ opacity: 0, y: 16, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <span className={styles.btnIcon}>☽</span>
              查看解读
              <span className={styles.btnIcon}>☽</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
