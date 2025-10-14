"use client";
import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new (Lenis as any)({ smoothWheel: true });
    (window as any).lenis = lenis;
    function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    const onAnchor = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute('href') || '';
      if (href.length <= 1) return;
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      if (typeof lenis.scrollTo === 'function') lenis.scrollTo(y); else window.scrollTo({ top: y, behavior: 'smooth' });
    };
    document.addEventListener('click', onAnchor);
    return () => { document.removeEventListener('click', onAnchor); lenis.destroy(); };
  }, []);
  return null;
}


