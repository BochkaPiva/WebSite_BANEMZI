"use client";
import { useEffect, useRef } from 'react';

// Комбинация volumetric glow (CSS) + лёгкие «искры» на canvas
export default function HeroFX() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    let raf = 0;

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const rect = canvas.parentElement!.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };
    resize();
    window.addEventListener('resize', resize);

    type P = { x: number; y: number; vx: number; vy: number; r: number; a: number };
    const N = 70;
    const parts: P[] = Array.from({ length: N }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0006,
      vy: (Math.random() - 0.5) * 0.0006,
      r: 8 + Math.random() * 18,
      a: 0.5 + Math.random() * 0.5,
    }));

    let mx = 0.6, my = 0.4;
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mx = (e.clientX - rect.left) / rect.width;
      my = (e.clientY - rect.top) / rect.height;
    };
    window.addEventListener('mousemove', onMove);

    const step = () => {
      const { width: w, height: h } = canvas;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      for (const p of parts) {
        p.x += p.vx + (mx - 0.5) * 0.0002;
        p.y += p.vy + (my - 0.5) * 0.0002;
        if (p.x < 0 || p.x > 1) p.vx *= -1, p.x = Math.min(0.999, Math.max(0.001, p.x));
        if (p.y < 0 || p.y > 1) p.vy *= -1, p.y = Math.min(0.999, Math.max(0.001, p.y));

        const gx = p.x * w, gy = p.y * h;
        const grd = ctx.createRadialGradient(gx, gy, 0, gx, gy, p.r * 6);
        grd.addColorStop(0, `rgba(255,209,102,${0.22 * p.a})`);
        grd.addColorStop(0.5, `rgba(255,154,60,${0.10 * p.a})`);
        grd.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(gx, gy, p.r * 6, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(step);
    };
    step();

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); window.removeEventListener('mousemove', onMove); };
  }, []);

  return (
    <div className="absolute inset-0 -z-10">
      {/* volumetric glow пятна */}
      <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full opacity-30 blur-3xl"
           style={{ background: 'radial-gradient(closest-side,#FFD166,rgba(255,209,102,0))' }} />
      <div className="absolute top-10 right-10 w-[520px] h-[520px] rounded-full opacity-30 blur-3xl"
           style={{ background: 'radial-gradient(closest-side,#FF6B00,rgba(255,107,0,0))' }} />
      <div className="absolute bottom-0 left-1/3 w-[480px] h-[480px] rounded-full opacity-25 blur-3xl"
           style={{ background: 'radial-gradient(closest-side,#FF9A3C,rgba(255,154,60,0))' }} />
      {/* «Искры» */}
      <canvas ref={ref} className="absolute inset-0" />
    </div>
  );
}


