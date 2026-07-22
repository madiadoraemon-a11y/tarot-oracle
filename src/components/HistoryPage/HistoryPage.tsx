import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReadingHistory } from '../../hooks/useReadingHistory';
import { ReadingRecord } from '../../types';
import HistoryDetail from '../HistoryDetail/HistoryDetail';
import styles from './HistoryPage.module.css';

interface Props {
  onClose: () => void;
}

export default function HistoryPage({ onClose }: Props) {
  const { records, deleteReading, clearAll } = useReadingHistory();
  const [selectedRecord, setSelectedRecord] = useState<ReadingRecord | null>(null);

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('确定删除这条占卜记录吗？')) {
      deleteReading(id);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={styles.panel}
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className={styles.header}>
            <h2 className={styles.title}>历史记录</h2>
            <div className={styles.headerActions}>
              {records.length > 0 && (
                <button className={styles.clearBtn} onClick={() => {
                  if (confirm('确定清除所有历史记录吗？此操作不可恢复。')) clearAll();
                }}>
                  清空全部
                </button>
              )}
              <button className={styles.closeBtn} onClick={onClose}>✕</button>
            </div>
          </div>

          {/* Records list */}
          <div className={styles.list}>
            {records.length === 0 ? (
              <div className={styles.empty}>
                <div className={styles.emptyIcon}>🔮</div>
                <p className={styles.emptyText}>暂无占卜记录</p>
                <p className={styles.emptyHint}>完成一次占卜后，结果将保存在这里</p>
              </div>
            ) : (
              records.map(record => (
                <motion.div
                  key={record.id}
                  className={styles.recordCard}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setSelectedRecord(record)}
                >
                  <div className={styles.recordInfo}>
                    <span className={styles.recordDate}>{formatDate(record.timestamp)}</span>
                    <span className={styles.recordSpread}>{record.spreadName}</span>
                    {record.question && (
                      <span className={styles.recordQuestion}>「{record.question}」</span>
                    )}
                  </div>
                  <div className={styles.recordCards}>
                    {record.cards.map(c => (
                      <span key={c.positionId} className={styles.recordCardName}>
                        {c.cardNameZh}
                        {c.isReversed && <sup className={styles.rev}>逆</sup>}
                      </span>
                    ))}
                  </div>
                  <button
                    className={styles.deleteBtn}
                    onClick={e => handleDelete(record.id, e)}
                  >
                    删除
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Detail modal */}
      {selectedRecord && (
        <HistoryDetail
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )}
    </AnimatePresence>
  );
}
