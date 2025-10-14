"use client";
import { useEffect, useRef } from 'react';

// Плазменный фон: плавные оранжево‑красные пятна, перетекающие друг в друга
export default function PlasmaBG() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    let raf = 0;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const fit = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };
    fit();
    addEventListener('resize', fit);

    type Blob = { x: number; y: number; r: number; hue: number; sp: number };
    const blobs: Blob[] = Array.from({ length: 5 }, (_, i) => ({
      x: Math.random(), y: Math.random(), r: 0.18 + Math.random() * 0.25,
      hue: 28 + Math.random() * 18, // 28..46 (оранжево‑янтарные)
      sp: 0.5 + Math.random() * 0.8,
    }));

    let t = 0;
    const loop = () => {
      t += 0.006;
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < blobs.length; i++) {
        const b = blobs[i];
        const px = (0.5 + Math.sin(t * b.sp + i) * 0.35 + b.x * 0.1) * w;
        const py = (0.5 + Math.cos(t * (b.sp * 0.9) + i * 1.3) * 0.35 + b.y * 0.1) * h;
        const rad = Math.min(w, h) * b.r;
        const g = ctx.createRadialGradient(px, py, 0, px, py, rad);
        g.addColorStop(0, `hsla(${b.hue},100%,60%,0.55)`);
        g.addColorStop(0.5, `hsla(${b.hue + 8},100%,50%,0.35)`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(px, py, rad, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => { cancelAnimationFrame(raf); removeEventListener('resize', fit); };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 -z-10" />;
}


