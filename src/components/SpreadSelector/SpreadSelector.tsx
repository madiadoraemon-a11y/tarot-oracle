import { spreads } from '../../data/spreads';
import { useGame } from '../../context/GameContext';
import type { SpreadConfig } from '../../types';
import styles from './SpreadSelector.module.css';

export default function SpreadSelector() {
  const { selectSpread, backToMeditation } = useGame();

  return (
    <div className={styles.container}>
      {/* ── Header ── */}
      <header className={styles.header}>
        <button
          className={styles.backButton}
          onClick={backToMeditation}
          aria-label="返回冥想"
        >
          <span className={styles.backArrow} aria-hidden="true">&#8592;</span>
          <span className={styles.backLabel}>返回</span>
        </button>

        <div className={styles.titleGroup}>
          <h1 className={styles.title}>选择牌阵</h1>
          <p className={styles.subtitle}>
            不同的牌阵适合不同的问题与深度
          </p>
        </div>

        {/* Spacer to balance the back button for centering */}
        <div className={styles.headerSpacer} aria-hidden="true" />
      </header>

      {/* ── Spread Grid ── */}
      <div className={styles.grid}>
        {spreads.map((spread) => (
          <SpreadCard
            key={spread.id}
            spread={spread}
            onSelect={() => selectSpread(spread)}
          />
        ))}
      </div>
    </div>
  );
}

// ── Spread Card ──

interface SpreadCardProps {
  spread: SpreadConfig;
  onSelect: () => void;
}

function SpreadCard({ spread, onSelect }: SpreadCardProps) {
  return (
    <button className={styles.card} onClick={onSelect} type="button">
      {/* Mini layout preview */}
      <div className={styles.preview} aria-hidden="true">
        <div className={styles.previewInner}>
          {spread.positions.map((pos) => (
            <span
              key={pos.id}
              className={styles.dot}
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Card info */}
      <div className={styles.cardInfo}>
        <h2 className={styles.cardName}>{spread.name}</h2>
        <span className={styles.cardCount}>
          {spread.cardCount} 张牌
        </span>
      </div>

      <p className={styles.cardDesc}>{spread.description}</p>
    </button>
  );
}
