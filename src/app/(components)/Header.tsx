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
  const handleTop = (e: React.MouseEvent<HTMLButtonElement>) => {
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
        {/* Кнопка "Наверх" слева */}
        <button 
          className={`group relative flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-orange-500/30 transition-all duration-300 ${showTop ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          onClick={handleTop}
        >
          {/* Анимированная иконка стрелки вверх */}
          <div className="relative w-6 h-6 flex items-center justify-center">
            <svg 
              className="w-4 h-4 text-white/70 group-hover:text-orange-400 transition-colors duration-300 animate-bounce" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 10l7-7m0 0l7 7m-7-7v18" 
              />
            </svg>
          </div>
          
          {/* Текст */}
          <span className="text-white/70 text-sm font-medium group-hover:text-white transition-colors duration-300">
            Наверх
          </span>
          
          {/* Эффект свечения при hover */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400/0 via-orange-400/5 to-orange-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
        {/* Центрированное меню с волновой анимацией */}
        <nav className="hidden sm:flex items-center justify-center absolute left-1/2 -translate-x-1/2 z-20 px-2">
          <WaveMenu 
            items={[
              { label: "Что умеем", href: "#dream-event" },
              { label: "Отзывы", href: "#reviews" },
              { label: "Что получите", href: "#benefits" },
              { label: "Процесс", href: "#process" },
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


