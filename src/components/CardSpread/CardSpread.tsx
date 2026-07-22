import { useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { shuffleDeck } from '../../data/tarotDeck';
import TarotCardComponent from '../TarotCard/TarotCard';
import styles from './CardSpread.module.css';

export default function CardSpread() {
  const { state, shuffleComplete, drawCard, setActiveIndex } = useGame();
  const containerRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const { phase, deck, selectedSpread, drawnCards, currentDrawPosition, shuffleCount } = state;

  // Auto-shuffle on entry
  useEffect(() => {
    if (phase === 'shuffling') {
      const timer = setTimeout(() => {
        const shuffled = shuffleDeck(deck);
        shuffleComplete(shuffled);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [phase, shuffleCount]);

  // Manual reshuffle
  const handleReshuffle = useCallback(() => {
    const shuffled = shuffleDeck(deck);
    shuffleComplete(shuffled);
  }, [deck, shuffleComplete]);

  // Click a card → draw to the next available position
  const handleCardClick = useCallback((card: (typeof deck)[0]) => {
    if (phase !== 'drawing') return;
    if (!selectedSpread || !currentDrawPosition) return;

    const alreadyDrawn = Array.from(state.drawnCards.values()).some(
      dc => dc.card.id === card.id
    );
    if (alreadyDrawn) return;

    initAudio();
    drawCard(currentDrawPosition, card);
  }, [phase, selectedSpread, currentDrawPosition, state.drawnCards, drawCard]);

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
        <motion.span className={styles.shuffleText}
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}>
          ✦ 正在洗牌 ✦
        </motion.span>
        <div className={styles.shuffleDeck}>
          {[0, 1, 2, 3, 4].map(i => (
            <motion.div key={i} className={styles.shuffleCard}
              animate={{ rotate: [0, -5 + i * 3, 5 - i * 2, 0], x: [0, -10 + i * 8, 8 - i * 6, 0], y: [0, -6, 4, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }} />
          ))}
        </div>
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
          重新洗牌
        </button>
      </div>

      {/* Scrollable card row — native CSS scroll with snap */}
      <div
        ref={containerRef}
        className={styles.cardRow}
        onClick={initAudio}
        onTouchStart={initAudio}
      >
        <div className={styles.cardTrack}>
          <AnimatePresence>
            {deck.map((card, index) => {
              const isDrawn = drawnCardIds.has(card.id);
              return (
                <motion.div
                  key={card.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: isDrawn ? 0.3 : 1, y: 0, scale: isDrawn ? 0.85 : 1 }}
                  transition={{ layout: { type: 'spring', stiffness: 200, damping: 25 }, delay: index * 0.008 }}
                  className={styles.cardSlot}
                >
                  <TarotCardComponent
                    card={card}
                    isDrawn={isDrawn}
                    data-card-index={index}
                    onClick={() => handleCardClick(card)}
                  />
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
