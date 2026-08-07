import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import HistoryPage from '../HistoryPage/HistoryPage';
import styles from './SidePanel.module.css';

export default function SidePanel() {
  const { state, skipCurrentStage, switchMode, startShuffle } = useGame();
  const { phase, interactionMode, handDetected } = state;
  const [showCamera, setShowCamera] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [reshuffleConfirm, setReshuffleConfirm] = useState(false);

  const handLabel = handDetected ? '已检测' : '未检测';

  const handleReshuffle = () => {
    if (!reshuffleConfirm) {
      setReshuffleConfirm(true);
      setTimeout(() => setReshuffleConfirm(false), 3000);
      return;
    }
    startShuffle();
    setReshuffleConfirm(false);
  };

  const handleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  const stageLabels: Record<string, string> = {
    'shuffling': '洗牌',
    'drawing': '抽牌',
    'reading-ready': '等待确认',
    'reading-armed': '已准备',
    'reading': '解读中',
    'completed': '完成',
  };

  return (
    <>
      <aside className={styles.panel}>
        {/* Session info */}
        <div className={styles.section}>
          <div className={styles.label}>当前阶段</div>
          <div className={styles.value}>{stageLabels[phase] || phase}</div>
        </div>

        {/* Hand status */}
        <div className={styles.section}>
          <div className={styles.label}>手部状态</div>
          <div className={`${styles.value} ${handDetected ? styles.ok : styles.muted}`}>
            {handLabel}
          </div>
        </div>

        {/* Camera toggle */}
        <div className={styles.section}>
          <div className={styles.label}>摄像头画面</div>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={showCamera}
              onChange={e => setShowCamera(e.target.checked)}
            />
            <span>{showCamera ? '显示' : '隐藏'}</span>
          </label>
        </div>

        <hr className={styles.divider} />

        {/* Actions */}
        <button className={styles.actionBtn} onClick={skipCurrentStage}>
          跳过当前{stageLabels[phase] || '阶段'}
        </button>

        <button className={styles.actionBtn} onClick={handleReshuffle}>
          {reshuffleConfirm ? '确认重新洗牌？(会清空当前结果)' : '重新洗牌'}
        </button>

        <button className={styles.actionBtn} onClick={handleFullscreen}>
          全屏
        </button>

        <button className={styles.actionBtn} onClick={() => setShowHistory(true)}>
          抽卡记录
        </button>

        <button
          className={`${styles.actionBtn} ${styles.switchBtn}`}
          onClick={() => switchMode('classic')}
        >
          切换到经典模式
        </button>

        <hr className={styles.divider} />

        {/* Gesture tutorial */}
        <div className={styles.section}>
          <div className={styles.label}>手势教程</div>
          <div className={styles.tutorial}>
            {phase === 'shuffling' && '张开手掌左右挥动'}
            {phase === 'drawing' && '移动选择→捏合→拉动'}
            {(phase === 'reading-ready' || phase === 'reading-armed') && '张开手掌 → 握拳确认'}
            {phase === 'reading' && '解读生成中...'}
          </div>
        </div>
      </aside>

      <AnimatePresence>
        {showHistory && (
          <HistoryPage onClose={() => setShowHistory(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
