import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { useReadingHistory } from '../../hooks/useReadingHistory';
import TarotCardComponent from '../TarotCard/TarotCard';
import styles from './ReadingResult.module.css';

export default function ReadingResult() {
  const { state, backToSelect, resetGame } = useGame();
  const { saveReading } = useReadingHistory();
  const { selectedSpread, drawnCards, userQuestion } = state;

  if (!selectedSpread) return null;

  const drawnList = Array.from(drawnCards.values());

  const handleSave = () => {
    saveReading({
      spreadType: selectedSpread.id,
      spreadName: selectedSpread.name,
      question: userQuestion,
      cards: Array.from(drawnCards.entries()).map(([posId, dc]) => ({
        positionId: posId,
        positionLabel: selectedSpread.positions.find(p => p.id === posId)?.label || posId,
        cardId: dc.card.id,
        cardNameEn: dc.card.nameEn,
        cardNameZh: dc.card.nameZh,
        isReversed: dc.isReversed,
      })),
    });
    alert('占卜结果已保存到历史记录 ✦');
  };

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className={styles.title}>占卜解读</h1>
        <p className={styles.spreadName}>{selectedSpread.name}</p>
        {userQuestion && (
          <p className={styles.question}>「{userQuestion}」</p>
        )}
      </motion.div>

      {/* Spread layout with all cards flipped */}
      <div className={styles.spreadLayout}>
        <div className={styles.positionsContainer}>
          {selectedSpread.positions.map(pos => {
            const dc = drawnCards.get(pos.id);
            return (
              <div
                key={pos.id}
                className={styles.position}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              >
                {dc ? (
                  <motion.div
                    className={styles.positionCard}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <TarotCardComponent
                      card={dc.card}
                      isFlipped
                      isReversed={dc.isReversed}
                      small
                    />
                    <div className={styles.posLabel}>{pos.label}</div>
                    <div className={styles.posCardName}>{dc.card.nameZh}{dc.isReversed ? ' (逆)' : ''}</div>
                  </motion.div>
                ) : (
                  <div className={styles.emptyPosition}>
                    <span className={styles.posLabel}>{pos.label}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action buttons */}
      <motion.div
        className={styles.actions}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <button className={styles.btnPrimary} onClick={handleSave}>
          ✦ 保存到历史记录
        </button>
        <button className={styles.btnSecondary} onClick={backToSelect}>
          选择其他牌阵
        </button>
        <button className={styles.btnGhost} onClick={resetGame}>
          重新开始
        </button>
      </motion.div>
    </div>
  );
}
