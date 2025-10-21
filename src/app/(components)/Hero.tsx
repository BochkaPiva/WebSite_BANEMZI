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
        <div className="relative w-full h-full overflow-hidden">
          <video
            className="absolute top-0 left-0 w-full h-full object-cover hero-video"
            src="/hero.mp4"
            autoPlay
            muted
            loop
            playsInline
            controls={false}
            suppressHydrationWarning
            style={{ 
              height: '100vh !important', 
              minHeight: '100vh !important', 
              objectPosition: 'center bottom',
              pointerEvents: 'none',
              zIndex: -1
            }}
          />
          {/* Накладываем невидимый слой поверх видео для блокировки контролов */}
          <div 
            className="absolute inset-0 w-full h-full"
            style={{ 
              zIndex: 1,
              pointerEvents: 'auto',
              background: 'transparent'
            }}
          />
        </div>
      </ParallaxElement>
      {/* Затемнение для читаемости */}
      <div className="absolute inset-0 -z-10 bg-black/45" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-6" style={{ minHeight: '400px' }}>
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
              priority={true}
              fetchPriority="high"
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
              События, про которые{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD166] via-[#FF9A3C] to-[#FF6B00]">хочется рассказывать.</span>
            </h1>
          </Reveal>
        </ParallaxElement>
        <ParallaxElement speed={0.1} direction="up">
          <Reveal delay={0.1}>
            <p className="relative mt-5 text-lg text-white/80">
              От идеи до шоу — под ключ и без компромиссов.
            </p>
          </Reveal>
        </ParallaxElement>
      </div>
      
      {/* SEO content - hidden but accessible to search engines */}
      <div className="sr-only">
        <h2>Ивент агентство BANEMZI в Омске - Организация мероприятий</h2>
        <p>Профессиональная организация мероприятий в Омске. Ивент агентство BANEMZI специализируется на корпоративных праздниках, тимбилдингах, презентациях и промо-акциях в Омске. Мы создаем незабываемые мероприятия для компаний и частных клиентов в Омске.</p>
        
        <h3>Услуги ивент агентства BANEMZI в Омске:</h3>
        <ul>
          <li>Корпоративные праздники и юбилеи в Омске</li>
          <li>Тимбилдинги и квесты для команд в Омске</li>
          <li>Презентации товаров и услуг в Омске</li>
          <li>Промо-мероприятия и рекламные акции в Омске</li>
          <li>Деловые события и конференции в Омске</li>
          <li>Частные праздники и торжества в Омске</li>
          <li>Детские праздники и дни рождения в Омске</li>
        </ul>
        
        <h3>Почему выбирают BANEMZI в Омске:</h3>
        <ul>
          <li>Опыт организации мероприятий в Омске</li>
          <li>Знание местных площадок и особенностей Омска</li>
          <li>Профессиональная команда в Омске</li>
          <li>Полный цикл услуг от идеи до реализации</li>
          <li>Доступные цены на мероприятия в Омске</li>
        </ul>
        
        <p>Организация мероприятий в Омске с полным циклом услуг: от концепции до реализации. Event агентство BANEMZI - ваш надежный партнер в создании ярких и запоминающихся событий в Омске. Работаем по всему Омску и области.</p>
        
        <h3>Районы работы в Омске:</h3>
        <p>Центральный округ, Советский округ, Кировский округ, Ленинский округ, Октябрьский округ, а также Омская область.</p>
      </div>
    </section>
  );
}


