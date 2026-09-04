import React, { useEffect, useRef, useState } from 'react';

const CONNECTION_DISTANCE = 150;
const MOUSE_DISTANCE = 200;
const DESKTOP_MIN_WIDTH = 768;

interface Point {
  x: number;
  y: number;
}

/**
 * Declared at module scope rather than inside the effect: the React compiler
 * skips any hook body containing a class declaration, which silently opted this
 * component out of compilation.
 */
class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;

  constructor(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.size = Math.random() * 1.5 + 0.5;
  }

  update(width: number, height: number, mouse: Point) {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;

    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distance = Math.hypot(dx, dy);

    if (distance < MOUSE_DISTANCE && distance > 0) {
      const force = (MOUSE_DISTANCE - distance) / MOUSE_DISTANCE;
      this.vx -= (dx / distance) * force * 0.6;
      this.vy -= (dy / distance) * force * 0.6;
    }
  }

  draw(ctx: CanvasRenderingContext2D, isDark: boolean) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)';
    ctx.fill();
  }
}

export const ParticleNetwork: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const evaluate = () =>
      setEnabled(window.innerWidth >= DESKTOP_MIN_WIDTH && !motionQuery.matches);

    evaluate();
    window.addEventListener('resize', evaluate);
    motionQuery.addEventListener('change', evaluate);
    return () => {
      window.removeEventListener('resize', evaluate);
      motionQuery.removeEventListener('change', evaluate);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId = 0;
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    const mouse: Point = { x: -1000, y: -1000 };

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      // Scale the backing store to the device pixel ratio, or the whole field
      // renders soft on any HiDPI screen.
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(Math.floor((width * height) / 15000), 100);
      particles = Array.from({ length: count }, () => new Particle(width, height));
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      const isDark = document.documentElement.classList.contains('dark');

      for (const particle of particles) {
        particle.update(width, height, mouse);
        particle.draw(ctx, isDark);
      }

      // Start at i + 1: the original started at i, so every particle measured
      // its distance to itself and stroked a zero-length line each frame.
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const distance = Math.hypot(
            particles[i].x - particles[j].x,
            particles[i].y - particles[j].y
          );
          if (distance >= CONNECTION_DISTANCE) continue;

          const opacity = (1 - distance / CONNECTION_DISTANCE) * 0.15;
          ctx.beginPath();
          ctx.strokeStyle = isDark
            ? `rgba(255, 255, 255, ${opacity})`
            : `rgba(0, 0, 0, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }

      frameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('resize', init);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    init();
    animate();

    return () => {
      window.removeEventListener('resize', init);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(frameId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
};
