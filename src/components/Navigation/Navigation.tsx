import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import HistoryPage from '../HistoryPage/HistoryPage';
import styles from './Navigation.module.css';

export default function Navigation() {
  const { state, backToSelect, backToMeditation, backToModeSelection, resetGame } = useGame();
  const [showHistory, setShowHistory] = useState(false);
  const { phase } = state;

  const getBackAction = () => {
    if (phase === 'selecting') return { fn: backToMeditation, label: '← 返回' };
    if (phase === 'mode-selection') return { fn: backToSelect, label: '← 牌阵选择' };
    if (phase === 'result' || phase === 'completed') return { fn: backToSelect, label: '← 牌阵选择' };
    return { fn: backToModeSelection, label: '← 模式选择' };
  };

  const { fn: backFn, label: backLabel } = getBackAction();

  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.left}>
          <button className={styles.navBtn} onClick={backFn}>
            {backLabel}
          </button>
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
