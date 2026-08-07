import { useRef, useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { shuffle } from '../../engine/TarotEngine';
import TarotCardComponent from '../TarotCard/TarotCard';
import styles from './CardSpread.module.css';

export default function CardSpread() {
  const { state, shuffleComplete, drawCardAction, setActiveIndex, setFlyingCard } = useGame();
  const { phase, deck, selectedSpread, drawnCards, currentDrawPosition, shuffleCount, interactionMode, hoveredCardId } = state;
  const containerRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Auto-shuffle on entry
  useEffect(() => {
    if (phase === 'shuffling') {
      const timer = setTimeout(() => {
        const shuffled = shuffle(deck);
        shuffleComplete(shuffled);
      }, 2600);
      return () => clearTimeout(timer);
    }
  }, [phase, shuffleCount]);

  // Manual reshuffle
  const [reshufflePending, setReshufflePending] = useState(false);

  const handleReshuffle = useCallback(() => {
    if (!reshufflePending) {
      setReshufflePending(true);
      setTimeout(() => setReshufflePending(false), 3000);
      return;
    }
    const shuffled = shuffle(deck);
    shuffleComplete(shuffled);
    setReshufflePending(false);
  }, [deck, shuffleComplete, reshufflePending]);

  // Click a card → draw to the next available position
  const handleCardClick = useCallback((card: (typeof deck)[0]) => {
    if (phase !== 'drawing') return;
    if (!selectedSpread || !currentDrawPosition) return;

    const alreadyDrawn = Array.from(state.drawnCards.values()).some(
      dc => dc.card.id === card.id
    );
    if (alreadyDrawn) return;

    // Capture source + target positions for flight animation
    const srcEl = document.querySelector(`[data-card-id="${card.id}"]`) as HTMLElement | null;
    const dstEl = document.querySelector('[data-draw-zone]') as HTMLElement | null;
    if (srcEl && dstEl) {
      const sr = srcEl.getBoundingClientRect();
      const dr = dstEl.getBoundingClientRect();
      setFlyingCard({
        card,
        startX: sr.left + sr.width / 2,
        startY: sr.top + sr.height / 2,
        endX: dr.left + dr.width / 2,
        endY: dr.top + dr.height / 2,
      });
    }

    initAudio();
    drawCardAction(currentDrawPosition, card);
  }, [phase, selectedSpread, currentDrawPosition, state.drawnCards, drawCardAction, setFlyingCard]);

  // Snap detection on scroll
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScrollEnd = () => {
      if (!el) return;
      const centerX = el.scrollLeft + el.clientWidth / 2;
      let closestIdx = 0, closestDist = Infinity;

      el.querySelectorAll('[data-card-index]').forEach((child) => {
        const idx = Number((child as HTMLElement).dataset.cardIndex);
        if (isNaN(idx)) return;
        const rect = child.getBoundingClientRect();
        const containerRect = el.getBoundingClientRect();
        const childCenter = rect.left + rect.width / 2 - containerRect.left + el.scrollLeft;
        const dist = Math.abs(centerX - childCenter);
        if (dist < closestDist) { closestDist = dist; closestIdx = idx; }
      });
      setActiveIndex(closestIdx);
      playClick();
    };

    el.addEventListener('scrollend', onScrollEnd);
    return () => el.removeEventListener('scrollend', onScrollEnd);
  }, [setActiveIndex]);

  // Audio
  const initAudio = () => { if (!audioCtxRef.current) audioCtxRef.current = new AudioContext(); };
  const playClick = () => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.value = 180; o.type = 'sine';
    g.gain.setValueAtTime(0.05, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    o.connect(g).connect(ctx.destination);
    o.start(); o.stop(ctx.currentTime + 0.04);
  };

  // Hooks must be before any conditional returns
  const drawnCardIds = new Set(Array.from(state.drawnCards.values()).map(dc => dc.card.id));

  // ── Shuffling state ──
  if (phase === 'shuffling') {
    return (
      <div className={styles.shufflingContainer}>
        <motion.div
          className={styles.shuffleText}
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          ✦ 正在洗牌 ✦
        </motion.div>
        <div className={styles.shuffleDeck}>
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const radius = 60 + i * 3;
            const xOff = Math.cos(angle) * radius;
            const yOff = Math.sin(angle) * radius * 0.6;
            return (
              <motion.div
                key={i}
                className={styles.shuffleCard}
                style={{
                  background: `linear-gradient(135deg,
                    rgba(201,169,110,${0.12 + i * 0.01}),
                    rgba(18,18,42,0.9))`,
                  borderColor: `rgba(201,169,110,${0.15 + i * 0.02})`,
                }}
                animate={{
                  x: [xOff, -xOff * 0.7, xOff * 0.5, xOff],
                  y: [yOff, -yOff * 0.5, yOff * 0.8, yOff],
                  rotate: [i * 10, 360 + i * 15, 180 + i * 8, i * 10],
                  scale: [1, 0.92, 1.04, 1],
                }}
                transition={{
                  duration: 3 + i * 0.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.08,
                }}
              />
            );
          })}
        </div>
        <motion.p
          className={styles.shuffleHint}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 2.6, delay: 0.3 }}
        >
          命运正在编织你的答案...
        </motion.p>
      </div>
    );
  }

  return (
    <div className={styles.spreadContainer}>
      {/* Instruction bar */}
      <div className={styles.instructionBar}>
        {phase === 'drawing' && selectedSpread && currentDrawPosition && (
          <div className={styles.drawInstruction}>
            点击一张牌放入：
            <span className={styles.positionLabel}>
              「{selectedSpread.positions.find(p => p.id === currentDrawPosition)?.label}」
            </span>
            （剩余 {selectedSpread.cardCount - state.drawnCards.size} 张）
          </div>
        )}
        {phase === 'revealing' && (
          <div className={styles.drawInstruction}>所有牌已抽完，点击牌面翻牌查看解读</div>
        )}
        <button className={styles.reshuffleBtn} onClick={handleReshuffle}>
          {reshufflePending ? '确认重新洗牌？(会清空结果)' : '重新洗牌'}
        </button>
      </div>

      {/* Scrollable card row — native CSS scroll with snap */}
      <div
        ref={containerRef}
        className={styles.cardRow}
        data-card-scroll
        onClick={initAudio}
        onTouchStart={initAudio}
      >
        <div className={styles.cardTrack}>
          <AnimatePresence>
            {deck.map((card, index) => {
              const isDrawn = drawnCardIds.has(card.id);
              const isHovered = interactionMode === 'gesture' && hoveredCardId === card.id;
              return (
                <motion.div
                  key={card.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{
                    opacity: isDrawn ? 0 : 1,
                    width: isDrawn ? 12 : 'auto',
                    scale: isDrawn ? 0.15 : isHovered ? 1.10 : 1,
                    y: isHovered && !isDrawn ? -10 : 0,
                    filter: isHovered && !isDrawn ? 'brightness(1.3) drop-shadow(0 0 16px rgba(201, 169, 110, 0.45))' : 'brightness(1) drop-shadow(0 0 0px transparent)',
                    zIndex: isHovered && !isDrawn ? 10 : 1,
                  }}
                  transition={{
                    duration: 0.35,
                    ease: 'easeOut',
                    layout: { type: 'spring', stiffness: 100, damping: 18 },
                    delay: index * 0.008,
                  }}
                  className={`${styles.cardSlot} ${isDrawn ? styles.cardSlotDrawn : ''} ${isHovered && !isDrawn ? styles.cardSlotHovered : ''}`}
                >
                  {isDrawn ? (
                    <div className={styles.gapMarker} />
                  ) : (
                    <TarotCardComponent
                      card={card}
                      isDrawn={false}
                      data-card-index={index}
                      data-card-id={card.id}
                      onClick={() => handleCardClick(card)}
                    />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div className={styles.spacer} />
        </div>
      </div>
    </div>
  );
}
