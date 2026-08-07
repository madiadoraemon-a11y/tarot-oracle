import { GamePhase } from '../../types';
import styles from './BottomHints.module.css';

interface Props {
  phase: GamePhase;
  hintKey: string;
}

const HINTS: Record<string, { text: string; icon: string }> = {
  'no-hand': { text: '请将一只手放入画面中央', icon: '👋' },
  'shuffle': { text: '张开手掌，左右挥动，让牌随你的动作流动', icon: '🤚' },
  'draw': { text: '移动手掌选择卡牌，捏住并向自己拉动', icon: '👌' },
  'scroll-mode': { text: '🖐 手掌控制牌行滑动，握拳切换光标', icon: '🖐' },
  'cursor-mode': { text: '✊ 光标选牌，拇指食指捏合抽取', icon: '✊' },
  'reveal': { text: '🖐 翻转手掌（掌心朝前→朝下），翻开所有卡牌', icon: '🃏' },
  'reading-ready': { text: '张开手掌，准备连接牌面的线索', icon: '🖐' },
  'reading-armed': { text: '已准备，请握拳确认解牌', icon: '✊' },
  'reading-timeout': { text: '未完成确认，请重新张开手掌', icon: '⏱' },
  'reading-triggered': { text: '已确认，正在解读你的牌阵...', icon: '✨' },
};

export default function BottomHints({ hintKey }: Props) {
  const hint = HINTS[hintKey] || HINTS['no-hand'];

  return (
    <div className={styles.container}>
      <span className={styles.icon} aria-hidden="true">{hint.icon}</span>
      <span className={styles.text}>{hint.text}</span>
    </div>
  );
}
