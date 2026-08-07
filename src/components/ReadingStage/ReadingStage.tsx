import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { useReadingHistory } from '../../hooks/useReadingHistory';
import { readingService } from '../../services/ReadingService';
import { generateLocalReading } from '../../services/LocalReadingGenerator';
import TarotCardComponent from '../TarotCard/TarotCard';
import styles from './ReadingStage.module.css';

const STATUS_MESSAGES: Record<string, string> = {
  connecting: '正在连接牌面线索...',
  analyzing: '正在分析牌位关系...',
  generating: '正在形成个性化建议...',
};

export default function ReadingStage() {
  const { state, setReadingContent, setReadingStatus, goToResult, switchMode } = useGame();
  const { saveReading } = useReadingHistory();
  const { selectedSpread, drawnCards, userQuestion, readingContent, readingStatus, interactionMode } = state;

  const [statusMsg, setStatusMsg] = useState(STATUS_MESSAGES.connecting);
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [followUpAnswer, setFollowUpAnswer] = useState('');
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isLocal, setIsLocal] = useState(false);
  const generatedRef = useRef(false);

  // Auto-start AI reading on mount
  useEffect(() => {
    if (generatedRef.current || !selectedSpread) return;
    generatedRef.current = true;
    startReading();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Rotate status messages
  useEffect(() => {
    if (readingStatus !== 'generating') return;
    const keys = Object.keys(STATUS_MESSAGES);
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % keys.length;
      setStatusMsg(STATUS_MESSAGES[keys[idx]]);
    }, 2500);
    return () => clearInterval(interval);
  }, [readingStatus]);

  const startReading = useCallback(async () => {
    if (!selectedSpread) return;

    setReadingStatus('generating');

    const cards = Array.from(drawnCards.entries()).map(([posId, dc], i) => {
      const pos = selectedSpread.positions.find(p => p.id === posId);
      return {
        cardId: dc.card.id,
        name: dc.card.nameEn,
        nameZh: dc.card.nameZh,
        orientation: dc.isReversed ? 'reversed' as const : 'upright' as const,
        positionId: posId,
        baseMeaning: dc.isReversed ? dc.card.reversedMeaning : dc.card.uprightMeaning,
        drawOrder: i,
      };
    });

    const request = readingService.buildRequest({
      sessionId: crypto.randomUUID?.() || Date.now().toString(36),
      question: userQuestion || undefined,
      locale: 'zh-CN',
      spreadId: selectedSpread.id,
      spreadName: selectedSpread.name,
      positions: selectedSpread.positions.map(p => ({
        id: p.id,
        name: p.label,
        meaning: '',
      })),
      cards,
    });

    await readingService.streamReading(request, {
      onToken: (text) => setReadingContent(text),
      onDone: (text) => {
        setReadingContent(text);
        setReadingStatus('completed');
      },
      onError: () => {
        // Fall back to local reading generator
        setIsLocal(true);
        const localReading = generateLocalReading(request);
        setReadingContent(localReading);
        setReadingStatus('completed');
      },
    });
  }, [selectedSpread, drawnCards, userQuestion, setReadingContent, setReadingStatus]);

  const handleStop = () => {
    readingService.cancel();
    setReadingStatus('completed');
  };

  const handleRetry = () => {
    generatedRef.current = false;
    setReadingContent('');
    startReading();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(readingContent);
    } catch { /* clipboard not available */ }
  };

  const handleSave = () => {
    if (!selectedSpread || saved) return;
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
    setSaved(true);
  };

  const handleFollowUp = async () => {
    if (!followUpQuestion.trim() || !selectedSpread) return;

    const cards = Array.from(drawnCards.entries()).map(([posId, dc], i) => ({
      cardId: dc.card.id,
      name: dc.card.nameEn,
      nameZh: dc.card.nameZh,
      orientation: dc.isReversed ? 'reversed' as const : 'upright' as const,
      positionId: posId,
      baseMeaning: dc.isReversed ? dc.card.reversedMeaning : dc.card.uprightMeaning,
      drawOrder: i,
    }));

    const sessionCtx = readingService.buildRequest({
      sessionId: crypto.randomUUID?.() || Date.now().toString(36),
      question: userQuestion || undefined,
      locale: 'zh-CN',
      spreadId: selectedSpread.id,
      spreadName: selectedSpread.name,
      positions: selectedSpread.positions.map(p => ({
        id: p.id,
        name: p.label,
        meaning: '',
      })),
      cards,
    });

    await readingService.streamFollowUp(
      Date.now().toString(36),
      followUpQuestion,
      readingContent,
      sessionCtx,
      {
        onToken: (text) => setFollowUpAnswer(text),
        onDone: () => {},
        onError: (err) => setFollowUpAnswer(`追问失败：${err}`),
      },
    );
  };

  const drawnList = Array.from(drawnCards.values());

  return (
    <div className={styles.container}>
      {/* Card reveal area */}
      <motion.div
        className={styles.cardsArea}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className={styles.cardGrid}>
          {drawnList.map((dc, i) => (
            <motion.div
              key={dc.card.id}
              className={styles.cardItem}
              initial={{ rotateY: 180, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.2, duration: 0.6 }}
            >
              <TarotCardComponent
                card={dc.card}
                isFlipped
                isReversed={dc.isReversed}
                small
              />
              <div className={styles.cardName}>
                {dc.card.nameZh}{dc.isReversed ? ' (逆)' : ''}
              </div>
              <div className={styles.cardPosition}>
                {selectedSpread?.positions.find(p => p.id === dc.positionId)?.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* AI Reading content */}
      <div className={styles.readingArea}>
        {/* Status */}
        {readingStatus === 'generating' && (
          <div className={styles.generating}>
            <motion.span
              className={styles.spinner}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              ✦
            </motion.span>
            <span className={styles.statusText}>{statusMsg}</span>
            <button className={styles.stopBtn} onClick={handleStop}>
              停止生成
            </button>
          </div>
        )}

        {/* Content */}
        {(readingStatus === 'completed' || readingStatus === 'generating') && readingContent && (
          <motion.div
            className={styles.content}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className={styles.markdown}>
              {formatReadingContent(readingContent)}
            </div>

            {/* AI label */}
            <div className={styles.aiLabel}>
              {isLocal
                ? '✦ 以上内容由本地生成（离线模式），仅供娱乐和自我反思'
                : '✦ 以上内容由 AI 生成，仅供娱乐和自我反思，不替代专业意见'}
            </div>
          </motion.div>
        )}

        {/* Failed */}
        {readingStatus === 'failed' && (
          <div className={styles.failed}>
            <p>{readingContent}</p>
            <button className={styles.retryBtn} onClick={handleRetry}>
              重新生成
            </button>
          </div>
        )}

        {/* Actions */}
        {readingStatus === 'completed' && (
          <motion.div
            className={styles.actions}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <button className={styles.actionBtn} onClick={handleSave} disabled={saved}>
              {saved ? '已保存' : '✦ 保存到历史记录'}
            </button>
            <button className={styles.actionBtn} onClick={handleCopy}>
              复制解读内容
            </button>
            <button className={styles.actionBtn} onClick={() => setShowFollowUp(!showFollowUp)}>
              追问
            </button>
            <button className={styles.actionBtn} onClick={handleRetry}>
              重新生成
            </button>
            <button className={styles.secondaryBtn} onClick={goToResult}>
              查看卡牌布局
            </button>
            {interactionMode === 'gesture' && (
              <button className={styles.secondaryBtn} onClick={() => switchMode('classic')}>
                切换到经典模式
              </button>
            )}
          </motion.div>
        )}

        {/* Follow-up */}
        <AnimatePresence>
          {showFollowUp && readingStatus === 'completed' && (
            <motion.div
              className={styles.followUp}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <textarea
                className={styles.followUpInput}
                value={followUpQuestion}
                onChange={e => setFollowUpQuestion(e.target.value)}
                placeholder="关于这次解读，你还想了解什么？"
                maxLength={300}
                rows={2}
              />
              <button className={styles.actionBtn} onClick={handleFollowUp}>
                发送追问
              </button>
              {followUpAnswer && (
                <div className={styles.followUpAnswer}>
                  {formatReadingContent(followUpAnswer)}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/** Simple plain-text formatting for reading content */
function formatReadingContent(text: string): JSX.Element[] {
  return text.split('\n').map((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) return <br key={i} />;
    return <p key={i}>{trimmed}</p>;
  });
}
