import styles from './TarotCard.module.css';

export default function CardBack() {
  return (
    <div className={styles.cardBack}>
      <svg viewBox="0 0 200 310" className={styles.cardBackSvg}>
        <defs>
          {/* Mandala pattern */}
          <pattern id="mandala" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="2" fill="var(--color-gold)" opacity="0.2" />
            <path d="M20 5 L20 15 M20 25 L20 35 M5 20 L15 20 M25 20 L35 20"
                  stroke="var(--color-gold)" strokeWidth="0.5" opacity="0.15" />
          </pattern>
          {/* Star field pattern */}
          <pattern id="stars" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <polygon points="30,5 32,25 30,28 28,25"
                     fill="var(--color-gold)" opacity="0.12" />
            <circle cx="50" cy="40" r="1" fill="var(--color-gold)" opacity="0.1" />
            <circle cx="10" cy="15" r="0.8" fill="var(--color-gold)" opacity="0.08" />
          </pattern>
          {/* Gold gradient */}
          <linearGradient id="goldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-gold-dim)" />
            <stop offset="50%" stopColor="var(--color-gold)" />
            <stop offset="100%" stopColor="var(--color-gold-dim)" />
          </linearGradient>
        </defs>

        {/* Base dark field */}
        <rect x="0" y="0" width="200" height="310" rx="8"
              fill="var(--color-midnight)" />

        {/* Outer ornate border */}
        <rect x="3" y="3" width="194" height="304" rx="6"
              fill="none" stroke="url(#goldBorder)" strokeWidth="2" opacity="0.7" />

        {/* Inner border */}
        <rect x="8" y="8" width="184" height="294" rx="4"
              fill="none" stroke="var(--color-gold-dim)" strokeWidth="1" opacity="0.4" />

        {/* Pattern layers */}
        <rect x="10" y="10" width="180" height="290" rx="3"
              fill="url(#mandala)" />
        <rect x="10" y="10" width="180" height="290" rx="3"
              fill="url(#stars)" />

        {/* Corner ornaments */}
        {[[18, 18], [182, 18], [18, 292], [182, 292]].map(([cx, cy], i) => (
          <g key={i} opacity="0.5">
            <circle cx={cx} cy={cy} r="8" fill="none" stroke="var(--color-gold)" strokeWidth="1" />
            <circle cx={cx} cy={cy} r="3" fill="var(--color-gold)" opacity="0.6" />
          </g>
        ))}

        {/* Central mandala */}
        <circle cx="100" cy="155" r="50" fill="none" stroke="var(--color-gold)" strokeWidth="0.8" opacity="0.3" />
        <circle cx="100" cy="155" r="38" fill="none" stroke="var(--color-gold)" strokeWidth="0.6" opacity="0.25" />
        <circle cx="100" cy="155" r="25" fill="none" stroke="var(--color-gold)" strokeWidth="1.2" opacity="0.4" />
        <circle cx="100" cy="155" r="12" fill="none" stroke="var(--color-gold)" strokeWidth="0.8" opacity="0.35" />

        {/* Central star / pentagram */}
        <polygon
          points="100,118 107,138 128,138 111,150 117,170 100,158 83,170 89,150 72,138 93,138"
          fill="var(--color-gold)" opacity="0.35"
        />

        {/* Central gem */}
        <circle cx="100" cy="155" r="5" fill="var(--color-gold)" opacity="0.5" />
        <circle cx="100" cy="155" r="2" fill="var(--color-gold-bright)" opacity="0.7" />

        {/* Decorative lines radiating from center */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
          <line key={angle}
            x1={100 + 15 * Math.cos(angle * Math.PI / 180)}
            y1={155 + 15 * Math.sin(angle * Math.PI / 180)}
            x2={100 + 32 * Math.cos(angle * Math.PI / 180)}
            y2={155 + 32 * Math.sin(angle * Math.PI / 180)}
            stroke="var(--color-gold)" strokeWidth="0.5" opacity="0.2"
          />
        ))}
      </svg>
    </div>
  );
}
