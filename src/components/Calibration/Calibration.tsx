import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { useGestureEngine } from '../../hooks/useGestureEngine';
import { GestureIntent } from '../../types';
import styles from './Calibration.module.css';

type CalibStep = 'palm' | 'shuffle' | 'pinch' | 'reading';
type StepStatus = 'waiting' | 'in-progress' | 'passed' | 'failed';

interface StepState {
  key: CalibStep;
  title: string;
  instruction: string;
  status: StepStatus;
  progress: number;
}

const STEP_ENGINE_PHASE: Record<CalibStep, string> = {
  palm: 'calibration',
  shuffle: 'shuffling',
  pinch: 'drawing',
  reading: 'reading-ready',
};

const STEPS: Array<{ key: CalibStep; title: string; instruction: string }> = [
  { key: 'palm', title: '手掌识别', instruction: '请张开手掌，稳定放入画面中央' },
  { key: 'shuffle', title: '洗牌手势', instruction: '张开手掌，左右挥动至少 2 次' },
  { key: 'pinch', title: '捏合抽牌', instruction: '拇指与食指捏合，稳定片刻后再拉动' },
  { key: 'reading', title: '解牌手势', instruction: '先张开手掌稳定，然后在 1.5 秒内握拳' },
];

export default function Calibration() {
  const { calibrationDone, switchMode } = useGame();
  const { start, stop, setPhase, engineRef } = useGestureEngine();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<StepState[]>(
    STEPS.map(s => ({ ...s, status: 'waiting' as StepStatus, progress: 0 })),
  );
  const [handDetected, setHandDetected] = useState(false);

  // Keep currentStep in a ref so the gesture handler always reads the latest value
  const currentStepRef = useRef(currentStep);
  currentStepRef.current = currentStep;

  // ── Setup camera + engine ──
  useEffect(() => {
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
          await start(videoRef.current, (intent: GestureIntent) => { handleGesture(intent); });
          setPhase('calibration');
        }
      } catch {
        if (!cancelled) switchMode('classic');
      }
    }
    setup();
    return () => {
      cancelled = true;
      stop();
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Gesture handler ──
  // Note: never calls any state setter other than setSteps/setHandDetected.
  // Advancing is done by the useEffect below, cleanly outside of this callback.
  const handleGesture = useCallback((intent: GestureIntent) => {
    setHandDetected(intent.type !== 'GESTURE_CANCELLED');

    setSteps(prev => {
      const idx = currentStepRef.current;
      const step = prev[idx];
      if (!step || step.status === 'passed') return prev;

      const updated = [...prev];
      const current = { ...updated[idx] };

      switch (current.key) {
        case 'palm':
          if (intent.type === 'HAND_VISIBLE') {
            current.status = 'in-progress';
            current.progress = Math.min(1, current.progress + 0.05);
            if (current.progress >= 1) {
              current.status = 'passed';
              current.progress = 1;
            }
          } else if (intent.type === 'GESTURE_CANCELLED') {
            current.progress = Math.max(0, current.progress - 0.03);
          }
          break;

        case 'shuffle':
          if (intent.type === 'SHUFFLE_PROGRESS') {
            current.progress = intent.progress;
            current.status = 'in-progress';
            if (intent.progress >= 0.5) {
              current.status = 'passed';
              current.progress = 1;
            }
          }
          break;

        case 'pinch':
          if (intent.type === 'DRAW_CONFIRMED') {
            current.status = 'passed';
            current.progress = 1;
          } else if (intent.type === 'DRAW_ARMED') {
            current.status = 'in-progress';
            current.progress = 0.6;
          }
          break;

        case 'reading':
          if (intent.type === 'READING_OPEN_PALM_CONFIRMED') {
            current.progress = 0.5;
            current.status = 'in-progress';
            setPhase('reading-armed');
          } else if (intent.type === 'READING_FIST_CONFIRMED') {
            current.status = 'passed';
            current.progress = 1;
          }
          break;
      }

      updated[idx] = current;
      return updated;
    });
  }, [setPhase]);

  // ── Keep engine callback synced ──
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setCallback((intent: GestureIntent) => { handleGesture(intent); });
    }
  }, [handleGesture, engineRef]);

  // ── Auto-advance when current step is passed ──
  // This runs cleanly as a React effect, never nested inside a setState callback.
  // That's the key fix: calling setCurrentStep inside setSteps caused React 18
  // batched updates to stall until a tab-focus event forced a flush.
  useEffect(() => {
    const step = steps[currentStep];
    if (!step || step.status !== 'passed') return;

    // Advance on the next animation frame so React has fully flushed
    // the "passed" state to the DOM before we switch steps.
    const raf = requestAnimationFrame(() => {
      if (currentStep >= STEPS.length - 1) {
        calibrationDone();
      } else {
        const nextKey = STEPS[currentStep + 1].key;
        setPhase(STEP_ENGINE_PHASE[nextKey]);
        setCurrentStep(currentStep + 1);
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [steps, currentStep, calibrationDone, setPhase]);

  const handleSkip = () => calibrationDone();
  const handleSkipStep = () => {
    setSteps(prev => {
      const updated = [...prev];
      if (updated[currentStep]) {
        updated[currentStep] = { ...updated[currentStep], status: 'passed', progress: 1 };
      }
      return updated;
    });
  };

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className={styles.title}>快速校准</h2>
        <p className={styles.subtitle}>让我们确认手势识别在你的环境中正常工作</p>

        <div className={styles.stepDots}>
          {steps.map((s, i) => (
            <div
              key={s.key}
              className={`${styles.dot} ${styles[`dot-${s.status}`]} ${i === currentStep ? styles.dotActive : ''}`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            className={styles.instruction}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <div className={styles.stepBadge}>步骤 {currentStep + 1}/{STEPS.length}</div>
            <h3 className={styles.stepTitle}>{steps[currentStep]?.title}</h3>
            <p className={styles.stepInstruction}>{steps[currentStep]?.instruction}</p>
            <div className={styles.progressBar}>
              <motion.div
                className={styles.progressFill}
                animate={{ width: `${(steps[currentStep]?.progress ?? 0) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        </AnimatePresence>

        <div className={styles.previewArea}>
          <video ref={videoRef} autoPlay playsInline muted className={styles.preview} />
          <div className={`${styles.handIndicator} ${handDetected ? styles.handOk : styles.handMissing}`}>
            {handDetected ? '手部已检测' : '等待手部...'}
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.skipStepBtn} onClick={handleSkipStep}>跳过此步骤</button>
          <button className={styles.skipAllBtn} onClick={handleSkip}>跳过全部校准，直接开始</button>
          <button className={styles.classicBtn} onClick={() => switchMode('classic')}>切换到经典模式</button>
        </div>
      </motion.div>
    </div>
  );
}
