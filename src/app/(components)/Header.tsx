"use client";
import { useEffect, useState } from "react";
import MagneticButton from "./MagneticButton";
import WaveMenu from "./WaveMenu";

export default function Header() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowTop(window.scrollY > window.innerHeight * 0.6);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleCta = () => {
    const target = document.getElementById('lead');
    if (!target) return;
    const y = target.getBoundingClientRect().top + window.scrollY - 80;
    const lenis = (window as any).lenis;
    if (lenis && typeof lenis.scrollTo === 'function') {
      lenis.scrollTo(y);
    } else {
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };
  const handleTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const lenis = (window as any).lenis;
    if (lenis && typeof lenis.scrollTo === 'function') {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  return (
    <header className="fixed top-0 left-0 right-0 z-40 text-white">
      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Лого слева */}
        <a href="#top" className={`flex flex-col items-center justify-center gap-0 max-w-[40%] transition-opacity duration-300 ${showTop ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={handleTop}>
          <span className="text-white/70 text-xs tracking-[0.3em] uppercase leading-none">Наверх</span>
          <span className="relative mt-1 h-3 w-8 overflow-hidden flex justify-center">
            <span className="absolute top-1/2 -translate-y-1/2 translate-x-0.5 h-[2px] w-8 bg-white/70 origin-center animate-[arrowUp_1.6s_ease-in-out_infinite]" />
            <span className="absolute top-1/2 -translate-y-[8px] translate-x-0.5 h-[2px] w-6 bg-white/50 origin-center animate-[arrowUp_1.6s_ease-in-out_infinite_0.18s]" />
          </span>
        </a>
        {/* Центрированное меню с волновой анимацией */}
        <nav className="hidden sm:flex items-center justify-center absolute left-1/2 -translate-x-1/2 z-20 px-2">
          <WaveMenu 
            items={[
              { label: "Что умеем", href: "#dream-event" },
              { label: "Что получите", href: "#benefits" },
              { label: "Процесс", href: "#process" },
              { label: "Города", href: "#cities" },
              { label: "FAQ", href: "#faq" }
            ]}
          />
        </nav>
        {/* CTA справа с магнитным эффектом */}
        <MagneticButton
          onClick={handleCta}
          className="relative px-4 py-2 rounded-full text-white font-semibold overflow-hidden backdrop-blur-md bg-white/10 hover:bg-white/15 transition"
          strength={0.6}
          attractionRadius={120}
        >
          <span className="relative z-10">Оставить заявку</span>
          {/* Оранжевый перелив поверх стекла — более насыщенный, без mix-blend */}
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#FFB800] via-[#FF6A00] to-[#FF2D00] opacity-100 btn-shine" />
        </MagneticButton>
      </div>
    </header>
  );
}


