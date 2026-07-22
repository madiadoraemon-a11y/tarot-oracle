import { useGame } from './context/GameContext';
import { AnimatePresence, motion } from 'framer-motion';
import Starfield from './components/Starfield/Starfield';
import MeditationStep from './components/MeditationStep/MeditationStep';
import SpreadSelector from './components/SpreadSelector/SpreadSelector';
import CardSpread from './components/CardSpread/CardSpread';
import DrawZone from './components/DrawZone/DrawZone';
import FlippedCardModal from './components/FlippedCardModal/FlippedCardModal';
import ReadingResult from './components/ReadingResult/ReadingResult';
import Navigation from './components/Navigation/Navigation';
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

      {phase !== 'meditation' && phase !== 'selecting' && (
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

        {(phase === 'shuffling' || phase === 'drawing' || phase === 'revealing') && (
          <motion.div key="drawing" {...pageVariants} className={styles.pageFull}>
            <CardSpread />
            <DrawZone />
          </motion.div>
        )}

        {phase === 'result' && (
          <motion.div key="result" {...pageVariants} className={styles.page}>
            <ReadingResult />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal overlay for enlarged flipped card */}
      <FlippedCardModal />
    </div>
  );
}
