import { useGame } from '../../context/GameContext';
import styles from './MeditationStep.module.css';

export default function MeditationStep() {
  const { state, setQuestion, backToSelect } = useGame();

  const handleContinue = () => {
    backToSelect();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleContinue();
    }
  };

  return (
    <div className={styles.container}>
      {/* ── Moon section ── */}
      <div className={styles.moonSection}>
        <div className={styles.moonWrapper}>
          <svg
            className={styles.moon}
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M 60 8
                 A 50 50 0 1 0 60 112
                 A 40 40 0 1 1 60 8
                 Z"
              fill="currentColor"
            />
          </svg>
          <div className={styles.moonGlow} />
        </div>
      </div>

      {/* ── Title ── */}
      <h2 className={styles.title}>静心凝神</h2>

      {/* ── Subtitle ── */}
      <p className={styles.subtitle}>
        在心中默念你想询问的问题，当你准备好时，宇宙将透过塔罗牌为你指引方向
      </p>

      {/* ── Decorative divider ── */}
      <div className={styles.divider} aria-hidden="true">
        <span className={styles.dividerLine} />
        <span className={styles.dividerOrnament}>&#10038;</span>
        <span className={styles.dividerLine} />
      </div>

      {/* ── Question input ── */}
      <div className={styles.inputSection}>
        <input
          className={styles.input}
          type="text"
          value={state.userQuestion}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入你的问题（可选）..."
          maxLength={200}
          aria-label="输入你的问题"
        />
      </div>

      {/* ── Continue button ── */}
      <button className={styles.button} onClick={handleContinue} type="button">
        选择牌阵&nbsp;&rarr;
      </button>
    </div>
  );
}
