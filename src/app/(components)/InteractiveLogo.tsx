"use client";

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface InteractiveLogoProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  repulsionRadius?: number;
  repulsionStrength?: number;
  onClick?: () => void;
  priority?: boolean;
  fetchPriority?: 'high' | 'low' | 'auto';
}

export default function InteractiveLogo({ 
  src, 
  alt, 
  className = '',
  style,
  repulsionRadius = 250,
  repulsionStrength = 1.2,
  onClick,
  priority = false,
  fetchPriority = 'auto'
}: InteractiveLogoProps) {
  const logoRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [deformation, setDeformation] = useState({ 
    scaleX: 1, 
    scaleY: 1, 
    skewX: 0, 
    skewY: 0,
    rotateX: 0,
    rotateY: 0
  });
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setIsMobile(window.innerWidth < 768);
  }, []);

  // Эффект отталкивания от курсора
  useEffect(() => {
    if (!isMounted || isMobile) return;

    const logo = logoRef.current;
    if (!logo) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = logo.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Если курсор в зоне отталкивания
      if (distance < repulsionRadius) {
        setIsInteracting(true);
        
        // Вычисляем силу отталкивания (обратно пропорционально расстоянию)
        const intensity = Math.max(0, 1 - distance / repulsionRadius);
        const force = intensity * repulsionStrength;
        
        // Отталкивание логотипа от курсора
        const repulsionX = -(deltaX / distance) * force * 50;
        const repulsionY = -(deltaY / distance) * force * 50;
        
        setPosition({ x: repulsionX, y: repulsionY });

        // Деформация логотипа
        const rawDeltaX = e.clientX - centerX;
        const rawDeltaY = e.clientY - centerY;
        const maxDelta = Math.max(Math.abs(rawDeltaX), Math.abs(rawDeltaY));
        
        // Деформация в направлении от курсора
        const stretchX = 1 + (Math.abs(rawDeltaX) / maxDelta) * intensity * 0.2;
        const stretchY = 1 + (Math.abs(rawDeltaY) / maxDelta) * intensity * 0.2;
        
        // Наклон в направлении от курсора
        const skewX = -(rawDeltaX / maxDelta) * intensity * 8;
        const skewY = -(rawDeltaY / maxDelta) * intensity * 8;
        
        // 3D поворот для объёма
        const rotateX = (rawDeltaY / maxDelta) * intensity * 15;
        const rotateY = -(rawDeltaX / maxDelta) * intensity * 15;
        
        setDeformation({
          scaleX: stretchX,
          scaleY: stretchY,
          skewX: skewX,
          skewY: skewY,
          rotateX: rotateX,
          rotateY: rotateY
        });
      } else {
        setIsInteracting(false);
        setPosition({ x: 0, y: 0 });
        setDeformation({ 
          scaleX: 1, 
          scaleY: 1, 
          skewX: 0, 
          skewY: 0,
          rotateX: 0,
          rotateY: 0
        });
      }
    };

    const handleMouseLeave = () => {
      setIsInteracting(false);
      setPosition({ x: 0, y: 0 });
      setDeformation({ 
        scaleX: 1, 
        scaleY: 1, 
        skewX: 0, 
        skewY: 0,
        rotateX: 0,
        rotateY: 0
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    logo.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      logo.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isMounted, isMobile, repulsionRadius, repulsionStrength]);

  if (!isMounted || isMobile) {
    // На мобильных или до монтирования показываем обычный логотип
    return (
      <img
        src={src}
        alt={alt}
        className={`cursor-pointer ${className}`}
        onClick={onClick}
        suppressHydrationWarning
        loading={priority ? "eager" : "lazy"}
        fetchPriority={fetchPriority}
        style={{
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
          ...style,
        }}
      />
    );
  }

  return (
    <motion.div
      ref={logoRef}
      className={`relative ${className}`}
      onClick={onClick}
      suppressHydrationWarning
      animate={{
        x: position.x,
        y: position.y,
        scaleX: deformation.scaleX,
        scaleY: deformation.scaleY,
        skewX: deformation.skewX,
        skewY: deformation.skewY,
        rotateX: deformation.rotateX,
        rotateY: deformation.rotateY,
        scale: isInteracting ? 1.05 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        willChange: 'transform',
      }}
      whileTap={{
        scale: 0.95,
      }}
    >
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-auto object-contain cursor-pointer"
        style={{
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
          transformStyle: 'preserve-3d',
          ...style,
        }}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={fetchPriority}
      />
    </motion.div>
  );
}