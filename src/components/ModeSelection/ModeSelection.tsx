import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import styles from './ModeSelection.module.css';

export default function ModeSelection() {
  const { state, selectMode, backToSelect } = useGame();

  return (
    <div className={styles.container}>
      <motion.header
        className={styles.header}
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          className={styles.backBtn}
          onClick={backToSelect}
          aria-label="返回选择牌阵"
        >
          <span aria-hidden="true">&#8592;</span> 返回
        </button>
        <h1 className={styles.title}>选择交互方式</h1>
        <p className={styles.subtitle}>
          你已选择了「{state.selectedSpread?.name}」牌阵，接下来想以哪种方式完成抽牌？
        </p>
      </motion.header>

      <div className={styles.modeCards}>
        {/* Classic Mode */}
        <motion.button
          className={styles.modeCard}
          onClick={() => selectMode('classic')}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className={styles.cardIcon}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
              <rect x="14" y="10" width="20" height="28" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M18 20h12M18 25h8M18 30h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className={styles.cardTitle}>经典模式</h2>
          <ul className={styles.cardFeatures}>
            <li>点击或触屏操作</li>
            <li>无需摄像头</li>
            <li>稳定快速</li>
          </ul>
          <span className={styles.cardAction}>使用经典模式</span>
        </motion.button>

        {/* Gesture Mode */}
        <motion.button
          className={`${styles.modeCard} ${styles.gestureCard}`}
          onClick={() => selectMode('gesture')}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className={styles.cardIcon}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
              <path d="M18 14c-1.5 0-3 .8-3 2.5v15c0 1.7 1.5 2.5 3 2.5s3-.8 3-2.5v-15c0-1.7-1.5-2.5-3-2.5z
                       M24 11c-1.5 0-3 .8-3 2.5v21c0 1.7 1.5 2.5 3 2.5s3-.8 3-2.5v-21c0-1.7-1.5-2.5-3-2.5z
                       M30 14c-1.5 0-3 .8-3 2.5v15c0 1.7 1.5 2.5 3 2.5s3-.8 3-2.5v-15c0-1.7-1.5-2.5-3-2.5z"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className={styles.cardTitle}>手势模式</h2>
          <ul className={styles.cardFeatures}>
            <li>使用摄像头识别手势</li>
            <li>洗牌、抽牌、解牌手势交互</li>
            <li>可随时退出到经典模式</li>
          </ul>
          <span className={styles.cardAction}>开启手势模式</span>
        </motion.button>
      </div>

      <motion.p
        className={styles.note}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        两种方式使用相同的抽卡核心，选择喜欢的体验即可。
        手势模式需要摄像头和良好光线，视频默认不上传。
      </motion.p>
    </div>
  );
}
