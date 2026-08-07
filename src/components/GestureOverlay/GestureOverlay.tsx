import { useEffect, useRef, useCallback, useState } from 'react';
import { useGame } from '../../context/GameContext';
import { useGestureEngine } from '../../hooks/useGestureEngine';
import { GestureIntent } from '../../types';
import GestureCursor from '../GestureCursor/GestureCursor';
import BottomHints from '../BottomHints/BottomHints';
import styles from './GestureOverlay.module.css';

/** Higher-sensitivity engine config */
const HIGH_SENSITIVITY = {
  minDetectionConfidence: 0.5,
  minPresenceConfidence: 0.5,
  openPalmFrames: 10,
  closedFistFrames: 8,
  pinchFrames: 8,
  pinchMaxDistance: 0.09,
  shuffleMinDisplacement: 0.05,
};

type HandMode = 'none' | 'scroll' | 'cursor';

export default function GestureOverlay() {
  const {
    state,
    drawCardAction,
    setFlyingCard,
    revealForReading,
    armReading,
    cancelReadingArmed,
    triggerReading,
    skipCurrentStage,
    setHoveredCardId,
  } = useGame();
  const { phase, currentDrawPosition, deck, drawnCards, readingTriggered } = state;

  const { start, stop, setPhase, engineRef } = useGestureEngine(HIGH_SENSITIVITY);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const armedTimerRef = useRef<number | null>(null);
  const [handStatus, setHandStatus] = useState<string>('手部未检测');
  const [handMode, setHandMode] = useState<HandMode>('none');

  // Cursor state
  const [cursorX, setCursorX] = useState(0.5);
  const [cursorY, setCursorY] = useState(0.5);
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorHovering, setCursorHovering] = useState(false);
  const [cursorPinching, setCursorPinching] = useState(false);

  // Snap tracking
  const snappedCardRef = useRef<string>('');

  // ── Card row bounds ──
  const getCardRowBounds = useCallback(() => {
    const row = document.querySelector('[data-card-scroll]') as HTMLElement | null;
    if (!row) return { left: 0, right: window.innerWidth, top: 0, bottom: window.innerHeight };
    const rect = row.getBoundingClientRect();
    return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
  }, []);

  // ── Hover resolver: find card closest to a screen position ──
  const resolveHover = useCallback((screenX: number): { cardId: string; centerX: number } => {
    const bounds = getCardRowBounds();
    const lookupY = bounds.top + (bounds.bottom - bounds.top) / 2;

    const cardEls = document.querySelectorAll('[data-card-id]');
    let best = { cardId: '', centerX: 0 };
    let bestDist = Infinity;

    cardEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = screenX - cx;
      const dy = lookupY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < bestDist) {
        bestDist = dist;
        best = { cardId: (el as HTMLElement).dataset.cardId || '', centerX: cx };
      }
    });

    return bestDist < 300 ? best : { cardId: '', centerX: 0 };
  }, [getCardRowBounds]);

  // ── Setup camera + engine ──
  useEffect(() => {
    if (state.interactionMode !== 'gesture') return;
    let cancelled = false;
    async function setup() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: 'user' },
          audio: false,
        });
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        if (videoRef.current) {
          await start(videoRef.current, handleGesture);
          engineRef.current?.setHoverResolver((nx, _ny) => {
            const sx = (1 - nx) * window.innerWidth;
            return resolveHover(sx).cardId;
          });
          setPhase(phase);
        }
      } catch { /* handled upstream */ }
    }
    setup();
    return () => {
      cancelled = true;
      stop();
      streamRef.current?.getTracks().forEach(t => t.stop());
      if (armedTimerRef.current) clearTimeout(armedTimerRef.current);
    };
  }, [state.interactionMode]); // eslint-disable-line react-hooks/exhaustive-deps

  // Phase sync
  useEffect(() => { setPhase(phase); }, [phase, setPhase]);

  // Resolver sync
  useEffect(() => {
    engineRef.current?.setHoverResolver((nx, _ny) => {
      const sx = (1 - nx) * window.innerWidth;
      return resolveHover(sx).cardId;
    });
  }, [resolveHover, engineRef]);

  // ── Gesture handler ──
  const handleGesture = useCallback((intent: GestureIntent) => {
    switch (intent.type) {
      case 'HAND_VISIBLE':
        setHandStatus('手部已检测');
        break;

      // ── Open palm: scroll the card row ──
      case 'SCROLL_POSITION': {
        if (handMode !== 'scroll') {
          setHandMode('scroll');
          setCursorVisible(false);
          setCursorHovering(false);
          snappedCardRef.current = '';
        }
        setHandStatus('🖐 浏览卡牌 — 握拳选择');

        const row = document.querySelector('[data-card-scroll]') as HTMLElement | null;
        if (!row || row.scrollWidth <= row.clientWidth) break;

        const maxScroll = row.scrollWidth - row.clientWidth;
        // Flip X for mirror, clamp to 0-1
        const handPercent = Math.max(0, Math.min(1, 1 - intent.normalizedX));
        const targetScroll = handPercent * maxScroll;
        // Smooth follow
        row.scrollLeft += (targetScroll - row.scrollLeft) * 0.22;
        break;
      }

      // ── Closed fist: cursor mode ──
      case 'CURSOR_MODE': {
        if (handMode !== 'cursor') {
          setHandMode('cursor');
          setCursorVisible(true);
        }
        setHandStatus('✊ 选择卡牌 — 捏合抽牌');

        const bounds = getCardRowBounds();
        const rowCenterY = bounds.top + (bounds.bottom - bounds.top) / 2;
        setCursorY(rowCenterY / window.innerHeight);

        const screenX = (1 - intent.normalizedX) * window.innerWidth;
        const hover = resolveHover(screenX);

        if (hover.cardId) {
          // Snap to card center
          if (snappedCardRef.current && snappedCardRef.current !== hover.cardId) {
            const prevEl = document.querySelector(`[data-card-id="${snappedCardRef.current}"]`) as HTMLElement | null;
            if (prevEl) {
              const pr = prevEl.getBoundingClientRect();
              const distToPrev = Math.abs(screenX - (pr.left + pr.width / 2));
              const distToNew = Math.abs(screenX - hover.centerX);
              if (distToNew < distToPrev - 20) {
                snappedCardRef.current = hover.cardId;
              }
            } else {
              snappedCardRef.current = hover.cardId;
            }
          } else if (!snappedCardRef.current) {
            snappedCardRef.current = hover.cardId;
          }

          const snappedEl = document.querySelector(`[data-card-id="${snappedCardRef.current}"]`) as HTMLElement | null;
          if (snappedEl) {
            const sr = snappedEl.getBoundingClientRect();
            const snapNx = 1 - ((sr.left + sr.width / 2) / window.innerWidth);
            setCursorX(Math.max(0, Math.min(1, snapNx)));
          }
          setHoveredCardId(snappedCardRef.current);
          setCursorHovering(true);
        } else {
          snappedCardRef.current = '';
          setCursorX(intent.normalizedX);
          setHoveredCardId(null);
          setCursorHovering(false);
        }
        break;
      }

      case 'DRAW_CONFIRMED': {
        if (phase !== 'drawing') return;
        const targetId = state.hoveredCardId || intent.cardId;
        if (!targetId) { setHandStatus('未选中卡牌，请先握拳选择'); break; }
        const drawnIds = new Set(Array.from(drawnCards.values()).map(dc => dc.card.id));
        const card = deck.find(c => c.id === targetId);
        if (card && currentDrawPosition && !drawnIds.has(card.id)) {
          // Capture source card position for flight animation
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
          drawCardAction(currentDrawPosition, card);
          setHoveredCardId(null);
          snappedCardRef.current = '';
          setHandStatus('✅ 已抽取');
          setCursorPinching(false);
          setCursorHovering(false);
        }
        break;
      }

      case 'REVEAL_TRIGGERED':
        if (phase === 'revealing') {
          revealForReading();
          setHandStatus('🃏 卡牌已翻开 — 准备解读');
        }
        break;

      case 'READING_OPEN_PALM_CONFIRMED':
        if (phase === 'reading-ready') {
          armReading();
          setHandStatus('已准备');
          armedTimerRef.current = window.setTimeout(() => {
            cancelReadingArmed();
            setHandStatus('超时取消');
          }, 1500);
        }
        break;

      case 'READING_FIST_CONFIRMED':
        if (phase === 'reading-armed' && !readingTriggered) {
          if (armedTimerRef.current) clearTimeout(armedTimerRef.current);
          triggerReading();
          setHandStatus('已触发解读');
        }
        break;

      case 'GESTURE_CANCELLED':
        setHandStatus('手部丢失');
        setHandMode('none');
        setCursorVisible(false);
        setCursorHovering(false);
        setCursorPinching(false);
        snappedCardRef.current = '';
        break;
    }
  }, [phase, handMode, drawnCards, deck, currentDrawPosition, drawCardAction, setFlyingCard, revealForReading, armReading, cancelReadingArmed, triggerReading, readingTriggered, state.hoveredCardId, setHoveredCardId, resolveHover, getCardRowBounds]);

  // ── Keep engine callback synced ──
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setCallback((intent: GestureIntent) => { handleGesture(intent); });
    }
  }, [handleGesture, engineRef]);

  if (state.interactionMode !== 'gesture') return null;

  return (
    <div className={styles.overlay}>
      <GestureCursor
        normalizedX={cursorX}
        normalizedY={cursorY}
        visible={cursorVisible}
        hovering={cursorHovering}
        pinching={cursorPinching}
      />

      {/* Mini camera */}
      <div className={styles.cameraMini}>
        <video ref={videoRef} autoPlay playsInline muted className={styles.miniVideo} />
        <span className={styles.handStatus}>{handStatus}</span>
      </div>

      {/* Skip */}
      <button className={styles.skipBtn} onClick={skipCurrentStage}>
        跳过{phase === 'shuffling' ? '洗牌' : phase === 'drawing' ? '本轮抽牌' : '手势'}
      </button>

      <BottomHints phase={phase} hintKey={
        phase === 'revealing' ? 'reveal' :
        handMode === 'scroll' ? 'scroll-mode' :
        handMode === 'cursor' ? 'cursor-mode' :
        'no-hand'
      } />
    </div>
  );
}
