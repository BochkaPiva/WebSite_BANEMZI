"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Reveal from './Reveal';

interface City {
  name: string;
  x: number; // процент от левого края
  y: number; // процент от верхнего края
  size: 'small' | 'medium' | 'large';
}

const cities: City[] = [
  { name: 'Омск', x: 37, y: 80, size: 'medium' },
  { name: 'Новосибирск', x: 40, y: 80, size: 'medium' },
  { name: 'Тюмень', x: 34, y: 77, size: 'small' },
  { name: 'Барнаул', x: 41, y: 84, size: 'small' },
  { name: 'Алтай', x: 43, y: 87, size: 'small' },
  { name: 'Кемерово', x: 45, y: 81, size: 'small' },
  { name: 'Красноярск', x: 46, y: 76, size: 'small' },
  { name: 'Екатеринбург', x: 32, y: 77, size: 'medium' },
  { name: 'Челябинск', x: 32, y: 81, size: 'small' },
  { name: 'Уфа', x: 31, y: 85, size: 'small' },
  { name: 'Москва', x: 23, y: 79, size: 'large' },
  { name: 'Санкт-Петербург', x: 20, y: 72, size: 'large' },
];

export default function CitiesMap() {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  const getSizeClasses = (size: City['size']) => {
    switch (size) {
      case 'large':
        return 'w-4 h-4';
      case 'medium':
        return 'w-3 h-3';
      case 'small':
        return 'w-2 h-2';
    }
  };

  return (
    <Reveal className="relative w-full">
      {/* Заголовок */}
      <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white tracking-tight">
        ГОРОДА КЛИЕНТОВ{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD166] via-[#FF9A3C] to-[#FF6B00]">
          BANEMZI
        </span>
      </h3>

      {/* Десктопная версия - карта */}
      <div className="hidden md:block">
        <div className="relative w-full h-[800px] flex items-center justify-center">
          <div className="relative w-full h-full">
            <Image
              src="/ru-03_1.svg"
              alt="Карта России"
              fill
              className="object-contain"
              priority
            />
            
            {/* Города */}
            {cities.map((city) => (
            <motion.div
              key={city.name}
              className={`absolute ${getSizeClasses(city.size)} rounded-full cursor-pointer shadow-lg ${
                city.name === 'Омск' 
                  ? 'bg-gradient-to-r from-orange-300 to-orange-500 shadow-orange-500/50' 
                  : 'bg-gradient-to-r from-orange-400 to-orange-600'
              }`}
              style={{
                left: `${city.x}%`,
                top: `${city.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              whileHover={{ 
                scale: 1.5,
                boxShadow: '0 0 20px rgba(255, 165, 0, 0.6)'
              }}
              onHoverStart={() => setHoveredCity(city.name)}
              onHoverEnd={() => setHoveredCity(null)}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                delay: Math.random() * 0.5,
                type: "spring",
                stiffness: 200
              }}
            >
              {/* Пульсирующий эффект только для Омска */}
              {city.name === 'Омск' && (
                <>
                  <motion.div
                    className="absolute inset-0 bg-orange-300 rounded-full"
                    animate={{ 
                      scale: [1, 2.2, 1],
                      opacity: [0.9, 0, 0.9]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-orange-400 rounded-full"
                    animate={{ 
                      scale: [1, 1.6, 1],
                      opacity: [0.7, 0, 0.7]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.3
                    }}
                  />
                </>
              )}
            </motion.div>
          ))}

            {/* Подсказка при наведении */}
            {hoveredCity && (
              <motion.div
                className="absolute bg-black/90 text-white px-4 py-2 rounded-lg text-sm font-bold tracking-wide pointer-events-none z-10 border border-orange-400/30"
                style={{
                  left: `${cities.find(c => c.name === hoveredCity)?.x}%`,
                  top: `${(cities.find(c => c.name === hoveredCity)?.y || 0) - 5}%`,
                  transform: 'translate(-50%, -100%)'
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                {hoveredCity.toUpperCase()}
              </motion.div>
            )}

          </div>
        </div>
      </div>

      {/* Мобильная версия - список городов */}
      <div className="md:hidden">
        <div className="max-w-sm mx-auto px-4">
          <div className="grid grid-cols-1 gap-3">
            {cities.map((city, index) => (
              <motion.div
                key={city.name}
                className="flex items-center space-x-4 py-3 px-4 bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.02,
                  backgroundColor: 'rgba(55, 65, 81, 0.4)'
                }}
              >
                <div className="relative flex-shrink-0">
                  <div className={`w-3 h-3 rounded-full ${
                    city.name === 'Омск' 
                      ? 'bg-orange-300' 
                      : 'bg-orange-400'
                  }`}></div>
                  {/* Пульсирующий эффект для Омска */}
                  {city.name === 'Омск' && (
                    <>
                      <motion.div
                        className="absolute inset-0 w-3 h-3 bg-orange-300 rounded-full"
                        animate={{ 
                          scale: [1, 2.2, 1],
                          opacity: [0.9, 0, 0.9]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      <motion.div
                        className="absolute inset-0 w-3 h-3 bg-orange-400 rounded-full"
                        animate={{ 
                          scale: [1, 1.6, 1],
                          opacity: [0.7, 0, 0.7]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.3
                        }}
                      />
                    </>
                  )}
                </div>
                <span className="text-white text-base font-medium tracking-wide">{city.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Статистика */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="text-5xl font-black text-orange-400 mb-3 tracking-tight">12+</div>
            <div className="text-gray-300 text-lg font-semibold tracking-wider uppercase">ГОРОДОВ</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-black text-orange-400 mb-3 tracking-tight">50+</div>
            <div className="text-gray-300 text-lg font-semibold tracking-wider uppercase">ПРОЕКТОВ</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-black text-orange-400 mb-3 tracking-tight">100%</div>
            <div className="text-gray-300 text-lg font-semibold tracking-wider uppercase">ДОВОЛЬНЫХ КЛИЕНТОВ</div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
