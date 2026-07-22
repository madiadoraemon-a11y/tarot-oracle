import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import HistoryPage from '../HistoryPage/HistoryPage';
import styles from './Navigation.module.css';

export default function Navigation() {
  const { state, backToSelect, backToMeditation, resetGame } = useGame();
  const [showHistory, setShowHistory] = useState(false);
  const { phase } = state;

  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.left}>
          {phase !== 'result' && (
            <button
              className={styles.navBtn}
              onClick={phase === 'selecting' ? backToMeditation : backToSelect}
            >
              ← 返回
            </button>
          )}
          {phase === 'result' && (
            <button className={styles.navBtn} onClick={backToSelect}>
              ← 牌阵选择
            </button>
          )}
        </div>

        <span className={styles.brand}>月光神谕</span>

        <div className={styles.right}>
          <button
            className={styles.navBtn}
            onClick={() => setShowHistory(true)}
          >
            历史记录
          </button>
          <button
            className={`${styles.navBtn} ${styles.resetBtn}`}
            onClick={resetGame}
          >
            重新开始
          </button>
        </div>
      </nav>

      {showHistory && (
        <HistoryPage onClose={() => setShowHistory(false)} />
      )}
    </>
  );
}
