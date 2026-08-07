import { useEffect, useRef, useState } from 'react';
import styles from './AudioManager.module.css';

const MUTE_KEY = 'tarot-audio-muted';

export default function AudioManager() {
  const [muted, setMuted] = useState(() => {
    try { return localStorage.getItem(MUTE_KEY) === 'true'; } catch { return false; }
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio('/tarot-oracle/ambient.wav');
    audio.loop = true;
    audio.volume = 0.35;
    audioRef.current = audio;

    // Try to play (may be blocked until user gesture)
    const play = () => {
      if (audio.paused && !muted) {
        audio.play().catch(() => {});
      }
    };
    document.addEventListener('click', play, { once: true });
    document.addEventListener('touchstart', play, { once: true });

    return () => {
      audio.pause();
      audio.src = '';
      document.removeEventListener('click', play);
      document.removeEventListener('touchstart', play);
    };
  }, []);

  // Sync mute state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (muted) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
  }, [muted]);

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    try { localStorage.setItem(MUTE_KEY, String(next)); } catch {}
  };

  return (
    <button
      className={`${styles.btn} ${muted ? styles.muted : ''}`}
      onClick={toggle}
      aria-label={muted ? '开启音乐' : '静音'}
      title={muted ? '开启音乐' : '静音'}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  );
}
