import { motion, AnimatePresence } from 'framer-motion';
import styles from './GestureCursor.module.css';

interface GestureCursorProps {
  /** Normalized hand position (0-1 from engine, X is raw image space) */
  normalizedX: number;
  normalizedY: number;
  /** Whether hand is currently detected */
  visible: boolean;
  /** Whether cursor is hovering over a card */
  hovering: boolean;
  /** Whether a pinch is in progress */
  pinching: boolean;
}

export default function GestureCursor({
  normalizedX,
  normalizedY,
  visible,
  hovering,
  pinching,
}: GestureCursorProps) {
  // Flip X for selfie mirror mode (video has scaleX(-1))
  const screenX = (1 - normalizedX) * window.innerWidth;
  const screenY = normalizedY * window.innerHeight;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={`${styles.cursor} ${hovering ? styles.hovering : ''} ${pinching ? styles.pinching : ''}`}
          style={{ left: screenX, top: screenY }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: 1,
            scale: pinching ? 1.3 : hovering ? 1.15 : 1,
          }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{
            left: { duration: 0.08, ease: 'easeOut' },
            top: { duration: 0.08, ease: 'easeOut' },
            scale: { duration: 0.2 },
            opacity: { duration: 0.15 },
          }}
        >
          {/* Outer glow ring */}
          <div className={`${styles.ring} ${hovering ? styles.ringHover : ''} ${pinching ? styles.ringPinch : ''}`} />

          {/* Inner dot */}
          <div className={styles.dot} />

          {/* Pinch rings */}
          {pinching && (
            <motion.div
              className={styles.pinchRing}
              initial={{ scale: 0.6, opacity: 0.8 }}
              animate={{ scale: 1.8, opacity: 0 }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
