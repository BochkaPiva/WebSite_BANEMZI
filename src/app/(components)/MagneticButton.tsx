"use client";

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  strength?: number;
  attractionRadius?: number;
}

export default function MagneticButton({ 
  children, 
  className = '', 
  onClick,
  strength = 0.3,
  attractionRadius = 150
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isAttracted, setIsAttracted] = useState(false);
  const [deformation, setDeformation] = useState({ scaleX: 1, scaleY: 1, skewX: 0, skewY: 0 });

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const distance = Math.sqrt(
        Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
      );

      // Если курсор в зоне притяжения
      if (distance < attractionRadius) {
        setIsAttracted(true);
        
        // Магнитное притяжение
        const deltaX = (e.clientX - centerX) * strength;
        const deltaY = (e.clientY - centerY) * strength;
        setPosition({ x: deltaX, y: deltaY });

        // Деформация кнопки в сторону курсора
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        const intensity = Math.max(0, 1 - distance / attractionRadius);
        
        // Вычисляем компоненты деформации по осям
        const rawDeltaX = e.clientX - centerX;
        const rawDeltaY = e.clientY - centerY;
        const maxDelta = Math.max(Math.abs(rawDeltaX), Math.abs(rawDeltaY));
        
        // Нормализуем деформацию по направлению к курсору
        const stretchX = 1 + (Math.abs(rawDeltaX) / maxDelta) * intensity * 0.3;
        const stretchY = 1 + (Math.abs(rawDeltaY) / maxDelta) * intensity * 0.3;
        
        // Наклон в направлении курсора
        const skewX = (rawDeltaX / maxDelta) * intensity * 8;
        const skewY = (rawDeltaY / maxDelta) * intensity * 8;
        
        setDeformation({
          scaleX: stretchX,
          scaleY: stretchY,
          skewX: skewX,
          skewY: skewY
        });
      } else {
        setIsAttracted(false);
        setPosition({ x: 0, y: 0 });
        setDeformation({ scaleX: 1, scaleY: 1, skewX: 0, skewY: 0 });
      }
    };

    const handleMouseLeave = () => {
      setIsAttracted(false);
      setPosition({ x: 0, y: 0 });
      setDeformation({ scaleX: 1, scaleY: 1, skewX: 0, skewY: 0 });
    };

    document.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength, attractionRadius]);

  return (
    <motion.button
      ref={buttonRef}
      className={`relative overflow-hidden ${className}`}
      onClick={onClick}
      animate={{
        x: position.x,
        y: position.y,
        scaleX: deformation.scaleX,
        scaleY: deformation.scaleY,
        skewX: deformation.skewX,
        skewY: deformation.skewY,
        scale: isAttracted ? 1.1 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
      }}
      whileTap={{
        scale: 0.95,
      }}
    >
      {children}
    </motion.button>
  );
}
