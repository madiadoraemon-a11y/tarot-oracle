import { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import styles from './CardFlyAnimation.module.css';

export default function CardFlyAnimation() {
  const { state, clearFlyingCard } = useGame();
  const { flyingCard } = state;

  // Auto-clear after animation
  useEffect(() => {
    if (!flyingCard) return;
    const timer = setTimeout(() => clearFlyingCard(), 700);
    return () => clearTimeout(timer);
  }, [flyingCard, clearFlyingCard]);

  // Generate random sparkle positions for the particle trail
  const sparkles = useMemo(() => Array.from({ length: 6 }, (_, i) => ({
    id: i,
    offsetX: (Math.random() - 0.5) * 60,
    offsetY: (Math.random() - 0.5) * 40,
    delay: i * 0.05,
    size: 3 + Math.random() * 5,
  })), [flyingCard?.card?.id]); // re-generate per card

  return (
    <AnimatePresence>
      {flyingCard && (
        <>
          {/* Source flash */}
          <motion.div
            className={styles.sourceFlash}
            style={{
              left: flyingCard.startX,
              top: flyingCard.startY,
            }}
            initial={{ scale: 0, opacity: 0.9 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />

          {/* Flying card */}
          <motion.div
            className={styles.flyContainer}
            initial={{
              x: flyingCard.startX - 40,
              y: flyingCard.startY - 56,
              scale: 1,
              opacity: 1,
              rotate: 0,
            }}
            animate={{
              x: flyingCard.endX - 30,
              y: flyingCard.endY - 42,
              scale: 0.55,
              opacity: [1, 1, 0.5],
              rotate: [0, -12, 8, 0],
            }}
            exit={{ opacity: 0, scale: 0.3 }}
            transition={{
              duration: 0.55,
              ease: [0.34, 1.56, 0.64, 1], // custom spring-like bezier
              opacity: { times: [0, 0.75, 1] },
            }}
          >
            <div className={styles.flyCard}>
              <div className={styles.cardBack}>
                <div className={styles.innerPattern}>
                  <span className={styles.star}>✦</span>
                </div>
              </div>
            </div>

            {/* Sparkle trail particles */}
            {sparkles.map(s => (
              <motion.div
                key={s.id}
                className={styles.sparkle}
                style={{
                  width: s.size,
                  height: s.size,
                }}
                initial={{
                  x: s.offsetX * 0.3,
                  y: s.offsetY * 0.3,
                  opacity: 0.7,
                  scale: 1,
                }}
                animate={{
                  x: s.offsetX,
                  y: s.offsetY + 30,
                  opacity: 0,
                  scale: 0,
                }}
                transition={{
                  duration: 0.5,
                  delay: s.delay,
                  ease: 'easeOut',
                }}
              />
            ))}
          </motion.div>

          {/* Destination ripple */}
          <motion.div
            className={styles.destRipple}
            style={{
              left: flyingCard.endX,
              top: flyingCard.endY,
            }}
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.35, ease: 'easeOut' }}
          />
        </>
      )}
    </AnimatePresence>
  );
}
