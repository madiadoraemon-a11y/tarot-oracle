import { memo } from 'react';
import { motion } from 'framer-motion';
import { TarotCard as TarotCardType } from '../../types';
import CardBack from './CardBack';
import CardFront from './CardFront';
import styles from './TarotCard.module.css';

interface TarotCardProps {
  card: TarotCardType;
  isFlipped?: boolean;
  isDrawn?: boolean;
  isReversed?: boolean;
  small?: boolean;
  onClick?: () => void;
  'data-card-index'?: number;
  'data-card-id'?: string;
}

const TarotCardComponent = memo(function TarotCardComponent({
  card,
  isFlipped = false,
  isDrawn = false,
  isReversed = false,
  small = false,
  onClick,
  'data-card-index': dataCardIndex,
  'data-card-id': dataCardId,
}: TarotCardProps) {
  return (
    <motion.div
      className={`${styles.cardWrapper} ${small ? styles.small : ''} ${isDrawn ? styles.drawn : ''}`}
      data-card-index={dataCardIndex}
      data-card-id={dataCardId}
      whileHover={!isDrawn ? { scale: 1.04, y: -4 } : undefined}
      whileTap={!isDrawn ? { scale: 0.97 } : undefined}
      onClick={onClick}
      style={{ cursor: onClick || !isDrawn ? 'pointer' : 'default' }}
    >
      <motion.div
        className={styles.cardInner}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22, duration: 0.6 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front face (card face — hidden until flipped) */}
        <div
          className={styles.cardFace}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            position: 'absolute',
            inset: 0,
          }}
        >
          <CardFront card={card} />
          {isReversed && isFlipped && (
            <div className={styles.reversedBadge}>逆位</div>
          )}
        </div>

        {/* Back face (ornate pattern — visible by default) */}
        <div
          className={styles.cardFace}
          style={{
            backfaceVisibility: 'hidden',
            position: 'absolute',
            inset: 0,
          }}
        >
          <CardBack />
        </div>
      </motion.div>
    </motion.div>
  );
});

export default TarotCardComponent;
