"use client";

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Reveal from './Reveal';

export default function DreamEvent() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; timestamp: number; vx: number; vy: number }>>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const particleIdRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      setMousePosition({ x, y });

      // Создаем частицы при движении мыши
      const newParticle = {
        id: particleIdRef.current++,
        x,
        y,
        timestamp: Date.now(),
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2
      };
      
      setParticles(prev => [...prev.slice(-15), newParticle]);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  // Обновляем позиции частиц
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy
        })).filter(particle => 
          particle.x > -5 && particle.x < 105 && 
          particle.y > -5 && particle.y < 105 &&
          Date.now() - particle.timestamp < 2000
        )
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-32 pb-40 overflow-visible">
      <div 
        ref={containerRef}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 min-h-[600px] md:min-h-[900px] pb-16"
        suppressHydrationWarning
      >
        {/* Интерактивный овальный фон */}
        <motion.div
          className="absolute bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-full opacity-15"
          style={{
            left: '0%',
            top: '0%',
            margin: '2rem',
            width: 'calc(100% - 4rem)',
            height: 'calc(100% - 4rem)',
          }}
          animate={{
            rotate: [0, 0.5, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Плавающие частицы */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute pointer-events-none"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ 
              scale: 0,
              opacity: 0
            }}
            animate={{ 
              scale: [0, 1, 0.8, 0],
              opacity: [0, 0.8, 0.4, 0]
            }}
            transition={{ 
              duration: 2,
              ease: "easeOut"
            }}
          >
            <div className="w-2 h-2 bg-orange-400 rounded-full shadow-lg"></div>
          </motion.div>
        ))}

        {/* Контент */}
        <Reveal className="relative z-10">
          {/* Заголовок */}
          <motion.h2 
            className="text-5xl md:text-7xl font-black mb-16 text-white tracking-tight text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            EVENT{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-orange-500">
              ВАШЕЙ МЕЧТЫ
            </span>
          </motion.h2>

          {/* Основной контент - асимметричная компоновка */}
          <div className="relative">
            {/* Первый блок - наклонный */}
            <motion.div 
              className="relative z-20 mb-16"
              initial={{ opacity: 0, x: -50, rotate: -2 }}
              whileInView={{ opacity: 1, x: 0, rotate: -1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-orange-500/20 via-orange-600/15 to-orange-700/10 rounded-3xl p-10 border-2 border-orange-400/30 backdrop-blur-sm shadow-2xl transform rotate-1">
                <p className="text-2xl md:text-3xl text-white leading-relaxed font-bold">
                  Яркие <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-orange-500 font-black">event-мероприятия</span> нужны для эффективного запуска продуктов, 
                  организации церемоний награждения, лучшей коммуникации партнеров и большого спектра иных задач.
                </p>
              </div>
              {/* Декоративные элементы */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full shadow-lg animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-8 h-8 bg-gradient-to-r from-orange-300 to-orange-500 rounded-full shadow-lg"></div>
            </motion.div>

            {/* Второй блок - смещенный вправо */}
            <motion.div 
              className="relative z-10 mb-16 ml-8 md:ml-16"
              initial={{ opacity: 0, x: 50, rotate: 1 }}
              whileInView={{ opacity: 1, x: 0, rotate: 0.5 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-bl from-gray-800/40 to-gray-700/20 rounded-2xl p-8 border border-gray-600/40 backdrop-blur-sm shadow-xl transform -rotate-1">
                <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
                  Оригинальный формат помогает продемонстрировать преимущества товаров, заинтересовать пользователей технологиями. 
                  Компании в позитивной атмосфере проводят нестандартные презентации продуктов, укрепляют авторитет брендов.
                </p>
              </div>
            </motion.div>

            {/* Третий блок - наклонный влево с услугами */}
            <motion.div 
              className="relative z-20 mb-16 mr-8 md:mr-16"
              initial={{ opacity: 0, x: -30, rotate: -1 }}
              whileInView={{ opacity: 1, x: 0, rotate: -0.5 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-tr from-orange-500/15 to-orange-600/10 rounded-3xl p-10 border-2 border-orange-400/25 backdrop-blur-sm shadow-2xl transform rotate-1">
                <h3 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-orange-500 mb-8">
                  Что мы умеем:
                </h3>
                <div className="space-y-6">
                  {[
                    {
                      title: 'Корпоративные праздники',
                      description: 'Дни рождения компаний, юбилеи, корпоративы',
                      icon: '🎉'
                    },
                    {
                      title: 'Тимбилдинги и квесты',
                      description: 'Сплочение команды через интерактивные активности',
                      icon: '🤝'
                    },
                    {
                      title: 'Презентации и запуски',
                      description: 'Презентации товаров, услуг, новых локаций',
                      icon: '🚀'
                    },
                    {
                      title: 'Промо-мероприятия',
                      description: 'Знакомство с брендом, рекламные акции',
                      icon: '📢'
                    },
                    {
                      title: 'Деловые события',
                      description: 'Конференции, семинары, бизнес-встречи',
                      icon: '💼'
                    }
                  ].map((service, index) => (
                    <motion.div
                      key={index}
                      className="bg-gradient-to-r from-gray-800/30 to-gray-700/20 rounded-2xl p-6 border border-gray-600/30 backdrop-blur-sm hover:border-orange-400/40 transition-all duration-300 group"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.02, rotate: 0.5 }}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="text-3xl group-hover:scale-110 transition-transform duration-200">
                          {service.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-white mb-2 group-hover:text-orange-300 transition-colors duration-200">
                            {service.title}
                          </h4>
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {service.description}
                          </p>
                        </div>
                        <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full mt-2 flex-shrink-0 group-hover:scale-125 transition-transform duration-200"></div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              {/* Декоративные элементы */}
              <div className="absolute -top-6 -left-6 w-10 h-10 bg-gradient-to-r from-orange-300 to-orange-500 rounded-full shadow-lg"></div>
              <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full shadow-lg animate-pulse"></div>
            </motion.div>

            {/* Четвертый блок - смещенный влево */}
            <motion.div 
              className="relative z-10 mb-16 ml-4 md:ml-8"
              initial={{ opacity: 0, x: -50, rotate: 1 }}
              whileInView={{ opacity: 1, x: 0, rotate: 0.5 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-gray-800/30 to-gray-700/15 rounded-2xl p-8 border border-gray-600/30 backdrop-blur-sm shadow-xl transform -rotate-1">
                <p className="text-lg md:text-xl text-white leading-relaxed font-medium">
                  Клиенты доверяют <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-orange-500 font-bold">BANEMZI</span> свои проекты, чтобы получить комплексный подход 
                  с учетом особенностей и целей предприятия. Сотрудники агентства следят за качеством услуг, обеспечивают безопасность 
                  участников корпоративов.
                </p>
              </div>
            </motion.div>

            {/* Фотогалерея - хаотично расположенная */}
            <motion.div 
              className="relative z-20"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              viewport={{ once: true }}
            >
              <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Фото 1 - большое, наклонное */}
                <motion.div
                  className="md:col-span-2 lg:col-span-2 relative"
                  whileHover={{ scale: 1.02, rotate: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="h-80 rounded-3xl overflow-hidden shadow-2xl border-2 border-orange-400/20 hover:border-orange-400/50 transition-all duration-300 transform rotate-2">
                    <Image
                      src="/ex1.jpeg"
                      alt="Корпоративное мероприятие"
                      width={600}
                      height={320}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full shadow-lg animate-pulse"></div>
                  <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-r from-orange-300 to-orange-500 rounded-full shadow-lg"></div>
                </motion.div>

                {/* Фото 2 - маленькое, наклонное в другую сторону */}
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="h-64 rounded-2xl overflow-hidden shadow-2xl border-2 border-orange-400/20 hover:border-orange-400/50 transition-all duration-300 transform -rotate-3">
                    <Image
                      src="/ex2.jpg"
                      alt="Тимбилдинг"
                      width={300}
                      height={256}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </div>
                  <div className="absolute -top-4 -left-4 w-6 h-6 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full shadow-lg"></div>
                </motion.div>

                {/* Фото 3 - среднее, слегка наклонное */}
                <motion.div
                  className="md:col-span-2 lg:col-span-1 relative"
                  whileHover={{ scale: 1.03, rotate: 1.5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="h-72 rounded-2xl overflow-hidden shadow-2xl border-2 border-orange-400/20 hover:border-orange-400/50 transition-all duration-300 transform rotate-1">
                    <Image
                      src="/ex3.jpg"
                      alt="Презентация"
                      width={400}
                      height={288}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </div>
                  <div className="absolute -bottom-6 -right-6 w-10 h-10 bg-gradient-to-r from-orange-300 to-orange-500 rounded-full shadow-lg"></div>
                </motion.div>
              </div>

              {/* Декоративная кривая линия под фото */}
              <svg className="absolute -bottom-12 left-0 right-0 pointer-events-none" viewBox="0 0 800 120" height="120">
                <path
                  d="M50,30 Q200,80 400,40 Q600,10 750,60"
                  stroke="rgba(255, 165, 0, 0.4)"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray="12,6"
                />
                <circle cx="50" cy="30" r="6" fill="rgba(255, 165, 0, 0.6)" />
                <circle cx="200" cy="80" r="6" fill="rgba(255, 165, 0, 0.6)" />
                <circle cx="400" cy="40" r="6" fill="rgba(255, 165, 0, 0.6)" />
                <circle cx="600" cy="10" r="6" fill="rgba(255, 165, 0, 0.6)" />
                <circle cx="750" cy="60" r="6" fill="rgba(255, 165, 0, 0.6)" />
              </svg>
            </motion.div>
          </div>

          {/* CTA - наклонная кнопка */}
          <motion.div
            className="text-center mt-20 mb-16 relative px-8 md:px-0"
            initial={{ opacity: 0, y: 50, rotate: -2 }}
            whileInView={{ opacity: 1, y: 0, rotate: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            viewport={{ once: true }}
          >
            <motion.button
              className="relative px-8 md:px-16 py-6 md:py-8 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 text-white font-black rounded-3xl text-lg md:text-2xl shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 tracking-wide uppercase transform rotate-1 md:rotate-2 hover:rotate-0 md:hover:rotate-1"
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 20px 40px rgba(255, 165, 0, 0.4)',
                rotate: 0
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const target = document.getElementById('lead');
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <span className="relative z-10">Заказать консультацию</span>
              {/* Декоративные элементы на кнопке */}
              <div className="absolute -top-2 -right-2 md:-top-3 md:-right-3 w-6 h-6 md:w-8 md:h-8 bg-white/20 rounded-full"></div>
              <div className="absolute -bottom-1 -left-1 md:-bottom-2 md:-left-2 w-4 h-4 md:w-6 md:h-6 bg-white/15 rounded-full"></div>
            </motion.button>
            
            {/* Дополнительные декоративные элементы вокруг кнопки - скрыты на мобильных */}
            <div className="hidden md:block absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-r from-orange-300 to-orange-500 rounded-full shadow-lg animate-pulse opacity-60"></div>
            <div className="hidden md:block absolute -bottom-6 -right-6 w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full shadow-lg"></div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
