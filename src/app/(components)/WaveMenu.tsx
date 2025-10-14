"use client";

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface MenuItem {
  label: string;
  href: string;
}

interface WaveMenuProps {
  items: MenuItem[];
}

export default function WaveMenu({ items }: WaveMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = menu.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePosition({ x, y });

      // Находим ближайший пункт меню
      const menuItems = menu.querySelectorAll('a');
      let closestIndex = -1;
      let minDistance = Infinity;

      menuItems.forEach((item, index) => {
        const itemRect = item.getBoundingClientRect();
        const itemCenterX = itemRect.left + itemRect.width / 2 - rect.left;
        const itemCenterY = itemRect.top + itemRect.height / 2 - rect.top;
        
        const distance = Math.sqrt(
          Math.pow(x - itemCenterX, 2) + Math.pow(y - itemCenterY, 2)
        );

        if (distance < minDistance && distance < 80) { // 80px - радиус влияния
          minDistance = distance;
          closestIndex = index;
        }
      });

      setHoveredIndex(closestIndex >= 0 ? closestIndex : null);
    };

    const handleMouseLeave = () => {
      setHoveredIndex(null);
    };

    menu.addEventListener('mousemove', handleMouseMove);
    menu.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      menu.removeEventListener('mousemove', handleMouseMove);
      menu.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div 
      ref={menuRef}
      className="relative rounded-full px-3 sm:px-4 py-2 backdrop-blur-md bg-white/5 border border-white/10 shadow-[0_0_1px_0_rgba(255,255,255,0.2)_inset,0_10px_30px_-10px_rgba(0,0,0,0.5)]"
    >
      <ul className="flex items-center gap-2 sm:gap-3 text-sm relative">
        {items.map((item, index) => (
          <li key={item.href} className="relative">
            <motion.a
              href={item.href}
              className="block px-2 sm:px-3 py-1 rounded-full transition-colors relative z-10"
              animate={{
                scale: hoveredIndex === index ? 1.15 : 1,
                backgroundColor: hoveredIndex === index ? 'rgba(255,255,255,0.15)' : 'transparent',
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
              }}
              whileHover={{
                scale: 1.1,
                backgroundColor: 'rgba(255,255,255,0.1)',
              }}
            >
              {item.label}
            </motion.a>
            
            {/* Волновой эффект */}
            {hoveredIndex === index && (
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400/20 via-orange-500/30 to-orange-600/20"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: 1.2, 
                  opacity: [0, 0.8, 0.4],
                }}
                exit={{ 
                  scale: 1.5, 
                  opacity: 0 
                }}
                transition={{
                  duration: 0.6,
                  ease: "easeOut"
                }}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
