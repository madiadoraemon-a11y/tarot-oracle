import { useGame } from './context/GameContext';
import { AnimatePresence, motion } from 'framer-motion';
import Starfield from './components/Starfield/Starfield';
import AudioManager from './components/AudioManager/AudioManager';
import ShuffleParticles from './components/ShuffleParticles/ShuffleParticles';
import MeditationStep from './components/MeditationStep/MeditationStep';
import SpreadSelector from './components/SpreadSelector/SpreadSelector';
import ModeSelection from './components/ModeSelection/ModeSelection';
import CameraSetup from './components/CameraSetup/CameraSetup';
import Calibration from './components/Calibration/Calibration';
import CardSpread from './components/CardSpread/CardSpread';
import DrawZone from './components/DrawZone/DrawZone';
import CardFlyAnimation from './components/CardFlyAnimation/CardFlyAnimation';
import FlippedCardModal from './components/FlippedCardModal/FlippedCardModal';
import ReadingResult from './components/ReadingResult/ReadingResult';
import ReadingStage from './components/ReadingStage/ReadingStage';
import Navigation from './components/Navigation/Navigation';
import GestureOverlay from './components/GestureOverlay/GestureOverlay';
import SidePanel from './components/SidePanel/SidePanel';
import styles from './App.module.css';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

export default function App() {
  const { state } = useGame();
  const { phase } = state;

  return (
    <div className={styles.app}>
      <Starfield />
      <ShuffleParticles />
      <AudioManager />

      {phase !== 'meditation' && phase !== 'selecting' && phase !== 'mode-selection' && (
        <Navigation />
      )}

      <AnimatePresence mode="wait">
        {phase === 'meditation' && (
          <motion.div key="meditation" {...pageVariants} className={styles.page}>
            <MeditationStep />
          </motion.div>
        )}

        {phase === 'selecting' && (
          <motion.div key="selecting" {...pageVariants} className={styles.page}>
            <SpreadSelector />
          </motion.div>
        )}

        {phase === 'mode-selection' && (
          <motion.div key="mode-selection" {...pageVariants} className={styles.page}>
            <ModeSelection />
          </motion.div>
        )}

        {(phase === 'shuffling' || phase === 'drawing' || phase === 'revealing'
        || phase === 'reading-ready' || phase === 'reading-armed') && (
          <motion.div key="drawing" {...pageVariants} className={styles.pageFull}>
            <CardSpread />
            <DrawZone />
          </motion.div>
        )}

        {phase === 'camera-setup' && (
          <motion.div key="camera-setup" {...pageVariants} className={styles.page}>
            <CameraSetup />
          </motion.div>
        )}

        {phase === 'calibration' && (
          <motion.div key="calibration" {...pageVariants} className={styles.page}>
            <Calibration />
          </motion.div>
        )}

        {(phase === 'reading' || phase === 'completed') && (
          <motion.div key="reading" {...pageVariants} className={styles.page}>
            <ReadingStage />
          </motion.div>
        )}

        {phase === 'result' && (
          <motion.div key="result" {...pageVariants} className={styles.page}>
            <ReadingResult />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card fly animation — visual bridge from spread to draw zone */}
      <CardFlyAnimation />

      {/* Modal overlay for enlarged flipped card */}
      <FlippedCardModal />

      {/* Gesture mode overlays — skip during calibration & camera setup (they manage their own camera) */}
      {state.interactionMode === 'gesture' && phase !== 'camera-setup' && phase !== 'calibration' && (
        <>
          <GestureOverlay />
          {(phase === 'shuffling' || phase === 'drawing'
            || phase === 'reading-ready' || phase === 'reading-armed'
            || phase === 'reading') && <SidePanel />}
        </>
      )}
    </div>
  );
}
