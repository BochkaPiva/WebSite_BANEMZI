"use client";
import { motion } from 'framer-motion';
import Reveal from './Reveal';
import MagneticButton from './MagneticButton';
import InteractiveLogo from './InteractiveLogo';
import ParallaxElement from './ParallaxElement';

export default function Hero() {
  return (
    <section className="relative overflow-hidden mt-[-64px] pt-[64px] pb-0 min-h-screen flex items-end hero-section" style={{ minHeight: '100vh !important', height: '100vh !important', maxHeight: '100vh !important' }}>
      {/* Видео‑фон с параллаксом */}
      <ParallaxElement speed={0.5} direction="down" className="absolute inset-0 -z-10">
        <video
          className="w-full h-full object-cover hero-video"
          src="/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          controls={false}
          poster="/hero-poster.jpg"
          style={{ 
            height: '100vh !important', 
            minHeight: '100vh !important', 
            objectPosition: 'center bottom',
            pointerEvents: 'none'
          }}
        />
      </ParallaxElement>
      {/* Затемнение для читаемости */}
      <div className="absolute inset-0 -z-10 bg-black/45" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-6">
        {/* Интерактивный логотип с параллаксом и скролл-анимацией */}
        <ParallaxElement speed={0.3} direction="up" className="flex justify-center mb-6 sm:mb-8 -mt-10">
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95, rotate: -4 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <InteractiveLogo
              src="/Logo.png"
              alt="BANEMZI"
              className="w-[28rem] sm:w-[36rem] md:w-[42rem]"
              repulsionRadius={250}
              repulsionStrength={1.2}
              onClick={() => {
                const target = document.getElementById('lead');
                if (!target) return;
                const y = target.getBoundingClientRect().top + window.scrollY - 80;
                const lenis = (window as any).lenis;
                if (lenis && typeof lenis.scrollTo === 'function') {
                  lenis.scrollTo(y);
                } else {
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }
              }}
            />
          </motion.div>
        </ParallaxElement>
      <ParallaxElement speed={0.2} direction="up">
        <Reveal>
          <h1 className="relative text-4xl md:text-6xl font-semibold leading-tight -mt-16">
            Будет громко, красиво и{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD166] via-[#FF9A3C] to-[#FF6B00]">чуть‑чуть неприлично. </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD166] via-[#FF9A3C] to-[#FF6B00]">Как вы просили.</span>
          </h1>
        </Reveal>
      </ParallaxElement>
      <ParallaxElement speed={0.1} direction="up">
        <Reveal delay={0.1}>
          <p className="relative mt-5 text-lg text-white/80">
            Мы не проводим мероприятия. Мы делаем повод хвастаться.
          </p>
        </Reveal>
      </ParallaxElement>
      </div>
    </section>
  );
}


