import { useEffect, useRef } from 'react';
import styles from './Starfield.module.css';

interface Star {
  x: number;
  y: number;
  r: number;
  opacity: number;
  speed: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let stars: Star[] = [];
    let animationId: number;
    let visible = true;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    }

    function initStars() {
      const count = Math.floor((canvas!.width * canvas!.height) / 3500);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * canvas!.width,
        y: Math.random() * canvas!.height,
        r: Math.random() * 1.5 + 0.3,
        opacity: Math.random() * 0.6 + 0.2,
        speed: Math.random() * 0.3 + 0.05,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
      }));
    }

    function draw(time: number) {
      if (!ctx || !canvas || !visible) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gold = '201, 169, 110'; // --color-gold
      const purple = '124, 58, 237'; // --color-purple

      for (const star of stars) {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase);
        const alpha = star.opacity * (0.6 + 0.4 * twinkle);

        // Slowly move stars upward
        star.y -= star.speed;
        if (star.y < -5) {
          star.y = canvas.height + 5;
          star.x = Math.random() * canvas.width;
        }

        const color = Math.random() < 0.15 ? purple : gold;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${alpha})`;
        ctx.fill();

        // Glow for larger stars
        if (star.r > 1) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.r * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${color}, ${alpha * 0.15})`;
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(draw);
    }

    // Visibility handling — pause when tab hidden
    function onVisibility() {
      visible = !document.hidden;
    }
    document.addEventListener('visibilitychange', onVisibility);

    resize();
    animationId = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
