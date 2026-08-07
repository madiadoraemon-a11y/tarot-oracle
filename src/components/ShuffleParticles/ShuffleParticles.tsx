import { useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import styles from './ShuffleParticles.module.css';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: 'gold' | 'purple';
  type: 'spark' | 'orb' | 'dust';
  glow: number;
}

const GOLD = '201, 169, 110';
const GOLD_BRIGHT = '224, 200, 124';
const PURPLE = '124, 58, 237';
const PURPLE_LIGHT = '167, 139, 250';

function particleCount(): number {
  const min = Math.min(window.innerWidth, window.innerHeight);
  if (min < 480) return 35;
  if (min < 768) return 55;
  return 80;
}

function spawnParticle(cx: number, cy: number): Particle {
  const angle = Math.random() * Math.PI * 2;
  const speed = 0.5 + Math.random() * 2.5;
  const typeRand = Math.random();
  const type: Particle['type'] =
    typeRand < 0.45 ? 'spark' : typeRand < 0.8 ? 'orb' : 'dust';
  const isGold = Math.random() < 0.78;

  const sizeByType = {
    spark: 1 + Math.random() * 1.8,
    orb: 2 + Math.random() * 3,
    dust: 0.8 + Math.random() * 1.2,
  };

  const lifeByType = {
    spark: 1.2 + Math.random() * 1.8,
    orb: 2.5 + Math.random() * 3,
    dust: 3 + Math.random() * 3,
  };

  return {
    x: cx + (Math.random() - 0.5) * 40,
    y: cy + (Math.random() - 0.5) * 40,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    life: lifeByType[type],
    maxLife: lifeByType[type],
    size: sizeByType[type],
    color: isGold ? 'gold' : 'purple',
    type,
    glow: type === 'orb' ? 0.3 : 0.08,
  };
}

export default function ShuffleParticles() {
  const { state } = useGame();
  const { phase } = state;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);
  const activeRef = useRef(false);
  const fadeAlphaRef = useRef(0);

  const isShuffling = phase === 'shuffling';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let spawnTimer = 0;
    let lastTime = performance.now();

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    function draw(time: number) {
      if (!ctx || !canvas) return;
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height * 0.4;
      const maxP = particleCount();

      // Fade alpha: ramp up when active, ramp down when inactive & empty
      const targetAlpha = activeRef.current ? 1 : 0;
      const fadeSpeed = 1.5; // seconds to fully transition
      const current = fadeAlphaRef.current;
      if (Math.abs(current - targetAlpha) > 0.001) {
        const step = dt / fadeSpeed;
        fadeAlphaRef.current = current + (targetAlpha > current ? step : -step);
        // Clamp
        if (targetAlpha > current && fadeAlphaRef.current > targetAlpha) fadeAlphaRef.current = targetAlpha;
        if (targetAlpha < current && fadeAlphaRef.current < targetAlpha) fadeAlphaRef.current = targetAlpha;
      }

      const globalAlpha = fadeAlphaRef.current;
      if (globalAlpha <= 0.001 && particlesRef.current.length === 0) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }

      // Spawn new particles while shuffling
      if (activeRef.current) {
        spawnTimer += dt;
        const spawnRate = 0.025;
        while (spawnTimer >= spawnRate && particlesRef.current.length < maxP) {
          particlesRef.current.push(spawnParticle(cx, cy));
          spawnTimer -= spawnRate;
        }
      } else {
        spawnTimer = 0;
      }

      // Update & draw
      const alive: Particle[] = [];

      for (const p of particlesRef.current) {
        p.life -= dt;
        if (p.life <= 0) continue;

        // Spiral gravity toward center
        const dx = cx - p.x;
        const dy = cy - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const gForce = 0.15;
        p.vx += (dx / dist) * gForce * dt;
        p.vy += (dy / dist) * gForce * dt;

        // Subtle tangential force for swirl
        p.vx += (-dy / dist) * 0.08 * dt;
        p.vy += (dx / dist) * 0.08 * dt;

        // Drag
        p.vx *= 0.995;
        p.vy *= 0.995;

        p.x += p.vx;
        p.y += p.vy;

        const lifeRatio = p.life / p.maxLife;
        const alpha = lifeRatio < 0.2 ? lifeRatio / 0.2 : 1;
        const rgb = p.color === 'gold'
          ? (p.type === 'spark' ? GOLD_BRIGHT : GOLD)
          : (p.type === 'spark' ? PURPLE_LIGHT : PURPLE);

        // Glow
        if (p.type === 'orb') {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgb}, ${alpha * p.glow * globalAlpha})`;
          ctx.fill();
        }

        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, ${alpha * globalAlpha})`;
        ctx.fill();

        alive.push(p);
      }

      particlesRef.current = alive;
      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Track shuffling state separately so particles can decay naturally
  useEffect(() => {
    activeRef.current = isShuffling;
    if (isShuffling) {
      particlesRef.current = [];
    }
  }, [isShuffling]);

  return (
    <canvas
      ref={canvasRef}
      className={styles.canvas}
      aria-hidden="true"
    />
  );
}
